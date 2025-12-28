-- =====================================================
-- FIX: Adicionar coluna EMAIL na tabela profiles
-- =====================================================
-- Erro: "Could not find the 'email' column of 'profiles'"
-- Data: 28/12/2025
-- =====================================================

-- 1. Adicionar coluna email se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- 2. Verificar colunas existentes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 4. Comentário
COMMENT ON COLUMN profiles.email IS 'Email do usuário (mesmo do auth.users)';

-- =====================================================
-- Verificação
-- =====================================================

-- Mostrar estrutura da tabela
\d profiles

SELECT 'Correção aplicada com sucesso!' as status;
