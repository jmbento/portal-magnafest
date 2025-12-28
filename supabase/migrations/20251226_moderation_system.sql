-- =====================================================================
-- MODERAÇÃO E BANIMENTO - Portal MagnaFest
-- =====================================================================
-- Sistema de reputação, strikes e moderação de conteúdo
-- =====================================================================

-- =====================================================================
-- 1. TABELA PROFILES - Campos de Moderação
-- =====================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    
    -- is_banned
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'is_banned'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN is_banned boolean DEFAULT false NOT NULL;
      RAISE NOTICE '✅ profiles.is_banned criado';
    END IF;

    -- trust_score (0-100, padrão 100 = novo usuário confiável)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'trust_score'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN trust_score integer DEFAULT 100 NOT NULL;
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_trust_score_check 
        CHECK (trust_score >= 0 AND trust_score <= 100);
      RAISE NOTICE '✅ profiles.trust_score criado';
    END IF;

    -- strikes (advertências acumuladas)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'strikes'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN strikes integer DEFAULT 0 NOT NULL;
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_strikes_check 
        CHECK (strikes >= 0);
      RAISE NOTICE '✅ profiles.strikes criado';
    END IF;

    -- banned_at (timestamp do banimento)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'banned_at'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN banned_at timestamptz;
      RAISE NOTICE '✅ profiles.banned_at criado';
    END IF;

    -- ban_reason (motivo do banimento)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'ban_reason'
    ) THEN
      ALTER TABLE public.profiles ADD COLUMN ban_reason text;
      RAISE NOTICE '✅ profiles.ban_reason criado';
    END IF;

    -- Índice para busca rápida de banidos
    CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);
    
    RAISE NOTICE '🛡️ Moderação em profiles configurada';
  END IF;
END $$;

-- =====================================================================
-- 2. TABELAS DE CONTEÚDO - Moderação
-- =====================================================================

-- Função helper para adicionar campos de moderação em qualquer tabela
CREATE OR REPLACE FUNCTION add_moderation_fields(table_name text)
RETURNS void AS $$
BEGIN
  -- moderation_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE information_schema.columns.table_name = add_moderation_fields.table_name 
    AND column_name = 'moderation_status'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN moderation_status text DEFAULT ''approved''', table_name);
    EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I_moderation_status_check 
      CHECK (moderation_status IN (''pending'', ''approved'', ''rejected''))', 
      table_name, table_name);
    RAISE NOTICE '✅ %.moderation_status criado', table_name;
  END IF;

  -- ai_flag_reason
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE information_schema.columns.table_name = add_moderation_fields.table_name 
    AND column_name = 'ai_flag_reason'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN ai_flag_reason text', table_name);
    RAISE NOTICE '✅ %.ai_flag_reason criado', table_name;
  END IF;

  -- moderated_by (ID do admin que moderou)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE information_schema.columns.table_name = add_moderation_fields.table_name 
    AND column_name = 'moderated_by'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN moderated_by uuid REFERENCES auth.users(id)', table_name);
    RAISE NOTICE '✅ %.moderated_by criado', table_name;
  END IF;

  -- moderated_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE information_schema.columns.table_name = add_moderation_fields.table_name 
    AND column_name = 'moderated_at'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN moderated_at timestamptz', table_name);
    RAISE NOTICE '✅ %.moderated_at criado', table_name;
  END IF;

  -- Índice
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_moderation_status ON public.%I(moderation_status)', 
    table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Aplicar em tabelas que existem
DO $$
BEGIN
  -- listings (marketplace/classificados)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'listings') THEN
    PERFORM add_moderation_fields('listings');
  END IF;

  -- posts (blog)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
    PERFORM add_moderation_fields('posts');
  END IF;

  -- events
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    PERFORM add_moderation_fields('events');
  END IF;
END $$;

-- =====================================================================
-- 3. RLS POLICIES - Esconder Conteúdo de Banidos
-- =====================================================================

-- Função helper: Verifica se autor está banido
CREATE OR REPLACE FUNCTION is_author_banned(author_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = author_id AND is_banned = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar policies de profiles
DROP POLICY IF EXISTS "Profiles públicos são visíveis" ON public.profiles;

CREATE POLICY "Profiles públicos visíveis exceto banidos" ON public.profiles FOR
SELECT USING (
    is_banned = false
    OR auth.uid()::uuid = id
  );

-- Policy para listings (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'listings') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Listings públicos visíveis" ON public.listings';
    EXECUTE 'CREATE POLICY "Listings aprovados de não-banidos"
      ON public.listings FOR SELECT
      USING (
        moderation_status = ''approved'' 
        AND NOT is_author_banned(profiles_id)
      )';
    RAISE NOTICE '🛡️ Policy listings atualizada';
  END IF;
END $$;

-- Policy para posts/blog (se existir)
DO $$
DECLARE
  has_status_column boolean;
  has_author_column boolean;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts') THEN
    
    -- Verificar se coluna status existe
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'posts' AND column_name = 'status'
    ) INTO has_status_column;

    -- Verificar se coluna author_id existe
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'posts' AND column_name = 'author_id'
    ) INTO has_author_column;

    EXECUTE 'DROP POLICY IF EXISTS "Posts públicos visíveis" ON public.posts';
    
    -- Criar policy baseado nas colunas disponíveis
    IF has_status_column AND has_author_column THEN
      EXECUTE 'CREATE POLICY "Posts publicados de não-banidos"
        ON public.posts FOR SELECT
        USING (
          status = ''published'' 
          AND (author_id IS NULL OR NOT is_author_banned(author_id))
        )';
      RAISE NOTICE '🛡️ Policy posts atualizada (com status e author)';
    ELSIF has_author_column THEN
      EXECUTE 'CREATE POLICY "Posts de não-banidos"
        ON public.posts FOR SELECT
        USING (author_id IS NULL OR NOT is_author_banned(author_id))';
      RAISE NOTICE '🛡️ Policy posts atualizada (apenas author)';
    ELSE
      -- Policy genérica
      EXECUTE 'CREATE POLICY "Posts públicos visíveis"
        ON public.posts FOR SELECT
        USING (true)';
      RAISE NOTICE 'ℹ️ Policy posts criada (genérica)';
    END IF;
    
  END IF;
END $$;

-- Policy para events (se existir)
DO $$
DECLARE
  has_status_column boolean;
  has_organizer_column boolean;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    
    -- Verificar se coluna status existe
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'status'
    ) INTO has_status_column;

    -- Verificar se coluna organizer_id existe
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'organizer_id'
    ) INTO has_organizer_column;

    EXECUTE 'DROP POLICY IF EXISTS "Events públicos visíveis" ON public.events';
    
    -- Criar policy baseado nas colunas disponíveis
    IF has_status_column AND has_organizer_column THEN
      EXECUTE 'CREATE POLICY "Events ativos de não-banidos"
        ON public.events FOR SELECT
        USING (
          status = ''confirmed''
          AND (organizer_id IS NULL OR NOT is_author_banned(organizer_id))
        )';
      RAISE NOTICE '🛡️ Policy events atualizada (com status e organizer)';
    ELSIF has_organizer_column THEN
      EXECUTE 'CREATE POLICY "Events de não-banidos"
        ON public.events FOR SELECT
        USING (organizer_id IS NULL OR NOT is_author_banned(organizer_id))';
      RAISE NOTICE '🛡️ Policy events atualizada (apenas organizer)';
    ELSE
      -- Policy genérica se não tiver as colunas
      EXECUTE 'CREATE POLICY "Events públicos visíveis"
        ON public.events FOR SELECT
        USING (true)';
      RAISE NOTICE 'ℹ️ Policy events criada (genérica - sem filtro de banimento)';
    END IF;
    
  END IF;
END $$;

-- =====================================================================
-- 4. TABELA DE LOG DE MODERAÇÃO
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.moderation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL, -- 'profile', 'listing', 'post', 'event'
  target_id uuid NOT NULL,
  action text NOT NULL, -- 'ban', 'unban', 'strike', 'approve', 'reject'
  reason text,
  moderator_id uuid REFERENCES auth.users(id),
  automated boolean DEFAULT false, -- Foi ação do bot AI?
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_moderation_log_target ON public.moderation_log (target_type, target_id);

CREATE INDEX idx_moderation_log_moderator ON public.moderation_log (moderator_id);

-- RLS para moderation_log (apenas admins)
ALTER TABLE public.moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins veem log de moderação" ON public.moderation_log FOR
SELECT USING (
        auth.jwt () ->> 'role' = 'admin'
        OR (
            SELECT raw_user_meta_data ->> 'role'
            FROM auth.users
            WHERE
                id = auth.uid ()
        ) = 'admin'
    );

-- =====================================================================
-- 5. FUNÇÕES DE MODERAÇÃO
-- =====================================================================

-- Banir usuário
CREATE OR REPLACE FUNCTION ban_user(
  user_id uuid,
  reason text,
  moderator_id uuid DEFAULT auth.uid()
)
RETURNS void AS $$
BEGIN
  -- Atualizar profile
  UPDATE public.profiles
  SET 
    is_banned = true,
    banned_at = now(),
    ban_reason = ban_user.reason,
    trust_score = 0
  WHERE id = user_id;

  -- Registrar log
  INSERT INTO public.moderation_log (
    target_type, target_id, action, reason, moderator_id
  ) VALUES (
    'profile', user_id, 'ban', ban_user.reason, ban_user.moderator_id
  );

  RAISE NOTICE '🚫 Usuário % banido', user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar strike
CREATE OR REPLACE FUNCTION apply_strike(
  user_id uuid,
  reason text,
  moderator_id uuid DEFAULT auth.uid()
)
RETURNS void AS $$
DECLARE
  new_strikes integer;
BEGIN
  -- Incrementar strikes
  UPDATE public.profiles
  SET strikes = strikes + 1
  WHERE id = user_id
  RETURNING strikes INTO new_strikes;

  -- Registrar log
  INSERT INTO public.moderation_log (
    target_type, target_id, action, reason, moderator_id
  ) VALUES (
    'profile', user_id, 'strike', apply_strike.reason, apply_strike.moderator_id
  );

  -- Auto-ban com 3 strikes
  IF new_strikes >= 3 THEN
    PERFORM ban_user(user_id, 'Auto-banimento: 3 strikes alcançados', moderator_id);
  END IF;

  RAISE NOTICE '⚠️ Strike aplicado. Total: %', new_strikes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rejeitar conteúdo
CREATE OR REPLACE FUNCTION reject_content(
  content_table text,
  content_id uuid,
  reason text,
  moderator_id uuid DEFAULT auth.uid()
)
RETURNS void AS $$
BEGIN
  -- Atualizar status
  EXECUTE format(
    'UPDATE public.%I SET 
      moderation_status = ''rejected'',
      ai_flag_reason = $1,
      moderated_by = $2,
      moderated_at = now()
    WHERE id = $3',
    content_table
  ) USING reason, moderator_id, content_id;

  -- Registrar log
  INSERT INTO public.moderation_log (
    target_type, target_id, action, reason, moderator_id
  ) VALUES (
    content_table, content_id, 'reject', reject_content.reason, moderator_id
  );

  RAISE NOTICE '❌ Conteúdo rejeitado: % %', content_table, content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 6. RELOAD E VERIFICAÇÃO
-- =====================================================================

NOTIFY pgrst, 'reload schema';

-- Relatório final
DO $$
DECLARE
  profiles_has_moderation boolean;
  moderation_log_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_banned'
  ) INTO profiles_has_moderation;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'moderation_log'
  ) INTO moderation_log_exists;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE '🛡️ SISTEMA DE MODERAÇÃO';
  RAISE NOTICE '═══════════════════════════════════════════';
  
  IF profiles_has_moderation THEN
    RAISE NOTICE '✅ Campos de moderação em profiles OK';
  ELSE
    RAISE NOTICE '❌ Campos de moderação FALTANDO';
  END IF;

  IF moderation_log_exists THEN
    RAISE NOTICE '✅ Tabela moderation_log criada';
  ELSE
    RAISE NOTICE '❌ Tabela moderation_log FALTANDO';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '🎯 FUNÇÕES DISPONÍVEIS:';
  RAISE NOTICE '  • ban_user(user_id, reason)';
  RAISE NOTICE '  • apply_strike(user_id, reason)';
  RAISE NOTICE '  • reject_content(table, id, reason)';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 SISTEMA PRONTO!';
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;