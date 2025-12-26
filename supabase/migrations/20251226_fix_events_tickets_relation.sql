-- =====================================================================
-- FIX: Relacionamento entre Events e Tickets
-- =====================================================================
-- Data: 2025-12-26
-- Objetivo: Garantir que o PostgREST detecte corretamente a relação
--           entre as tabelas events e tickets
-- =====================================================================

-- =====================================================================
-- STEP 1: Remover constraint existente (se houver problema)
-- =====================================================================

ALTER TABLE public.tickets
DROP CONSTRAINT IF EXISTS tickets_event_id_fkey;

-- =====================================================================
-- STEP 2: Recriar Foreign Key com configuração explícita
-- =====================================================================

ALTER TABLE public.tickets
ADD CONSTRAINT tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- STEP 3: Garantir que o índice existe para performance
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets (event_id);

-- =====================================================================
-- STEP 4: Adicionar comentário na relação para documentação
-- =====================================================================

COMMENT ON CONSTRAINT tickets_event_id_fkey ON public.tickets IS 'FK: Relaciona ingressos aos eventos. Cascade delete quando evento for removido.';

-- =====================================================================
-- STEP 5: Forçar reload do schema cache no PostgREST
-- =====================================================================

NOTIFY pgrst, 'reload schema';

-- =====================================================================
-- VERIFICAÇÃO: Confirmar que a constraint foi criada
-- =====================================================================

DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE
        constraint_name = 'tickets_event_id_fkey'
        AND table_name = 'tickets'
) THEN RAISE NOTICE '✅ Constraint tickets_event_id_fkey criada com sucesso!';

ELSE RAISE WARNING '❌ Falha ao criar constraint tickets_event_id_fkey';

END IF;

END $$;