import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cria um storage customizado que usa apenas localStorage
const customStorage: Storage = {
  length: localStorage.length,
  clear: () => {
    localStorage.clear();
  },
  getItem: (key: string) => localStorage.getItem(key),
  key: (index: number) => localStorage.key(index),
  removeItem: (key: string) => localStorage.removeItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value)
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: false
  }
});

// Função para verificar e atualizar o token se necessário
export async function refreshSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}

// Tipos para as tabelas do Supabase
export interface Profile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Helper functions
export async function clearAllStorage() {
  try {
    // Limpa todos os storages
    localStorage.clear();
    sessionStorage.clear();

    // Remove cookies específicos do Supabase
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // Força o signOut do Supabase
    await supabase.auth.signOut({ scope: 'local' });

    // Limpa qualquer cache do service worker se existir
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    // Limpa qualquer cache da aplicação
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    // Verifica a sessão atual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.log('No valid session found');
      await clearAllStorage();
      return null;
    }

    // Verifica se o token ainda é válido
    const { data: { user }, error: userError } = await supabase.auth.getUser(session.access_token);
    
    if (userError || !user) {
      console.error('Error getting user or no user found:', userError);
      await clearAllStorage();
      return null;
    }

    // Busca o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          await clearAllStorage();
          return null;
        }

        return newProfile;
      }
      await clearAllStorage();
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    await clearAllStorage();
    return null;
  }
}
