-- =====================================================================
-- BLOG - Sistema de Posts/Artigos
-- =====================================================================
-- Migração: Criação de tabela de posts para blog SEO-friendly
-- =====================================================================

BEGIN;

-- =====================================================================
-- TABELA: posts
-- =====================================================================

CREATE TABLE IF NOT EXISTS posts (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,

-- Conteúdo
title TEXT NOT NULL,
excerpt TEXT, -- Resumo para cards
content TEXT NOT NULL, -- Markdown completo
cover_image_url TEXT,

-- Autor
author_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,

-- Categorização
category TEXT, tags TEXT[] DEFAULT '{}',

-- Publicação
published_at TIMESTAMPTZ, -- NULL = rascunho

-- SEO
meta_description TEXT,

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- ÍNDICES
-- =====================================================================

CREATE INDEX idx_posts_slug ON posts (slug);

CREATE INDEX idx_posts_category ON posts (category);

CREATE INDEX idx_posts_tags ON posts USING gin (tags);

CREATE INDEX idx_posts_published ON posts (published_at DESC)
WHERE
    published_at IS NOT NULL;

CREATE INDEX idx_posts_author ON posts (author_id);

COMMENT ON
TABLE posts IS 'Posts/Artigos do blog para SEO e conteúdo';

COMMENT ON COLUMN posts.published_at IS 'Data de publicação (NULL = rascunho)';

-- =====================================================================
-- TRIGGER: Auto-update
-- =====================================================================

CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Leitura: Apenas posts publicados são públicos
CREATE POLICY "Qualquer um pode visualizar posts publicados" ON posts FOR
SELECT USING (published_at IS NOT NULL);

-- Autor vê seus próprios rascunhos
CREATE POLICY "Autor pode visualizar próprios rascunhos" ON posts FOR
SELECT USING (author_id = auth.uid ());

-- Escrita: Apenas autores autenticados
CREATE POLICY "Autores podem criar posts" ON posts FOR
INSERT
WITH
    CHECK (auth.uid()::uuid = author_id);

-- Atualização: Apenas o autor
CREATE POLICY "Autor pode atualizar próprio post" ON posts FOR
    UPDATE USING (auth.uid()::uuid = author_id);

-- Exclusão: Apenas o autor
CREATE POLICY "Autor pode deletar próprio post" ON posts FOR DELETE USING (auth.uid()::uuid = author_id);

COMMIT;

-- =====================================================================
-- SEED DATA - Posts de Exemplo
-- =====================================================================

BEGIN;

-- Usar um UUID de exemplo para autor (substitua pelo UUID real se necessário)
DO $$
DECLARE
    exemplo_author_id UUID := '6443ae57-e411-4c6c-a10c-20806bf6fc08';
BEGIN

-- =====================================================================
-- POST 1: Drones para Eventos
-- =====================================================================

INSERT INTO posts (
    slug,
    title,
    excerpt,
    content,
    cover_image_url,
    author_id,
    category,
    tags,
    published_at,
    meta_description
) VALUES (
    '5-drones-essenciais-filmagem-eventos-2025',
    '5 Drones Essenciais para Filmagem de Eventos em 2025',
    'Descubra os melhores drones profissionais para capturar imagens aéreas incríveis em eventos. Guia completo com comparações e reviews.',
    E'# 5 Drones Essenciais para Filmagem de Eventos em 2025

A filmagem aérea está revolucionando a cobertura de eventos. Veja os 5 melhores drones profissionais do mercado:

## 1. DJI Mavic 3 Pro

O **Mavic 3 Pro** é o queridinho dos profissionais. Com câmera Hasselblad e sensor de 4/3", captura imagens cinematográficas mesmo em baixa luz.

**Prós:**
- Autonomia de 46 minutos
- Qualidade de imagem excepcional
- Compacto e portátil

**Contras:**
- Preço elevado (R$ 15.000+)

## 2. DJI Air 3

Para quem busca custo-benefício, o **Air 3** é perfeito. Câmera dual com zoom óptico de 3x.

## 3. Autel EVO Lite+

Alternativa robusta ao DJI, com sensor de 1" e resistência a ventos.

## 4. Parrot ANAFI USA

Focado em segurança e compliance. Ideal para eventos corporativos que exigem certificações.

## 5. DJI Mini 4 Pro

Menor que 249g (não precisa de registro ANAC). Perfeito para eventos menores e ambientes fechados.

---

## Dicas de Filmagem

1. **Sempre tenha autorização** da ANAC e do local
2. **Faça um plano de voo** antes do evento
3. **Tenha baterias extras** (no mínimo 3)

> **Importante:** Todo drone acima de 250g precisa ser registrado na ANAC!',
    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200',
    exemplo_author_id,
    'Tecnologia',
    ARRAY['drones', 'filmagem', 'eventos', 'tecnologia'],
    now(),
    'Guia completo dos 5 melhores drones profissionais para filmagem de eventos em 2025. Comparações, preços e dicas práticas.'
),

-- =====================================================================
-- POST 2: IA e Credenciamento
-- =====================================================================

(
    'ia-mudando-gestao-credenciamento-eventos',
    'Como a IA está Mudando a Gestão de Credenciamento',
    'Inteligência Artificial no credenciamento de eventos: reconhecimento facial, análise preditiva e automação completa. Veja o futuro acontecendo agora.',
    E'# Como a IA está Mudando a Gestão de Credenciamento

O credenciamento sempre foi um gargalo em grandes eventos. A **Inteligência Artificial** está resolvendo isso de forma revolucionária.

## Reconhecimento Facial

Sistemas modernos usam **Face ID** para check-in instantâneo. Sem filas, sem pulseiras.

### Vantagens:
- Check-in em menos de 2 segundos
- Redução de 90% nos custos operacionais
- Zero fraudes com ingressos

### Cases de Sucesso:
- **Rock in Rio 2024:** 100.000 pessoas credenciadas em 3 horas
- **Lollapalooza:** Sistema antifraude 99,9% eficaz

## Análise Preditiva

IA prevê **horários de pico** e sugere reforço de equipe automaticamente.

## Chatbots Inteligentes

Assistentes virtuais respondem dúvidas 24/7:
- "Qual minha entrada?"
- "Como chego no local?"
- "Posso transferir meu ingresso?"

## Implementação Prática

Para implementar em seu evento:

1. Escolha uma plataforma (ex: Sympla, Eventbrite)
2. Ative o módulo de IA
3. Treine sua equipe
4. Teste com evento menor

**Custo:** A partir de R$ 5.000 para eventos de médio porte.

---

> **O futuro é agora:** Eventos que não adotarem IA perderão competitividade nos próximos 2 anos.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    exemplo_author_id,
    'Tecnologia',
    ARRAY['IA', 'inteligência artificial', 'credenciamento', 'inovação'],
    now(),
    'Descubra como a Inteligência Artificial está revolucionando o credenciamento em eventos com reconhecimento facial e análise preditiva.'
),

-- =====================================================================
-- POST 3: Carreira de Produtor
-- =====================================================================

(
    'guia-carreira-quanto-cobra-produtor-senior',
    'Guia de Carreira: Quanto Cobra um Produtor Sênior?',
    'Tabela de preços atualizada 2025: descubra quanto cobrar por cada tipo de evento, desde aniversários até grandes festivais.',
    E'# Guia de Carreira: Quanto Cobra um Produtor Sênior?

Uma das dúvidas mais comuns de quem está entrando na área: **quanto cobrar**?

## Tabela de Preços 2025

### Eventos Corporativos

| Porte do Evento | Valor Fee | Tempo de Trabalho |
|-----------------|-----------|-------------------|
| Pequeno (até 50 pessoas) | R$ 3.000 - R$ 5.000 | 20-40h |
| Médio (50-300) | R$ 8.000 - R$ 15.000 | 60-100h |
| Grande (300-1000) | R$ 20.000 - R$ 50.000 | 150-300h |
| Mega (1000+) | R$ 80.000+ | 400h+ |

### Eventos Sociais

- **Casamento:** R$ 5.000 - R$ 20.000
- **15 Anos:** R$ 3.000 - R$ 8.000
- **Aniversário Adulto:** R$ 2.000 - R$ 10.000

### Festivais e Shows

- **Festival 1 dia:** R$ 30.000 - R$ 100.000
- **Festival 3 dias:** R$ 80.000 - R$ 300.000
- **Show Grande Artista:** R$ 50.000 - R$ 150.000

## Como Precificar

A fórmula básica:

```
Fee = (Horas Estimadas × Valor/Hora) + Complexidade + Urgência
```

**Valor/Hora Sugerido:**
- Júnior: R$ 100-150/h
- Pleno: R$ 150-250/h
- Sênior: R$ 250-500/h

## Fatores que Aumentam o Fee

1. **Urgência:** Evento em menos de 30 dias (+50%)
2. **Complexidade técnica:** Som, luz, cenografia (+30%)
3. **Público VIP:** Celebridades, políticos (+40%)
4. **Locais difíceis:** Sem infraestrutura (+25%)

## Dica de Ouro

> **Nunca trabalhe de graça** esperando "visibilidade". Seu tempo tem valor!

Comece com preços competitivos, mas não se subestime. A experiência e o portfólio falam por si.',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
    exemplo_author_id,
    'Carreira',
    ARRAY['carreira', 'produtor', 'preços', 'valores'],
    now(),
    'Guia completo de precificação para produtores de eventos em 2025. Tabela de preços atualizada por tipo e porte de evento.'
)

ON CONFLICT (slug) DO NOTHING;

END $$;

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Ver todos os posts publicados:
-- SELECT slug, title, category, published_at 
-- FROM posts 
-- WHERE published_at IS NOT NULL 
-- ORDER BY published_at DESC;

-- Buscar por tag:
-- SELECT * FROM posts WHERE 'IA' = ANY(tags);

-- Buscar por categoria:
-- SELECT * FROM posts WHERE category = 'Tecnologia';