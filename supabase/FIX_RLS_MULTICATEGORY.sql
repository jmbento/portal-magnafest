-- =====================================================
-- FIX URGENTE: RLS Policies + Multi-categorias
-- =====================================================

-- 1. LIBERAR INSERT na tabela profiles (estava bloqueando cadastro)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role only" ON public.profiles;

CREATE POLICY "Allow anyone to insert profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- 2. LIBERAR UPDATE para usuários atualizarem próprio perfil
DROP POLICY IF EXISTS "Enable update for profile owner" ON public.profiles;

CREATE POLICY "Allow users to update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id OR is_claimed = false)
  WITH CHECK (auth.uid() = id OR is_claimed = false);

-- 3. Criar tabela de MÚLTIPLAS CATEGORIAS por profissional
CREATE TABLE IF NOT EXISTS profile_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, category_id)
);

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_profile_categories_profile ON profile_categories(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_categories_category ON profile_categories(category_id);

-- RLS para profile_categories
ALTER TABLE profile_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profile categories" 
  ON profile_categories FOR SELECT USING (true);

CREATE POLICY "Anyone can insert profile categories" 
  ON profile_categories FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete own categories" 
  ON profile_categories FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_categories.profile_id 
      AND profiles.id = auth.uid()
    )
  );

-- Comentários
COMMENT ON TABLE profile_categories IS 'Permite que profissionais tenham múltiplas categorias/habilidades';

-- Verificar
SELECT 'RLS Policies atualizadas! Cadastro liberado e multi-categorias habilitado.' as status;
