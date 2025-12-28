-- =====================================================================
-- MIGRATION: Fix profiles table for user signup
-- Date: 2025-12-28
-- Description: Adds missing columns needed for user registration
-- =====================================================================

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS main_category_id UUID REFERENCES service_categories(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON profiles(city, state);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_category ON profiles(main_category_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_claimed ON profiles(is_claimed);

-- Add comments
COMMENT ON COLUMN profiles.email IS 'User email (synced with auth.users)';
COMMENT ON COLUMN profiles.trust_score IS 'Trust score from 0-100';
COMMENT ON COLUMN profiles.is_verified IS 'Profile verified by admin';
COMMENT ON COLUMN profiles.latitude IS 'Geolocation latitude';
COMMENT ON COLUMN profiles.longitude IS 'Geolocation longitude';

-- Update RLS policies to allow authenticated users to insert their own profile
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid()::uuid = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Enable update for profile owner" ON public.profiles;
CREATE POLICY "Enable update for profile owner" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid()::uuid = id)
  WITH CHECK (auth.uid()::uuid = id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificação
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Migration completed successfully!' as status;
