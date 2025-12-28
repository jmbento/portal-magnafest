-- =====================================================================
-- SEED DE DADOS - Portal MagnaFest (TESTE)
-- =====================================================================
-- Execute no Supabase SQL Editor para popular o banco com dados de teste
-- =====================================================================

-- 1. Criar usuários de teste (apenas campos básicos)
INSERT INTO
    public.profiles (
        id,
        name,
        email,
        trust_score,
        is_banned
    )
VALUES (
        gen_random_uuid (),
        'João Silva - Som Profissional',
        'joao@teste.com',
        95,
        false
    ),
    (
        gen_random_uuid (),
        'Maria Santos - Luz & Cor',
        'maria@teste.com',
        98,
        false
    ),
    (
        gen_random_uuid (),
        'Pedro Costa - AudioVisual Pro',
        'pedro@teste.com',
        92,
        false
    );

-- Pegar IDs dos profiles criados para usar nos listings
DO $$
DECLARE
  profile1_id uuid;
  profile2_id uuid;
  profile3_id uuid;
  category_audio_id uuid;
  category_ilum_id uuid;
  category_video_id uuid;
BEGIN
  -- Pegar IDs dos profiles
  SELECT id INTO profile1_id FROM public.profiles WHERE email = 'joao@teste.com' LIMIT 1;
  SELECT id INTO profile2_id FROM public.profiles WHERE email = 'maria@teste.com' LIMIT 1;
  SELECT id INTO profile3_id FROM public.profiles WHERE email = 'pedro@teste.com' LIMIT 1;
  
  -- Pegar IDs das categorias
  SELECT id INTO category_audio_id FROM public.categories WHERE slug = 'audio' LIMIT 1;
  SELECT id INTO category_ilum_id FROM public.categories WHERE slug = 'iluminacao' LIMIT 1;
  SELECT id INTO category_video_id FROM public.categories WHERE slug = 'video' LIMIT 1;

  -- 2. Criar anúncios de teste
  INSERT INTO public.listings (
    title, description, price_min, price_max, listing_type, condition, 
    status, profiles_id, category_id, moderation_status
  ) VALUES
    (
      'Mesa de Som Soundcraft Si Expression 3',
      'Mesa digital profissional 32 canais. Estado de conservação impecável, usada apenas em eventos corporativos. Inclui case de transporte. Aceito propostas!',
      15000, 18000, 'product_sale', 'seminovo',
      'active', profile1_id, category_audio_id, 'approved'
    ),
    (
      'Kit Iluminação LED Moving Head 8x',
      'Kit completo com 8 moving heads LED RGB, cases, cabos DMX e controlador. Perfeito para eventos de médio porte. Preço negociável.',
      12000, 15000, 'product_sale', 'usado',
      'active', profile2_id, category_ilum_id, 'approved'
    ),
    (
      'Câmera Sony PXW-Z280 4K',
      'Câmera profissional 4K com menos de 100h de uso. Sem arranhões, sem defeitos. Ideal para streaming e gravação de eventos. Acompanha tripé manfrotto.',
      28000, 32000, 'product_sale', 'seminovo',
      'active', profile3_id, category_video_id, 'approved'
    ),
    (
      'Aluguel de Sistema de Som Completo',
      'Sistema de PA completo: 2 caixas ativas 1000W, 2 monitores, mesa 16 canais, microfones. Ideal para eventos até 200 pessoas. Diária com técnico incluso.',
      800, 1200, 'product_rent', 'novo',
      'active', profile1_id, category_audio_id, 'approved'
    ),
    (
      'Projetor Epson EB-L1505U - 12.000 Lumens',
      'Projetor laser profissional, usado em apenas 5 eventos. Perfeito estado. Acompanha tela de 4x3m e suporte de teto.',
      45000, 50000, 'product_sale', 'seminovo',
      'active', profile3_id, category_video_id, 'approved'
    ),
    (
      'Par de Caixas JBL SRX835P (PARA PEÇAS)',
      'Caixas ativas profissionais com defeito em amplificador. Falantes em perfeito estado. Venda para retirada de peças ou reparo.',
      3000, 4000, 'product_sale', 'pecas',
      'active', profile1_id, category_audio_id, 'approved'
    ),
    (
      'Controlador DMX Avolites Tiger Touch II',
      'Controlador profissional de iluminação. Zero defeitos, com case. Acompanha manual e software original.',
      18000, 22000, 'product_sale', 'usado',
      'active', profile2_id, category_ilum_id, 'approved'
    ),
    (
      'Microfone Shure SM58 (Novo Lacrado)',
      'Microfone dinâmico profissional novo, nunca usado. Nota fiscal e garantia de 2 anos.',
      550, 600, 'product_sale', 'novo',
      'active', profile1_id, category_audio_id, 'approved'
    );

END $$;

-- Verificar quantos anúncios foram criados
SELECT COUNT(*) as total_listings FROM public.listings;

SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Mostrar preview dos anúncios
SELECT l.title, l.condition, l.price_min, l.listing_type, p.name as vendedor, c.name as categoria
FROM public.listings l
    LEFT JOIN public.profiles p ON l.profiles_id = p.id
    LEFT JOIN public.categories c ON l.category_id = c.id
ORDER BY l.created_at DESC;

-- Mensagem final
DO $$
BEGIN
  RAISE NOTICE '🎉 SEED COMPLETO!';
  RAISE NOTICE '✅ Profiles de teste criados';
  RAISE NOTICE '✅ 8 Anúncios criados (variados)';
  RAISE NOTICE '✅ Categorias vinculadas';
  RAISE NOTICE '';
  RAISE NOTICE '📱 Acesse: https://portalmagnafest.com.br/marketplace';
  RAISE NOTICE '🛒 Você verá todos os anúncios funcionando!';
END $$;