-- =====================================================================
-- COMPLIANCE DOCS - Guia de Documentação e Licenças
-- =====================================================================
-- Migração: Sistema de orientação sobre licenças necessárias para eventos
-- =====================================================================

BEGIN;

-- =====================================================================
-- ENUM: Scope (Abrangência)
-- =====================================================================

CREATE TYPE compliance_scope AS ENUM ('national', 'state', 'municipal');

-- =====================================================================
-- TABELA: compliance_docs
-- =====================================================================

CREATE TABLE IF NOT EXISTS compliance_docs (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Conteúdo
title TEXT NOT NULL,
description TEXT NOT NULL,
issuing_body TEXT NOT NULL, -- Órgão emissor: "ECAD", "Corpo de Bombeiros", "Prefeitura"
official_url TEXT, -- Link para o serviço oficial

-- Abrangência
scope compliance_scope NOT NULL,
region_filter TEXT, -- UF (SP, RJ) ou nome da cidade específica

-- Tags para busca
tags TEXT[] DEFAULT '{}', -- Ex: ['show', 'música', 'festa', 'comida', 'rua']

-- Criticidade
is_mandatory BOOLEAN DEFAULT true, -- Se é obrigatório ou apenas recomendado

-- Ordenação/Prioridade
sort_order INTEGER DEFAULT 0,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- ÍNDICES
-- =====================================================================

CREATE INDEX idx_compliance_scope ON compliance_docs (scope);

CREATE INDEX idx_compliance_region ON compliance_docs (region_filter)
WHERE
    region_filter IS NOT NULL;

CREATE INDEX idx_compliance_tags ON compliance_docs USING gin (tags);

CREATE INDEX idx_compliance_mandatory ON compliance_docs (is_mandatory)
WHERE
    is_mandatory = true;

CREATE INDEX idx_compliance_sort ON compliance_docs (sort_order, title);

COMMENT ON
TABLE compliance_docs IS 'Guia de documentação e licenças necessárias para eventos';

COMMENT ON COLUMN compliance_docs.scope IS 'Abrangência: nacional, estadual ou municipal';

COMMENT ON COLUMN compliance_docs.region_filter IS 'Filtro regional (UF ou cidade específica)';

-- =====================================================================
-- TRIGGER: Auto-update
-- =====================================================================

CREATE TRIGGER compliance_docs_updated_at
    BEFORE UPDATE ON compliance_docs
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE compliance_docs ENABLE ROW LEVEL SECURITY;

-- Leitura: PÚBLICA
CREATE POLICY "Qualquer um pode visualizar compliance docs" ON compliance_docs FOR
SELECT USING (true);

-- Escrita: Apenas admins
CREATE POLICY "Apenas admins podem gerenciar compliance docs" ON compliance_docs FOR ALL USING (
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE
            id = auth.uid ()
            AND raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- =====================================================================
-- FUNÇÕES UTILITÁRIAS
-- =====================================================================

-- Buscar documentos por evento/tags
CREATE OR REPLACE FUNCTION search_compliance_docs(
    search_tags TEXT[] DEFAULT NULL,
    search_term TEXT DEFAULT NULL,
    target_scope compliance_scope DEFAULT NULL,
    target_region TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    issuing_body TEXT,
    official_url TEXT,
    scope compliance_scope,
    is_mandatory BOOLEAN,
    tags TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd.id,
        cd.title,
        cd.description,
        cd.issuing_body,
        cd.official_url,
        cd.scope,
        cd.is_mandatory,
        cd.tags
    FROM compliance_docs cd
    WHERE 
        -- Filtro por tags (se o doc contém alguma das tags buscadas)
        (search_tags IS NULL OR cd.tags && search_tags)
        -- Busca textual no título ou descrição
        AND (search_term IS NULL OR 
             cd.title ILIKE '%' || search_term || '%' OR
             cd.description ILIKE '%' || search_term || '%')
        -- Filtro por abrangência
        AND (target_scope IS NULL OR cd.scope = target_scope)
        -- Filtro por região
        AND (target_region IS NULL OR
             cd.region_filter IS NULL OR
             cd.region_filter = target_region)
    ORDER BY 
        cd.is_mandatory DESC,
        cd.sort_order ASC,
        cd.title ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMIT;

-- =====================================================================
-- SEED DATA - Documentos Essenciais para Eventos no Brasil
-- =====================================================================

BEGIN;

INSERT INTO
    compliance_docs (
        title,
        description,
        issuing_body,
        official_url,
        scope,
        region_filter,
        tags,
        is_mandatory,
        sort_order
    )
VALUES

-- 1. ECAD (Nacional)
(
    'ECAD - Direitos Autorais Musicais',
    'Toda vez que você tocar música em um evento (ao vivo ou gravada), é obrigatório pagar os direitos autorais ao ECAD. Isso vale para shows, festas, casamentos, eventos corporativos, etc. O valor varia conforme o tipo e tamanho do evento.',
    'ECAD (Escritório Central de Arrecadação e Distribuição)',
    'https://www.ecad.org.br/',
    'national',
    NULL,
    ARRAY['show', 'música', 'festa', 'casamento', 'corporativo', 'palco'],
    true,
    1
),

-- 2. AVCB (Estadual - Exemplo genérico)
(
    'AVCB - Auto de Vistoria do Corpo de Bombeiros',
    'Documento que atesta que o local do evento cumpre as normas de segurança contra incêndio e pânico. Obrigatório para espaços fechados e eventos com grande público. A vistoria é feita pelo Corpo de Bombeiros do estado.',
    'Corpo de Bombeiros Militar',
    'https://www.policiamilitar.sp.gov.br/ccb/',
    'state',
    'SP',
    ARRAY['show', 'festa', 'corporativo', 'espaço fechado', 'palco'],
    true,
    2
),

-- 3. Alvará de Funcionamento Temporário (Municipal)
(
    'Alvará de Funcionamento Temporário',
    'Autorização da prefeitura para realizar eventos em locais públicos ou privados por período determinado. Necessário solicitar com antecedência (geralmente 30-60 dias). Cada cidade tem suas próprias exigências.',
    'Prefeitura Municipal',
    'https://www.prefeitura.sp.gov.br/',
    'municipal',
    NULL,
    ARRAY['festa', 'rua', 'praça', 'público', 'feira', 'festival'],
    true,
    3
),

-- 4. Alvará Sanitário (Municipal)
(
    'Alvará Sanitário / Licença para Manipulação de Alimentos',
    'Obrigatório para eventos que servem comida e bebida. A vigilância sanitária inspeciona as condições de higiene, armazenamento e preparo dos alimentos. Pode ser solicitado para food trucks, barracas, buffets, etc.',
    'Vigilância Sanitária Municipal',
    'https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/vigilancia_em_saude/',
    'municipal',
    NULL,
    ARRAY['comida', 'bebida', 'buffet', 'food truck', 'festa', 'feira', 'gastronomia'],
    true,
    4
),

-- 5. PPCI (Estadual - RS exemplo)
(
    'PPCI - Plano de Prevenção e Proteção Contra Incêndio',
    'Similar ao AVCB, mas específico do Rio Grande do Sul. Documento técnico que define medidas de segurança contra incêndio para edificações e eventos.',
    'Corpo de Bombeiros Militar - RS',
    'https://www.cbm.rs.gov.br/',
    'state',
    'RS',
    ARRAY['show', 'festa', 'espaço fechado'],
    true,
    5
),

-- 6. Autorização de Som (Municipal)
(
    'Autorização de Som / Controle de Ruído',
    'Necessário para eventos com som amplificado, especialmente em áreas residenciais. Define horários permitidos e níveis de decibéis. Evita multas por perturbação do sossego.',
    'Prefeitura Municipal',
    NULL,
    'municipal',
    NULL,
    ARRAY['show', 'música', 'palco', 'rua', 'festa'],
    true,
    6
),

-- 7. Seguro de Responsabilidade Civil (Recomendado)
(
    'Seguro de Responsabilidade Civil para Eventos',
    'Não é obrigatório por lei, mas ALTAMENTE recomendado. Cobre danos a terceiros, acidentes, cancelamentos e imprevistos. Muitos espaços exigem como condição para locação.',
    'Seguradoras Privadas',
    'https://www.susep.gov.br/',
    'national',
    NULL,
    ARRAY['show', 'festa', 'corporativo', 'casamento', 'esporte'],
    false,
    7
),

-- 8. Taxa de Fiscalização de Eventos (Municipal - SP)
(
    'TFE - Taxa de Fiscalização de Eventos',
    'Taxa cobrada pela prefeitura de São Paulo para eventos de médio e grande porte. O valor varia conforme o número de participantes e tipo de evento.',
    'Prefeitura de São Paulo',
    'https://www.prefeitura.sp.gov.br/',
    'municipal',
    'São Paulo',
    ARRAY['show', 'festa', 'corporativo', 'grande porte'],
    true,
    8
),

-- 9. Alvará da Polícia Civil (Alguns Estados)
(
    'Alvará da Polícia Civil',
    'Em alguns estados, é necessário comunicar a polícia sobre realização de eventos, especialmente shows e festas com aglomeração. Serve para garantir segurança pública.',
    'Polícia Civil',
    NULL,
    'state',
    NULL,
    ARRAY['show', 'festa', 'grande porte', 'público'],
    false,
    9
),

-- 10. Licença Ambiental (Eventos ao ar livre)

(
    'Licença Ambiental',
    'Necessária para eventos em áreas de preservação, parques, praias ou que possam causar impacto ambiental. Avalia barulho, geração de resíduos, proteção de fauna/flora.',
    'Órgão Ambiental (CETESB, INEA, etc)',
    'https://cetesb.sp.gov.br/',
    'state',
    NULL,
    ARRAY['festival', 'parque', 'praia', 'natureza', 'ao ar livre'],
    false,
    10
)

ON CONFLICT DO NOTHING;

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Buscar documentos para um show com música:
-- SELECT * FROM search_compliance_docs(
--     ARRAY['show', 'música'],
--     NULL, NULL, NULL
-- );

-- Buscar documentos municipais:
-- SELECT * FROM search_compliance_docs(
--     NULL, NULL, 'municipal', NULL
-- );

-- Buscar por termo:
-- SELECT * FROM search_compliance_docs(
--     NULL, 'ECAD', NULL, NULL
-- );

-- Buscar para evento em SP:
-- SELECT * FROM search_compliance_docs(
--     ARRAY['festa'], NULL, NULL, 'SP'
-- );