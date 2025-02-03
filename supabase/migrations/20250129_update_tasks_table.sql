-- Atualizar a estrutura da tabela existente
ALTER TABLE public.tasks ALTER COLUMN title SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN client SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN deadline SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN priority SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN type SET NOT NULL;
ALTER TABLE public.tasks ALTER COLUMN task_order SET NOT NULL;

-- Definir valor padrão para status
ALTER TABLE public.tasks ALTER COLUMN status SET DEFAULT 'pendente';

-- Adicionar as constraints de verificação
DO $$ BEGIN
    BEGIN
        ALTER TABLE public.tasks
            ADD CONSTRAINT tasks_priority_check 
            CHECK (priority IN ('Alta', 'Média', 'Baixa'));
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

DO $$ BEGIN
    BEGIN
        ALTER TABLE public.tasks
            ADD CONSTRAINT tasks_status_check 
            CHECK (status IN ('pendente', 'em_progresso', 'concluida'));
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

DO $$ BEGIN
    BEGIN
        ALTER TABLE public.tasks
            ADD CONSTRAINT tasks_type_check 
            CHECK (type IN ('SEO Técnico', 'Keyword Research', 'Backlinks', 'Conteúdo'));
    EXCEPTION
        WHEN duplicate_object THEN null;
    END;
END $$;

-- Habilitar RLS se ainda não estiver habilitado
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Recriar as políticas de segurança
DROP POLICY IF EXISTS "Usuários podem ver suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.tasks FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem inserir suas próprias tarefas"
ON public.tasks FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem atualizar suas próprias tarefas"
ON public.tasks FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem deletar suas próprias tarefas"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);
