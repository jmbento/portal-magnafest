-- =====================================================================
-- SEED: Popular Banco com Profissionais de Teste
-- =====================================================================
-- Execute DEPOIS de criar as categorias
-- Este script insere 30 profissionais realistas distribuídos em 10 categorias
-- =====================================================================

-- Inserir profissionais por categoria
-- Usamos subquery para pegar o ID da categoria pelo slug

-- =====================================================================
-- 1. TÉCNICO DE SOM (3 profissionais)
-- =====================================================================

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
SELECT 'Carlos Mendes - Som Profissional', 'Técnico especializado em casamentos e festas de médio porte. Equipamentos de ponta.', 'Rio de Janeiro', 'RJ', '21987654321', id, false, 'seed-sql'
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
SELECT 'SoundTech Brasil', 'Empresa de som e áudio para festivais e shows. Equipe técnica certificada.', 'Belo Horizonte', 'MG', '31988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'tecnico-de-som';

-- =====================================================================
-- 2. ELETRICISTA (3 profissionais)
-- =====================================================================

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
SELECT 'EletroEventos SP', 'Dimensionamento de carga elétrica e instalações temporárias para eventos de todos os portes.', 'São Paulo', 'SP', '11977665544', id, false, 'seed-sql'
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
SELECT 'João Almeida - Eletricista Certificado', 'Profissional com NR10 e experiência em montagem de estruturas elétricas para eventos.', 'Curitiba', 'PR', '41988776655', id, false, 'seed-sql'
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
SELECT 'Energia Total Eventos', 'Fornecimento de geradores e infraestrutura elétrica completa. Atendimento 24h.', 'Brasília', 'DF', '61999887766', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'eletricista';

-- =====================================================================
-- 3. BOMBEIRO CIVIL (3 profissionais)
-- =====================================================================

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
SELECT 'Brigada Eventos Seguros', 'Equipe de bombeiros civis certificados para prevenção e combate a incêndios em eventos.', 'São Paulo', 'SP', '11966554433', id, false, 'seed-sql'
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
SELECT 'Lucas Ferreira - Bombeiro Civil', 'Atendimento a primeiros socorros e prevenção de acidentes. Certificação CBMSP.', 'Campinas', 'SP', '19988776655', id, false, 'seed-sql'
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
SELECT 'Proteção Total Eventos', 'Serviço completo de brigada de incêndio e plano de emergência para grandes eventos.', 'Rio de Janeiro', 'RJ', '21977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'bombeiro-civil';

-- =====================================================================
-- 4. SEGURANÇA / VIGILÂNCIA (3 profissionais)
-- =====================================================================

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
SELECT 'Segurança Prime Eventos', 'Equipe treinada para controle de acesso e segurança patrimonial em eventos corporativos.', 'São Paulo', 'SP', '11955443322', id, false, 'seed-sql'
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
SELECT 'Vigilância & Eventos RJ', 'Segurança especializada em casamentos, festas e eventos de grande porte.', 'Rio de Janeiro', 'RJ', '21966554433', id, false, 'seed-sql'
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
SELECT 'Roberto Silva - Segurança Profissional', 'Vigilante certificado com experiência em shows e festivais. Atendimento individual.', 'Salvador', 'BA', '71988776655', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'seguranca-vigilancia';

-- =====================================================================
-- 5. EQUIPE DE LIMPEZA (3 profissionais)
-- =====================================================================

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
SELECT 'Clean Eventos SP', 'Limpeza durante e pós-evento. Equipe especializada em grandes volumes.', 'São Paulo', 'SP', '11944332211', id, false, 'seed-sql'
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
SELECT 'Higieniza Total', 'Manutenção de banheiros químicos e áreas comuns durante o evento. Monitoramento contínuo.', 'Porto Alegre', 'RS', '51988776655', id, false, 'seed-sql'
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
SELECT 'Limpex Eventos', 'Serviço de limpeza express para eventos corporativos e casamentos.', 'Fortaleza', 'CE', '85977665544', id, false, 'seed-sql'
FROM public.service_categories
WHERE
    slug = 'equipe-de-limpeza';

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================

-- Ver total de profissionais inseridos
SELECT
    COUNT(*) as total_profissionais,
    COUNT(*) FILTER (
        WHERE
            source = 'seed-sql'
    ) as via_seed_sql
FROM public.profiles;

-- Ver distribuição por categoria
SELECT
    sc.name as categoria,
    COUNT(p.id) as total_profissionais
FROM public.service_categories sc
    LEFT JOIN public.profiles p ON p.main_category_id = sc.id
GROUP BY
    sc.name
ORDER BY total_profissionais DESC;