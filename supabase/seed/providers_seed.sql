-- =====================================================================
-- PROVIDERS - Seed Data para Testes de UI
-- =====================================================================
-- Dados variados para demonstrar os diferentes estados do ProviderCard
-- =====================================================================

BEGIN;

-- Limpar dados de teste anteriores (se existirem)
DELETE FROM providers
WHERE
    name IN (
        'Canapev Segurança VIP',
        'João Eletricista',
        'Buffet Delícia',
        'Ana Fotografia Pro'
    );

-- =====================================================================
-- PERFIL 1: "Premium" - Completo e Verificado
-- =====================================================================

INSERT INTO
    providers (
        name,
        category,
        city,
        state,
        description,
        contact_info,
        is_verified,
        avatar_url
    )
VALUES (
        'Canapev Segurança VIP',
        'Segurança',
        'São Paulo',
        'SP',
        'Empresa especializada em segurança para eventos de grande porte. Equipe treinada, equipamentos de ponta e mais de 15 anos de experiência no mercado.',
        jsonb_build_object (
            'whatsapp',
            '+5511999999999',
            'instagram',
            'https://instagram.com/canapev',
            'website',
            'https://www.canapev.com.br',
            'email',
            'contato@canapev.com.br'
        ),
        true, -- Verificado
        'https://ui-avatars.com/api/?name=Canapev&background=4F46E5&color=fff&size=200'
    );

-- =====================================================================
-- PERFIL 2: "Básico" - Apenas WhatsApp
-- =====================================================================

INSERT INTO
    providers (
        name,
        category,
        city,
        state,
        description,
        contact_info,
        is_verified,
        avatar_url
    )
VALUES (
        'João Eletricista',
        'Sonorização',
        'Rio de Janeiro',
        'RJ',
        'Eletricista profissional com experiência em instalações para eventos. Trabalho rápido e com garantia.',
        jsonb_build_object ('whatsapp', '+5521988888888'),
        false,
        NULL -- Sem avatar (vai mostrar iniciais)
    );

-- =====================================================================
-- PERFIL 3: "Fantasma" (Estilo ABRAPE) - Apenas Nome e Localização
-- =====================================================================

INSERT INTO
    providers (
        name,
        category,
        city,
        state,
        description,
        contact_info,
        is_verified,
        avatar_url
    )
VALUES (
        'Buffet Delícia',
        'Buffet',
        'Belo Horizonte',
        'MG',
        NULL, -- Sem descrição
        '{}', -- Sem contatos
        false,
        NULL
    );

-- =====================================================================
-- PERFIL 4: "Médio" - Instagram + Descrição
-- =====================================================================

INSERT INTO
    providers (
        name,
        category,
        city,
        state,
        description,
        contact_info,
        is_verified,
        avatar_url
    )
VALUES (
        'Ana Fotografia Pro',
        'Foto/Vídeo',
        'Curitiba',
        'PR',
        'Fotógrafa especializada em eventos corporativos e sociais. Portfolio disponível no Instagram.',
        jsonb_build_object ('instagram', '@anafotopro'),
        true, -- Verificado
        'https://ui-avatars.com/api/?name=Ana+F&background=EC4899&color=fff&size=200'
    );

COMMIT;

-- =====================================================================
-- VERIFICAÇÃO
-- =====================================================================

-- Ver todos os providers de teste:
-- SELECT
--     name,
--     category,
--     city,
--     is_verified,
--     contact_info,
--     CASE
--         WHEN contact_info = '{}' THEN 'Fantasma'
--         WHEN jsonb_object_keys(contact_info) @> ARRAY['website'] THEN 'Premium'
--         ELSE 'Básico'
--     END as perfil_tipo
-- FROM providers
-- WHERE name IN (
--     'Canapev Segurança VIP',
--     'João Eletricista',
--     'Buffet Delícia',
--     'Ana Fotografia Pro'
-- );