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
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      // Se o perfil não existir, criar um novo
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.name || user.email?.split('@')[0]
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
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}
