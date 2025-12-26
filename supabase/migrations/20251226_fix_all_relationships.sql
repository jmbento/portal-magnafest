-- =====================================================================
-- FIX: Todas as Relações Críticas do MagnaFest
-- =====================================================================
-- Data: 2025-12-26
-- Objetivo: Recriar TODAS as foreign keys principais para garantir
--           que o PostgREST detecte corretamente todas as relações
-- =====================================================================

-- =====================================================================
-- 1. PROFILES → SERVICE_CATEGORIES
-- =====================================================================

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_main_category_id_fkey;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_main_category_id_fkey FOREIGN KEY (main_category_id) REFERENCES public.service_categories (id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS idx_profiles_main_category_id ON public.profiles (main_category_id);

-- =====================================================================
-- 2. PROFILE_SPECIALTIES → PROFILES
-- =====================================================================

ALTER TABLE public.profile_specialties
DROP CONSTRAINT IF EXISTS profile_specialties_profile_id_fkey;

ALTER TABLE public.profile_specialties
ADD CONSTRAINT profile_specialties_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- 3. PROFILE_SPECIALTIES → SERVICE_CATEGORIES
-- =====================================================================

ALTER TABLE public.profile_specialties
DROP CONSTRAINT IF EXISTS profile_specialties_category_id_fkey;

ALTER TABLE public.profile_specialties
ADD CONSTRAINT profile_specialties_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- =====================================================================
-- 4. EVENTS → USERS (via user_id)
-- =====================================================================

-- Verifica se a coluna user_id existe em events
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.events
        DROP CONSTRAINT IF EXISTS events_user_id_fkey;

        ALTER TABLE public.events
        ADD CONSTRAINT events_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

        CREATE INDEX IF NOT EXISTS idx_events_user_id 
        ON public.events(user_id);
    END IF;
END $$;

-- =====================================================================
-- 5. REGISTRATIONS → EVENTS
-- =====================================================================

ALTER TABLE public.registrations
DROP CONSTRAINT IF EXISTS registrations_event_id_fkey;

ALTER TABLE public.registrations
ADD CONSTRAINT registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations (event_id);

-- =====================================================================
-- 6. REGISTRATIONS → USERS
-- =====================================================================

ALTER TABLE public.registrations
DROP CONSTRAINT IF EXISTS registrations_user_id_fkey;

ALTER TABLE public.registrations
ADD CONSTRAINT registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations (user_id);

-- =====================================================================
-- 7. TICKETS → EVENTS (já feito na migração anterior, mas garantindo)
-- =====================================================================

ALTER TABLE public.tickets
DROP CONSTRAINT IF EXISTS tickets_event_id_fkey;

ALTER TABLE public.tickets
ADD CONSTRAINT tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events (id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON public.tickets (event_id);

-- =====================================================================
-- 8. POSTS → USERS (se existir a coluna author_id)
-- =====================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'posts' 
        AND column_name = 'author_id'
    ) THEN
        ALTER TABLE public.posts
        DROP CONSTRAINT IF EXISTS posts_author_id_fkey;

ALTER TABLE public.posts
ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users (id) ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts (author_id);

END IF;

END $$;

-- =====================================================================
-- RELOAD DO SCHEMA CACHE
-- =====================================================================

NOTIFY pgrst, 'reload schema';

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================

DO $$ DECLARE constraint_count INTEGER;

BEGIN
SELECT COUNT(*) INTO constraint_count
FROM information_schema.table_constraints
WHERE
    constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public';

RAISE NOTICE '✅ Total de Foreign Keys reconfiguradas: %',
constraint_count;

RAISE NOTICE '📡 PostgREST schema cache recarregado!';

RAISE NOTICE '🎯 Execute uma query de teste no Supabase para confirmar os relacionamentos.';

END $$;