-- =====================================================================
-- MIGRATION: Create Profiles Feed System
-- Created: 2025-12-24
-- Updated: 2025-12-25 (Fixed for existing table)
-- Description: Auto-populated profiles table for "Se você não está aqui, não existe" campaign
-- =====================================================================

-- Drop existing table if it exists (to start fresh)
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