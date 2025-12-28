-- =====================================================
-- SETUP SIMPLIFICADO - APENAS DADOS
-- Execute este arquivo diretamente
-- =====================================================

-- =====================================================
-- 1. INSERIR PERFIS DE VENDEDORES
-- =====================================================

INSERT INTO
    profiles (
        id,
        email,
        name,
        trust_score,
        is_verified
    )
VALUES (
        '550e8400-e29b-41d4-a716-446655440001',
        'vendedor1@audiolocacoes.com',
        'AudioPro Locações',
        95,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'vendedor2@lightshow.com',
        'LightShow Equipamentos',
        88,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'contato@portalmagnafest.com',
        'Portal MagnaFest',
        100,
        true
    ) ON CONFLICT (id) DO
UPDATE
SET
    name = EXCLUDED.name,
    trust_score = EXCLUDED.trust_score,
    is_verified = EXCLUDED.is_verified;

-- =====================================================
-- 2. CRIAR TABELA DE BLOG POSTS (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  featured_image TEXT,
  tags TEXT[],
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published_at DESC);

-- RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts públicos" ON blog_posts;

CREATE POLICY "Posts públicos" ON blog_posts FOR SELECT USING (true);

-- =====================================================
-- 3. INSERIR 20 POSTS DO BLOG
-- =====================================================

INSERT INTO
    blog_posts (
        title,
        slug,
        excerpt,
        content,
        category,
        author,
        published_at,
        featured_image,
        tags
    )
VALUES

-- Produção

('Como Calcular o Break-Even de um Evento: Guia Completo', 'como-calcular-break-even-evento', 'Aprenda a calcular o ponto de equilíbrio financeiro do seu evento e evitar prejuízos.', 'O break-even é o número mínimo de ingressos que você precisa vender para cobrir todos os custos. Fórmula: Break-Even = Custos Fixos / (Preço do Ingresso - Custo Variável). Exemplo: Evento com R$ 50k de custos fixos, ingresso a R$ 100 e custo variável de R$ 20 = 625 ingressos para empatar.', 'Produção', 'Equipe MagnaFest', NOW(), '/blog/break-even.jpg', ARRAY['finanças', 'planejamento']),

('10 Erros Fatais que Quebram Produtoras de Evento', 'erros-fatais-produtoras-eventos', 'Descubra os erros mais comuns que levam produtoras à falência.', 'Erro #1: Não ter contrato formal. Erro #2: Depender de um único cliente. Erro #3: Não ter seguro. Erro #4: Precificar errado. Erro #5: Não diversificar.', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '2 days', '/blog/erros.jpg', ARRAY['gestão', 'riscos']),

('Rider Técnico: O Que Todo Produtor Precisa Saber', 'rider-tecnico-guia-completo', 'Entenda o que é um rider técnico e como negociar.', 'O rider técnico lista todas as exigências do artista: som, luz, palco, camarim. Dividido em Technical Rider e Hospitality Rider.', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '5 days', '/blog/rider.jpg', ARRAY['rider', 'internacional']),

-- Jurídico

('MEI para Produtores: Vale a Pena em 2024?', 'mei-produtores-vale-pena-2024', 'Análise sobre MEI para produtores: limites e alternativas.', 'MEI tem limite de R$ 81k/ano. CNAE permitido: 9001-9/01. Tributação: R$ 70/mês. Alternativas: SLU, EIRELI.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '1 week', '/blog/mei.jpg', ARRAY['MEI', 'tributação']),

('ECAD 2024: Tabela Atualizada e Como Calcular', 'ecad-2024-tabela-atualizada', 'Valores atualizados do ECAD para música ao vivo.', 'Tabela 2024: Até 500 pessoas = 10%. 501-1000 = 12%. Acima de 1000 = 15%. DJ: 50% do valor ao vivo.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '10 days', '/blog/ecad.jpg', ARRAY['ECAD', 'direitos']),

('Contrato de Prestação de Serviço: Modelo Gratuito', 'contrato-prestacao-servico-modelo', 'Modelo de contrato para DJs, bandas e técnicos.', 'Cláusulas essenciais: valor, horário, rider técnico anexo, multa, força maior, foro.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '12 days', '/blog/contrato.jpg', ARRAY['contratos', 'documentos']),

-- Tecnologia

('Line Array vs. PA Tradicional: Qual Escolher?', 'line-array-vs-pa-tradicional', 'Comparativo técnico entre Line Array e PA tradicional.', 'Line Array: cobertura uniforme, alcance 80m. PA: custo menor, limite 40m. Para 500-2000: Line Array.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '3 days', '/blog/line-array.jpg', ARRAY['áudio', 'equipamentos']),

('Moving Lights: Guia de Compra 2024', 'moving-lights-guia-compra-2024', 'Tudo sobre Moving Lights: tipos, marcas e preços.', 'Tipos: Wash, Spot, Beam. Marcas: Clay Paky, Martin, Robe. Preços: R$ 5k a R$ 20k+.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '6 days', '/blog/moving.jpg', ARRAY['iluminação', 'DMX']),

('LED Wall vs. Projeção: O Que Usar em 2024?', 'led-wall-vs-projecao-2024', 'Análise de custos e qualidade: LED vs Projetor.', 'LED: contraste infinito, R$ 1.5-3k/m². Projetor: custo 60% menor, precisa escuro.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '8 days', '/blog/led.jpg', ARRAY['vídeo', 'LED']),

-- Marketing

('Como Vender 1000 Ingressos em 7 Dias', 'vender-1000-ingressos-7-dias', 'Estratégia de marketing digital para lotar seu evento.', 'Dia 1-2: Instagram Ads. Dia 3-4: Email marketing. Dia 5-6: FOMO. Dia 7: Flash sale.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '4 days', '/blog/vendas.jpg', ARRAY['vendas', 'marketing']),

('Instagram para Produtores: Dicas que Funcionam', 'instagram-produtores-dicas', 'Aumente engajamento e venda mais ingressos.', 'Poste 1x/dia, 3-5 Stories. Use Reels. Horários: 12h-13h e 19h-21h. 5-10 hashtags.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '7 days', '/blog/instagram.jpg', ARRAY['instagram', 'redes sociais']),

('Email Marketing para Eventos: Guia Prático', 'email-marketing-eventos-guia', 'Construa lista e crie emails que convertem.', 'ROI de 42:1. Ferramentas: RD Station, E-goi. Sequência: boas-vindas, promo, FOMO, última chance.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '9 days', '/blog/email.jpg', ARRAY['email', 'automação']),

-- Mercado

('Festivais em Alta: Tendências para 2024', 'festivais-tendencias-2024', 'Análise do mercado de festivais no Brasil.', 'Festivais boutique +35%. Público busca experiência. Mercado: R$ 8bi/ano. Crescimento 2024: 12%.', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '11 days', '/blog/festivais.jpg', ARRAY['festivais', 'tendências']),

('Quanto Custa Produzir um Show de Grande Porte?', 'custo-show-grande-porte', 'Breakdown de custos de show para 5.000 pessoas.', 'Total: R$ 630k (espaço, som, luz, palco, segurança, staff, marketing, artista).', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '13 days', '/blog/custos.jpg', ARRAY['custos', 'orçamento']),

('Cashless: A Revolução no Pagamento de Eventos', 'cashless-revolucao-pagamentos', 'Como funciona e cases de sucesso no Brasil.', 'Reduz fila 70%, aumenta consumo 30%. Tecnologias: NFC, QR Code. Fornecedores: Yooga, Zig.', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '14 days', '/blog/cashless.jpg', ARRAY['cashless', 'pagamentos']),

-- Carreira

('Como Começar como DJ Profissional em 2024', 'comecar-dj-profissional-2024', 'Roadmap: equipamentos, residências, precificação.', 'Setup inicial: DDJ-400 R$ 2.5k. Evolução: CDJs R$ 12k + mixer R$ 8k. Cachê: R$ 500 a R$ 5k+.', 'Carreira', 'DJ Rodrigo Lopes', NOW() - INTERVAL '15 days', '/blog/dj.jpg', ARRAY['DJ', 'carreira']),

('Roadie: Profissão Essencial e Invisível', 'roadie-profissao-essencial', 'Rotina e remuneração dos bastidores.', 'Auxiliar R$ 200/dia, técnico R$ 400/dia, chefe R$ 800/dia. Jornada: 12-16h. Turnês: 30-60 dias.', 'Carreira', 'Bruno Machado', NOW() - INTERVAL '16 days', '/blog/roadie.jpg', ARRAY['roadie', 'bastidores']),

('Iluminador Profissional: Mercado e Certificações', 'iluminador-profissional-mercado', 'Cursos, certificações e faixa salarial.', 'Certificação GrandMA: €3.5k = R$ 1.5k/dia. Cursos: SENAI R$ 1.2k, Pro Light R$ 5k.', 'Carreira', 'Eng. Carlos Henrique', NOW() - INTERVAL '17 days', '/blog/iluminador.jpg', ARRAY['iluminação', 'certificação']),

-- Casos

('Lollapalooza 2024: Análise Técnica Completa', 'lollapalooza-2024-analise-tecnica', 'Breakdown técnico do maior festival do Brasil.', '6 palcos, 400 moving heads, 80 painéis LED P2.9, 200 ton estrutura. 800 técnicos. Setup: 7 dias.', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '18 days', '/blog/lolla.jpg', ARRAY['festivais', 'case']),

('Rock in Rio: Nos Bastidores da Cidade do Rock', 'rock-in-rio-bastidores', 'Entrevista com equipe técnica.', '4 meses montagem, 10k pessoas, R$ 350mi. Palco Mundo: 102m x 48m. 500kW som. 100k pessoas/dia.', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '19 days', '/blog/rir.jpg', ARRAY['rock in rio', 'megaeventos'])

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content;

-- =====================================================
-- 4. CRIAR TABELA DE LISTINGS (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_min DECIMAL(10, 2) NOT NULL,
    price_max DECIMAL(10, 2),
    condition TEXT NOT NULL CHECK (
        condition IN (
            'novo',
            'seminovo',
            'usado',
            'pecas'
        )
    ),
    listing_type TEXT NOT NULL CHECK (
        listing_type IN (
            'product_sale',
            'product_rent',
            'service'
        )
    ),
    status TEXT DEFAULT 'active' CHECK (
        status IN ('active', 'sold', 'inactive')
    ),
    moderation_status TEXT DEFAULT 'pending' CHECK (
        moderation_status IN (
            'pending',
            'approved',
            'rejected'
        )
    ),
    profiles_id UUID REFERENCES profiles (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);

CREATE INDEX IF NOT EXISTS idx_listings_moderation ON listings (moderation_status);

-- RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anúncios aprovados públicos" ON listings;

CREATE POLICY "Anúncios aprovados públicos" ON listings FOR
SELECT USING (
        moderation_status = 'approved'
    );

-- =====================================================
-- 5. INSERIR 10 ANÚNCIOS
-- =====================================================

INSERT INTO
    listings (
        title,
        description,
        price_min,
        price_max,
        condition,
        listing_type,
        status,
        moderation_status,
        profiles_id
    )
VALUES

-- Anúncios do Portal
(
    '[DESTAQUE] Anuncie no Portal MagnaFest - Plano Pro',
    'Banner homepage (30 dias) + 2 posts patrocinados + Native Ads. Suporte prioritário e relatório mensal. Sem fidelidade.',
    1997.00,
    1997.00,
    'novo',
    'service',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440003'
),
(
    '[PROMO] Banner Homepage - Visibilidade Máxima',
    'Banner full-width 1920x300px por 30 dias. 50k impressões mensais. Relatório de cliques incluso.',
    497.00,
    497.00,
    'novo',
    'service',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440003'
),

-- Equipamentos
(
    'Mesa de Som Yamaha QL1 - Seminova',
    'Yamaha QL1 32 canais, 2022, 15 eventos. Case original + Dante + cabos. Nota fiscal disponível.',
    28000.00,
    32000.00,
    'seminovo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'Line Array QSC K12.2 (Par) - Novo na Caixa',
    'Par QSC K12.2 1000W cada, lacrado. Garantia 2 anos. Aceito cartão 3x.',
    12000.00,
    12000.00,
    'novo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'Moving Head Clay Paky Sharpy - Perfeito Estado',
    'Sharpy 189W, lâmpada 400h. Case duplo incluso. Todas funções OK.',
    8500.00,
    9000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    'Painel LED P3.9 Indoor - 500x500mm (20 Módulos)',
    'Unilumin P3.9, 20 módulos = tela 3m x 2m. Controller Novastar + cabos.',
    45000.00,
    50000.00,
    'seminovo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    'Console GrandMA2 Light - Com Licença Original',
    'GrandMA2 Light, licença transferível. Touchscreen 100%, case Gator incluso.',
    65000.00,
    70000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    'Gerador Toyama 8KVA Silenciado - 50h de Uso',
    'TDG8000SLE3D 8000W, 50h horímetro. Partida elétrica, silenciado 65dB. 2023.',
    18000.00,
    20000.00,
    'seminovo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '[LOTE] 50 Cabos XLR 10m - Santo Angelo',
    'Lote 50 cabos XLR 10m Santo Angelo. Testados, funcionando. Vendo apenas lote completo.',
    2500.00,
    3000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'CDJ Pioneer 2000 Nexus (Par) + Mixer DJM 900',
    'Setup completo DJ: 2x CDJ-2000 Nexus + DJM-900. Estado 9/10, cabos inclusos.',
    22000.00,
    25000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- MENSAGEM FINAL
-- =====================================================

DO $$ BEGIN RAISE NOTICE '✅ Setup completo!';

RAISE NOTICE '📊 % posts criados',
(
    SELECT COUNT(*)
    FROM blog_posts
);

RAISE NOTICE '📦 % anúncios criados',
(
    SELECT COUNT(*)
    FROM listings
    WHERE
        moderation_status = 'approved'
);

RAISE NOTICE '👥 % perfis criados',
(
    SELECT COUNT(*)
    FROM profiles
    WHERE
        is_verified = true
);

RAISE NOTICE '🚀 Banco pronto para produção!';

END $$;