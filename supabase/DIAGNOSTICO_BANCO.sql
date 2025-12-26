-- =====================================================================
-- DIAGNÓSTICO DO BANCO DE DADOS
-- =====================================================================
-- Execute para ver o que realmente existe no seu Supabase
-- =====================================================================

-- 1. Listar TODAS as tabelas públicas
SELECT table_name, (
        SELECT COUNT(*)
        FROM information_schema.columns
        WHERE
            table_name = t.table_name
    ) as num_columns
FROM information_schema.tables t
WHERE
    table_schema = 'public'
ORDER BY table_name;

-- 2. Se tiver tabela de anúncios/classifica dos, qual é o nome?
-- Possíveis nomes: listings, ads, classifieds, announcements, posts_marketplace

-- 3. Listar colunas de cada tabela encontrada
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE
    table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- =====================================================================
-- RESULTADO: Cole aqui o que apareceu
-- =====================================================================