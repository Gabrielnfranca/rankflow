-- Create tasks table
CREATE TABLE public.tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    client TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Alta', 'Média', 'Baixa')),
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    type TEXT NOT NULL CHECK (type IN ('SEO Técnico', 'Keyword Research', 'Backlinks', 'Conteúdo')),
    task_order INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    labels TEXT[],
    time TEXT,
    color TEXT
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias tarefas"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias tarefas"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);
