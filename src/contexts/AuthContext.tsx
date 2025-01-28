import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, clearAllStorage, Profile } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Função para buscar usuário atual
  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        await clearAllStorage();
      }
      setUser(currentUser);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Erro ao buscar usuário');
      setUser(null);
      await clearAllStorage();
    } finally {
      setLoading(false);
    }
  };

  // Efeito para inicialização
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Primeiro, tenta recuperar a sessão
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.access_token) {
          // Verifica se o token ainda é válido
          const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
          
          if (userError || !user) {
            throw new Error('Invalid session');
          }

          await fetchCurrentUser();
        } else {
          setUser(null);
          await clearAllStorage();
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setError('Erro na inicialização');
        setUser(null);
        await clearAllStorage();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session);

      try {
        switch (event) {
          case 'SIGNED_IN':
            if (session?.access_token) {
              await fetchCurrentUser();
            }
            break;
          case 'SIGNED_OUT':
            setUser(null);
            setError(null);
            await clearAllStorage();
            break;
          case 'TOKEN_REFRESHED':
            if (session?.access_token) {
              await fetchCurrentUser();
            }
            break;
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Erro na mudança de estado');
        setUser(null);
        await clearAllStorage();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await fetchCurrentUser();
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message);
      setLoading(false);
      await clearAllStorage();
      throw error;
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await clearAllStorage();
      setUser(null);
      setError(null);
      window.location.href = '/login'; // Força um refresh completo da página
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string, name: string) {
    try {
      setLoading(true);
      setError(null);

      const { data: { user: newUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;
      if (!newUser?.id) throw new Error('Erro ao criar usuário');

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: newUser.id,
            email,
            name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) throw profileError;

      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    } catch (error: any) {
      console.error('Error registering:', error);
      if (error.message.includes('User already registered')) {
        setError('Este email já está registrado');
      } else {
        setError(error.message);
      }
      setLoading(false);
      await clearAllStorage();
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setLoading(false);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message);
      setLoading(false);
      await clearAllStorage();
      throw error;
    }
  }

  // Só renderiza o conteúdo após a inicialização
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const value = {
    user,
    login,
    logout,
    register,
    resetPassword,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
