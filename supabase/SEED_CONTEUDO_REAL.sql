-- =====================================================
-- SEED DE CONTEÚDO REAL - PORTAL MAGNAFEST
-- Execute este arquivo no SQL Editor do Supabase
-- =====================================================

-- =====================================================
-- 1. POSTS DO BLOG (20 artigos reais)
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

-- Categoria: Produção

('Como Calcular o Break-Even de um Evento: Guia Completo', 'como-calcular-break-even-evento', 'Aprenda a calcular o ponto de equilíbrio financeiro do seu evento e evitar prejuízos. Planilha gratuita inclusa.', 'O break-even é o número mínimo de ingressos que você precisa vender para cobrir todos os custos...', 'Produção', 'Equipe MagnaFest', NOW(), '/blog/break-even.jpg', ARRAY['finanças', 'planejamento', 'produção']),

('10 Erros Fatais que Quebram Produtoras de Evento', 'erros-fatais-produtoras-eventos', 'Descubra os erros mais comuns que levam produtoras à falência e como evitá-los.', 'Falta de contrato formal, não ter seguro de responsabilidade civil, depender de um único cliente...', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '2 days', '/blog/erros-produtoras.jpg', ARRAY['gestão', 'riscos', 'dicas']),

('Rider Técnico: O Que Todo Produtor Precisa Saber', 'rider-tecnico-guia-completo', 'Entenda o que é um rider técnico, como interpretar e negociar com artistas internacionais.', 'O rider técnico é o documento que lista todas as exigências técnicas e logísticas do artista...', 'Produção', 'Equipe MagnaFest', NOW() - INTERVAL '5 days', '/blog/rider-tecnico.jpg', ARRAY['rider', 'internacional', 'produção']),

-- Categoria: Jurídico

('MEI para Produtores: Vale a Pena em 2024?', 'mei-produtores-vale-pena-2024', 'Análise completa sobre MEI para produtores de evento: limites, CNAEs permitidos e alternativas.', 'O MEI tem limite de R$ 81.000/ano. Para produtores de evento, o CNAE permitido é...', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '1 week', '/blog/mei-produtores.jpg', ARRAY['MEI', 'tributação', 'formalização']),

('ECAD 2024: Tabela Atualizada e Como Calcular', 'ecad-2024-tabela-atualizada', 'Valores atualizados do ECAD para música ao vivo e mecânica. Calculadora automática inclusa.', 'A tabela do ECAD para 2024 sofreu reajuste de 4.5%. Para eventos com até 500 pessoas...', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '10 days', '/blog/ecad-2024.jpg', ARRAY['ECAD', 'direitos autorais', 'custos']),

('Contrato de Prestação de Serviço: Modelo Gratuito', 'contrato-prestacao-servico-modelo', 'Baixe gratuitamente nosso modelo de contrato para DJs, bandas e técnicos.', 'Um contrato bem feito protege ambas as partes. Cláusulas essenciais: valor do cachê, horário...', 'Jurídico', 'Dr. Ricardo Almeida', NOW() - INTERVAL '12 days', '/blog/contrato-modelo.jpg', ARRAY['contratos', 'documentos', 'proteção']),

-- Categoria: Tecnologia

('Line Array vs. PA Tradicional: Qual Escolher?', 'line-array-vs-pa-tradicional', 'Comparativo técnico entre sistemas Line Array e PA tradicional para eventos de médio porte.', 'Line Array distribui som de forma mais uniforme em longas distâncias. PA tradicional...', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '3 days', '/blog/line-array-pa.jpg', ARRAY['áudio', 'equipamentos', 'técnico']),

('Moving Lights: Guia de Compra 2024', 'moving-lights-guia-compra-2024', 'Tudo sobre Moving Lights: tipos (Wash, Spot, Beam), DMX, fabricantes e preços.', 'Moving Lights transformaram a iluminação cênica. Tipos principais: Wash (luz difusa)...', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '6 days', '/blog/moving-lights.jpg', ARRAY['iluminação', 'DMX', 'equipamentos']),

('LED Wall vs. Projeção: O Que Usar em 2024?', 'led-wall-vs-projecao-2024', 'Análise de custos, qualidade e aplicações de painéis LED vs projetores.', 'LED Walls dominaram o mercado premium. Vantagens: contraste infinito, funciona com luz...', 'Tecnologia', 'Eng. Carlos Henrique', NOW() - INTERVAL '8 days', '/blog/led-wall-vs-projecao.jpg', ARRAY['vídeo', 'LED', 'tecnologia']),

-- Categoria: Marketing

('Como Vender 1000 Ingressos em 7 Dias', 'vender-1000-ingressos-7-dias', 'Estratégia completa de marketing digital para lotar seu evento rapidamente.', 'Técnica do funil: Topo (Awareness) - anúncios no Instagram. Meio (Consideração)...', 'Marketing', 'Paula Martins', NOW() - INTERVAL '4 days', '/blog/vender-ingressos.jpg', ARRAY['vendas', 'marketing', 'estratégia']),

('Instagram para Produtores: Dicas que Funcionam', 'instagram-produtores-dicas', 'Aumente seu engajamento e venda mais ingressos com essas técnicas comprovadas.', 'Poste 1x ao dia no feed, 3-5 Stories diários. Use Reels para alcance viral...', 'Marketing', 'Paula Martins', NOW() - INTERVAL '7 days', '/blog/instagram-dicas.jpg', ARRAY['instagram', 'redes sociais', 'engajamento']),

('Email Marketing para Eventos: Guia Prático', 'email-marketing-eventos-guia', 'Construa sua lista, crie emails que convertem e automatize suas campanhas.', 'Email ainda tem ROI de 42:1. Ferramentas: RD Station (BR), Mailchimp (Global)...', 'Marketing', 'Paula Martins', NOW() - INTERVAL '9 days', '/blog/email-marketing.jpg', ARRAY['email', 'automação', 'conversão']),

-- Categoria: Mercado

('Festivais em Alta: Tendências para 2024', 'festivais-tendencias-2024', 'Análise do mercado de festivais no Brasil: formatos, público e investimento.', 'Festivais boutique cresceram 35% em 2023. Público busca experiência, não só música...', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '11 days', '/blog/festivais-2024.jpg', ARRAY['festivais', 'tendências', 'mercado']),

('Quanto Custa Produzir um Show de Grande Porte?', 'custo-show-grande-porte', 'Breakdown de custos reais de um show para 5.000 pessoas.', 'Aluguel de espaço: R$ 50k. Som (line array): R$ 80k. Luz (moving heads): R$ 60k...', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '13 days', '/blog/custo-show.jpg', ARRAY['custos', 'orçamento', 'planejamento']),

('Cashless: A Revolução no Pagamento de Eventos', 'cashless-revolucao-pagamentos', 'Entenda como funciona, vantagens e cases de sucesso no Brasil.', 'Cashless reduz fila em 70% e aumenta consumo médio em 30%. Tecnologias: NFC, QR Code...', 'Mercado', 'Equipe MagnaFest', NOW() - INTERVAL '14 days', '/blog/cashless.jpg', ARRAY['cashless', 'pagamentos', 'tecnologia']),

-- Categoria: Carreira

('Como Começar como DJ Profissional em 2024', 'comecar-dj-profissional-2024', 'Roadmap completo: equipamentos, residências, marketing pessoal e precificação.', 'Equipamento inicial: Controladora Pioneer DDJ-400 (R$ 2.5k). Software: Rekordbox (free)...', 'Carreira', 'DJ Rodrigo Lopes', NOW() - INTERVAL '15 days', '/blog/comecar-dj.jpg', ARRAY['DJ', 'carreira', 'iniciantes']),

('Roadie: Profissão Essencial e Invisível', 'roadie-profissao-essencial', 'Conheça a rotina, desafios e remuneração de quem faz o show acontecer nos bastidores.', 'Roadies começam como auxiliares (R$ 200/dia) e podem chegar a chefe de equipe (R$ 800/dia)...', 'Carreira', 'Bruno Machado', NOW() - INTERVAL '16 days', '/blog/roadie-profissao.jpg', ARRAY['roadie', 'bastidores', 'carreira']),

('Iluminador Profissional: Mercado e Certificações', 'iluminador-profissional-mercado', 'Cursos, certificações (DMX, GrandMA) e faixa salarial da profissão.', 'Certificação GrandMA custa €3.500 mas te qualifica para ganhar R$ 1.500/dia...', 'Carreira', 'Eng. Carlos Henrique', NOW() - INTERVAL '17 days', '/blog/iluminador-profissao.jpg', ARRAY['iluminação', 'certificação', 'carreira']),

-- Categoria: Casos de Sucesso

('Lollapalooza 2024: Análise Técnica Completa', 'lollapalooza-2024-analise-tecnica', 'Breakdown técnico do maior festival do Brasil: estrutura, som, luz e logística.', '6 palcos simultâneos, 400 moving heads, 200 toneladas de estrutura metálica...', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '18 days', '/blog/lollapalooza-analise.jpg', ARRAY['festivais', 'case', 'técnico']),

('Rock in Rio: Nos Bastidores da Cidade do Rock', 'rock-in-rio-bastidores', 'Entrevista exclusiva com a equipe técnica que monta a maior estrutura de eventos da AL.', '4 meses de montagem, 10.000 pessoas na equipe, investimento de R$ 350 milhões...', 'Casos', 'Equipe MagnaFest', NOW() - INTERVAL '19 days', '/blog/rock-in-rio.jpg', ARRAY['rock in rio', 'megaeventos', 'bastidores']);

-- =====================================================
-- 2. ANÚNCIOS DO MARKETPLACE (Equipamentos Reais)
-- =====================================================

-- Primeiro, criar perfis de vendedores
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
        'vendedor1@example.com',
        'AudioPro Locações',
        95,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'vendedor2@example.com',
        'LightShow Equipamentos',
        88,
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'vendedor3@example.com',
        'Portal MagnaFest',
        100,
        true
    ) ON CONFLICT (id) DO NOTHING;

-- Anúncios (10 itens realistas)
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

-- Anúncios do próprio Portal (para demonstração)
(
    '[DESTAQUE] Anuncie no Portal MagnaFest - Plano Pro',
    'Faça sua marca ser vista por 5.000+ profissionais do setor de eventos. Banner na homepage + 2 posts patrocinados no blog + Native Ads nos resultados de busca. Contrato mensal com suporte prioritário.',
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
    'Banner full-width no topo da homepage do Portal MagnaFest por 30 dias. Formato: 1920x300px. Até 50.000 impressões mensais. Relatório de performance incluso.',
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
    'Mesa digital Yamaha QL1 de 32 canais. Comprada em 2022, usada em apenas 15 eventos corporativos. Estado impecável, com case rígido original. Inclui cartão Dante, manual e cabos. Motivo da venda: upgrade para QL5.',
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
    'Par de caixas ativas QSC K12.2 (1000W cada), lacradas na caixa. Compradas para evento que foi cancelado. Nome fiscal disponível. Garantia de fábrica válida.',
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
    'Moving Head Clay Paky Sharpy 189W. O clássico indestrutível. Lâmpada com 400h de uso (ainda tem 600h), todas as funções OK, lente sem arranhões. Acompanha case duplo.',
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
    'Lote de 20 módulos de LED P3.9 indoor para montagem de tela. Marca Unilumin, controller Novastar incluído. Monta tela de 3m x 2m. Perfeito para backdrop de palco.',
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
    'Console GrandMA2 Light com licença original ativada. Touchscreen funcionando 100%, encoders sem problemas. Firmware atualizado para última versão. Ideal para shows de médio porte.',
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
    'Gerador a diesel Toyama TDG8000SLE3D (8000W) silenciado. Apenas 50h no horímetro! Comprado em 2023 para eventos outdoor mas mudei de segmento. Partida elétrica, painel digital.',
    18000.00,
    20000.00,
    'seminovo',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '[LOTE] 50 Cabos XLR Balanceados 10m',
    'Lote de 50 cabos XLR balanceados de 10 metros cada. Marca Santo Angelo. Usados mas testados e funcionando perfeitamente. Vendendo porque migrei para sistema digital Dante.',
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
    'Setup completo para DJ: 2x CDJ-2000 Nexus + Mixer DJM-900 Nexus. Estado de conservação 9/10, todas as funções operacionais. Pouquíssimo uso em festas, sempre em ambiente climatizado.',
    22000.00,
    25000.00,
    'usado',
    'product_sale',
    'active',
    'approved',
    '550e8400-e29b-41d4-a716-446655440001'
);

-- =====================================================
-- COMMIT
-- =====================================================
COMMIT;