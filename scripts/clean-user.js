import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpkozlhjmugpjyidethx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa296bGhqbXVncGp5aWRldGh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzYyODczNywiZXhwIjoyMDQ5MjA0NzM3fQ.20N7KXdOw8oYriYA0iJ7MC5pKRFx3IegK51FQiqK27A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanUserData(userEmail) {
  try {
    console.log(`Iniciando limpeza dos dados do usuário: ${userEmail}`);

    // Primeiro, encontrar o ID do usuário pelo email
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) {
      console.error('Erro ao buscar usuário:', userError);
      return;
    }

    if (!userData) {
      console.log('Usuário não encontrado');
      return;
    }

    const userId = userData.id;
    console.log(`ID do usuário encontrado: ${userId}`);

    // Deletar todas as tasks do usuário
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId);

    if (tasksError) {
      console.error('Erro ao deletar tasks:', tasksError);
      return;
    }

    console.log('Tasks deletadas com sucesso');
    console.log('Agora você pode tentar deletar o usuário pela interface do Supabase');

  } catch (error) {
    console.error('Erro:', error);
  }
}

// Pegar o email do usuário dos argumentos da linha de comando
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Por favor, forneça o email do usuário como argumento');
  process.exit(1);
}

cleanUserData(userEmail);
