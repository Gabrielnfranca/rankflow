import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpkozlhjmugpjyidethx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa296bGhqbXVncGp5aWRldGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2Mjg3MzcsImV4cCI6MjA0OTIwNDczN30.q7fRK-_o1kjHQZlzsJPlznIMiIjn5T6W_SFR41cO1bw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  try {
    console.log('1. Verificando status do serviço...');
    const { data: health, error: healthError } = await supabase.rpc('auth.health');
    
    if (healthError) {
      console.error('Erro ao verificar status:', healthError);
    } else {
      console.log('Status do serviço:', health);
    }

    console.log('\n2. Tentando criar usuário...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'teste@example.com',
      password: 'teste123456',
      options: {
        data: {
          name: 'Usuário Teste'
        }
      }
    });

    if (signUpError) {
      console.error('Erro ao criar usuário:', signUpError);
      console.error('Detalhes:', {
        message: signUpError.message,
        status: signUpError.status,
        code: signUpError.code
      });
    } else {
      console.log('Usuário criado:', signUpData);
    }

    console.log('\n3. Verificando configurações de autenticação...');
    const { data: settings, error: settingsError } = await supabase.rpc('auth.settings');
    
    if (settingsError) {
      console.error('Erro ao verificar configurações:', settingsError);
    } else {
      console.log('Configurações:', settings);
    }

  } catch (error) {
    console.error('Erro geral:', error);
  }
}

testAuth();
