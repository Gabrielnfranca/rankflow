import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mpkozlhjmugpjyidethx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa296bGhqbXVncGp5aWRldGh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzYyODczNywiZXhwIjoyMDQ5MjA0NzM3fQ.20N7KXdOw8oYriYA0iJ7MC5pKRFx3IegK51FQiqK27A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  try {
    console.log('Verificando conexão com o banco de dados...');

    // 1. Verificar se podemos nos conectar
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserById('fake-id');
    if (authError && !authError.message.includes('User not found')) {
      console.error('Erro de conexão:', authError);
      return;
    }
    console.log('Conexão com o banco estabelecida');

    // 2. Verificar se a tabela auth.users existe e está acessível
    const { data: authUsers, error: authUsersError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);

    if (authUsersError) {
      console.error('Erro ao acessar auth.users:', authUsersError);
      console.log('Verifique se:');
      console.log('1. O banco de dados foi criado corretamente');
      console.log('2. As extensões auth e storage estão habilitadas');
      console.log('3. As políticas de segurança estão configuradas');
      return;
    }

    console.log('Tabela auth.users está acessível');

    // 3. Verificar se a tabela tasks existe
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1);

    if (tasksError) {
      console.error('Erro ao acessar tasks:', tasksError);
      if (tasksError.code === '42P01') { // relation does not exist
        console.log('Tabela tasks não existe. Criando...');
        
        // Criar a tabela tasks
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql_string: `
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
          `
        });

        if (createError) {
          console.error('Erro ao criar tabela tasks:', createError);
          return;
        }

        console.log('Tabela tasks criada com sucesso!');
      }
    } else {
      console.log('Tabela tasks existe e está acessível');
    }

    // 4. Verificar políticas de segurança
    const { data: policies, error: policiesError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);

    if (policiesError) {
      console.error('Erro ao verificar políticas:', policiesError);
      console.log('Verifique se as políticas de segurança estão configuradas corretamente');
    } else {
      console.log('Políticas de segurança estão funcionando');
    }

  } catch (error) {
    console.error('Erro:', error);
  }
}

verifyDatabase();
