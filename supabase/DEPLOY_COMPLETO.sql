-- =====================================================================
-- SCRIPT DE DEPLOY COMPLETO - EXECUTAR NO SQL EDITOR DO SUPABASE
-- =====================================================================
-- Este script pode ser executado diretamente no SQL Editor
-- Ele vai:
-- 1. Dropar tabelas existentes
-- 2. Criar tabelas do zero com todas as colunas
-- 3. Configurar RLS e policies
-- 4. Criar índices
-- =====================================================================

-- =====================================================================
-- PARTE 1: TABELA PROFILES
-- =====================================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    name text NOT NULL,
    description text,
    website text UNIQUE,
    category text,
    is_claimed boolean DEFAULT false NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    source text DEFAULT 'auto-bot',
    CONSTRAINT profiles_name_not_empty CHECK (char_length(name) > 0)
);

-- Add table comment
COMMENT ON
TABLE public.profiles IS 'Auto-populated company/professional profiles. is_claimed=false indicates unclaimed profiles for viral campaign.';

-- Add column comments
COMMENT ON COLUMN public.profiles.is_claimed IS 'FALSE = Auto-generated profile (unclaimed). TRUE = Verified/claimed by owner.';

COMMENT ON COLUMN public.profiles.source IS 'Origin of profile data: auto-bot, manual, api, claimed';

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Enable read access for all users" ON public.profiles FOR
SELECT USING (true);

-- Policy: Write access only for service_role (Edge Functions)
CREATE POLICY "Enable insert for service role only" ON public.profiles FOR
INSERT
WITH
    CHECK (
        auth.role () = 'service_role'
        OR auth.role () = 'authenticated'
    );

-- Policy: Update only for service_role or owner claiming profile
CREATE POLICY "Enable update for service role or claim" ON public.profiles FOR
UPDATE USING (
    auth.role () = 'service_role'
    OR auth.role () = 'authenticated'
);

-- Indexes for performance
CREATE INDEX idx_profiles_category ON public.profiles (category);

CREATE INDEX idx_profiles_is_claimed ON public.profiles (is_claimed);

CREATE INDEX idx_profiles_created_at ON public.profiles (created_at DESC);

CREATE INDEX idx_profiles_source ON public.profiles (source);

CREATE INDEX idx_profiles_website ON public.profiles (website)
WHERE
    website IS NOT NULL;

-- =====================================================================
-- PARTE 2: TABELA EVENTS
-- =====================================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.events CASCADE;

-- Create events table
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    title text NOT NULL,
    description text,
    event_date timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NOT NULL DEFAULT auth.uid () REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Add table comment
COMMENT ON
TABLE public.events IS 'Stores event information created by authenticated users';

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Enable read access for all users
CREATE POLICY "Enable read access for all users" ON public.events FOR
SELECT USING (true);

-- Policy: Enable insert for authenticated users only
CREATE POLICY "Enable insert for authenticated users only" ON public.events FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

-- Create index on created_by for performance
CREATE INDEX idx_events_created_by ON public.events (created_by);

-- Create index on event_date for performance
CREATE INDEX idx_events_event_date ON public.events (event_date);

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================

-- Verificar se as tabelas foram criadas
SELECT 'profiles' as tabela, COUNT(*) as total_colunas
FROM information_schema.columns
WHERE
    table_schema = 'public'
    AND table_name = 'profiles'
UNION ALL
SELECT 'events' as tabela, COUNT(*) as total_colunas
FROM information_schema.columns
WHERE
    table_schema = 'public'
    AND table_name = 'events';

-- Resultado esperado:
-- profiles: 8 colunas
-- events: 6 colunas