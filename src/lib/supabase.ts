import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    // Primeiro verifica se há uma sessão válida
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      return null;
    }

    if (!session) {
      console.log('Nenhuma sessão encontrada');
      return null;
    }

    // Depois verifica o usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return null;
    }

    if (!user) {
      console.log('Nenhum usuário encontrado');
      return null;
    }

    // Por fim, busca o perfil do usuário
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
