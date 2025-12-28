-- =====================================================
-- FIX URGENTE: Colunas e relações faltantes
-- =====================================================

-- 1. Adicionar coluna STATUS na tabela events
ALTER TABLE events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published' 
  CHECK (status IN ('draft', 'published', 'cancelled', 'completed'));

-- 2. Criar índice para busca por status
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 3. Comentário
COMMENT ON COLUMN events.status IS 'Status do evento: draft, published, cancelled, completed';

-- 4. Atualizar eventos existentes para published
UPDATE events SET status = 'published' WHERE status IS NULL;

-- =====================================================
-- Verificação
-- =====================================================

SELECT 'Colunas corrigidas! Events.status adicionado.' as resultado;

-- Ver estrutura
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'status';
