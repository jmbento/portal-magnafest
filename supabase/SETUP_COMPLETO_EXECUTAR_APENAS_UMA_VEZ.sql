-- =====================================================================
-- CANAPEV - SETUP COMPLETO DO BANCO DE DADOS
-- =====================================================================
-- Este arquivo cria TODAS as tabelas necessárias de uma vez
-- Execute ESTE ARQUIVO ÚNICO no SQL Editor do Supabase
-- =====================================================================

BEGIN;

-- =====================================================================
-- PARTE 1: EVENTOS
-- =====================================================================

-- ENUMs
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_format AS ENUM ('online', 'in_person', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE currency AS ENUM ('BRL', 'USD', 'EUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tabela events


CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    organizer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    short_description TEXT,
    full_content TEXT,
    cover_image_url TEXT,
    external_ticket_url TEXT,
    
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    
    format event_format DEFAULT 'in_person',
    status event_status DEFAULT 'draft',
    
    location_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    views_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT valid_dates CHECK (ends_at > starts_at)
);

-- Tabela tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency currency DEFAULT 'BRL',
    quantity_total INTEGER NOT NULL DEFAULT 0,
    quantity_sold INTEGER NOT NULL DEFAULT 0,
    sale_starts_at TIMESTAMPTZ,
    sale_ends_at TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_quantity CHECK (
        quantity_sold <= quantity_total
    )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_events_slug ON events (slug);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events (organizer_id);

CREATE INDEX IF NOT EXISTS idx_events_status ON events (status);

CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events (starts_at);

CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets (event_id);

-- =====================================================================
-- PARTE 2: INSCRIÇÕES
-- =====================================================================

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets (id) ON DELETE SET NULL,
    status TEXT DEFAULT 'confirmed' CHECK (
        status IN (
            'pending',
            'confirmed',
            'cancelled'
        )
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_registration UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations (event_id);

CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations (user_id);

-- =====================================================================
-- PARTE 3: COMPLIANCE DOCS
-- =====================================================================

DO $$ BEGIN
    CREATE TYPE compliance_scope AS ENUM ('national', 'state', 'municipal');

EXCEPTION WHEN duplicate_object THEN null;

END $$;

CREATE TABLE IF NOT EXISTS compliance_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    issuing_body TEXT NOT NULL,
    official_url TEXT,
    scope compliance_scope NOT NULL,
    region_filter TEXT,
    tags TEXT[] DEFAULT '{}',
    is_mandatory BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_scope ON compliance_docs (scope);

CREATE INDEX IF NOT EXISTS idx_compliance_tags ON compliance_docs USING gin (tags);

-- =====================================================================
-- PARTE 4: PROVIDERS
-- =====================================================================

DO $$ BEGIN
    CREATE TYPE enrichment_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');

EXCEPTION WHEN duplicate_object THEN null;

END $$;

CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    full_address TEXT,
    website TEXT,
    instagram_url TEXT,
    linkedin_url TEXT,
    whatsapp TEXT,
    email TEXT,
    phone TEXT,
    description TEXT,
    logo_url TEXT,
    avatar_url TEXT,
    contact_info JSONB DEFAULT '{}'::jsonb,
    source_url TEXT,
    last_enriched_at TIMESTAMPTZ,
    enrichment_status enrichment_status DEFAULT 'pending',
    enrichment_attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_state CHECK (length(state) = 2)
);

CREATE INDEX IF NOT EXISTS idx_providers_slug ON providers (slug);

CREATE INDEX IF NOT EXISTS idx_providers_category ON providers (category);

CREATE INDEX IF NOT EXISTS idx_providers_state_city ON providers (state, city);

-- =====================================================================
-- PARTE 5: BLOG
-- =====================================================================

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published_at DESC)
WHERE
    published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING gin (tags);

COMMIT;

-- =====================================================================
-- RLS POLICIES (Em transação separada)
-- =====================================================================

BEGIN;

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_public_published" ON events;

DROP POLICY IF EXISTS "events_owner_view" ON events;

DROP POLICY IF EXISTS "events_auth_insert" ON events;

DROP POLICY IF EXISTS "events_owner_update" ON events;

CREATE POLICY "events_public_published" ON events FOR
SELECT USING (status = 'published');

CREATE POLICY "events_owner_view" ON events FOR
SELECT USING (auth.uid () = organizer_id);

CREATE POLICY "events_auth_insert" ON events FOR
INSERT
WITH
    CHECK (auth.uid () = organizer_id);

CREATE POLICY "events_owner_update" ON events FOR
UPDATE USING (auth.uid () = organizer_id);

-- Registrations
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registrations_user_view" ON registrations;

DROP POLICY IF EXISTS "registrations_user_insert" ON registrations;

DROP POLICY IF EXISTS "registrations_user_delete" ON registrations;

CREATE POLICY "registrations_user_view" ON registrations FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "registrations_user_insert" ON registrations FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "registrations_user_delete" ON registrations FOR DELETE USING (auth.uid () = user_id);

-- Compliance Docs (Público)
ALTER TABLE compliance_docs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "compliance_public" ON compliance_docs;

CREATE POLICY "compliance_public" ON compliance_docs FOR
SELECT USING (true);

-- Providers (Público)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "providers_public" ON providers;

CREATE POLICY "providers_public" ON providers FOR
SELECT USING (true);

-- Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_public_published" ON posts;

DROP POLICY IF EXISTS "posts_author_drafts" ON posts;

CREATE POLICY "posts_public_published" ON posts FOR
SELECT USING (published_at IS NOT NULL);

CREATE POLICY "posts_author_drafts" ON posts FOR
SELECT USING (author_id = auth.uid ());

COMMIT;

-- =====================================================================
-- TRIGGERS
-- =====================================================================

BEGIN;

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS events_updated_at ON events;

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS registrations_updated_at ON registrations;

CREATE TRIGGER registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS providers_updated_at ON providers;

CREATE TRIGGER providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS posts_updated_at ON posts;

CREATE TRIGGER posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

COMMIT;

-- =====================================================================
-- SEED DATA
-- =====================================================================

BEGIN;

-- Compliance Docs
INSERT INTO compliance_docs (title, description, issuing_body, official_url, scope, tags, is_mandatory, sort_order) VALUES
('ECAD - Direitos Autorais Musicais', 'Toda vez que você tocar música em um evento (ao vivo ou gravada), é obrigatório pagar os direitos autorais ao ECAD.', 'ECAD', 'https://www.ecad.org.br/', 'national', ARRAY['show', 'música', 'festa'], true, 1),
('AVCB - Auto de Vistoria do Corpo de Bombeiros', 'Documento que atesta que o local do evento cumpre as normas de segurança contra incêndio e pânico.', 'Corpo de Bombeiros Militar', 'https://www.policiamilitar.sp.gov.br/ccb/', 'state', ARRAY['show', 'festa', 'espaço fechado'], true, 2),
('Alvará de Funcionamento Temporário', 'Autorização da prefeitura para realizar eventos em locais públicos ou privados por período determinado.', 'Prefeitura Municipal', NULL, 'municipal', ARRAY['festa', 'rua', 'praça', 'público'], true, 3);

-- Blog Posts
INSERT INTO posts (slug, title, excerpt, content, category, tags, published_at) VALUES
('5-drones-essenciais-filmagem-eventos-2025', '5 Drones Essenciais para Filmagem de Eventos em 2025', 'Descubra os melhores drones profissionais para capturar imagens aéreas incríveis em eventos.', E'# 5 Drones Essenciais\n\nA filmagem aérea está revolucionando eventos.\n\n## 1. DJI Mavic 3 Pro\nO melhor do mercado.\n\n## 2. DJI Air 3\nCusto-benefício excelente.', 'Tecnologia', ARRAY['drones', 'filmagem', 'tecnologia'], now()),
('ia-mudando-gestao-credenciamento-eventos', 'Como a IA está Mudando a Gestão de Credenciamento', 'Inteligência Artificial no credenciamento: reconhecimento facial e automação completa.', E'# IA e Credenciamento\n\nO futuro já chegou.\n\n## Reconhecimento Facial\nCheck-in em 2 segundos.', 'Tecnologia', ARRAY['IA', 'credenciamento', 'inovação'], now()),
('guia-carreira-quanto-cobra-produtor-senior', 'Guia de Carreira: Quanto Cobra um Produtor Sênior?', 'Tabela de preços atualizada 2025: descubra quanto cobrar por cada tipo de evento.', E'# Tabela de Preços 2025\n\n## Eventos Corporativos\n\n- Pequeno: R$ 3.000 - R$ 5.000\n- Médio: R$ 8.000 - R$ 15.000', 'Carreira', ARRAY['carreira', 'produtor', 'preços'], now());

COMMIT;

-- =====================================================================
-- SUCESSO!
-- =====================================================================

SELECT 'Setup completo! Tabelas criadas com sucesso!' as mensagem;