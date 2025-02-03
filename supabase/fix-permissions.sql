-- Garantir que o esquema auth existe
CREATE SCHEMA IF NOT EXISTS auth;

-- Garantir que as extensões necessárias estão instaladas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Garantir que o papel authenticator tem as permissões necessárias
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Garantir permissões na tabela de tasks
GRANT ALL ON public.tasks TO authenticated;
GRANT ALL ON public.tasks_id_seq TO authenticated;

-- Recriar as políticas de segurança
DROP POLICY IF EXISTS "Usuários podem ver suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem ver suas próprias tarefas"
ON public.tasks FOR ALL
USING (auth.uid() = user_id);

-- Habilitar RLS na tabela tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Garantir que o banco pode criar usuários
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO service_role;
