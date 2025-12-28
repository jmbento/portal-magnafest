-- =====================================================
-- FIX: Adicionar colunas faltantes na tabela profiles
-- Execute ANTES do SETUP_FINAL_EXECUTAR_AGORA.sql
-- =====================================================

-- Adicionar colunas que podem estar faltando
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 0;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Adicionar constraint no trust_score
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_trust_score_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_trust_score_check 
    CHECK (trust_score >= 0 AND trust_score <= 100);
  END IF;
END $$;

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Colunas adicionadas à tabela profiles!';
  RAISE NOTICE 'Agora execute o SETUP_FINAL_EXECUTAR_AGORA.sql';
END $$;