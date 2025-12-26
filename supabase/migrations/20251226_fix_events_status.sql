-- =====================================================================
-- FIX: Adicionar coluna STATUS na tabela EVENTS
-- =====================================================================
-- Problema: Agenda está quebrando por falta da coluna status
-- Solução: Adicionar coluna com valor padrão 'confirmed'
-- =====================================================================

-- Adiciona a coluna de status
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed';

-- Adiciona constraint para validar valores
ALTER TABLE public.events
ADD CONSTRAINT events_status_check CHECK (
    status IN (
        'confirmed',
        'pending',
        'cancelled',
        'postponed'
    )
);

-- Garante que o PostgREST detecte a mudança
NOTIFY pgrst, 'reload schema';

-- Verificação
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'events'
    AND column_name = 'status';

-- Sucesso!
DO $$
BEGIN
  RAISE NOTICE '✅ Coluna STATUS adicionada com sucesso!';
  RAISE NOTICE '📋 Valores válidos: confirmed, pending, cancelled, postponed';
END $$;