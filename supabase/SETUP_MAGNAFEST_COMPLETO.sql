-- =====================================================================
-- PORTAL MAGNAFEST - SETUP COMPLETO PARTE 2
-- =====================================================================
-- Execute DEPOIS do DEPLOY_COMPLETO.sql
-- Este script:
-- 1. Cria tabela de categorias
-- 2. Insere 10 categorias de serviço
-- 3. Adiciona relacionamento profiles → categories
-- 4. Popula com 30 profissionais realistas
-- =====================================================================

-- =====================================================================
-- PARTE 1: CATEGORIAS
-- =====================================================================

DROP TABLE IF EXISTS public.service_categories CASCADE;

CREATE TABLE public.service_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text NOT NULL,
    icon_key text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON
TABLE public.service_categories IS 'Service/professional categories available on the platform';

ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.service_categories FOR
SELECT USING (true);

CREATE POLICY "Allow admin insert/update" ON public.service_categories FOR ALL USING (auth.role () = 'service_role');

CREATE INDEX idx_service_categories_slug ON public.service_categories (slug);

CREATE INDEX idx_service_categories_name ON public.service_categories (name);

-- Seed categorias
INSERT INTO
    public.service_categories (
        name,
        slug,
        description,
        icon_key
    )
VALUES (
        'Técnico de Som',
        'tecnico-de-som',
        'Garante que tudo seja ouvido com clareza e evita microfonias ou falhas de áudio.',
        'mic-2'
    ),
    (
        'Eletricista',
        'eletricista',
        'Crucial para dimensionar a carga de energia, evitar apagões e garantir a segurança.',
        'zap'
    ),
    (
        'Bombeiro Civil',
        'bombeiro-civil',
        'Indispensável para a segurança, prevenção de incêndios e primeiros socorros imediatos.',
        'flame'
    ),
    (
        'Segurança / Vigilância',
        'seguranca-vigilancia',
        'Responsável pelo controle de acesso, ordem e integridade física dos participantes.',
        'shield-alert'
    ),
    (
        'Equipe de Limpeza',
        'equipe-de-limpeza',
        'Mantém a higiene de banheiros e áreas comuns durante e pós-evento.',
        'sparkles'
    ),
    (
        'Produtor de Eventos',
        'produtor-de-eventos',
        'O "maestro" que coordena todos os fornecedores, horários e resolve imprevistos.',
        'clapperboard'
    ),
    (
        'Técnico de Iluminação',
        'tecnico-de-iluminacao',
        'Define a visibilidade correta e cria a atmosfera/cenografia do ambiente.',
        'lightbulb'
    ),
    (
        'Recepcionistas / Staff',
        'recepcionistas-staff',
        'Realizam o credenciamento e orientam o fluxo de pessoas.',
        'users'
    ),
    (
        'Montadores de Estrutura',
        'montadores-de-estrutura',
        'Responsáveis pela montagem segura de palcos, tendas e cenografia pesada.',
        'hammer'
    ),
    (
        'Catering / Buffet',
        'catering-buffet',
        'Garçons e cozinheiros para o serviço de alimentos e bebidas.',
        'utensils'
    ) ON CONFLICT (name) DO NOTHING;

-- =====================================================================
-- PARTE 2: ADICIONAR FK EM PROFILES
-- =====================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS main_category_id uuid REFERENCES public.service_categories (id) ON DELETE SET NULL;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS whatsapp text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS instagram text;

CREATE INDEX IF NOT EXISTS idx_profiles_main_category_id ON public.profiles (main_category_id);

CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles (city);

CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles (state);

COMMENT ON COLUMN public.profiles.main_category_id IS 'Primary service category';

COMMENT ON COLUMN public.profiles.city IS 'City where operates';

COMMENT ON COLUMN public.profiles.state IS 'State/UF';

-- =====================================================================
-- PARTE 3: TABELA MANY-TO-MANY (ESPECIALIDADES)
-- =====================================================================

DROP TABLE IF EXISTS public.profile_specialties CASCADE;

CREATE TABLE public.profile_specialties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    category_id uuid NOT NULL REFERENCES public.service_categories (id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (profile_id, category_id)
);

COMMENT ON
TABLE public.profile_specialties IS 'Many-to-many: profiles can have multiple categories';

ALTER TABLE public.profile_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.profile_specialties FOR
SELECT USING (true);

CREATE POLICY "Allow users to manage specialties" ON public.profile_specialties FOR ALL USING (
    auth.role () = 'service_role'
    OR auth.role () = 'authenticated'
);

CREATE INDEX idx_profile_specialties_profile_id ON public.profile_specialties (profile_id);

CREATE INDEX idx_profile_specialties_category_id ON public.profile_specialties (category_id);

-- =====================================================================
-- PARTE 4: SEED PROFISSIONAIS (30 perfis)
-- =====================================================================

-- 1. Técnico de Som (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'AudioVisão Locações', 'Sonorização completa para grandes eventos corporativos com 15 anos de experiência.', 'São Paulo', 'SP', '11999887766', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-som';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Carlos Mendes - Som Profissional', 'Técnico especializado em casamentos e festas de médio porte.', 'Rio de Janeiro', 'RJ', '21987654321', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-som';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'SoundTech Brasil', 'Empresa de som e áudio para festivais e shows.', 'Belo Horizonte', 'MG', '31988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-som';

-- 2. Eletricista (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'EletroEventos SP', 'Dimensionamento de carga elétrica e instalações temporárias.', 'São Paulo', 'SP', '11977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'eletricista';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'João Almeida - Eletricista', 'Profissional com NR10 certificado.', 'Curitiba', 'PR', '41988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'eletricista';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Energia Total Eventos', 'Fornecimento de geradores. Atendimento 24h.', 'Brasília', 'DF', '61999887766', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'eletricista';

-- 3. Bombeiro Civil (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Brigada Eventos Seguros', 'Equipe de bombeiros civis certificados.', 'São Paulo', 'SP', '11966554433', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'bombeiro-civil';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Lucas Ferreira - Bombeiro', 'Primeiros socorros e prevenção. Certificação CBMSP.', 'Campinas', 'SP', '19988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'bombeiro-civil';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Proteção Total Eventos', 'Brigada de incêndio completa.', 'Rio de Janeiro', 'RJ', '21977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'bombeiro-civil';

-- 4. Segurança (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Segurança Prime Eventos', 'Controle de acesso e segurança patrimonial.', 'São Paulo', 'SP', '11955443322', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'seguranca-vigilancia';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Vigilância  & Eventos RJ', 'Especializada em eventos de grande porte.', 'Rio de Janeiro', 'RJ', '21966554433', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'seguranca-vigilancia';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Roberto Silva - Segurança', 'Experiência em shows e festivais.', 'Salvador', 'BA', '71988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'seguranca-vigilancia';

-- 5. Limpeza (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Clean Eventos SP', 'Limpeza durante e pós-evento.', 'São Paulo', 'SP', '11944332211', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'equipe-de-limpeza';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Higieniza Total', 'Manutenção de banheiros químicos.', 'Porto Alegre', 'RS', '51988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'equipe-de-limpeza';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Limpex Eventos', 'Limpeza express para eventos corporativos.', 'Fortaleza', 'CE', '85977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'equipe-de-limpeza';

-- 6. Produtor de Eventos (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Maria Oliveira - Produtora', 'Coordenação de casamentos e eventos corporativos.', 'São Paulo', 'SP', '11933221100', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'produtor-de-eventos';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Produtora Luxo & Estilo', 'Eventos de alto padrão.', 'Rio de Janeiro', 'RJ', '21955443322', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'produtor-de-eventos';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Felipe Costa - Producer', 'Especialista em festivais e shows.', 'Belo Horizonte', 'MG', '31966554433', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'produtor-de-eventos';

-- 7. Iluminação (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Light Design Eventos', 'Iluminação cênica e arquitetural.', 'São Paulo', 'SP', '11922110099', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-iluminacao';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'André Luz - Designer', 'Projetos personalizados de iluminação.', 'Curitiba', 'PR', '41977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-iluminacao';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Iluminart Eventos', 'Locação de equipamentos profissionais.', 'Recife', 'PE', '81988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-iluminacao';

-- 8. Staff (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Staff Prime Eventos', 'Recepcionistas bilíngues certificados.', 'São Paulo', 'SP', '11911009988', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'recepcionistas-staff';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Juliana Santos - Recepcionista', 'Atendimento profissional em eventos.', 'Brasília', 'DF', '61966554433', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'recepcionistas-staff';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Equipe VIP Eventos', 'Staff treinado para alto padrão.', 'Florianópolis', 'SC', '48988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'recepcionistas-staff';

-- 9. Montadores (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Estrutura Pro Eventos', 'Montagem de palcos e tendas. NR35 certificado.', 'São Paulo', 'SP', '11900998877', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'montadores-de-estrutura';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Pedro Monteiro - Montador', 'Cenografia e estruturas complexas.', 'Manaus', 'AM', '92988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'montadores-de-estrutura';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Monta Rápido Eventos', 'Montagem 24h disponível.', 'Goiânia', 'GO', '62977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'montadores-de-estrutura';

-- 10. Buffet (3)
INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Sabor & Eventos Buffet', 'Buffet completo para casamentos.', 'São Paulo', 'SP', '11999887700', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'catering-buffet';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Chef Gourmet Eventos', 'Alta gastronomia com sommelier.', 'Rio de Janeiro', 'RJ', '21988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'catering-buffet';

INSERT INTO
    public.profiles (
        name,
        description,
        city,
        state,
        whatsapp,
        main_category_id,
        is_claimed,
        source
    )
SELECT 'Garçons & Cia', 'Equipe de garçons treinados.', 'Vitória', 'ES', '27977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'catering-buffet';

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================

SELECT 'Categorias criadas:' as status, COUNT(*) as total
FROM public.service_categories
UNION ALL
SELECT 'Profissionais inseridos:', COUNT(*)
FROM public.profiles
WHERE
    source = 'seed-sql'
UNION ALL
SELECT 'Total profiles geral:', COUNT(*)
FROM public.profiles;