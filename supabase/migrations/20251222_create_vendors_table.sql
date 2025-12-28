-- =====================================================================
-- GUIA ATLAS PRÓ - Tabela de Fornecedores (Vendors)
-- =====================================================================
-- Migração: Implementação de "Unclaimed Listings"
-- Permite inserir perfis públicos que podem ser reivindicados depois
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. CRIAR TABELA VENDORS
-- =====================================================================

CREATE TABLE IF NOT EXISTS vendors (
    -- Identificador único
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Proprietário (nullable = unclaimed listing)
owner_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,

-- Informações básicas
name TEXT NOT NULL,
slug TEXT UNIQUE NOT NULL,
category TEXT NOT NULL,
description TEXT,

-- Informações de contato (JSONB estruturado)
contact_info JSONB DEFAULT '{}'::jsonb,

-- Informações de endereço (JSONB estruturado)
address_info JSONB DEFAULT '{}'::jsonb,

-- Status e tier
is_claimed BOOLEAN DEFAULT false,
subscription_tier TEXT DEFAULT 'free' CHECK (
    subscription_tier IN ('free', 'featured', 'partner')
),

-- Full-text search
search_vector TSVECTOR,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints
CONSTRAINT name_min_length CHECK (char_length(name) >= 2),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comentários da tabela
COMMENT ON
TABLE vendors IS 'Fornecedores de eventos - suporta perfis não reivindicados';

COMMENT ON COLUMN vendors.owner_id IS 'NULL = perfil não reivindicado (criado pela admin)';

COMMENT ON COLUMN vendors.is_claimed IS 'Auto-atualizado quando owner_id é definido';

COMMENT ON COLUMN vendors.subscription_tier IS 'Define ordem de exibição: partner > featured > free';

COMMENT ON COLUMN vendors.contact_info IS 'JSON: {email, phone, whatsapp, website, instagram_url}';

COMMENT ON COLUMN vendors.address_info IS 'JSON: {city, state, neighborhood, zip_code, coordinates: {lat, lng}}';

-- =====================================================================
-- 2. ÍNDICES
-- =====================================================================

-- Índice para busca por slug (usado em URLs)
CREATE INDEX idx_vendors_slug ON vendors (slug);

-- Índice para owner_id (buscar vendors de um usuário)
CREATE INDEX idx_vendors_owner_id ON vendors (owner_id)
WHERE
    owner_id IS NOT NULL;

-- Índice para categoria
CREATE INDEX idx_vendors_category ON vendors (category);

-- Índice GIN para search_vector (full-text search)
CREATE INDEX idx_vendors_search ON vendors USING GIN (search_vector);

-- Índice para subscription_tier (ordenação)
CREATE INDEX idx_vendors_tier ON vendors (subscription_tier);

-- Índice para is_claimed (filtrar não reivindicados)
CREATE INDEX idx_vendors_claimed ON vendors (is_claimed);

-- Índice composto para filtros comuns
CREATE INDEX idx_vendors_category_tier ON vendors (category, subscription_tier);

COMMENT ON INDEX idx_vendors_search IS 'Índice GIN para busca full-text';

-- =====================================================================
-- 3. TRIGGERS
-- =====================================================================

-- Trigger para auto-atualizar updated_at
CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendors_updated_at();

-- Trigger para auto-atualizar is_claimed quando owner_id muda
CREATE OR REPLACE FUNCTION update_vendors_claimed_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.owner_id IS NOT NULL AND OLD.owner_id IS NULL THEN
        NEW.is_claimed = true;
    ELSIF NEW.owner_id IS NULL THEN
        NEW.is_claimed = false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendors_claimed_status
    BEFORE INSERT OR UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendors_claimed_status();

-- Trigger para gerar search_vector automaticamente
CREATE OR REPLACE FUNCTION update_vendors_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = 
        setweight(to_tsvector('portuguese', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.category, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.address_info->>'city', '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.address_info->>'state', '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendors_search_vector
    BEFORE INSERT OR UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_vendors_search_vector();

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Policy: Qualquer um pode VER todos os vendors ativos
CREATE POLICY "Vendors são públicos para leitura" ON vendors FOR
SELECT USING (true);

COMMENT ON POLICY "Vendors são públicos para leitura" ON vendors IS 'Permite visualização pública de todos os fornecedores';

-- Policy: Apenas service_role ou admins podem CRIAR vendors (carga de dados)
-- OU usuários autenticados podem criar seu próprio perfil
CREATE POLICY "Admins ou usuários autenticados podem criar vendors"
    ON vendors
    FOR INSERT
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR auth.uid() IS NOT NULL
    );

COMMENT ON POLICY "Admins ou usuários autenticados podem criar vendors" ON vendors IS 'Permite carga de dados pela admin ou criação de perfil próprio';

-- Policy: Apenas o dono pode ATUALIZAR seu vendor
CREATE POLICY "Proprietários podem atualizar seus vendors" ON vendors FOR
    UPDATE USING (auth.uid()::uuid = owner_id)
WITH
    CHECK (auth.uid()::uuid = owner_id);

COMMENT ON POLICY "Proprietários podem atualizar seus vendors" ON vendors IS 'Apenas o dono pode editar seu perfil';

-- Policy: Apenas o dono pode DELETAR seu vendor
CREATE POLICY "Proprietários podem deletar seus vendors" ON vendors FOR DELETE USING (auth.uid()::uuid = owner_id);

COMMENT ON POLICY "Proprietários podem deletar seus vendors" ON vendors IS 'Apenas o dono pode excluir seu perfil';

-- =====================================================================
-- 5. FUNÇÃO DE BUSCA (RPC)
-- =====================================================================

CREATE OR REPLACE FUNCTION search_vendors(
    search_term TEXT DEFAULT '',
    category_filter TEXT DEFAULT NULL,
    city_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    category TEXT,
    description TEXT,
    contact_info JSONB,
    address_info JSONB,
    is_claimed BOOLEAN,
    subscription_tier TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.slug,
        v.category,
        v.description,
        v.contact_info,
        v.address_info,
        v.is_claimed,
        v.subscription_tier,
        v.created_at
    FROM vendors v
    WHERE 
        -- Filtro de texto (se fornecido)
        (search_term = '' OR v.search_vector @@ plainto_tsquery('portuguese', search_term))
        -- Filtro de categoria (se fornecido)
        AND (category_filter IS NULL OR v.category = category_filter)
        -- Filtro de cidade (se fornecido)
        AND (city_filter IS NULL OR v.address_info->>'city' ILIKE city_filter)
    ORDER BY 
        -- Prioridade 1: Subscription tier (partner > featured > free)
        CASE v.subscription_tier
            WHEN 'partner' THEN 1
            WHEN 'featured' THEN 2
            WHEN 'free' THEN 3
        END,
        -- Prioridade 2: Relevância da busca (se houver termo)
        CASE 
            WHEN search_term != '' THEN ts_rank(v.search_vector, plainto_tsquery('portuguese', search_term))
            ELSE 0
        END DESC,
        -- Prioridade 3: Nome alfabético
        v.name ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_vendors IS 'Busca vendors com filtros opcionais e ordenação por tier + relevância';

-- =====================================================================
-- 6. FUNÇÃO PARA REIVINDICAR PERFIL
-- =====================================================================

CREATE OR REPLACE FUNCTION claim_vendor(
    vendor_slug TEXT,
    user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    vendor_record RECORD;
BEGIN
    -- Buscar vendor pelo slug
    SELECT * INTO vendor_record FROM vendors WHERE slug = vendor_slug;
    
    -- Verificar se existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Vendor não encontrado';
    END IF;
    
    -- Verificar se já foi reivindicado
    IF vendor_record.is_claimed THEN
        RAISE EXCEPTION 'Este perfil já foi reivindicado';
    END IF;
    
    -- Atualizar owner_id (trigger vai atualizar is_claimed automaticamente)
    UPDATE vendors 
    SET owner_id = user_id
    WHERE slug = vendor_slug;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION claim_vendor IS 'Permite usuário reivindicar um perfil não reivindicado';

-- =====================================================================
-- COMMIT DA TRANSAÇÃO
-- =====================================================================

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Inserir vendor não reivindicado (admin):
-- INSERT INTO vendors (name, slug, category, description, contact_info, address_info)
-- VALUES (
--   'DJ Alok',
--   'dj-alok',
--   'DJ',
--   'DJ internacional com performances em grandes festivais',
--   '{"email": "contato@djalok.com", "instagram_url": "instagram.com/djalok"}',
--   '{"city": "São Paulo", "state": "SP", "coordinates": {"lat": -23.5505, "lng": -46.6333}}'
-- );

-- Buscar vendors:
-- SELECT * FROM search_vendors('dj', NULL, NULL, 10);

-- Buscar por categoria:
-- SELECT * FROM search_vendors('', 'DJ', NULL, 10);

-- Buscar por cidade:
-- SELECT * FROM search_vendors('', NULL, 'São Paulo', 10);

-- Reivindicar perfil:
-- SELECT claim_vendor('dj-alok', auth.uid());