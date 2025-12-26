-- =====================================================================
-- ATUALIZAÇÃO FINAL - Portal MagnaFest (VERSÃO SEGURA)
-- =====================================================================
-- Execute este script completo no Supabase SQL Editor
-- Adiciona features faltantes e corrige estrutura
-- NÃO DÁ ERRO mesmo se tabelas não existirem
-- =====================================================================

-- 1. Adicionar coluna STATUS na tabela EVENTS (se existir)
DO $$
BEGIN
  -- Verificar se tabela events existe
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'events'
  ) THEN
    
    -- Adicionar coluna status se não existir
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'status'
    ) THEN
      ALTER TABLE public.events ADD COLUMN status text DEFAULT 'confirmed';
      RAISE NOTICE '✅ events.status criado';
    ELSE
      RAISE NOTICE 'ℹ️ events.status já existe';
    END IF;

    -- Adicionar/recriar constraint
    ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;
    ALTER TABLE public.events ADD CONSTRAINT events_status_check 
      CHECK (status IN ('confirmed', 'pending', 'cancelled', 'postponed'));
    
    -- Criar índice
    CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
    
    RAISE NOTICE '🎉 events.status configurado com sucesso';
  ELSE
    RAISE NOTICE '⚠️ Tabela events não existe - ignorando';
  END IF;
END $$;

-- 2. Adicionar coluna CONDITION na tabela LISTINGS (se existir)
DO $$
BEGIN
  -- Verificar se tabela listings existe
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'listings'
  ) THEN
    
    -- Adicionar coluna condition se não existir
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'listings' AND column_name = 'condition'
    ) THEN
      ALTER TABLE public.listings ADD COLUMN condition text DEFAULT 'usado';
      RAISE NOTICE '✅ listings.condition criado';
    ELSE
      RAISE NOTICE 'ℹ️ listings.condition já existe';
    END IF;

    -- Adicionar/recriar constraint
    ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_condition_check;
    ALTER TABLE public.listings ADD CONSTRAINT listings_condition_check 
      CHECK (condition IN ('novo', 'seminovo', 'usado', 'pecas'));
    
    -- Criar índice
    CREATE INDEX IF NOT EXISTS idx_listings_condition ON public.listings(condition);
    
    -- Seed aleatório apenas para registros sem condition
    UPDATE public.listings
    SET condition = (
      CASE (random() * 3)::int
        WHEN 0 THEN 'novo'
        WHEN 1 THEN 'seminovo'
        WHEN 2 THEN 'usado'
        ELSE 'pecas'
      END
    )
    WHERE condition IS NULL;
    
    RAISE NOTICE '🎉 listings.condition configurado com sucesso';
  ELSE
    RAISE NOTICE '⚠️ Tabela listings não existe - ignorando (será criada no futuro)';
  END IF;
END $$;

-- 3. Garantir que PostgREST detecte mudanças
NOTIFY pgrst, 'reload schema';

-- 4. Relatório Final
DO $$
DECLARE
  events_exists boolean;
  listings_exists boolean;
  events_has_status boolean;
  listings_has_condition boolean;
BEGIN
  -- Verificações
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'events'
  ) INTO events_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'listings'
  ) INTO listings_exists;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'status'
  ) INTO events_has_status;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'condition'
  ) INTO listings_has_condition;

  -- Relatório
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '📊 RELATÓRIO DE ATUALIZAÇÃO';
  RAISE NOTICE '═══════════════════════════════════════════';
  
  IF events_exists THEN
    RAISE NOTICE '✅ Tabela events existe';
    IF events_has_status THEN
      RAISE NOTICE '  └─ ✅ Coluna status OK';
    ELSE
      RAISE NOTICE '  └─ ❌ Coluna status FALTANDO';
    END IF;
  ELSE
    RAISE NOTICE 'ℹ️ Tabela events não existe (OK se não usar Agenda)';
  END IF;

  IF listings_exists THEN
    RAISE NOTICE '✅ Tabela listings existe';
    IF listings_has_condition THEN
      RAISE NOTICE '  └─ ✅ Coluna condition OK';
    ELSE
      RAISE NOTICE '  └─ ❌ Coluna condition FALTANDO';
    END IF;
  ELSE
    RAISE NOTICE 'ℹ️ Tabela listings não existe (OK se não usar Marketplace)';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '🎉 SCRIPT CONCLUÍDO SEM ERROS!';
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;