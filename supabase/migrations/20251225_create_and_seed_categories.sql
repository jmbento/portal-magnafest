-- =====================================================================
-- MIGRATION: Create and Seed Service Categories
-- Created: 2025-12-25
-- Description: Service taxonomy for platform with pre-populated categories
-- =====================================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.service_categories CASCADE;

-- Create service_categories table
CREATE TABLE public.service_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text NOT NULL,
    icon_key text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Add table comment
COMMENT ON
TABLE public.service_categories IS 'Service/professional categories available on the platform';

-- Enable Row Level Security
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access
CREATE POLICY "Allow public read access" ON public.service_categories FOR
SELECT USING (true);

-- Policy: Admin insert/update only
CREATE POLICY "Allow admin insert/update" ON public.service_categories FOR ALL USING (auth.role () = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_service_categories_slug ON public.service_categories (slug);

CREATE INDEX idx_service_categories_name ON public.service_categories (name);

-- =====================================================================
-- SEED DATA
-- =====================================================================

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
-- VERIFICATION
-- =====================================================================

-- Verify categories were inserted
SELECT
    COUNT(*) as total_categories,
    array_agg (
        name
        ORDER BY name
    ) as category_names
FROM public.service_categories;

-- Expected result: 10 categories