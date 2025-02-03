-- Reset e recrie as políticas da tabela profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer usuário autenticado insira seu próprio perfil
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem inserir seus próprios perfis"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- Permitir que usuários vejam seus próprios perfis
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Permitir que usuários atualizem seus próprios perfis
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON public.profiles;
CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
