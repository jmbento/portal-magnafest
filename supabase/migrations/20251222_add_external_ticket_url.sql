-- =====================================================================
-- EVENTOS - Adicionar Suporte a Links Externos
-- =====================================================================
-- Migração: Adiciona campo para links de ingressos externos (Sympla, Eventbrite, etc)
-- =====================================================================

BEGIN;

-- Adicionar coluna external_ticket_url
ALTER TABLE events
ADD COLUMN IF NOT EXISTS external_ticket_url TEXT;

-- Índice para buscar eventos com/sem link externo
CREATE INDEX IF NOT EXISTS idx_events_external_ticket ON events (external_ticket_url)
WHERE
    external_ticket_url IS NOT NULL;

COMMENT ON COLUMN events.external_ticket_url IS 'URL externa para compra de ingressos (Sympla, Eventbrite, etc)';

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Adicionar link externo a um evento existente:
-- UPDATE events
-- SET external_ticket_url = 'https://www.sympla.com.br/evento/123'
-- WHERE slug = 'rock-in-rio-2025';

-- Buscar eventos com link externo:
-- SELECT id, title, external_ticket_url
-- FROM events
-- WHERE external_ticket_url IS NOT NULL;

-- Buscar eventos com RSVP interno (sem link externo):
-- SELECT id, title
-- FROM events
-- WHERE external_ticket_url IS NULL
-- AND status = 'published';