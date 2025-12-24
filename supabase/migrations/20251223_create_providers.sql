-- =====================================================================
-- PROVIDERS - Tabela de Fornecedores com Enriquecimento Automático
-- =====================================================================
-- Migração: Sistema preparado para scraping e enriquecimento de dados
-- =====================================================================

BEGIN;

-- =====================================================================
-- ENUM: Enrichment Status
-- =====================================================================

CREATE TYPE enrichment_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');

-- =====================================================================
-- TABELA: providers (Fornecedores)
-- =====================================================================

CREATE TABLE IF NOT EXISTS providers (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Dados Principais (OBRIGATÓRIOS)
name TEXT NOT NULL,
slug TEXT UNIQUE,
category TEXT, -- Ex: 'Produtora', 'Segurança', 'Cenografia', 'Buffet'

-- Localização (OBRIGATÓRIO - Chave para busca regional)
city TEXT NOT NULL,
state TEXT NOT NULL, -- UF: SP, RJ, MG, BA, etc
full_address TEXT,

-- Dados de Contato (NULLABLE - Enriquecidos via scraping/usuário)
website TEXT,
instagram_url TEXT,
linkedin_url TEXT,
whatsapp TEXT,
email TEXT,
phone TEXT,

-- Descrição (Pode vir do scraping ou usuário)
description TEXT, logo_url TEXT,

-- Metadados de Automação/Scraping
source_url TEXT, -- De onde tiramos esse nome? (ex: Link ABRAPE)
last_enriched_at TIMESTAMPTZ, -- Quando o robô rodou por último
enrichment_status enrichment_status DEFAULT 'pending',
enrichment_attempts INTEGER DEFAULT 0, -- Quantas vezes tentamos enriquecer

-- Verificação Manual
is_verified BOOLEAN DEFAULT false, -- Admin conferiu os dados

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints
CONSTRAINT valid_state CHECK (length(state) = 2), -- UF tem 2 letras
    CONSTRAINT valid_slug CHECK (slug IS NULL OR slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- =====================================================================
-- ÍNDICES DE PERFORMANCE
-- =====================================================================

-- Índices básicos
CREATE INDEX idx_providers_slug ON providers (slug)
WHERE
    slug IS NOT NULL;

CREATE INDEX idx_providers_category ON providers (category);

-- Índices de localização (CRÍTICOS para busca regional)
CREATE INDEX idx_providers_state ON providers (state);

CREATE INDEX idx_providers_city ON providers (city);

CREATE INDEX idx_providers_state_city ON providers (state, city);
-- Composto

-- Índices de automação
CREATE INDEX idx_providers_enrichment_status ON providers (enrichment_status);

CREATE INDEX idx_providers_pending_enrichment ON providers (last_enriched_at NULLS FIRST)
WHERE
    enrichment_status IN ('pending', 'failed');

-- Índice para busca por nome
CREATE INDEX idx_providers_name_trgm ON providers USING gin (name gin_trgm_ops);

COMMENT ON
TABLE providers IS 'Fornecedores/empresas para enriquecimento automático via scraping';

COMMENT ON COLUMN providers.source_url IS 'URL original de onde o dado foi coletado';

COMMENT ON COLUMN providers.enrichment_status IS 'Status do enriquecimento automático';

COMMENT ON COLUMN providers.last_enriched_at IS 'Última vez que tentamos enriquecer este registro';

-- =====================================================================
-- TRIGGER: Auto-update
-- =====================================================================

CREATE TRIGGER providers_updated_at
    BEFORE UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- FUNÇÃO: Gerar slug automaticamente
-- =====================================================================

CREATE OR REPLACE FUNCTION generate_provider_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := regexp_replace(
            lower(unaccent(NEW.name)),
            '[^a-z0-9]+', '-', 'g'
        );
        -- Remove hífens duplicados e das pontas
        NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
        NEW.slug := trim(both '-' from NEW.slug);
        
        -- Garantir unicidade
        IF EXISTS (SELECT 1 FROM providers WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) THEN
            NEW.slug := NEW.slug || '-' || substr(md5(random()::text), 1, 6);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER providers_generate_slug
    BEFORE INSERT OR UPDATE ON providers
    FOR EACH ROW
    EXECUTE FUNCTION generate_provider_slug();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Leitura: PÚBLICA (qualquer um pode ver a lista)
CREATE POLICY "Qualquer um pode visualizar providers" ON providers FOR
SELECT USING (true);

-- Inserção: Apenas service_role ou admins
CREATE POLICY "Apenas service_role ou admins podem inserir" ON providers FOR
INSERT
WITH
    CHECK (
        -- Service role bypass RLS automaticamente
        -- Apenas admins autenticados
        EXISTS (
            SELECT 1
            FROM auth.users
            WHERE
                id = auth.uid ()
                AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- Atualização: Apenas service_role ou admins
CREATE POLICY "Apenas service_role ou admins podem atualizar" ON providers FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE
            id = auth.uid ()
            AND raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- Exclusão: Apenas service_role ou admins
CREATE POLICY "Apenas service_role ou admins podem deletar" ON providers FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE
            id = auth.uid ()
            AND raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- =====================================================================
-- FUNÇÕES UTILITÁRIAS
-- =====================================================================

-- Buscar providers por localização e categoria
CREATE OR REPLACE FUNCTION search_providers(
    search_state TEXT DEFAULT NULL,
    search_city TEXT DEFAULT NULL,
    search_category TEXT DEFAULT NULL,
    search_term TEXT DEFAULT NULL,
    verified_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    category TEXT,
    city TEXT,
    state TEXT,
    website TEXT,
    enrichment_status enrichment_status,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.category,
        p.city,
        p.state,
        p.website,
        p.enrichment_status,
        p.is_verified
    FROM providers p
    WHERE 
        (search_state IS NULL OR p.state = search_state)
        AND (search_city IS NULL OR p.city ILIKE '%' || search_city || '%')
        AND (search_category IS NULL OR p.category ILIKE '%' || search_category || '%')
        AND (search_term IS NULL OR p.name ILIKE '%' || search_term || '%')
        AND (NOT verified_only OR p.is_verified = true)
    ORDER BY 
        p.is_verified DESC,
        p.name ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Obter providers que precisam de enriquecimento
CREATE OR REPLACE FUNCTION get_providers_needing_enrichment(
    limit_count INTEGER DEFAULT 10
)
RETURNS SETOF providers AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM providers
    WHERE enrichment_status IN ('pending', 'failed')
        AND (last_enriched_at IS NULL OR last_enriched_at < now() - interval '7 days')
        AND enrichment_attempts < 3 -- Máximo 3 tentativas
    ORDER BY 
        CASE enrichment_status 
            WHEN 'pending' THEN 1 
            WHEN 'failed' THEN 2 
        END,
        last_enriched_at NULLS FIRST
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- =====================================================================
-- SEED DATA - Dados de Teste (Baseado em ABRAPE)
-- =====================================================================

BEGIN;

INSERT INTO
    providers (
        name,
        category,
        city,
        state,
        source_url,
        website,
        instagram_url,
        enrichment_status
    )
VALUES

-- Provider 1: Completo
(
    'Produtora Alvorada Eventos',
    'Produtora',
    'São Paulo',
    'SP',
    'https://abrape.org.br/associados',
    'https://www.alvoradaeventos.com.br',
    'https://instagram.com/alvoradaeventos',
    'completed'
),

-- Provider 2: Sem contato (pending enrichment)
(
    'Segurança Forte Security',
    'Segurança',
    'Rio de Janeiro',
    'RJ',
    'https://abrape.org.br/associados',
    NULL,
    NULL,
    'pending'
),

-- Provider 3: Parcialmente preenchido
(
    'Buffet Sabor & Arte',
    'Buffet',
    'Belo Horizonte',
    'MG',
    'https://lista-fornecedores-eventos.com',
    'https://www.saborarte.com.br',
    NULL,
    'in_progress'
),

-- Provider 4: Failed enrichment
(
    'Cenografia Criativa Ltda',
    'Cenografia',
    'Salvador',
    'BA',
    'https://abrape.org.br/associados',
    NULL,
    NULL,
    'failed'
),

-- Provider 5: Completo e verificado
(
    'Iluminação Pro Light',
    'Iluminação',
    'Curitiba',
    'PR',
    'https://abrape.org.br/associados',
    'https://www.prolight.com.br',
    'https://instagram.com/prolightbr',
    'completed'
) ON CONFLICT (slug) DO NOTHING;

-- Marcar o último como verificado
UPDATE providers
SET
    is_verified = true,
    whatsapp = '+5541999999999',
    email = 'contato@prolight.com.br'
WHERE
    name = 'Iluminação Pro Light';

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Buscar providers em SP:
-- SELECT * FROM search_providers('SP', NULL, NULL, NULL, false);

-- Buscar providers que precisam enriquecimento:
-- SELECT * FROM get_providers_needing_enrichment(5);

-- Marcar como enriquecido com sucesso:
-- UPDATE providers
-- SET enrichment_status = 'completed',
--     last_enriched_at = now(),
--     website = 'https://...',
--     instagram_url = 'https://...'
-- WHERE id = 'provider-uuid';

-- Incrementar tentativas de enrichment após falha:
-- UPDATE providers
-- SET enrichment_status = 'failed',
--     last_enriched_at = now(),
--     enrichment_attempts = enrichment_attempts + 1
-- WHERE id = 'provider-uuid';