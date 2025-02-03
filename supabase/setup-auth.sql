-- Habilitar a extensão UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar schema auth se não existir
CREATE SCHEMA IF NOT EXISTS auth;

-- Garantir que as funções de autenticação estão disponíveis
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Garantir permissões corretas
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Garantir permissões no schema public
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Recriar a tabela de usuários se necessário
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE,
  encrypted_password text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Garantir que o RLS está desabilitado para a tabela de usuários
ALTER TABLE IF EXISTS auth.users DISABLE ROW LEVEL SECURITY;

-- Criar índices necessários
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users (email);

-- Limpar cache do schema
NOTIFY pgrst, 'reload schema';
