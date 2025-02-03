import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpkozlhjmugpjyidethx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa296bGhqbXVncGp5aWRldGh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzYyODczNywiZXhwIjoyMDQ5MjA0NzM3fQ.20N7KXdOw8oYriYA0iJ7MC5pKRFx3IegK51FQiqK27A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  try {
    console.log('Verificando conexão com o banco de dados...');

    // Verificar se a tabela tasks existe
    const { data, error } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);

    if (error) {
      if (error.code === '42P01') { // Código para "tabela não existe"
        console.error('A tabela tasks não existe. Por favor, crie a tabela usando o dashboard do Supabase.');
        console.log('Execute o seguinte SQL no dashboard do Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS public.tasks (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    deadline TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    "order" INTEGER,
    labels JSONB DEFAULT '[]'::jsonb,
    color TEXT,
    time TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    user_id TEXT NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Criar política de segurança
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.tasks FOR ALL
USING (auth.uid() = user_id);

-- Criar índices
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
        `);
      } else {
        console.error('Erro ao verificar tabela:', error);
      }
      return;
    }

    console.log('Tabela tasks existe e está acessível');
    console.log('Quantidade de registros:', data.length);

    // Verificar políticas de segurança
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'tasks' });

    if (policiesError) {
      console.error('Erro ao verificar políticas:', policiesError);
    } else {
      console.log('Políticas de segurança:', policies);
    }

  } catch (error) {
    console.error('Erro:', error);
  }
}

verifyDatabase();
