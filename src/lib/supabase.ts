import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'rankflow-auth',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
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
export async function getCurrentUser(): Promise<Profile | null> {
  try {
    // Tenta atualizar a sessão primeiro
    const session = await refreshSession();
    if (!session) {
      console.log('Nenhuma sessão válida encontrada');
      return null;
    }

    // Busca o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return null;
    }

    if (!user) {
      console.log('Nenhum usuário encontrado');
      return null;
    }

    // Busca o perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      // Se o perfil não existir, tenta criar um novo
      if (profileError.code === 'PGRST116') {
        console.log('Criando novo perfil para o usuário:', user.id);
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
          console.error('Erro ao criar perfil:', createError);
          return null;
        }

        return newProfile;
      }
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Erro inesperado ao buscar usuário:', error);
    return null;
  }
}
