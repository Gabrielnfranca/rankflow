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

  const fetchCurrentUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setUser(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setUser(profile);
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setError('Erro ao buscar usuário');
    }
  };

  useEffect(() => {
    fetchCurrentUser().finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchCurrentUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setError(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      await fetchCurrentUser();
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
      
      // Limpa todos os storages
      localStorage.clear();
      sessionStorage.clear();
      
      // Força um refresh da página
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Error logging out:', error);
      setError(error.message);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
