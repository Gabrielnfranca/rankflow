-- Primeiro, vamos garantir que a tabela tenha a estrutura correta
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

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas suas próprias tarefas
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.tasks FOR ALL
USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
