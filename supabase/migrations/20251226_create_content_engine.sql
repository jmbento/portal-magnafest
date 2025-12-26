-- =====================================================================
-- CONTENT ENGINE - Blog & Interview System
-- =====================================================================
-- Data: 2025-12-26
-- Objetivo: Sistema completo de blog com geração automática e entrevistas
-- =====================================================================

-- =====================================================================
-- 1. TABELA POSTS (Blog Articles)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Conteúdo
title TEXT NOT NULL,
slug TEXT NOT NULL UNIQUE,
content TEXT NOT NULL, -- Markdown ou HTML
excerpt TEXT, -- Resumo/Descrição curta
cover_image_url TEXT, -- URL da imagem de capa

-- Metadados
category TEXT NOT NULL DEFAULT 'Geral',
  tags TEXT[] DEFAULT '{}', -- Array de tags

-- Autoria
author_type TEXT NOT NULL DEFAULT 'bot' CHECK (
    author_type IN ('bot', 'human', 'interviewee')
),
author_id UUID REFERENCES auth.users (id) ON DELETE SET NULL, -- Apenas se author_type = 'human'
author_name TEXT, -- Nome do autor (para display)

-- Publicação
status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
        'draft',
        'published',
        'archived'
    )
),
published_at TIMESTAMPTZ,

-- Métricas (Opcional)
views_count INTEGER DEFAULT 0, likes_count INTEGER DEFAULT 0,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts (slug);

CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts (status);

CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts (published_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts (category);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();

-- =====================================================================
-- 2. TABELA INTERVIEWS (Sistema de Entrevistas)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relacionamento com Perfil
profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,

-- Status do Fluxo
status TEXT NOT NULL DEFAULT 'invited' CHECK (
    status IN (
        'invited',
        'answered',
        'approved',
        'rejected',
        'published'
    )
),

-- Dados da Entrevista
questions_json JSONB NOT NULL, -- Perguntas enviadas
answers_json JSONB, -- Respostas do entrevistado
photos_json JSONB, -- URLs das fotos enviadas

-- Metadados da Entrevista
interview_type TEXT DEFAULT 'standard', -- Tipo de entrevista (standard, expert, etc)
topic TEXT, -- Tópico principal (ex: "Equipamentos de Som")

-- Post Gerado
generated_post_id UUID REFERENCES public.posts (id) ON DELETE SET NULL,

-- Comunicação
invitation_sent_at TIMESTAMPTZ DEFAULT NOW(),
answered_at TIMESTAMPTZ,
approved_at TIMESTAMPTZ,
published_at TIMESTAMPTZ,

-- Notas internas (Admin)
admin_notes TEXT,

-- Timestamps
created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_interviews_profile_id ON public.interviews (profile_id);

CREATE INDEX IF NOT EXISTS idx_interviews_status ON public.interviews (status);

CREATE INDEX IF NOT EXISTS idx_interviews_created_at ON public.interviews (created_at DESC);

-- Trigger para updated_at
CREATE TRIGGER interviews_updated_at
BEFORE UPDATE ON public.interviews
FOR EACH ROW
EXECUTE FUNCTION update_posts_updated_at();
-- Reutiliza a função

-- =====================================================================
-- 3. TABELA COMPLEMENTAR: Post Views (Analytics)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    post_id UUID NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL, -- Anônimo se NULL
    ip_address INET, -- IP para analytics
    user_agent TEXT, -- Navegador/Device
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_views_post_id ON public.post_views (post_id);

CREATE INDEX IF NOT EXISTS idx_post_views_viewed_at ON public.post_views (viewed_at DESC);

-- =====================================================================
-- 4. FUNCTIONS ÚTEIS
-- =====================================================================

-- Função para incrementar views
CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET views_count = views_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_post_slug(post_title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Converte título em slug
  base_slug := lower(regexp_replace(
    regexp_replace(
      regexp_replace(post_title, '[áàãâä]', 'a', 'g'),
      '[éèêë]', 'e', 'g'
    ),
    '[^a-z0-9]+', '-', 'g'
  ));
  
  -- Remove hífens duplicados e das pontas
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Verifica unicidade
  WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Habilitar RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- POLICIES - POSTS
-- =====================================================================

-- Leitura pública de posts publicados
DROP POLICY IF EXISTS posts_public_read ON public.posts;

CREATE POLICY posts_public_read ON public.posts FOR
SELECT USING (status = 'published');

-- Service Role pode tudo (Bot de Conteúdo)
DROP POLICY IF EXISTS posts_service_role_all ON public.posts;

CREATE POLICY posts_service_role_all ON public.posts FOR ALL USING (
    auth.jwt () ->> 'role' = 'service_role'
);

-- Admins podem tudo
DROP POLICY IF EXISTS posts_admin_all ON public.posts;

CREATE POLICY posts_admin_all ON public.posts FOR ALL USING (
    auth.uid () IN (
        SELECT id
        FROM auth.users
        WHERE
            raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- Autores humanos podem ver e editar seus próprios posts
DROP POLICY IF EXISTS posts_author_manage ON public.posts;

CREATE POLICY posts_author_manage ON public.posts FOR ALL USING (author_id = auth.uid ());

-- =====================================================================
-- POLICIES - INTERVIEWS
-- =====================================================================

-- Service Role pode tudo (Sistema de Entrevistas)
DROP POLICY IF EXISTS interviews_service_role_all ON public.interviews;

CREATE POLICY interviews_service_role_all ON public.interviews FOR ALL USING (
    auth.jwt () ->> 'role' = 'service_role'
);

-- Admins podem tudo
DROP POLICY IF EXISTS interviews_admin_all ON public.interviews;

CREATE POLICY interviews_admin_all ON public.interviews FOR ALL USING (
    auth.uid () IN (
        SELECT id
        FROM auth.users
        WHERE
            raw_user_meta_data ->> 'role' = 'admin'
    )
);

-- Dono do perfil pode ver e responder sua própria entrevista
DROP POLICY IF EXISTS interviews_owner_access ON public.interviews;

CREATE POLICY interviews_owner_access ON public.interviews FOR ALL USING (
    profile_id IN (
        SELECT id
        FROM public.profiles
        WHERE
            user_id = auth.uid ()
    )
);

-- =====================================================================
-- POLICIES - POST VIEWS (Analytics)
-- =====================================================================

-- Qualquer pessoa pode registrar visualização (INSERT apenas)
DROP POLICY IF EXISTS post_views_insert_public ON public.post_views;

CREATE POLICY post_views_insert_public ON public.post_views FOR
INSERT
WITH
    CHECK (true);

-- Apenas admins podem ler analytics
DROP POLICY IF EXISTS post_views_admin_read ON public.post_views;

CREATE POLICY post_views_admin_read ON public.post_views FOR
SELECT USING (
        auth.uid () IN (
            SELECT id
            FROM auth.users
            WHERE
                raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- =====================================================================
-- 6. SEED INICIAL (Posts de Exemplo)
-- =====================================================================

-- Post de Boas-Vindas (Gerado pelo Bot)
INSERT INTO public.posts (
  title,
  slug,
  content,
  excerpt,
  cover_image_url,
  category,
  tags,
  author_type,
  author_name,
  status,
  published_at
) VALUES (
  'Bem-vindo ao Blog do Portal MagnaFest!',
  'bem-vindo-ao-blog-magnafest',
  E'# Bem-vindo ao Portal MagnaFest!\n\nEste é o hub central de conhecimento para profissionais do mercado de eventos.\n\n## Nossa Missão\n\nConectar profissionais qualificados com organizadores de eventos, oferecendo conteúdo de qualidade, insights do mercado e melhores práticas da indústria.\n\n## O que você vai encontrar aqui:\n\n- **Dicas Técnicas**: Tutoriais e guias práticos\n- **Entrevistas**: Conversas com profissionais experientes\n- **Tendências**: Novidades do mercado de eventos\n- **Regulamentação**: Guias sobre legislação e compliance\n\nFique ligado para mais conteúdo!',
  'Hub central de conhecimento para profissionais do mercado de eventos. Conectando talentos com oportunidades.',
  'https://source.unsplash.com/1600x900/?concert,festival,stage',
  'Geral',
  ARRAY['bem-vindo', 'portal', 'eventos'],
  'bot',
  'MagnaFest AI',
  'published',
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- =====================================================================
-- VERIFICAÇÃO FINAL
-- =====================================================================

DO $$ BEGIN RAISE NOTICE '✅ Content Engine criado com sucesso!';

RAISE NOTICE '📝 Tabelas: posts, interviews, post_views';

RAISE NOTICE '🔒 RLS ativado e policies configuradas';

RAISE NOTICE '🤖 Sistema pronto para Blog Automático e Entrevistas!';

END $$;