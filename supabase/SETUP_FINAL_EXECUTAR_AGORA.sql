-- =====================================================
-- SETUP COMPLETO PORTAL MAGNAFEST - EXECUTAR UMA VEZ
-- Este arquivo cria TUDO: tabelas, RLS, índices e dados
-- =====================================================

-- Limpar dados antigos (CUIDADO: apaga tudo!)
-- TRUNCATE blog_posts, listings, profiles CASCADE;

-- =====================================================
-- 1. CRIAR EXTENSÕES NECESSÁRIAS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. CRIAR/ATUALIZAR TABELAS
-- =====================================================

-- Tabela de Perfis (já existe via auth, mas garantindo estrutura)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    trust_score INTEGER DEFAULT 0 CHECK (
        trust_score >= 0
        AND trust_score <= 100
    ),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Posts do Blog
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

-- Tabela de Anúncios/Listings
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

-- =====================================================
-- 3. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);

CREATE INDEX IF NOT EXISTS idx_listings_moderation ON listings (moderation_status);

CREATE INDEX IF NOT EXISTS idx_listings_type ON listings (listing_type);

CREATE INDEX IF NOT EXISTS idx_listings_profile ON listings (profiles_id);

CREATE INDEX IF NOT EXISTS idx_listings_created ON listings (created_at DESC);

-- =====================================================
-- 4. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Policies para Profiles
DROP POLICY IF EXISTS "Perfis públicos visíveis" ON profiles;

CREATE POLICY "Perfis públicos visíveis" ON profiles FOR
SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio perfil" ON profiles;

CREATE POLICY "Usuários podem atualizar próprio perfil" ON profiles FOR
UPDATE USING (auth.uid () = id);

-- Policies para Blog Posts (todos podem ler)
DROP POLICY IF EXISTS "Posts públicos" ON blog_posts;

CREATE POLICY "Posts públicos" ON blog_posts FOR SELECT USING (true);

-- Policies para Listings
DROP POLICY IF EXISTS "Anúncios aprovados são públicos" ON listings;

CREATE POLICY "Anúncios aprovados são públicos" ON listings FOR
SELECT USING (
        moderation_status = 'approved'
        AND status = 'active'
    );

DROP POLICY IF EXISTS "Usuários podem criar anúncios" ON listings;

CREATE POLICY "Usuários podem criar anúncios" ON listings FOR
INSERT
WITH
    CHECK (auth.uid () = profiles_id);

DROP POLICY IF EXISTS "Usuários podem editar próprios anúncios" ON listings;

CREATE POLICY "Usuários podem editar próprios anúncios" ON listings FOR
UPDATE USING (auth.uid () = profiles_id);

-- =====================================================
-- 5. INSERIR PERFIS DE VENDEDORES
-- =====================================================

INSERT INTO
    profiles (
        id,
        email,
        full_name,
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
    full_name = EXCLUDED.full_name,
    trust_score = EXCLUDED.trust_score,
    is_verified = EXCLUDED.is_verified;

-- =====================================================
-- 6. INSERIR 20 POSTS DO BLOG
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

('Como Calcular o Break-Even de um Evento: Guia Completo', 'como-calcular-break-even-evento', 'Aprenda a calcular o ponto de equilíbrio financeiro do seu evento e evitar prejuízos. Planilha gratuita inclusa.', 'O break-even é o número mínimo de ingressos que você precisa vender para cobrir todos os custos. Fórmula: Break-Even = Custos Fixos / (Preço do Ingresso - Custo Variável por Ingresso). Exemplo prático: Evento com R$ 50.000 de custos fixos, ingresso a R$ 100 e custo variável de R$ 20 = 625 ingressos.', 'Produção', 'Equipe MagnaFest', NOW(), '/blog/break-even.jpg', ARRAY['finanças', 'planejamento', 'produção']),

('10 Erros Fatais que Quebram Produtoras de Evento', 'erros-fatais-produtoras-eventos', 'Descubra os erros mais comuns que levam produtoras à falência e como evitá-los.', 'Erro #1: Não ter contrato formal. Erro #2: Depender de um único cliente. Erro #3: Não ter seguro de responsabilidade civil. Erro #4: Precificar errado (não calcular break-even). Erro #5: Não diversificar portfólio.', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '2 days', '/blog/erros-produtoras.jpg', ARRAY['gestão', 'riscos', 'dicas']),

('Rider Técnico: O Que Todo Produtor Precisa Saber', 'rider-tecnico-guia-completo', 'Entenda o que é um rider técnico, como interpretar e negociar com artistas internacionais.', 'O rider técnico é o documento que lista todas as exigências técnicas e logísticas do artista. Dividido em: Technical Rider (som, luz, palco, camarim), Hospitality Rider (alimentação, hospedagem) e Stage Plot (posicionamento dos músicos e equipamentos).', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '5 days', '/blog/rider-tecnico.jpg', ARRAY['rider', 'internacional', 'produção']),

-- Jurídico

('MEI para Produtores: Vale a Pena em 2024?', 'mei-produtores-vale-pena-2024', 'Análise completa sobre MEI para produtores de evento: limites, CNAEs permitidos e alternativas.', 'MEI tem limite de R$ 81.000/ano. CNAEs permitidos: 9001-9/01 (Produção teatral), 9329-8/01 (Produção e promoção de eventos). Tributação: DAS de ±R$ 70/mês. Alternativas para quem fatura mais: SLU, EIRELI, Sociedade Limitada.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '1 week', '/blog/mei-produtores.jpg', ARRAY['MEI', 'tributação', 'formalização']),

('ECAD 2024: Tabela Atualizada e Como Calcular', 'ecad-2024-tabela-atualizada', 'Valores atualizados do ECAD para música ao vivo e mecânica. Calculadora automática inclusa.', 'Tabela ECAD 2024: Eventos até 500 pessoas = 10% do valor declarado. 501-1000 = 12%. Acima de 1000 = 15%. Música mecânica (DJ/playlist): 50% do valor da música ao vivo. Isenções: eventos beneficentes registrados.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '10 days', '/blog/ecad-2024.jpg', ARRAY['ECAD', 'direitos autorais', 'custos']),

('Contrato de Prestação de Serviço: Modelo Gratuito', 'contrato-prestacao-servico-modelo', 'Baixe gratuitamente nosso modelo de contrato para DJs, bandas e técnicos.', 'Cláusulas essenciais: 1) Identificação das partes 2) Valor do cachê e forma de pagamento 3) Horário de início e duração 4) Rider técnico anexo 5) Multa por descumprimento 6) Cláusula de força maior 7) Foro competente.', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '12 days', '/blog/contrato-modelo.jpg', ARRAY['contratos', 'documentos', 'proteção']),

-- Tecnologia

('Line Array vs. PA Tradicional: Qual Escolher?', 'line-array-vs-pa-tradicional', 'Comparativo técnico entre sistemas Line Array e PA tradicional para eventos de médio porte.', 'Line Array: Vantagens: cobertura uniforme, alcance longo (até 80m), menos caixas. Desvantagens: custo alto, setup complexo. PA Tradicional: Vantagens: custo menor, setup simples. Desvantagens: cobertura irregular, limite de 40m. Para eventos 500-2000 pessoas: Line Array. Abaixo de 500: PA tradicional.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '3 days', '/blog/line-array-pa.jpg', ARRAY['áudio', 'equipamentos', 'técnico']),

('Moving Lights: Guia de Compra 2024', 'moving-lights-guia-compra-2024', 'Tudo sobre Moving Lights: tipos (Wash, Spot, Beam), DMX, fabricantes e preços.', 'Tipos: Wash (luz difusa, coloração), Spot (recortes, gobos), Beam (feixe aéreo). Marcas top: Clay Paky, Martin, Robe. Marcas chinesas: PR Lighting, Lightsky. Preços: Wash entry-level R$ 5k, profissional R$ 20k+. DMX: protocolo de controle, 512 canais por universo.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '6 days', '/blog/moving-lights.jpg', ARRAY['iluminação', 'DMX', 'equipamentos']),

('LED Wall vs. Projeção: O Que Usar em 2024?', 'led-wall-vs-projecao-2024', 'Análise de custos, qualidade e aplicações de painéis LED vs projetores.', 'LED Wall: Vantagens: contraste infinito, funciona com luz ambiente, resolução 4K+. Desvantagens: custo R$ 1.500-3.000/m². Projeção: Vantagens: custo 60% menor, flexibilidade. Desvantagens: precisa escuro, lâmpada 2.000h. Recomendação: LED para outdoor/palco, Projetor para indoor corporativo.', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '8 days', '/blog/led-wall-vs-projecao.jpg', ARRAY['vídeo', 'LED', 'tecnologia']),

-- Marketing

('Como Vender 1000 Ingressos em 7 Dias', 'vender-1000-ingressos-7-dias', 'Estratégia completa de marketing digital para lotar seu evento rapidamente.', 'Funil: Dia 1-2 (Awareness): Instagram Ads + influencers. Dia 3-4 (Consideração): Email marketing + lote promocional. Dia 5-6 (Decisão): FOMO (últimos ingressos), depoimentos. Dia 7: Flash sale final. Budget mínimo: R$ 3.000 em ads.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '4 days', '/blog/vender-ingressos.jpg', ARRAY['vendas', 'marketing', 'estratégia']),

('Instagram para Produtores: Dicas que Funcionam', 'instagram-produtores-dicas', 'Aumente seu engajamento e venda mais ingressos com essas técnicas comprovadas.', 'Poste 1x/dia no feed, 3-5 Stories diários. Use Reels (alcance 10x maior). Horários nobres: 12h-13h e 19h-21h. Hashtags: 5-10 específicas. Engagement pods funcionam para crescimento inicial. Parcerias com micro-influencers (5k-20k): ROI melhor que celebridades.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '7 days', '/blog/instagram-dicas.jpg', ARRAY['instagram', 'redes sociais', 'engajamento']),

('Email Marketing para Eventos: Guia Prático', 'email-marketing-eventos-guia', 'Construa sua lista, crie emails que convertem e automatize suas campanhas.', 'Email ainda tem ROI de 42:1. Ferramentas BR: RD Station, E-goi. Sequência de automação: 1) Boas-vindas 2) Lote promocional (+48h) 3) FOMO (-7 dias do evento) 4) Última chance (-24h). Taxa de abertura boa: 25%+. Cliques: 3%+.', 'Marketing', 'Paula Martins', NOW() - INTERVAL '9 days', '/blog/email-marketing.jpg', ARRAY['email', 'automação', 'conversão']),

-- Mercado

('Festivais em Alta: Tendências para 2024', 'festivais-tendencias-2024', 'Análise do mercado de festivais no Brasil: formatos, público e investimento.', 'Festivais boutique cresceram 35% em 2023. Público busca experiência, não só música. Tendências: camping premium, gastronomia de chefs, ativações de marca integradas. Mercado BR: R$ 8 bilhões/ano. Crescimento esperado 2024: 12%.', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '11 days', '/blog/festivais-2024.jpg', ARRAY['festivais', 'tendências', 'mercado']),

('Quanto Custa Produzir um Show de Grande Porte?', 'custo-show-grande-porte', 'Breakdown de custos reais de um show para 5.000 pessoas.', 'Espaço: R$ 50k. Som (line array): R$ 80k. Luz (moving heads): R$ 60k. Palco + estrutura: R$ 120k. Segurança: R$ 40k. Staff: R$ 30k. Marketing: R$ 50k. Artista: R$ 200k+. TOTAL: R$ 630k. Break-even com ingresso médio R$ 150: 4.200 ingressos.', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '13 days', '/blog/custo-show.jpg', ARRAY['custos', 'orçamento', 'planejamento']),

('Cashless: A Revolução no Pagamento de Eventos', 'cashless-revolucao-pagamentos', 'Entenda como funciona, vantagens e cases de sucesso no Brasil.', 'Cashless reduz fila em 70% e aumenta consumo em 30%. Tecnologias: NFC (pulseira/cartão), QR Code. Fornecedores BR: Yooga, Zig. Setup: R$ 5k + 3-5% de taxa por transação. ROI positivo com 2.000+ pessoas. Rock in Rio 2022: 100% cashless, aumento de 40% no consumo.', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '14 days', '/blog/cashless.jpg', ARRAY['cashless', 'pagamentos', 'tecnologia']),

-- Carreira

('Como Começar como DJ Profissional em 2024', 'comecar-dj-profissional-2024', 'Roadmap completo: equipamentos, residências, marketing pessoal e precificação.', 'Setup inicial: Pioneer DDJ-400 (R$ 2.5k) + laptop + Rekordbox (free). Evolução: CDJs (R$ 12k par) + mixer (R$ 8k). Precificação: Iniciante R$ 500/set, Intermediário R$ 1.500, Top R$ 5k+. Conseguir residências: portfólio no Instagram, mixagem no SoundCloud, networking em eventos.', 'Carreira', 'DJ Rodrigo Lopes', NOW() - INTERVAL '15 days', '/blog/comecar-dj.jpg', ARRAY['DJ', 'carreira', 'iniciantes']),

('Roadie: Profissão Essencial e Invisível', 'roadie-profissao-essencial', 'Conheça a rotina, desafios e remuneração de quem faz o show acontecer nos bastidores.', 'Roadies: carga/descarga, montagem, operação, desmontagem. Começam como auxiliares (R$ 200/dia), evoluem para técnicos (R$ 400/dia), chegam a chefe de equipe (R$ 800/dia). Jornada normal: 12-16h. Turnês nacionais: 30 dias fora. Internacional: 60+ dias.', 'Carreira', 'Bruno Machado', NOW() - INTERVAL '16 days', '/blog/roadie-profissao.jpg', ARRAY['roadie', 'bastidores', 'carreira']),

('Iluminador Profissional: Mercado e Certificações', 'iluminador-profissional-mercado', 'Cursos, certificações (DMX, GrandMA) e faixa salarial da profissão.', 'Certificação GrandMA: €3.500, habilita para R$ 1.500/dia. Cursos no Brasil: SENAI (DMX básico R$ 1.2k), Pro Light (avançado R$ 5k). Carreira: operador (R$ 300/dia), programador (R$ 800/dia), designer de luz (R$ 2k/dia). Freelancer ou CLT em produtoras.', 'Carreira', 'Eng. Carlos Henrique', NOW() - INTERVAL '17 days', '/blog/iluminador-profissao.jpg', ARRAY['iluminação', 'certificação', 'carreira']),

-- Casos

('Lollapalooza 2024: Análise Técnica Completa', 'lollapalooza-2024-analise-tecnica', 'Breakdown técnico do maior festival do Brasil: estrutura, som, luz e logística.', '6 palcos simultâneos, 400 moving heads, 80 painéis LED P2.9, 200 toneladas de estrutura. Som: L-Acoustics K2 (palco principal), Meyer Sound (secundários). Potência elétrica: 2.5MW. Equipe técnica: 800 pessoas. Setup: 7 dias. Desmontagem: 3 dias.', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '18 days', '/blog/lollapalooza-analise.jpg', ARRAY['festivais', 'case', 'técnico']),

('Rock in Rio: Nos Bastidores da Cidade do Rock', 'rock-in-rio-bastidores', 'Entrevista exclusiva com a equipe técnica que monta a maior estrutura de eventos da AL.', '4 meses de montagem, 10.000 pessoas na equipe, R$ 350 mi de investimento. Palco Mundo: 102m de largura, 48m de altura. Sistema de som com 500.000W. 15km de cabos. Capacidade: 100.000 pessoas/dia. Certificado ISO 20121 (sustentabilidade).', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '19 days', '/blog/rock-in-rio.jpg', ARRAY['rock in rio', 'megaeventos', 'bastidores'])

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- =====================================================
-- 7. INSERIR 10 ANÚNCIOS DO MARKETPLACE
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

-- Anúncios do Portal (demonstração)
(
    '[DESTAQUE] Anuncie no Portal MagnaFest - Plano Pro',
    'Faça sua marca ser vista por 5.000+ profissionais do setor de eventos. Inclui: Banner na homepage (30 dias) + 2 posts patrocinados no blog + Native Ads nos resultados de busca. Suporte prioritário e relatório mensal de performance. Contrato mensal sem fidelidade.',
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
    'Banner full-width (1920x300px) no topo da homepage do Portal MagnaFest por 30 dias. Estimativa de 50.000 impressões mensais. Público qualificado: produtores, DJs, técnicos e fornecedores. Relatório de cliques incluso. Arte pode ser criada por nossa equipe (+R$ 300).',
    497.00,
    497.00,
    'novo',
    'service',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440003'
),

-- Equipamentos reais
(
    'Mesa de Som Yamaha QL1 - Seminova',
    'Mesa digital Yamaha QL1 de 32 canais com processamento DSP integrado. Comprada em 2022, usada em apenas 15 eventos corporativos indoor. Estado impecável, sem riscos ou marcas. Inclui: case rígido Thomann original, cartão Dante MY16-AUD, manual em português e 8 cabos de força. Firmware atualizado para última versão. Nota fiscal disponível. Motivo da venda: upgrade para QL5 para eventos maiores.',
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
    'Par de caixas ativas QSC K12.2 de 1000W cada, lacradas na caixa original. Compradas para evento corporativo que foi cancelado. Nunca foram abertas. Nome na nota fiscal disponível para garantia de fábrica (2 anos restantes). Especificações: 127dB SPL, DSP integrado, entrada XLR/TRS. Perfeitas para bandas, DJs ou sistema de monitor. Aceito cartão em até 3x.',
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
    'Moving Head Clay Paky Sharpy 189W, o clássico indestrutível da iluminação profissional. Lâmpada Osram Sirius com apenas 400h de uso (ainda tem 600h de vida útil). Todas as funções operando perfeitamente: pan/tilt, zoom, prisma, gobo rodando. Lente sem arranhões ou embaçamento. Acompanha case duplo rígido com rodas e alça retrátil. Manutenção em dia, testado e aprovado. Ideal para shows, festas e eventos.',
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
    'Lote com 20 módulos de painel LED P3.9 indoor para montagem de telão. Marca Unilumin (top de linha), resolução 500x500mm por módulo. Monta telão de 3 metros (largura) x 2 metros (altura). Inclui controller Novastar MCTRL660 e cabos de dados/energia. Brilho: 800 nits. Refresh rate: 3840Hz (sem flicker em câmera). Perfeito para backdrop de palco, telão de igreja ou eventos corporativos. Aceito troca por equipamento de som.',
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
    'Console de iluminação GrandMA2 Light com licença original ativada e transferível. Touchscreen funcionando 100%, todos os encoders suaves sem folga. 2 universos DMX integrados + expansível via ArtNet/MA-Net. Firmware atualizado para última versão. Inclui mouse e case rígido Gator com rodas. Ideal para shows de médio porte (até 150 fixtures). Aceito proposta razoável à vista.',
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
    'Gerador a diesel Toyama TDG8000SLE3D de 8000W com sistema de silenciamento profissional. Somente 50 horas no horímetro digital! Comprado em 2023 para eventos outdoor mas mudei de segmento. Partida elétrica com bateria nova, painel digital LCD, proteção contra sobrecarga. Nível de ruído: 65dB. Autonomia: 8h com tanque cheio (25L). Revisão em dia com laudo técnico. Acompanha manual e nota fiscal. Aceito carro/moto na troca.',
    18000.00,
    20000.00,
    'seminovo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '[LOTE] 50 Cabos XLR Balanceados 10m - Santo Angelo',
    'Lote com 50 cabos XLR balanceados de 10 metros cada. Marca Santo Angelo (nacional de qualidade). Usados mas testados um por um e funcionando perfeitamente. Alguns têm leves marcas de uso mas sem interferência no sinal. Vendendo porque migrei 100% para sistema digital Dante e não preciso mais de tanto cabo analógico. Preço por unidade sai R$ 50-60 (mercado cobra R$ 80+). Vendo apenas o lote completo.',
    2500.00,
    3000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'CDJ Pioneer 2000 Nexus (Par) + Mixer DJM 900 Nexus',
    'Setup completo para DJ profissional: 2x CDJ-2000 Nexus + Mixer DJM-900 Nexus. Estado de conservação 9/10, todas as funções 100% operacionais. Pouquíssimo uso, apenas em festas particulares indoor, sempre em ambiente climatizado. CDJs com tela LCD perfeita, jog wheel sem folga. Mixer com faders suaves, crossfader novo (trocado há 6 meses). Acompanha cabos de força, USB, RCA e manual. Aceito parcelamento com cheque.',
    22000.00,
    25000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. MENSAGEM FINAL
-- =====================================================

DO $$ BEGIN RAISE NOTICE '✅ Setup completo executado com sucesso!';

RAISE NOTICE '📊 % posts de blog criados',
(
    SELECT COUNT(*)
    FROM blog_posts
);

RAISE NOTICE '📦 % anúncios criados',
(
    SELECT COUNT(*)
    FROM listings
);

RAISE NOTICE '👥 % perfis criados',
(
    SELECT COUNT(*)
    FROM profiles
);

RAISE NOTICE '';

RAISE NOTICE '🚀 Banco de dados pronto para produção!';

END $$;

COMMIT;