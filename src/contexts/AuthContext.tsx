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
  const [initialized, setInitialized] = useState(false);

  // Função para buscar usuário atual
  const fetchCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Erro ao buscar usuário');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para inicialização
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Verifica se já tem uma sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session) {
            await fetchCurrentUser();
          } else {
            setUser(null);
            setLoading(false);
          }
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        if (mounted) {
          setError('Erro na inicialização');
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, { session });

      if (!mounted) return;

      setLoading(true);

      try {
        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
            await fetchCurrentUser();
            break;
          case 'SIGNED_OUT':
            setUser(null);
            setError(null);
            setLoading(false);
            break;
          case 'TOKEN_REFRESHED':
            await fetchCurrentUser();
            break;
          default:
            setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setError('Erro na mudança de estado');
        setUser(null);
        setLoading(false);
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
      throw error;
    }
  }

  async function logout() {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      localStorage.removeItem('rankflow-auth');
      
      // Limpa qualquer estado persistido
      window.sessionStorage.clear();
      window.localStorage.clear();
      
      // Força um reload completo da aplicação
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
      setLoading(false);
      throw error;
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
