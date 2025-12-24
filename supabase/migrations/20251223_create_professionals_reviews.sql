-- =====================================================================
-- PROFESSIONALS & REVIEWS - Sistema de Diretório e Reputação
-- =====================================================================
-- Migração: Cria tabelas para profissionais e sistema de avaliações
-- =====================================================================

BEGIN;

-- =====================================================================
-- TABELA: professionals (Perfil de Prestadores de Serviço)
-- =====================================================================

CREATE TABLE IF NOT EXISTS professionals (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

-- Identificação Pública
name TEXT NOT NULL,
slug TEXT NOT NULL UNIQUE,
niche TEXT NOT NULL, -- Ex: 'Fotografia', 'Buffet', 'Segurança'
bio TEXT,

-- Contato (JSONB para flexibilidade)
contact_info JSONB DEFAULT '{}'::jsonb,
    -- Exemplo: { "whatsapp": "+5511999999999", "instagram": "@user", "website": "https://..." }

-- Localização (JSONB)
location JSONB DEFAULT '{}'::jsonb,
    -- Exemplo: { "city": "São Paulo", "state": "SP", "address": "Rua X, 123", "google_maps_link": "..." }

-- Trust Signals (Verificações)
is_verified BOOLEAN DEFAULT false,
address_verified BOOLEAN DEFAULT false,
phone_verified BOOLEAN DEFAULT false,

-- Estatísticas (calculadas)
total_reviews INTEGER DEFAULT 0,
average_rating NUMERIC(3, 2) DEFAULT 0.00, -- Ex: 4.75

-- Avatar/Banner
avatar_url TEXT, banner_url TEXT,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints
CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT valid_rating CHECK (average_rating >= 0 AND average_rating <= 5)
);

-- Índices de Performance
CREATE INDEX idx_professionals_user_id ON professionals (user_id);

CREATE INDEX idx_professionals_slug ON professionals (slug);

CREATE INDEX idx_professionals_niche ON professionals (niche);

CREATE INDEX idx_professionals_verified ON professionals (is_verified)
WHERE
    is_verified = true;

CREATE INDEX idx_professionals_city ON professionals ((location ->> 'city'));

CREATE INDEX idx_professionals_state ON professionals ((location ->> 'state'));

CREATE INDEX idx_professionals_rating ON professionals (average_rating DESC);

-- Índice composto para busca por nicho + cidade
CREATE INDEX idx_professionals_niche_city ON professionals (niche, (location ->> 'city'));

COMMENT ON
TABLE professionals IS 'Profissionais/prestadores de serviço do diretório';

COMMENT ON COLUMN professionals.is_verified IS 'Verificado pelo admin (documentos conferidos)';

COMMENT ON COLUMN professionals.address_verified IS 'Endereço físico verificado';

COMMENT ON COLUMN professionals.phone_verified IS 'Telefone verificado via SMS';

-- =====================================================================
-- TABELA: reviews (Avaliações/Reputação)
-- =====================================================================

CREATE TABLE IF NOT EXISTS reviews (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

-- Avaliação
rating INTEGER NOT NULL CHECK (
    rating >= 1
    AND rating <= 5
),
comment TEXT,

-- Contexto
service_date DATE, -- Quando o serviço foi prestado
verified_hire BOOLEAN DEFAULT false, -- Se o sistema confirmou contratação

-- Moderação
is_approved BOOLEAN DEFAULT true, -- Para moderação futura
flagged BOOLEAN DEFAULT false, -- Se foi denunciado

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraints: Um usuário pode avaliar o mesmo profissional apenas uma vez a cada 30 dias
CONSTRAINT unique_review_per_period 
        EXCLUDE USING gist (
            professional_id WITH =,
            author_id WITH =,
            tstzrange(created_at, created_at + interval '30 days') WITH &&
        )
);

-- Índices de Performance
CREATE INDEX idx_reviews_professional ON reviews (professional_id);

CREATE INDEX idx_reviews_author ON reviews (author_id);

CREATE INDEX idx_reviews_rating ON reviews (rating);

CREATE INDEX idx_reviews_created ON reviews (created_at DESC);

CREATE INDEX idx_reviews_approved ON reviews (is_approved)
WHERE
    is_approved = true;

-- Índice composto para buscar reviews aprovadas de um profissional
CREATE INDEX idx_reviews_professional_approved ON reviews (
    professional_id,
    created_at DESC
)
WHERE
    is_approved = true;

COMMENT ON
TABLE reviews IS 'Avaliações de profissionais pelos clientes';

COMMENT ON COLUMN reviews.verified_hire IS 'Se o sistema confirmou que houve contratação real';

-- =====================================================================
-- TRIGGERS
-- =====================================================================

-- Trigger: Atualizar updated_at
CREATE TRIGGER professionals_updated_at
    BEFORE UPDATE ON professionals
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- FUNÇÃO: Atualizar estatísticas do profissional
-- =====================================================================

CREATE OR REPLACE FUNCTION update_professional_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalcular total_reviews e average_rating
    UPDATE professionals
    SET 
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
            AND is_approved = true
        ),
        average_rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
            FROM reviews 
            WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
            AND is_approved = true
        )
    WHERE id = COALESCE(NEW.professional_id, OLD.professional_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger: Recalcular stats quando review é inserida/atualizada/deletada
CREATE TRIGGER update_stats_on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_professional_stats();

CREATE TRIGGER update_stats_on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_professional_stats();

CREATE TRIGGER update_stats_on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_professional_stats();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFESSIONALS POLICIES
-- =====================

-- Leitura: Público
CREATE POLICY "Qualquer um pode visualizar profissionais" ON professionals FOR
SELECT USING (true);

-- Inserção: Usuário autenticado
CREATE POLICY "Usuários autenticados podem criar perfil" ON professionals FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Atualização: Apenas o dono
CREATE POLICY "Profissional pode atualizar próprio perfil" ON professionals FOR
UPDATE USING (auth.uid () = user_id);

-- Exclusão: Apenas o dono
CREATE POLICY "Profissional pode deletar próprio perfil" ON professionals FOR DELETE USING (auth.uid () = user_id);

-- =====================
-- REVIEWS POLICIES
-- =====================

-- Leitura: Público (apenas aprovadas)
CREATE POLICY "Qualquer um pode visualizar reviews aprovadas" ON reviews FOR
SELECT USING (is_approved = true);

-- Leitura: Autor vê suas próprias reviews (mesmo não aprovadas)
CREATE POLICY "Autor pode visualizar próprias reviews" ON reviews FOR
SELECT USING (auth.uid () = author_id);

-- Inserção: Apenas usuários autenticados
CREATE POLICY "Usuários autenticados podem criar review" ON reviews FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND auth.uid () = author_id
    );

-- Atualização: Apenas o autor (dentro de 24h)
CREATE POLICY "Autor pode editar review em 24h" ON reviews FOR
UPDATE USING (
    auth.uid () = author_id
    AND created_at > now() - interval '24 hours'
);

-- Exclusão: Apenas o autor
CREATE POLICY "Autor pode deletar própria review" ON reviews FOR DELETE USING (auth.uid () = author_id);

-- =====================================================================
-- FUNÇÕES UTILITÁRIAS
-- =====================================================================

-- Buscar profissionais por nicho e cidade
CREATE OR REPLACE FUNCTION search_professionals(
    search_niche TEXT DEFAULT NULL,
    search_city TEXT DEFAULT NULL,
    min_rating NUMERIC DEFAULT 0,
    verified_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    niche TEXT,
    city TEXT,
    average_rating NUMERIC,
    total_reviews INTEGER,
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.niche,
        p.location->>'city' as city,
        p.average_rating,
        p.total_reviews,
        p.is_verified
    FROM professionals p
    WHERE 
        (search_niche IS NULL OR p.niche ILIKE '%' || search_niche || '%')
        AND (search_city IS NULL OR p.location->>'city' ILIKE '%' || search_city || '%')
        AND p.average_rating >= min_rating
        AND (NOT verified_only OR p.is_verified = true)
    ORDER BY 
        p.is_verified DESC,
        p.average_rating DESC,
        p.total_reviews DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Obter reviews de um profissional
CREATE OR REPLACE FUNCTION get_professional_reviews(
    target_slug TEXT,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    rating INTEGER,
    comment TEXT,
    service_date DATE,
    created_at TIMESTAMPTZ,
    author_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.rating,
        r.comment,
        r.service_date,
        r.created_at,
        u.raw_user_meta_data->>'full_name' as author_name
    FROM reviews r
    JOIN professionals p ON p.id = r.professional_id
    LEFT JOIN auth.users u ON u.id = r.author_id
    WHERE p.slug = target_slug
        AND r.is_approved = true
    ORDER BY r.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Criar perfil de profissional:
-- INSERT INTO professionals (user_id, name, slug, niche, bio, contact_info, location)
-- VALUES (
--     auth.uid(),
--     'João Silva Fotografia',
--     'joao-silva-fotografia',
--     'Fotografia',
--     'Fotógrafo especializado em eventos corporativos',
--     '{"whatsapp": "+5511999999999", "instagram": "@joaosilva"}'::jsonb,
--     '{"city": "São Paulo", "state": "SP"}'::jsonb
-- );

-- Buscar profissionais:
-- SELECT * FROM search_professionals('Fotografia', 'São Paulo', 4.0, false);

-- Criar review:
-- INSERT INTO reviews (professional_id, author_id, rating, comment, service_date)
-- VALUES ('prof-uuid', auth.uid(), 5, 'Excelente trabalho!', '2024-12-20');

-- Ver reviews:
-- SELECT * FROM get_professional_reviews('joao-silva-fotografia', 5);