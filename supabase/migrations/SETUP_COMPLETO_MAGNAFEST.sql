-- =====================================================================
-- SETUP COMPLETO - Portal MagnaFest (VERSÃO FINAL LIMPA)
-- =====================================================================
-- Este SQL configura TUDO de uma vez
-- Execute COMPLETO no Supabase SQL Editor
--=====================================================================

-- Desabilitar notices para execução mais limpa (opcional)
SET client_min_messages TO WARNING;

-- ===================================================================
-- 1. TABELAS PRINCIPAIS
-- ===================================================================

-- Tabela listings
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    description TEXT,
    price_min DECIMAL(10, 2) NOT NULL DEFAULT 0,
    price_max DECIMAL(10, 2),
    price_unit TEXT DEFAULT 'unit',
    listing_type TEXT NOT NULL DEFAULT 'product_sale',
    condition TEXT DEFAULT 'usado',
    status TEXT DEFAULT 'active',
    location_data JSONB,
    profiles_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
    category_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela listings_media
CREATE TABLE IF NOT EXISTS public.listings_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    listing_id UUID NOT NULL REFERENCES public.listings (id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela moderation_log
CREATE TABLE IF NOT EXISTS public.moderation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    action TEXT NOT NULL,
    reason TEXT,
    moderator_id UUID REFERENCES auth.users (id),
    automated BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 2. ADICIONAR COLUNAS
-- ===================================================================

-- Events: status
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'confirmed';

-- Listings: condition, moderation
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved';

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS ai_flag_reason TEXT;

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users (id);

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

-- Profiles: moderação
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 100 NOT NULL;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS strikes INTEGER DEFAULT 0 NOT NULL;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;

-- Categories: slug (se não tem)
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT;

-- ===================================================================
-- 3. CONSTRAINTS
-- ===================================================================

-- Listings
ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_type_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_type_check CHECK (
    listing_type IN (
        'venue',
        'service',
        'product_rent',
        'product_sale'
    )
);

ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_condition_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_condition_check CHECK (
    condition IN (
        'novo',
        'seminovo',
        'usado',
        'pecas'
    )
);

ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_status_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_status_check CHECK (
    status IN ('active', 'inactive', 'sold')
);

ALTER TABLE public.listings
DROP CONSTRAINT IF EXISTS listings_moderation_status_check;

ALTER TABLE public.listings
ADD CONSTRAINT listings_moderation_status_check CHECK (
    moderation_status IN (
        'pending',
        'approved',
        'rejected'
    )
);

-- Events
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_status_check;

ALTER TABLE public.events
ADD CONSTRAINT events_status_check CHECK (
    status IN (
        'confirmed',
        'pending',
        'cancelled',
        'postponed'
    )
);

-- Profiles
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_trust_score_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_trust_score_check CHECK (
    trust_score >= 0
    AND trust_score <= 100
);

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_strikes_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_strikes_check CHECK (strikes >= 0);

-- ===================================================================
-- 4. ÍNDICES
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings (status);

CREATE INDEX IF NOT EXISTS idx_listings_type ON public.listings (listing_type);

CREATE INDEX IF NOT EXISTS idx_listings_condition ON public.listings (condition);

CREATE INDEX IF NOT EXISTS idx_listings_profile ON public.listings (profiles_id);

CREATE INDEX IF NOT EXISTS idx_listings_moderation ON public.listings (moderation_status);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status);

CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles (is_banned);

CREATE INDEX IF NOT EXISTS idx_moderation_log_target ON public.moderation_log (target_type, target_id);

-- ===================================================================
-- 5. TRIGGERS
-- ===================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.listings;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===================================================================
-- 6. RLS POLICIES
-- ===================================================================

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.listings_media ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.moderation_log ENABLE ROW LEVEL SECURITY;

-- Func helper: verificar se banido
CREATE OR REPLACE FUNCTION is_author_banned(author_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = author_id AND is_banned = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles
DROP POLICY IF EXISTS "Profiles públicos são visíveis" ON public.profiles;

DROP POLICY IF EXISTS "Profiles públicos visíveis exceto banidos" ON public.profiles;

CREATE POLICY "Profiles públicos visíveis exceto banidos" ON public.profiles FOR
SELECT USING (
        is_banned = false
        OR auth.uid () = id
    );

-- Listings
DROP POLICY IF EXISTS "Listings públicos são visíveis" ON public.listings;

DROP POLICY IF EXISTS "Listings aprovados de não-banidos" ON public.listings;

CREATE POLICY "Listings aprovados de não-banidos" ON public.listings FOR
SELECT USING (
        status = 'active'
        AND moderation_status = 'approved'
        AND (
            profiles_id IS NULL
            OR NOT is_author_banned (profiles_id)
        )
    );

DROP POLICY IF EXISTS "Dono pode criar listings" ON public.listings;

CREATE POLICY "Dono pode criar listings" ON public.listings FOR
INSERT
WITH
    CHECK (auth.uid () = profiles_id);

DROP POLICY IF EXISTS "Dono pode editar listings" ON public.listings;

CREATE POLICY "Dono pode editar listings" ON public.listings FOR
UPDATE USING (auth.uid () = profiles_id);

-- Moderation Log (apenas admins)
DROP POLICY IF EXISTS "Apenas admins veem log" ON public.moderation_log;

CREATE POLICY "Apenas admins veem log" ON public.moderation_log FOR
SELECT USING (
        (
            SELECT raw_user_meta_data ->> 'role'
            FROM auth.users
            WHERE
                id = auth.uid ()
        ) = 'admin'
    );

-- ===================================================================
-- 7. FUNÇÕES DE MODERAÇÃO
-- ===================================================================

-- Banir usuário
CREATE OR REPLACE FUNCTION ban_user(user_id UUID, reason TEXT, moderator_id UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles SET 
    is_banned = true, banned_at = NOW(), ban_reason = reason, trust_score = 0
  WHERE id = user_id;
  
  INSERT INTO public.moderation_log (target_type, target_id, action, reason, moderator_id)
  VALUES ('profile', user_id, 'ban', reason, moderator_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar strike
CREATE OR REPLACE FUNCTION apply_strike(user_id UUID, reason TEXT, moderator_id UUID DEFAULT auth.uid())
RETURNS VOID AS $$
DECLARE new_strikes INTEGER;
BEGIN
  UPDATE public.profiles SET strikes = strikes + 1
  WHERE id = user_id RETURNING strikes INTO new_strikes;
  
  INSERT INTO public.moderation_log (target_type, target_id, action, reason, moderator_id)
  VALUES ('profile', user_id, 'strike', reason, moderator_id);
  
  IF new_strikes >= 3 THEN
    PERFORM ban_user(user_id, 'Auto-ban: 3 strikes', moderator_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rejeitar conteúdo
CREATE OR REPLACE FUNCTION reject_content(content_table TEXT, content_id UUID, reason TEXT, moderator_id UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET moderation_status = $1, ai_flag_reason = $2, moderated_by = $3, moderated_at = NOW() WHERE id = $4', content_table)
  USING 'rejected', reason, moderator_id, content_id;
  
  INSERT INTO public.moderation_log (target_type, target_id, action, reason, moderator_id)
  VALUES (content_table, content_id, 'reject', reason, moderator_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================================================
-- 8. SEED DE DADOS
-- ===================================================================

-- Atualizar slugs vazios
UPDATE public.categories
SET
    slug = lower(
        regexp_replace(
            name,
            '[^a-zA-Z0-9]+',
            '-',
            'g'
        )
    )
WHERE
    slug IS NULL;

-- Inserir categorias padrão
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
        'Sistemas de iluminação'
    ),
    (
        'Vídeo',
        'video',
        'Câmeras e projetores'
    ),
    (
        'Estrutura',
        'estrutura',
        'Palcos e treliças'
    ),
    (
        'Energia',
        'energia',
        'Geradores'
    ),
    (
        'Transporte',
        'transporte',
        'Vans e trucks'
    ) ON CONFLICT (slug) DO NOTHING;

-- Atualizar listings sem condition
UPDATE public.listings SET condition = 
  (ARRAY['novo', 'seminovo', 'usado', 'pecas'])[floor(random() * 4 + 1)]
WHERE condition IS NULL;

-- ===================================================================
-- 9. FINALIZAÇÃO
-- ===================================================================

NOTIFY pgrst, 'reload schema';

-- Relatório
DO $$
BEGIN
  RAISE NOTICE '🎉 Setup completo Portal MagnaFest';
  RAISE NOTICE 'Tabelas criadas: listings, categories, listings_media, moderation_log';
  RAISE NOTICE 'Funções: ban_user(), apply_strike(), reject_content()';
  RAISE NOTICE 'Sistema pronto para deploy!';
END $$;