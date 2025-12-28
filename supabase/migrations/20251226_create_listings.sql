-- =====================================================================
-- CRIAR TABELA LISTINGS - Marketplace/Classificados
-- =====================================================================
-- Tabela completa para o sistema de Classificados (Gear Exchange)
-- =====================================================================

-- 1. Criar tabela principal listings
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Informações básicas
title TEXT NOT NULL, description TEXT,

-- Preço
price_min DECIMAL(10, 2) NOT NULL DEFAULT 0,
price_max DECIMAL(10, 2),
price_unit TEXT DEFAULT 'unit',

-- Tipo e condição
listing_type TEXT NOT NULL DEFAULT 'product_sale',
condition TEXT DEFAULT 'usado',
status TEXT DEFAULT 'active',

-- Localização (JSON)
location_data JSONB,

-- Relacionamentos
profiles_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
category_id UUID,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),

-- Constraints
CONSTRAINT listings_type_check 
    CHECK (listing_type IN ('venue', 'service', 'product_rent', 'product_sale')),
  CONSTRAINT listings_condition_check 
    CHECK (condition IN ('novo', 'seminovo', 'usado', 'pecas')),
  CONSTRAINT listings_status_check 
    CHECK (status IN ('active', 'inactive', 'sold')),
  CONSTRAINT listings_price_unit_check
    CHECK (price_unit IN ('unit', 'hour', 'day', 'week', 'month'))
);

-- 2. Criar tabela de categorias (se não existir)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Adicionar FK para categories (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
    ALTER TABLE public.listings 
    ADD CONSTRAINT fk_listings_category 
    FOREIGN KEY (category_id) REFERENCES public.categories(id);
  END IF;
END $$;

-- 4. Criar tabela de mídia (fotos)
CREATE TABLE IF NOT EXISTS public.listings_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    listing_id UUID NOT NULL REFERENCES public.listings (id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT listings_media_type_check CHECK (
        media_type IN ('image', 'video')
    )
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings (status);

CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings (listing_type);

CREATE INDEX IF NOT EXISTS idx_listings_condition ON public.listings (condition);

CREATE INDEX IF NOT EXISTS idx_listings_profile ON public.listings (profiles_id);

CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings (category_id);

CREATE INDEX IF NOT EXISTS idx_listings_created ON public.listings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_media_listing ON public.listings_media (listing_id);

-- 6. Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.listings;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 7. RLS - Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.listings_media ENABLE ROW LEVEL SECURITY;

-- Policy: Todos podem ver listings ativos
DROP POLICY IF EXISTS "Listings públicos são visíveis" ON public.listings;

CREATE POLICY "Listings públicos são visíveis" ON public.listings FOR
SELECT USING (status = 'active');

-- Policy: Dono pode ver seus próprios (mesmo inativos)
DROP POLICY IF EXISTS "Dono pode ver próprios listings" ON public.listings;

CREATE POLICY "Dono pode ver próprios listings" ON public.listings FOR
SELECT USING (auth.uid()::uuid = profiles_id);

-- Policy: Usuários autenticados podem criar
DROP POLICY IF EXISTS "Usuários podem criar listings" ON public.listings;

CREATE POLICY "Usuários podem criar listings" ON public.listings FOR
INSERT
WITH
    CHECK (auth.uid()::uuid = profiles_id);

-- Policy: Dono pode editar
DROP POLICY IF EXISTS "Dono pode editar listings" ON public.listings;

CREATE POLICY "Dono pode editar listings" ON public.listings FOR
UPDATE USING (auth.uid()::uuid = profiles_id);

-- Policy: Dono pode deletar
DROP POLICY IF EXISTS "Dono pode deletar listings" ON public.listings;

CREATE POLICY "Dono pode deletar listings" ON public.listings FOR DELETE USING (auth.uid()::uuid = profiles_id);

-- Policy Mídia: Pública se listing ativo
DROP POLICY IF EXISTS "Mídia pública" ON public.listings_media;

CREATE POLICY "Mídia pública" ON public.listings_media FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.listings
            WHERE
                id = listing_id
                AND status = 'active'
        )
    );

-- Policy Mídia: Dono pode inserir
DROP POLICY IF EXISTS "Dono pode adicionar mídia" ON public.listings_media;

CREATE POLICY "Dono pode adicionar mídia" ON public.listings_media FOR
INSERT
WITH
    CHECK (
        EXISTS (
            SELECT 1
            FROM public.listings
            WHERE
                id = listing_id
                AND profiles_id = auth.uid ()
        )
    );

-- 8. Seed de categorias (opcional)
INSERT INTO
    public.categories (name, slug, description)
VALUES (
        'Áudio',
        'audio',
        'Equipamentos de áudio profissional'
    ),
    (
        'Iluminação',
        'iluminacao',
        'Sistemas de iluminação para eventos'
    ),
    (
        'Vídeo',
        'video',
        'Câmeras, projetores e equipamentos de vídeo'
    ),
    (
        'Estrutura',
        'estrutura',
        'Palcos, treliças e estruturas metálicas'
    ),
    (
        'Energia',
        'energia',
        'Geradores e distribuição elétrica'
    ),
    (
        'Transporte',
        'transporte',
        'Vans, trucks e carretas'
    ) ON CONFLICT (slug) DO NOTHING;

-- 9. Reload schema
NOTIFY pgrst, 'reload schema';

-- 10. Verificação
DO $$ BEGIN RAISE NOTICE '';

RAISE NOTICE '═══════════════════════════════════════════';

RAISE NOTICE '📦 TABELA LISTINGS CRIADA COM SUCESSO!';

RAISE NOTICE '═══════════════════════════════════════════';

RAISE NOTICE '✅ Tabela listings criada';

RAISE NOTICE '✅ Tabela listings_media criada';

RAISE NOTICE '✅ Tabela categories criada';

RAISE NOTICE '✅ Índices criados';

RAISE NOTICE '✅ RLS policies configuradas';

RAISE NOTICE '✅ Triggers configurados';

RAISE NOTICE '';

RAISE NOTICE '🎯 Próximo passo: Execute 20251226_final_update.sql';

RAISE NOTICE '═══════════════════════════════════════════';

END $$;