-- =====================================================================
-- 🚨 FIX COMPLETO - TABELAS EVENTS E PROFILES
-- =====================================================================
-- Execute este script no Supabase SQL Editor
-- Isso vai criar/atualizar as tabelas e inserir dados de teste
-- =====================================================================

-- =====================================================================
-- PARTE 1: TABELA EVENTS (CORRIGIDA)
-- =====================================================================

-- 1.1 Verificar se tabela existe e dropar para recriar
DROP TABLE IF EXISTS public.events CASCADE;

-- 1.2 Criar tabela com schema completo
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,

-- Organizador
organizer_id uuid REFERENCES auth.users (id) ON DELETE SET NULL,

-- Conteúdo
title text NOT NULL,
short_description text,
full_content text,
cover_image_url text,
external_ticket_url text,

-- Data e hora
starts_at timestamptz NOT NULL DEFAULT(now() + interval '7 days'),
ends_at timestamptz NOT NULL DEFAULT(
    now() + interval '7 days' + interval '4 hours'
),

-- Formato e status
format text NOT NULL DEFAULT 'in_person' CHECK (
    format IN (
        'online',
        'in_person',
        'hybrid'
    )
),
status text NOT NULL DEFAULT 'published' CHECK (
    status IN (
        'draft',
        'published',
        'cancelled',
        'completed'
    )
),

-- JSONB fields
location_data jsonb NOT NULL DEFAULT '{}',
metadata jsonb NOT NULL DEFAULT '{}',

-- Estatísticas
views_count integer NOT NULL DEFAULT 0,

-- Timestamps
created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 1.3 Comentários
COMMENT ON TABLE public.events IS 'Eventos do portal MagnaFest';

-- 1.4 Índices
CREATE INDEX idx_events_status ON public.events (status);

CREATE INDEX idx_events_starts_at ON public.events (starts_at);

CREATE INDEX idx_events_slug ON public.events (slug);

-- 1.5 RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "Allow public read access" ON public.events FOR
SELECT USING (true);

-- Inserção para autenticados
CREATE POLICY "Allow authenticated insert" ON public.events FOR
INSERT
WITH
    CHECK (
        auth.role () = 'authenticated'
    );

-- Update pelo organizador
CREATE POLICY "Allow organizer update" ON public.events FOR
UPDATE USING (auth.uid () = organizer_id);

-- =====================================================================
-- PARTE 2: SEED EVENTOS DE EXEMPLO
-- =====================================================================

INSERT INTO
    public.events (
        slug,
        title,
        short_description,
        full_content,
        cover_image_url,
        starts_at,
        ends_at,
        format,
        status,
        location_data,
        external_ticket_url
    )
VALUES (
        'festival-de-inverno-2026',
        'Festival de Inverno 2026',
        'O maior festival de inverno do Brasil com shows, gastronomia e muito mais!',
        'Prepare-se para uma experiência única no Festival de Inverno 2026! Serão 3 dias de muita música, comida e diversão. Com line-up internacional e local, o evento promete ser inesquecível.',
        'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        now() + interval '30 days',
        now() + interval '32 days',
        'in_person',
        'published',
        '{"city": "Campos do Jordão", "state": "SP", "address": "Parque Municipal"}',
        'https://sympla.com.br'
    ),
    (
        'workshop-producao-eventos',
        'Workshop de Produção de Eventos',
        'Aprenda com os melhores profissionais do mercado',
        'Workshop intensivo de 2 dias onde você vai aprender tudo sobre produção de eventos, desde planejamento até execução.',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
        now() + interval '14 days',
        now() + interval '15 days',
        'hybrid',
        'published',
        '{"city": "São Paulo", "state": "SP", "address": "Centro de Convenções", "url": "https://zoom.us/meeting123"}',
        NULL
    ),
    (
        'masterclass-iluminacao-cenica',
        'Masterclass de Iluminação Cênica',
        'Técnicas avançadas de iluminação para shows e eventos',
        'Com instrutores renomados, você vai aprender técnicas de iluminação utilizadas nos maiores shows do país.',
        'https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=800',
        now() + interval '21 days',
        now() + interval '21 days' + interval '5 hours',
        'in_person',
        'published',
        '{"city": "Rio de Janeiro", "state": "RJ", "address": "Teatro Municipal"}',
        NULL
    ),
    (
        'feira-equipamentos-som',
        'Feira de Equipamentos de Som',
        'Exposição dos melhores equipamentos de áudio do mercado',
        'Venha conhecer os últimos lançamentos em equipamentos de som profissional. Entrada gratuita!',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        now() + interval '45 days',
        now() + interval '47 days',
        'in_person',
        'published',
        '{"city": "Belo Horizonte", "state": "MG", "address": "Expominas"}',
        'https://eventbrite.com'
    ),
    (
        'webinar-tendencias-2026',
        'Webinar: Tendências para Eventos 2026',
        'Conheça as principais tendências do setor',
        'Evento online e gratuito com especialistas discutindo o futuro do mercado de eventos.',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        now() + interval '7 days',
        now() + interval '7 days' + interval '2 hours',
        'online',
        'published',
        '{"url": "https://meet.google.com/abc-defg-hij"}',
        NULL
    ),
    (
        'congresso-nacional-produtores',
        'Congresso Nacional de Produtores',
        'O maior encontro de produtores de eventos do Brasil',
        'Networking, palestras e muita troca de experiências entre os maiores nomes do setor.',
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800',
        now() + interval '60 days',
        now() + interval '62 days',
        'in_person',
        'published',
        '{"city": "Brasília", "state": "DF", "address": "Centro de Convenções Ulysses Guimarães"}',
        'https://sympla.com.br'
    );

-- =====================================================================
-- PARTE 3: GARANTIR COLUNAS EM PROFILES
-- =====================================================================

-- 3.1 Adicionar colunas se não existirem
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS is_claimed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS main_category_id uuid;

-- 3.2 Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city);

CREATE INDEX IF NOT EXISTS idx_profiles_is_claimed ON public.profiles (is_claimed);

-- =====================================================================
-- PARTE 4: SEED PROFISSIONAIS (SE ESTIVER VAZIO)
-- =====================================================================

DO $$ DECLARE profile_count integer;

BEGIN
SELECT COUNT(*) INTO profile_count
FROM public.profiles;

IF profile_count < 5 THEN
-- Inserir profissionais de exemplo
INSERT INTO
    public.profiles (
        id,
        name,
        description,
        city,
        state,
        category,
        whatsapp,
        is_claimed,
        source
    )
VALUES (
        gen_random_uuid (),
        'AudioVisão Locações',
        'Sonorização completa para grandes eventos corporativos com 15 anos de experiência.',
        'São Paulo',
        'SP',
        'Som',
        '11999887766',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Carlos Mendes - Som Profissional',
        'Técnico especializado em casamentos e festas de médio porte.',
        'Rio de Janeiro',
        'RJ',
        'Som',
        '21987654321',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Light Design Eventos',
        'Iluminação cênica e arquitetural para eventos de alto padrão.',
        'São Paulo',
        'SP',
        'Iluminação',
        '11922110099',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Segurança Prime Eventos',
        'Equipe treinada para controle de acesso e segurança patrimonial.',
        'São Paulo',
        'SP',
        'Segurança',
        '11955443322',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'EletroEventos SP',
        'Dimensionamento de carga elétrica e instalações temporárias para eventos.',
        'São Paulo',
        'SP',
        'Eletricista',
        '11977665544',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Maria Oliveira - Produtora',
        'Coordenação de casamentos e eventos corporativos. 10 anos de experiência.',
        'São Paulo',
        'SP',
        'Produtora',
        '11933221100',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Buffet Sabor & Eventos',
        'Buffet completo para casamentos e eventos corporativos.',
        'Rio de Janeiro',
        'RJ',
        'Buffet',
        '21988776655',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Clean Eventos SP',
        'Limpeza durante e pós-evento. Equipe especializada.',
        'São Paulo',
        'SP',
        'Limpeza',
        '11944332211',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Brigada Eventos Seguros',
        'Equipe de bombeiros civis certificados para prevenção e combate a incêndios.',
        'Campinas',
        'SP',
        'Segurança',
        '19988776655',
        false,
        'seed'
    ),
    (
        gen_random_uuid (),
        'Staff Prime Eventos',
        'Recepcionistas bilíngues certificados para eventos internacionais.',
        'São Paulo',
        'SP',
        'Recepção',
        '11911009988',
        false,
        'seed'
    );

RAISE NOTICE '✅ 10 profissionais de exemplo inseridos!';

ELSE RAISE NOTICE 'ℹ️ Já existem % profissionais no banco.',
profile_count;

END IF;

END $$;

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================
SELECT 'EVENTOS' as tabela, COUNT(*) as total
FROM public.events
WHERE
    status = 'published'
UNION ALL
SELECT 'PROFISSIONAIS', COUNT(*)
FROM public.profiles;

-- =====================================================================
-- ✅ SCRIPT CONCLUÍDO!
-- =====================================================================
-- Agora acesse:
-- - /eventos → Deve mostrar 6 eventos
-- - /agenda → Deve mostrar eventos na timeline
-- - /profissionais → Deve mostrar 10+ profissionais
-- =====================================================================