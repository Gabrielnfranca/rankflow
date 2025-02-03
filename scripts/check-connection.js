import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpkozlhjmugpjyidethx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa296bGhqbXVncGp5aWRldGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2Mjg3MzcsImV4cCI6MjA0OTIwNDczN30.q7fRK-_o1kjHQZlzsJPlznIMiIjn5T6W_SFR41cO1bw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  try {
    console.log('Verificando conexão com o banco de dados...');

    // Tentar criar um usuário de teste
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'teste@example.com',
      password: 'teste123456'
    });

    if (signUpError) {
      console.error('Erro ao criar usuário:', signUpError);
      return;
    }

    console.log('Resposta do signup:', signUpData);

    // Tentar fazer login
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'teste@example.com',
      password: 'teste123456'
    });

    if (signInError) {
      console.error('Erro ao fazer login:', signInError);
      return;
    }

    console.log('Resposta do login:', signInData);

  } catch (error) {
    console.error('Erro:', error);
  }
}

checkConnection();
