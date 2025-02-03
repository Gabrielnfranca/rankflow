import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Função para criar storage seguro com fallback
function createSafeStorage(): Storage {
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    throw new Error('Storage is only available in browser environment');
  }

  try {
    // Test localStorage
    localStorage.setItem('supabase.test-ls', 'test');
    localStorage.removeItem('supabase.test-ls');
    
    return window.localStorage;
  } catch (e) {
    console.warn('localStorage not available, using memory storage');
    
    // Fallback para storage em memória
    const memoryStorage: { [key: string]: string } = {};
    return {
      length: Object.keys(memoryStorage).length,
      clear: () => Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]),
      getItem: (key: string) => memoryStorage[key] || null,
      key: (index: number) => Object.keys(memoryStorage)[index] || null,
      removeItem: (key: string) => delete memoryStorage[key],
      setItem: (key: string, value: string) => { memoryStorage[key] = value; }
    };
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: createSafeStorage(),
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true // Adiciona logs para debug
  }
});

// Função para verificar e atualizar o token de forma mais robusta
export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao recuperar sessão:', error);
      return null;
    }

    if (!session) {
      console.log('Nenhuma sessão encontrada');
      return null;
    }

    // Força a atualização do token
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();

    if (refreshError) {
      console.error('Erro ao atualizar sessão:', refreshError);
      return null;
    }

    return refreshedSession;
  } catch (error) {
    console.error('Erro ao atualizar sessão:', error);
    return null;
  }
}

export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Função para obter o usuário atual
export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

// Função para limpar o storage de forma mais segura
export function clearAllStorage() {
  try {
    // Limpa o storage do Supabase
    supabase.auth.signOut();
    
    // Limpa localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Remove apenas as chaves relacionadas ao Supabase
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.startsWith('supabase.')) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error('Erro ao limpar storage:', error);
  }
}
