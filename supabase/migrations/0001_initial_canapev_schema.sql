-- =====================================================================
-- CANAPEV - Marketplace Nacional de Eventos
-- Migração Inicial do Schema do Banco de Dados
-- =====================================================================
-- Versão: 0001
-- Data: 2025-12-22
-- Descrição: Estrutura completa do banco de dados para marketplace de
--            eventos com suporte a fornecedores, locais, produtos e serviços.
--            Otimizado para alta escalabilidade e busca geoespacial.
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. HABILITAÇÃO DE EXTENSÕES
-- =====================================================================
-- Essas extensões expandem as capacidades do PostgreSQL para atender
-- aos requisitos de busca textual avançada e dados geoespaciais.

-- pg_trgm: Trigram Matching para busca fuzzy e similaridade textual
-- Permite buscas tolerantes a erros de digitação e auto-complete
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- PostGIS: Suporte completo para dados geoespaciais
-- Permite cálculos de distância, raio de busca e indexação espacial
CREATE EXTENSION IF NOT EXISTS postgis;

-- UUID: Geração de identificadores únicos universais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMENT ON EXTENSION pg_trgm IS 'Trigram matching para busca fuzzy e auto-complete';

COMMENT ON EXTENSION postgis IS 'Suporte geoespacial para busca por proximidade';

-- =====================================================================
-- 2. ENUMS CUSTOMIZADOS
-- =====================================================================
-- Enums garantem consistência de dados e facilitam validações

-- Tipo de anúncio no marketplace
CREATE TYPE listing_type_enum AS ENUM (
    'venue',        -- Local para eventos (espaços, salões)
    'service',      -- Serviços (fotografia, buffet, decoração)
    'product_rent', -- Produtos para aluguel (som, iluminação, mobília)
    'product_sale'  -- Produtos para venda (descartáveis, lembrancinhas)
);

-- Status do anúncio no sistema
CREATE TYPE listing_status_enum AS ENUM (
    'draft',    -- Rascunho (não visível publicamente)
    'active',   -- Ativo e visível no marketplace
    'archived'  -- Arquivado (histórico, não visível)
);

-- Perfil/Role do usuário
CREATE TYPE user_role_enum AS ENUM (
    'customer', -- Cliente que busca serviços
    'supplier', -- Fornecedor que oferece produtos/serviços
    'admin'     -- Administrador da plataforma
);

-- Tipo de mídia
CREATE TYPE media_type_enum AS ENUM (
    'image',
    'video'
);

COMMENT ON TYPE listing_type_enum IS 'Categorização do tipo de anúncio no marketplace';

COMMENT ON TYPE listing_status_enum IS 'Controle de visibilidade e ciclo de vida do anúncio';

COMMENT ON TYPE user_role_enum IS 'Permissões e funcionalidades baseadas em papel do usuário';

-- =====================================================================
-- 3. TABELA: profiles
-- =====================================================================
-- Estende auth.users do Supabase com informações de perfil público
-- Decisão: Separar dados públicos (profiles) dos privados (auth.users)

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,

-- Metadados temporais
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- Constraints
CONSTRAINT full_name_min_length CHECK (char_length(full_name) >= 2)
);

-- Índices para performance
CREATE INDEX idx_profiles_role ON profiles (role);

CREATE INDEX idx_profiles_verified ON profiles (is_verified)
WHERE
    is_verified = true;

COMMENT ON
TABLE profiles IS 'Perfis públicos dos usuários, estendendo auth.users';

COMMENT ON COLUMN profiles.is_verified IS 'Verificação manual pela equipe CANAPEV (badge de confiança)';

COMMENT ON COLUMN profiles.role IS 'Define permissões e acesso a funcionalidades específicas';

-- =====================================================================
-- 4. TABELA: categories
-- =====================================================================
-- Estrutura hierárquica para organização de anúncios
-- Decisão: Adjacency List Pattern para árvore de categorias

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    icon_name TEXT, -- Nome do ícone Lucide React (ex: 'music', 'camera')
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,

-- Metadados temporais
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- Constraints
CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT name_min_length CHECK (char_length(name) >= 2),
    CONSTRAINT no_self_reference CHECK (id != parent_id)
);

-- Índices para performance
CREATE INDEX idx_categories_parent ON categories (parent_id);

CREATE INDEX idx_categories_slug ON categories (slug);

CREATE INDEX idx_categories_sort ON categories (sort_order);

-- Índice para busca de texto
CREATE INDEX idx_categories_name_trgm ON categories USING GIN (name gin_trgm_ops);

COMMENT ON
TABLE categories IS 'Hierarquia de categorias para classificação de anúncios';

COMMENT ON COLUMN categories.parent_id IS 'Null = categoria raiz, UUID = subcategoria';

COMMENT ON COLUMN categories.slug IS 'URL-friendly, único, para rotas (ex: equipamentos-som-cabos)';

COMMENT ON COLUMN categories.icon_name IS 'Referência ao nome do ícone Lucide React para UI';

-- =====================================================================
-- 5. TABELA: listings
-- =====================================================================
-- Tabela central: todos os anúncios (locais, serviços, produtos)
-- Decisão: JSONB para metadados flexíveis sem poluir o schema

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,

-- Informações básicas
title TEXT NOT NULL,
slug TEXT NOT NULL UNIQUE,
description TEXT NOT NULL,

-- Tipo e status
listing_type listing_type_enum NOT NULL,
status listing_status_enum NOT NULL DEFAULT 'draft',

-- Preços (em centavos para evitar problemas de precisão)
price_min BIGINT, -- Preço mínimo em centavos
price_max BIGINT, -- Preço máximo em centavos (para faixas)
price_unit TEXT, -- 'hora', 'dia', 'unidade', 'pessoa', 'evento'

-- Metadados flexíveis (JSONB)
-- Exemplo: {"voltagem": "110V/220V", "potencia": "1000W", "capacidade": 500}
metadata JSONB NOT NULL DEFAULT '{}',

-- Dados de localização (JSONB + PostGIS)
location_data JSONB NOT NULL DEFAULT '{}',
-- Exemplo: {"endereco": "Rua X", "cidade": "São Paulo", "estado": "SP", 
--           "cep": "01234-567", "lat": -23.550520, "long": -46.633308}

-- Ponto geográfico para cálculos espaciais
location_point GEOGRAPHY (POINT, 4326),

-- Busca full-text (gerado automaticamente via trigger)
search_vector TSVECTOR,

-- Estatísticas de engajamento
view_count INTEGER NOT NULL DEFAULT 0,
favorite_count INTEGER NOT NULL DEFAULT 0,

-- Metadados temporais
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- Constraints
CONSTRAINT title_min_length CHECK (char_length(title) >= 5),
    CONSTRAINT description_min_length CHECK (char_length(description) >= 20),
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT price_min_positive CHECK (price_min IS NULL OR price_min >= 0),
    CONSTRAINT price_max_positive CHECK (price_max IS NULL OR price_max >= 0),
    CONSTRAINT price_range_valid CHECK (price_min IS NULL OR price_max IS NULL OR price_max >= price_min)
);

-- Índices para performance
CREATE INDEX idx_listings_owner ON listings (owner_id);

CREATE INDEX idx_listings_category ON listings (category_id);

CREATE INDEX idx_listings_type ON listings (listing_type);

CREATE INDEX idx_listings_status ON listings (status);

CREATE INDEX idx_listings_created ON listings (created_at DESC);

-- Índice composto para filtros comuns
CREATE INDEX idx_listings_status_type ON listings (status, listing_type);

-- Índice GIN para busca em JSONB metadata
CREATE INDEX idx_listings_metadata ON listings USING GIN (metadata);

-- Índice GIN para busca em JSONB location_data
CREATE INDEX idx_listings_location_data ON listings USING GIN (location_data);

-- Índice GIN para busca full-text
CREATE INDEX idx_listings_search_vector ON listings USING GIN (search_vector);

-- Índice GIST para busca geoespacial (raio de proximidade)
CREATE INDEX idx_listings_location_point ON listings USING GIST (location_point);

-- Índice para busca de texto no título
CREATE INDEX idx_listings_title_trgm ON listings USING GIN (title gin_trgm_ops);

COMMENT ON
TABLE listings IS 'Anúncios centralizados de locais, serviços e produtos';

COMMENT ON COLUMN listings.metadata IS 'Atributos técnicos variáveis por tipo de produto (JSONB flexível)';

COMMENT ON COLUMN listings.location_data IS 'Endereço completo em formato estruturado';

COMMENT ON COLUMN listings.location_point IS 'Coordenadas geográficas para cálculos espaciais';

COMMENT ON COLUMN listings.search_vector IS 'Índice de busca full-text atualizado automaticamente';

-- =====================================================================
-- 6. TABELA: media
-- =====================================================================
-- Galeria de imagens e vídeos para os anúncios

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    media_type media_type_enum NOT NULL DEFAULT 'image',
    sort_order INTEGER NOT NULL DEFAULT 0,
    caption TEXT,

-- Metadados temporais
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

-- Constraints
CONSTRAINT url_not_empty CHECK (char_length(url) > 0) );

-- Índices para performance
CREATE INDEX idx_media_listing ON media (listing_id, sort_order);

CREATE INDEX idx_media_type ON media (media_type);

COMMENT ON
TABLE media IS 'Galeria de mídias (fotos/vídeos) associadas aos anúncios';

COMMENT ON COLUMN media.sort_order IS 'Ordem de exibição na galeria (0 = principal)';

-- =====================================================================
-- 7. TRIGGERS AUTOMÁTICOS
-- =====================================================================

-- 7.1 Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON FUNCTION update_updated_at_column () IS 'Atualiza automaticamente o campo updated_at em modificações';

-- 7.2 Trigger para atualizar search_vector automaticamente
CREATE OR REPLACE FUNCTION update_listing_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.metadata::text, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_search_vector BEFORE INSERT OR UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_listing_search_vector();

COMMENT ON FUNCTION update_listing_search_vector () IS 'Gera índice de busca full-text ponderado (título mais relevante)';

-- 7.3 Trigger para extrair e atualizar location_point de location_data
CREATE OR REPLACE FUNCTION update_listing_location_point()
RETURNS TRIGGER AS $$
BEGIN
    -- Extrai lat/long do JSONB e cria ponto geográfico
    IF NEW.location_data ? 'lat' AND NEW.location_data ? 'long' THEN
        NEW.location_point := ST_SetSRID(
            ST_MakePoint(
                (NEW.location_data->>'long')::double precision,
                (NEW.location_data->>'lat')::double precision
            ),
            4326
        );
    ELSE
        NEW.location_point := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_location_point BEFORE INSERT OR UPDATE ON listings
    FOR EACH ROW EXECUTE FUNCTION update_listing_location_point();

COMMENT ON FUNCTION update_listing_location_point () IS 'Converte coordenadas do JSONB para tipo GEOGRAPHY espacial';

-- 7.4 Trigger para criar perfil automaticamente ao registrar usuário
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role_enum, 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

COMMENT ON FUNCTION create_profile_for_new_user () IS 'Cria perfil público automaticamente ao registrar novo usuário';

-- =====================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- 8.1 Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- 8.2 Policies para PROFILES
-- Leitura: Qualquer usuário autenticado pode ver perfis públicos
CREATE POLICY "Perfis públicos são visíveis para todos" ON profiles FOR
SELECT USING (true);

-- Inserção: Usuários podem criar apenas seu próprio perfil
CREATE POLICY "Usuários podem criar seu próprio perfil" ON profiles FOR
INSERT
WITH
    CHECK (auth.uid () = id);

-- Atualização: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles FOR
UPDATE USING (auth.uid () = id)
WITH
    CHECK (auth.uid () = id);

-- Exclusão: Usuários podem deletar apenas seu próprio perfil
CREATE POLICY "Usuários podem deletar seu próprio perfil" ON profiles FOR DELETE USING (auth.uid () = id);

-- 8.3 Policies para CATEGORIES
-- Leitura: Pública para todos
CREATE POLICY "Categorias são públicas" ON categories FOR
SELECT USING (true);

-- Escrita: Apenas admins (para gestão futura)
CREATE POLICY "Apenas admins podem gerenciar categorias" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.role = 'admin'
    )
);

-- 8.4 Policies para LISTINGS
-- Leitura: Qualquer um pode ver anúncios ativos
CREATE POLICY "Anúncios ativos são públicos" ON listings FOR
SELECT USING (
        status = 'active'
        OR owner_id = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM profiles
            WHERE
                profiles.id = auth.uid ()
                AND profiles.role = 'admin'
        )
    );

-- Inserção: Usuários autenticados podem criar anúncios
CREATE POLICY "Usuários autenticados podem criar anúncios" ON listings FOR
INSERT
WITH
    CHECK (auth.uid () = owner_id);

-- Atualização: Apenas o dono ou admin
CREATE POLICY "Apenas donos e admins podem editar anúncios" ON listings FOR
UPDATE USING (
    owner_id = auth.uid ()
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.role = 'admin'
    )
);

-- Exclusão: Apenas o dono ou admin
CREATE POLICY "Apenas donos e admins podem deletar anúncios" ON listings FOR DELETE USING (
    owner_id = auth.uid ()
    OR EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            profiles.id = auth.uid ()
            AND profiles.role = 'admin'
    )
);

-- 8.5 Policies para MEDIA
-- Leitura: Pública para mídias de anúncios ativos
CREATE POLICY "Mídias de anúncios ativos são públicas" ON media FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM listings
            WHERE
                listings.id = media.listing_id
                AND (
                    listings.status = 'active'
                    OR listings.owner_id = auth.uid ()
                    OR EXISTS (
                        SELECT 1
                        FROM profiles
                        WHERE
                            profiles.id = auth.uid ()
                            AND profiles.role = 'admin'
                    )
                )
        )
    );

-- Inserção: Apenas o dono do anúncio
CREATE POLICY "Apenas donos podem adicionar mídias" ON media FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM listings
            WHERE
                listings.id = media.listing_id
                AND listings.owner_id = auth.uid ()
        )
    );

-- Atualização: Apenas o dono do anúncio
CREATE POLICY "Apenas donos podem atualizar mídias" ON media FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM listings
        WHERE
            listings.id = media.listing_id
            AND listings.owner_id = auth.uid ()
    )
);

-- Exclusão: Apenas o dono do anúncio
CREATE POLICY "Apenas donos podem deletar mídias" ON media FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM listings
        WHERE
            listings.id = media.listing_id
            AND listings.owner_id = auth.uid ()
    )
);

-- =====================================================================
-- 9. FUNÇÕES UTILITÁRIAS
-- =====================================================================

-- 9.1 Função para busca geoespacial por raio
CREATE OR REPLACE FUNCTION search_listings_by_radius(
    user_lat DOUBLE PRECISION,
    user_long DOUBLE PRECISION,
    radius_km DOUBLE PRECISION DEFAULT 50
)
RETURNS TABLE (
    listing_id UUID,
    title TEXT,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        ST_Distance(
            l.location_point,
            ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)::geography
        ) / 1000 AS distance_km
    FROM listings l
    WHERE 
        l.status = 'active'
        AND l.location_point IS NOT NULL
        AND ST_DWithin(
            l.location_point,
            ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)::geography,
            radius_km * 1000
        )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_listings_by_radius IS 'Busca anúncios por proximidade geográfica (raio em km)';

-- 9.2 Função para busca full-text com ranking
CREATE OR REPLACE FUNCTION search_listings_fulltext(
    search_query TEXT,
    limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
    listing_id UUID,
    title TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        ts_rank(l.search_vector, query) AS rank
    FROM listings l, plainto_tsquery('portuguese', search_query) query
    WHERE 
        l.status = 'active'
        AND l.search_vector @@ query
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_listings_fulltext IS 'Busca full-text com ranking de relevância';

-- =====================================================================
-- 10. DADOS INICIAIS (SEED)
-- =====================================================================

-- Categorias raiz
INSERT INTO
    categories (
        name,
        slug,
        icon_name,
        description
    )
VALUES (
        'Locais',
        'locais',
        'map-pin',
        'Espaços para realização de eventos'
    ),
    (
        'Equipamentos',
        'equipamentos',
        'speaker',
        'Equipamentos técnicos para eventos'
    ),
    (
        'Serviços',
        'servicos',
        'briefcase',
        'Serviços profissionais para eventos'
    ),
    (
        'Decoração',
        'decoracao',
        'palette',
        'Itens e serviços de decoração'
    ),
    (
        'Alimentação',
        'alimentacao',
        'utensils',
        'Buffets e serviços de alimentação'
    ),
    (
        'Entretenimento',
        'entretenimento',
        'music',
        'Shows e entretenimento'
    );

-- Subcategorias de Equipamentos
INSERT INTO
    categories (
        name,
        slug,
        parent_id,
        icon_name
    )
SELECT 'Som e Áudio', 'som-audio', id, 'volume-2'
FROM categories
WHERE
    slug = 'equipamentos'
UNION ALL
SELECT 'Iluminação', 'iluminacao', id, 'lightbulb'
FROM categories
WHERE
    slug = 'equipamentos'
UNION ALL
SELECT 'Estruturas', 'estruturas', id, 'tent'
FROM categories
WHERE
    slug = 'equipamentos';

-- Subcategorias de Serviços
INSERT INTO
    categories (
        name,
        slug,
        parent_id,
        icon_name
    )
SELECT 'Fotografia', 'fotografia', id, 'camera'
FROM categories
WHERE
    slug = 'servicos'
UNION ALL
SELECT 'Filmagem', 'filmagem', id, 'video'
FROM categories
WHERE
    slug = 'servicos'
UNION ALL
SELECT 'Cerimonial', 'cerimonial', id, 'users'
FROM categories
WHERE
    slug = 'servicos';

-- =====================================================================
-- COMMIT DA TRANSAÇÃO
-- =====================================================================

COMMIT;

-- =====================================================================
-- FIM DA MIGRAÇÃO
-- =====================================================================
-- Próximos passos sugeridos:
-- 1. Criar tabelas de favoritos (user_favorites)
-- 2. Criar tabelas de avaliações (reviews)
-- 3. Criar tabelas de mensagens (conversations, messages)
-- 4. Implementar sistema de reservas/pedidos
-- 5. Adicionar analytics e tracking de eventos
-- =====================================================================