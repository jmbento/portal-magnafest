-- =====================================================================
-- MAGNAFEST - Configuração do Supabase Storage
-- =====================================================================
-- Cria o bucket para upload de imagens dos anúncios
-- Execute este script no SQL Editor do Supabase
-- =====================================================================

BEGIN;

-- Criar bucket para imagens dos anúncios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,  -- Público para todos poderem ver as imagens
  5242880,  -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- POLICIES DE STORAGE (RLS)
-- =====================================================================

-- Policy: Qualquer um pode LER imagens
CREATE POLICY "Imagens são públicas" ON storage.objects FOR
SELECT USING (bucket_id = 'listing-images');

-- Policy: Usuários autenticados podem FAZER UPLOAD
CREATE POLICY "Usuários podem fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listing-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Usuários podem DELETAR apenas suas próprias imagens
CREATE POLICY "Usuários podem deletar suas imagens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listing-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Usuários podem ATUALIZAR apenas suas próprias imagens
CREATE POLICY "Usuários podem atualizar suas imagens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'listing-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

COMMIT;

-- =====================================================================
-- INSTRUÇÕES
-- =====================================================================
-- 1. Copie todo este script
-- 2. No Supabase Dashboard, vá em SQL Editor
-- 3. Cole o script e clique em "Run"
-- 4. Verifique em Storage → Buckets se 'listing-images' foi criado
-- =====================================================================