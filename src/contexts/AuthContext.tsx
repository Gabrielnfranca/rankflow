import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile, getCurrentUser } from '../lib/supabase';

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

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setError(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Erro ao inicializar autenticação');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Inicializa a autenticação
    initializeAuth();

    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (mounted) {
          setLoading(true);
        }
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
          setError(null);
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setError(null);
          setLoading(false);
        }
      }
    });

    // Cleanup
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
      
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('Erro ao obter dados do usuário');
      }
      
      setUser(currentUser);
    } catch (error: any) {
      console.error('Error logging in:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else {
        setError(error.message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      
      // Limpa o cache do Supabase
      localStorage.removeItem('rankflow-auth');
      
      // Força um reload da página após o logout
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
      throw error;
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
      throw error;
    }
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
