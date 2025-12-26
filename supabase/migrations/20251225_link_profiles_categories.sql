-- =====================================================================
-- MIGRATION: Link Profiles to Categories
-- Created: 2025-12-25
-- Description: Add relationship between profiles and service categories
-- =====================================================================

-- =====================================================================
-- PARTE 1: Adicionar FK em Profiles
-- =====================================================================

-- Add main_category_id column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS main_category_id uuid REFERENCES public.service_categories (id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_main_category_id ON public.profiles (main_category_id);

-- Add comment
COMMENT ON COLUMN public.profiles.main_category_id IS 'Primary service category of the professional/company';

-- =====================================================================
-- PARTE 2: Tabela Many-to-Many (Especialidades Múltiplas)
-- =====================================================================

-- Drop if exists
DROP TABLE IF EXISTS public.profile_specialties CASCADE;

-- Create profile_specialties junction table
CREATE TABLE public.profile_specialties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.service_categories (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (profile_id, category_id)
);

-- Add table comment
COMMENT ON
TABLE public.profile_specialties IS 'Many-to-many relationship: allows profiles to have multiple service categories';

-- Enable RLS
ALTER TABLE public.profile_specialties ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Allow public read access" ON public.profile_specialties FOR
SELECT USING (true);

-- Policy: Authenticated users can manage their specialties
CREATE POLICY "Allow users to manage their specialties" ON public.profile_specialties FOR ALL USING (
    auth.role () = 'service_role'
    OR auth.role () = 'authenticated'
);

-- Create indexes for performance
CREATE INDEX idx_profile_specialties_profile_id ON public.profile_specialties (profile_id);

CREATE INDEX idx_profile_specialties_category_id ON public.profile_specialties (category_id);

-- =====================================================================
-- PARTE 3: Adicionar colunas extras úteis em profiles
-- =====================================================================

-- Add location fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS instagram text;

-- Add indexes for location filtering
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city);

CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles (state);

-- Add comments
COMMENT ON COLUMN public.profiles.city IS 'City where the professional/company operates';

COMMENT ON COLUMN public.profiles.state IS 'State/UF (e.g., SP, RJ, MG)';

COMMENT ON COLUMN public.profiles.whatsapp IS 'WhatsApp number for contact';

COMMENT ON COLUMN public.profiles.email IS 'Email for contact';

COMMENT ON COLUMN public.profiles.instagram IS 'Instagram handle (without @)';

-- =====================================================================
-- VERIFICATION
-- =====================================================================

-- Verify new columns were added
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE
    table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name IN (
        'main_category_id',
        'city',
        'state',
        'whatsapp',
        'email',
        'instagram'
    )
ORDER BY column_name;

-- Verify profile_specialties table was created
SELECT COUNT(*) as specialty_table_exists
FROM information_schema.tables
WHERE
    table_schema = 'public'
    AND table_name = 'profile_specialties';