-- =====================================================================
-- SEED DATA - Eventos de Teste
-- =====================================================================
-- Script para popular o banco de dados com eventos realistas
-- UUID do organizador já configurado!
-- =====================================================================

DO $$
DECLARE
    user_id UUID := '6443ae57-e411-4c6c-a10c-20806bf6fc08';
    
    -- Gerar IDs fixos para os eventos
    evento1_id UUID := gen_random_uuid();
    evento2_id UUID := gen_random_uuid();
    evento3_id UUID := gen_random_uuid();
BEGIN

-- =====================================================================
-- EVENTO 1: Rock in Rio 2025
-- =====================================================================

INSERT INTO public.events (
    id,
    slug,
    organizer_id,
    title,
    short_description,
    full_content,
    cover_image_url,
    starts_at,
    ends_at,
    format,
    status,
    location_data,
    metadata
) VALUES (
    evento1_id,
    'rock-in-rio-2025',
    user_id,
    'Rock in Rio 2025',
    'O maior festival de música do mundo retorna ao Brasil com lineup internacional incrível!',
    E'O Rock in Rio 2025 promete ser uma das edições mais memoráveis do festival.\n\n🎸 LINEUP CONFIRMADO:\n• Foo Fighters\n• Imagine Dragons\n• Coldplay\n• Iron Maiden\n• Post Malone\n\n📅 PROGRAMAÇÃO:\nSete dias de shows com os maiores artistas nacionais e internacionais.\n\n🎫 INGRESSOS:\nVendas online pelo site oficial.',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200',
    '2025-09-15T14:00:00Z',
    '2025-09-22T04:00:00Z',
    'in_person',
    'published',
    jsonb_build_object(
        'address', 'Cidade do Rock',
        'city', 'Rio de Janeiro',
        'state', 'RJ',
        'coordinates', jsonb_build_object('lat', -22.9068, 'lng', -43.1729)
    ),
    jsonb_build_object(
        'capacity', 100000,
        'age_rating', '16+',
        'hashtags', jsonb_build_array('#RockInRio', '#RIR2025')
    )
) ON CONFLICT (slug) DO NOTHING;

-- Tickets Rock in Rio
INSERT INTO public.tickets (event_id, name, price, currency, quantity_total, quantity_sold, active, sort_order)
VALUES 
    (evento1_id, 'Pista', 350.00, 'BRL', 50000, 15000, true, 1),
    (evento1_id, 'Pista Premium', 550.00, 'BRL', 10000, 3000, true, 2),
    (evento1_id, 'Camarote', 1200.00, 'BRL', 5000, 2000, true, 3)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- EVENTO 2: Webinar React 19
-- =====================================================================

INSERT INTO public.events (
    id,
    slug,
    organizer_id,
    title,
    short_description,
    full_content,
    cover_image_url,
    starts_at,
    ends_at,
    format,
    status,
    location_data,
    metadata
) VALUES (
    evento2_id,
    'webinar-react-19',
    user_id,
    'Webinar: React 19 - Novidades e Melhores Práticas',
    'Aprenda sobre as novidades do React 19 com experts da comunidade brasileira',
    E'Participe do maior webinar sobre React 19 do Brasil!\n\n✨ O QUE VOCÊ VAI APRENDER:\n• React Compiler\n• Actions e Transitions\n• Server Components\n• Suspense',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200',
    '2025-01-10T19:00:00Z',
    '2025-01-10T21:00:00Z',
    'online',
    'published',
    jsonb_build_object(
        'streaming_url', 'https://zoom.us/meeting/react19',
        'platform', 'Zoom'
    ),
    jsonb_build_object(
        'capacity', 1000,
        'age_rating', 'Livre',
        'hashtags', jsonb_build_array('#React19', '#WebinarGratuito')
    )
) ON CONFLICT (slug) DO NOTHING;

-- Ticket Webinar
INSERT INTO public.tickets (event_id, name, price, currency, quantity_total, quantity_sold, active, sort_order)
VALUES 
    (evento2_id, 'Ingresso Gratuito', 0.00, 'BRL', 1000, 550, true, 1)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- EVENTO 3: Conferência Tech Brasil
-- =====================================================================

INSERT INTO public.events (
    id,
    slug,
    organizer_id,
    title,
    short_description,
    full_content,
    cover_image_url,
    starts_at,
    ends_at,
    format,
    status,
    location_data,
    metadata
) VALUES (
    evento3_id,
    'conf-tech-brasil-2025',
    user_id,
    'Conferência Tech Brasil 2025',
    'O maior encontro de tecnologia e inovação do Brasil',
    E'Conferência com os principais nomes da tecnologia.\n\n🎯 TRILHAS:\n• IA e Machine Learning\n• Cloud & DevOps\n• Frontend & Mobile',
    null,
    '2025-03-20T09:00:00Z',
    '2025-03-22T18:00:00Z',
    'hybrid',
    'draft',
    jsonb_build_object(
        'address', 'Centro de Convenções Frei Caneca',
        'city', 'São Paulo',
        'state', 'SP',
        'streaming_url', 'https://youtube.com/live/techbrasil'
    ),
    jsonb_build_object(
        'capacity', 5000,
        'age_rating', '18+',
        'hashtags', jsonb_build_array('#TechBrasil', '#ConfTech2025')
    )
) ON CONFLICT (slug) DO NOTHING;

-- Tickets Conferência
INSERT INTO public.tickets (event_id, name, price, currency, quantity_total, active, sort_order)
VALUES 
    (evento3_id, 'Individual - Online', 197.00, 'BRL', 2000, true, 1),
    (evento3_id, 'Individual - Presencial', 497.00, 'BRL', 3000, true, 2),
    (evento3_id, 'Empresarial (5 pessoas)', 1997.00, 'BRL', 200, true, 3)
ON CONFLICT DO NOTHING;

END $$;

-- =====================================================================
-- VERIFICAÇÃO
-- =====================================================================
SELECT
    id,
    slug,
    title,
    status,
    format,
    starts_at
FROM public.events
ORDER BY starts_at;