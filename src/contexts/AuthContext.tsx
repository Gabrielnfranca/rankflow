import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, refreshSession } from '../lib/supabase';

interface AuthContextData {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ user: User; profile: Profile }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar o perfil do usuário
  async function loadProfile(userId: string) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      return profileData;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return null;
    }
  }

  // Efeito para monitorar mudanças na sessão
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        // Verificar sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profileData = await loadProfile(session.user.id);
            setProfile(profileData);
          } else {
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Erro ao carregar usuário:', error);
        if (mounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    }

    // Carregar usuário inicial
    loadUser();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          const profileData = await loadProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);

      // 1. Criar o usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!data?.user) throw new Error('Usuário não criado');

      // 2. Criar o perfil
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username: email.split('@')[0],
            full_name: name,
          },
        ])
        .select()
        .single();

      if (profileError) {
        // Se houver erro ao criar o perfil, tenta deletar o usuário
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
      }

      if (!newProfile) {
        throw new Error('Perfil não criado');
      }

      // 3. Atualizar o estado local
      setUser(data.user);
      setProfile(newProfile);

      return { user: data.user, profile: newProfile };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
