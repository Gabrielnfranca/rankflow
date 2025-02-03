-- Primeiro, remover as restrições existentes
ALTER TABLE IF EXISTS public.profiles
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE IF EXISTS public.tasks
DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- Recriar as restrições com DELETE CASCADE
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE public.tasks
ADD CONSTRAINT tasks_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Atualizar as políticas para permitir deleção
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem deletar seus próprios perfis"
ON public.profiles FOR DELETE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem deletar suas próprias tarefas" ON public.tasks;
CREATE POLICY "Usuários podem deletar suas próprias tarefas"
ON public.tasks FOR DELETE
USING (auth.uid() = user_id);
