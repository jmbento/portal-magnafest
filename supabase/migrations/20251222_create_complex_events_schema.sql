-- =====================================================================
-- GUIA ATLAS PRÓ - Sistema de Eventos Complexos
-- =====================================================================
-- Migração: Arquitetura escalável para gerenciamento de eventos
-- Data: 2025-12-22
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. CRIAR ENUMS
-- =====================================================================

CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

CREATE TYPE event_format AS ENUM ('online', 'in_person', 'hybrid');

CREATE TYPE currency AS ENUM ('BRL', 'USD', 'EUR');

COMMENT ON TYPE event_status IS 'Status do evento: rascunho, publicado, cancelado ou concluído';

COMMENT ON TYPE event_format IS 'Formato do evento: online, presencial ou híbrido';

COMMENT ON TYPE currency IS 'Moedas aceitas para ingressos';

-- =====================================================================
-- 2. TABELA: event_categories (Lookup)
-- =====================================================================

CREATE TABLE IF NOT EXISTS event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT, -- Nome do ícone (ex: 'Music', 'PartyPopper')
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para ordenação
CREATE INDEX idx_event_categories_sort_order ON event_categories (sort_order);

COMMENT ON
TABLE event_categories IS 'Categorias de eventos (lookup table)';

COMMENT ON COLUMN event_categories.slug IS 'Slug para URLs (ex: /eventos/musica)';

-- =====================================================================
-- 3. TABELA: events (Principal)
-- =====================================================================

CREATE TABLE IF NOT EXISTS events (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,

-- Organizador
organizer_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

-- Conteúdo
title TEXT NOT NULL,
short_description TEXT,
full_content TEXT,
cover_image_url TEXT,

-- Data e hora
starts_at TIMESTAMPTZ NOT NULL, ends_at TIMESTAMPTZ NOT NULL,

-- Formato e status
format event_format NOT NULL DEFAULT 'in_person',
status event_status NOT NULL DEFAULT 'draft',

-- Localização (JSONB estruturado)
location_data JSONB DEFAULT '{}'::jsonb,

-- Metadata flexível (JSONB)
metadata JSONB DEFAULT '{}'::jsonb,

-- Estatísticas
views_count INT DEFAULT 0,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints
CONSTRAINT valid_title_length CHECK (char_length(title) >= 3),
    CONSTRAINT valid_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT valid_event_dates CHECK (ends_at > starts_at)
);

-- Índices de performance
CREATE INDEX idx_events_organizer_id ON events (organizer_id);

CREATE INDEX idx_events_slug ON events (slug);

CREATE INDEX idx_events_status ON events (status);

CREATE INDEX idx_events_format ON events (format);

CREATE INDEX idx_events_starts_at ON events (starts_at);

CREATE INDEX idx_events_ends_at ON events (ends_at);

CREATE INDEX idx_events_created_at ON events (created_at DESC);

-- Índice composto para queries comuns
CREATE INDEX idx_events_status_starts_at ON events (status, starts_at);

-- Índice GIN para busca em JSONB
CREATE INDEX idx_events_location_data ON events USING GIN (location_data);

CREATE INDEX idx_events_metadata ON events USING GIN (metadata);

COMMENT ON TABLE events IS 'Eventos criados por organizadores';

COMMENT ON COLUMN events.location_data IS 'JSON: {address, city, state, zip_code, coordinates: {lat, lng}, streaming_url}';

COMMENT ON COLUMN events.metadata IS 'JSON livre: {dress_code, lineup, age_rating, accessibility, etc}';

COMMENT ON COLUMN events.views_count IS 'Contador de visualizações da página do evento';

-- =====================================================================
-- 4. TABELA: events_categories_pivot (Many-to-Many)
-- =====================================================================

CREATE TABLE IF NOT EXISTS events_categories_pivot (
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES event_categories (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, category_id)
);

-- Índices para busca bidirecional
CREATE INDEX idx_events_categories_event_id ON events_categories_pivot (event_id);

CREATE INDEX idx_events_categories_category_id ON events_categories_pivot (category_id);

COMMENT ON
TABLE events_categories_pivot IS 'Relacionamento Many-to-Many entre eventos e categorias';

-- =====================================================================
-- 5. TABELA: tickets (Ingressos)
-- =====================================================================

CREATE TABLE IF NOT EXISTS tickets (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

-- Informações do lote
name TEXT NOT NULL, -- Ex: "Lote 1", "VIP", "Backstage"
description TEXT,

-- Preço
price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
currency currency NOT NULL DEFAULT 'BRL',

-- Estoque
quantity_total INT NOT NULL CHECK (quantity_total >= 0),
quantity_sold INT NOT NULL DEFAULT 0 CHECK (quantity_sold >= 0),

-- Controle de venda
sale_starts_at TIMESTAMPTZ,
sale_ends_at TIMESTAMPTZ,
active BOOLEAN NOT NULL DEFAULT true,

-- Ordem de exibição
sort_order INT DEFAULT 0,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints
CONSTRAINT valid_ticket_quantity CHECK (quantity_sold <= quantity_total),
    CONSTRAINT valid_sale_dates CHECK (
        sale_ends_at IS NULL OR 
        sale_starts_at IS NULL OR 
        sale_ends_at > sale_starts_at
    )
);

-- Índices
CREATE INDEX idx_tickets_event_id ON tickets (event_id);

CREATE INDEX idx_tickets_active ON tickets (active);

CREATE INDEX idx_tickets_sort_order ON tickets (sort_order);

-- Índice composto para queries comuns
CREATE INDEX idx_tickets_event_active ON tickets (event_id, active);

COMMENT ON
TABLE tickets IS 'Lotes de ingressos vinculados a eventos';

COMMENT ON COLUMN tickets.quantity_sold IS 'Quantidade vendida (gerenciado por sistema de pagamento)';

COMMENT ON COLUMN tickets.sale_starts_at IS 'Data de início das vendas (null = imediato)';

COMMENT ON COLUMN tickets.sale_ends_at IS 'Data de fim das vendas (null = sem limite)';

-- =====================================================================
-- 6. TRIGGERS PARA AUTO-UPDATE
-- =====================================================================

-- Função genérica para updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em events
CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Aplicar trigger em tickets
CREATE TRIGGER tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

ALTER TABLE events_categories_pivot ENABLE ROW LEVEL SECURITY;

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- POLICIES: event_categories (Público)
-- =====================================================================

CREATE POLICY "Categorias são públicas para leitura" ON event_categories FOR
SELECT USING (true);

CREATE POLICY "Apenas admins podem criar categorias"
    ON event_categories
    FOR INSERT
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- =====================================================================
-- POLICIES: events
-- =====================================================================

-- Leitura: Público vê 'published', criador vê seus próprios drafts
CREATE POLICY "Eventos publicados são públicos" ON events FOR
SELECT USING (
        status = 'published'
        OR organizer_id = auth.uid ()
    );

-- Inserção: Apenas usuários autenticados
CREATE POLICY "Usuários autenticados podem criar eventos" ON events FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND organizer_id = auth.uid ()
    );

-- Atualização: Apenas o organizador
CREATE POLICY "Organizadores podem atualizar seus eventos" ON events FOR
UPDATE USING (organizer_id = auth.uid ())
WITH
    CHECK (organizer_id = auth.uid ());

-- Exclusão: Apenas o organizador
CREATE POLICY "Organizadores podem deletar seus eventos" ON events FOR DELETE USING (organizer_id = auth.uid ());

-- =====================================================================
-- POLICIES: events_categories_pivot
-- =====================================================================

-- Leitura: Público vê categorias de eventos publicados
CREATE POLICY "Categorias de eventos são públicas" ON events_categories_pivot FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM events
            WHERE
                events.id = event_id
                AND (
                    events.status = 'published'
                    OR events.organizer_id = auth.uid ()
                )
        )
    );

-- Escrita: Apenas o organizador do evento
CREATE POLICY "Organizadores podem gerenciar categorias" ON events_categories_pivot FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM events
        WHERE
            events.id = event_id
            AND events.organizer_id = auth.uid ()
    )
);

-- =====================================================================
-- POLICIES: tickets
-- =====================================================================

-- Leitura: Público vê tickets de eventos publicados
CREATE POLICY "Tickets de eventos publicados são públicos" ON tickets FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM events
            WHERE
                events.id = event_id
                AND (
                    events.status = 'published'
                    OR events.organizer_id = auth.uid ()
                )
        )
    );

-- Escrita: Apenas o organizador do evento
CREATE POLICY "Organizadores podem gerenciar tickets" ON tickets FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM events
        WHERE
            events.id = event_id
            AND events.organizer_id = auth.uid ()
    )
)
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM events
            WHERE
                events.id = event_id
                AND events.organizer_id = auth.uid ()
        )
    );

-- =====================================================================
-- 8. FUNÇÕES UTILITÁRIAS
-- =====================================================================

-- Função para buscar eventos futuros
CREATE OR REPLACE FUNCTION get_upcoming_events(
    limit_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    slug TEXT,
    title TEXT,
    short_description TEXT,
    cover_image_url TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    format event_format,
    status event_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.slug,
        e.title,
        e.short_description,
        e.cover_image_url,
        e.starts_at,
        e.ends_at,
        e.format,
        e.status
    FROM events e
    WHERE e.status = 'published'
      AND e.starts_at > now()
    ORDER BY e.starts_at ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Função para verificar disponibilidade de tickets
CREATE OR REPLACE FUNCTION get_available_ticket_count(ticket_id UUID)
RETURNS INT AS $$
DECLARE
    available_count INT;
BEGIN
    SELECT (quantity_total - quantity_sold)
    INTO available_count
    FROM tickets
    WHERE id = ticket_id AND active = true;
    
    RETURN COALESCE(available_count, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Função para incrementar views
CREATE OR REPLACE FUNCTION increment_event_views(event_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE events
    SET views_count = views_count + 1
    WHERE slug = event_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 9. SEED INICIAL (Categorias padrão)
-- =====================================================================

INSERT INTO
    event_categories (name, slug, icon, sort_order)
VALUES (
        'Música ao Vivo',
        'musica-ao-vivo',
        'Music',
        1
    ),
    (
        'Festivais',
        'festivais',
        'PartyPopper',
        2
    ),
    (
        'Conferências',
        'conferencias',
        'Presentation',
        3
    ),
    (
        'Workshops',
        'workshops',
        'GraduationCap',
        4
    ),
    (
        'Esportes',
        'esportes',
        'Trophy',
        5
    ),
    (
        'Teatro',
        'teatro',
        'Drama',
        6
    ),
    (
        'Exposições',
        'exposicoes',
        'Image',
        7
    ),
    (
        'Networking',
        'networking',
        'Users',
        8
    ),
    (
        'Webinars',
        'webinars',
        'Video',
        9
    ),
    (
        'Outros',
        'outros',
        'MoreHorizontal',
        10
    ) ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- COMMIT DA TRANSAÇÃO
-- =====================================================================

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Criar evento:
-- INSERT INTO events (organizer_id, slug, title, short_description, starts_at, ends_at, format, location_data)
-- VALUES (
--   auth.uid(),
--   'festival-verao-2025',
--   'Festival de Verão 2025',
--   'O maior festival de música do Brasil',
--   '2025-02-20 14:00:00+00',
--   '2025-02-22 23:00:00+00',
--   'in_person',
--   '{"address": "Parque Ibirapuera", "city": "São Paulo", "state": "SP", "coordinates": {"lat": -23.5878, "lng": -46.6572}}'
-- );

-- Adicionar categoria ao evento:
-- INSERT INTO events_categories_pivot (event_id, category_id)
-- SELECT 'event-uuid', id FROM event_categories WHERE slug = 'festivais';

-- Criar ticket:
-- INSERT INTO tickets (event_id, name, price, currency, quantity_total, quantity_sold)
-- VALUES ('event-uuid', 'Lote 1 - Pista', 150.00, 'BRL', 1000, 0);

-- Buscar próximos eventos:
-- SELECT * FROM get_upcoming_events(5);

-- Verificar disponibilidade:
-- SELECT get_available_ticket_count('ticket-uuid');