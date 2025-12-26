-- =====================================================================
-- FAVORITES - Sistema de Wishlist/Favoritos
-- =====================================================================
-- Migração: Permite usuários favoritarem profissionais (prova social)
-- =====================================================================

BEGIN;

-- =====================================================================
-- TABELA: favorites
-- =====================================================================

CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraint: Um usuário não pode favoritar o mesmo provider 2x
CONSTRAINT unique_user_provider UNIQUE(user_id, provider_id) );

-- =====================================================================
-- ÍNDICES DE PERFORMANCE
-- =====================================================================

-- Índice para buscar favoritos de um usuário
CREATE INDEX idx_favorites_user_id ON favorites (user_id);

-- Índice para contar favoritos de um provider
CREATE INDEX idx_favorites_provider_id ON favorites (provider_id);

-- Índice composto para verificação rápida de existência
CREATE INDEX idx_favorites_user_provider ON favorites (user_id, provider_id);

COMMENT ON
TABLE favorites IS 'Favoritos/Wishlist de usuários para profissionais';

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- SELECT: Público (para contagem de likes)
CREATE POLICY "Qualquer um pode visualizar favoritos" ON favorites FOR
SELECT USING (true);

-- INSERT: Apenas usuário autenticado pode favoritar
CREATE POLICY "Usuários podem adicionar favoritos" ON favorites FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- DELETE: Apenas o próprio usuário pode desfavoritar
CREATE POLICY "Usuários podem remover seus favoritos" ON favorites FOR DELETE USING (auth.uid () = user_id);

-- =====================================================================
-- ADICIONAR COLUNA: portfolio_images em providers
-- =====================================================================

-- Adicionar array de URLs de imagens do portfólio
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS portfolio_images text[] DEFAULT '{}';

-- Índice GIN para busca eficiente em arrays
CREATE INDEX idx_providers_portfolio_images ON providers USING gin (portfolio_images);

COMMENT ON COLUMN providers.portfolio_images IS 'Array de URLs das imagens do portfólio do profissional';

-- =====================================================================
-- FUNÇÃO: Contar favoritos de um provider
-- =====================================================================

CREATE OR REPLACE FUNCTION get_provider_favorites_count(provider_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)::INTEGER
        FROM favorites
        WHERE provider_id = provider_uuid
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================================
-- FUNÇÃO: Verificar se usuário favoritou provider
-- =====================================================================

CREATE OR REPLACE FUNCTION is_provider_favorited(provider_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM favorites
        WHERE provider_id = provider_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================================
-- FUNÇÃO: Buscar providers com estatísticas de favoritos
-- =====================================================================

CREATE OR REPLACE FUNCTION search_providers_with_stats(
    search_state TEXT DEFAULT NULL,
    search_city TEXT DEFAULT NULL,
    search_category TEXT DEFAULT NULL,
    search_term TEXT DEFAULT NULL,
    verified_only BOOLEAN DEFAULT false,
    sort_by TEXT DEFAULT 'recent', -- 'recent' ou 'popular'
    current_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    category TEXT,
    city TEXT,
    state TEXT,
    website TEXT,
    logo_url TEXT,
    description TEXT,
    instagram_url TEXT,
    whatsapp TEXT,
    portfolio_images text[],
    enrichment_status enrichment_status,
    is_verified BOOLEAN,
    favorites_count INTEGER,
    is_favorited BOOLEAN,
    created_at TIMESTAMPTZ
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
        p.logo_url,
        p.description,
        p.instagram_url,
        p.whatsapp,
        p.portfolio_images,
        p.enrichment_status,
        p.is_verified,
        COALESCE(COUNT(f.id)::INTEGER, 0) AS favorites_count,
        CASE 
            WHEN current_user_id IS NOT NULL THEN
                EXISTS(
                    SELECT 1 
                    FROM favorites f2 
                    WHERE f2.provider_id = p.id AND f2.user_id = current_user_id
                )
            ELSE false
        END AS is_favorited,
        p.created_at
    FROM providers p
    LEFT JOIN favorites f ON f.provider_id = p.id
    WHERE 
        (search_state IS NULL OR p.state = search_state)
        AND (search_city IS NULL OR p.city ILIKE '%' || search_city || '%')
        AND (search_category IS NULL OR p.category ILIKE '%' || search_category || '%')
        AND (search_term IS NULL OR p.name ILIKE '%' || search_term || '%')
        AND (NOT verified_only OR p.is_verified = true)
    GROUP BY p.id
    ORDER BY 
        CASE WHEN sort_by = 'popular' THEN COUNT(f.id) END DESC NULLS LAST,
        CASE WHEN sort_by = 'recent' THEN p.created_at END DESC,
        p.is_verified DESC,
        p.name ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Buscar providers ordenados por popularidade:
-- SELECT * FROM search_providers_with_stats(NULL, NULL, NULL, NULL, false, 'popular', NULL);

-- Buscar favoritos de um usuário:
-- SELECT p.* FROM providers p
-- INNER JOIN favorites f ON f.provider_id = p.id
-- WHERE f.user_id = 'user-uuid'
-- ORDER BY f.created_at DESC;

-- Adicionar favorito:
-- INSERT INTO favorites (user_id, provider_id) VALUES ('user-uuid', 'provider-uuid');

-- Remover favorito:
-- DELETE FROM favorites WHERE user_id = 'user-uuid' AND provider_id = 'provider-uuid';