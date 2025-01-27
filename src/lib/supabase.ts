import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Cria um storage customizado que limpa tudo ao fechar a página
const customStorage: Storage = {
  length: 0,
  clear: () => {
    sessionStorage.clear();
    localStorage.clear();
  },
  getItem: (key: string) => sessionStorage.getItem(key),
  key: (index: number) => sessionStorage.key(index),
  removeItem: (key: string) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
  setItem: (key: string, value: string) => sessionStorage.setItem(key, value)
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: customStorage,
    storageKey: 'rankflow-auth-session',
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

// Função para verificar e atualizar o token se necessário
export async function refreshSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Erro ao atualizar sessão:', error);
      return null;
    }
    return refreshedSession;
  }
  return null;
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
    customStorage.clear();
    await supabase.auth.signOut();
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
