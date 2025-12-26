# 🚀 Content Engine - Blog & Interview System

## 📋 O Que Foi Criado

### **Arquivo de Migração:**
```
supabase/migrations/20251226_create_content_engine.sql
```

---

## 🗄️ **Estrutura do Banco de Dados**

### **1. Tabela `posts`** (Artigos do Blog)

```sql
posts
├── id (UUID)
├── title (TEXT)
├── slug (TEXT) - UNIQUE
├── content (TEXT) - Markdown ou HTML
├── excerpt (TEXT) - Resumo
├── cover_image_url (TEXT)
├── category (TEXT) - 'Tecnologia', 'Entrevista', etc.
├── tags (TEXT[]) - Array de tags
├── author_type (ENUM) - 'bot', 'human', 'interviewee'
├── author_id (UUID) - FK para auth.users
├── author_name (TEXT)
├── status (ENUM) - 'draft', 'published', 'archived'
├── published_at (TIMESTAMPTZ)
├── views_count (INTEGER)
├── likes_count (INTEGER)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

**Índices:**
- slug (único)
- status
- published_at (DESC)
- category

---

### **2. Tabela `interviews`** (Sistema de Entrevistas)

```sql
interviews
├── id (UUID)
├── profile_id (UUID) - FK para profiles
├── status (ENUM) - 'invited', 'answered', 'approved', 'rejected', 'published'
├── questions_json (JSONB) - Perguntas enviadas
├── answers_json (JSONB) - Respostas recebidas
├── photos_json (JSONB) - URLs de fotos
├── interview_type (TEXT)
├── topic (TEXT)
├── generated_post_id (UUID) - FK para posts
├── invitation_sent_at (TIMESTAMPTZ)
├── answered_at (TIMESTAMPTZ)
├── approved_at (TIMESTAMPTZ)
├── published_at (TIMESTAMPTZ)
├── admin_notes (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

**Fluxo:**
```
invited → answered → approved → published
                  ↓
               rejected
```

---

### **3. Tabela `post_views`** (Analytics)

```sql
post_views
├── id (UUID)
├── post_id (UUID) - FK para posts
├── user_id (UUID) - FK para auth.users (NULL = anônimo)
├── ip_address (INET)
├── user_agent (TEXT)
└── viewed_at (TIMESTAMPTZ)
```

---

## 🔒 **Row Level Security (RLS)**

### **Posts:**
- ✅ **Leitura Pública:** Qualquer um pode ler posts com `status = 'published'`
- ✅ **Service Role:** Bot de conteúdo pode tudo
- ✅ **Admins:** Acesso completo
- ✅ **Autores:** Podem gerenciar seus próprios posts

### **Interviews:**
- ✅ **Service Role:** Sistema pode tudo
- ✅ **Admins:** Acesso completo
- ✅ **Dono do Perfil:** Pode ver/responder suas próprias entrevistas

### **Post Views:**
- ✅ **Inserção Pública:** Qualquer um pode registrar visualização
- ✅ **Leitura Admin:** Apenas admins veem analytics

---

## ⚙️ **Funções Úteis**

### **1. Incrementar Views**
```sql
SELECT increment_post_views('uuid-do-post');
```

### **2. Gerar Slug Automático**
```sql
SELECT generate_post_slug('Título do Meu Artigo');
-- Retorna: 'titulo-do-meu-artigo'
```

**Features:**
- Remove acentos
- Converte para lowercase
- Substitui espaços por hífens
- Garante unicidade (adiciona contador se necessário)

---

## 🤖 **Sistema de Entrevistas - Workflow**

### **Passo 1: Convidar Profissional**
```sql
INSERT INTO interviews (profile_id, questions_json, status)
VALUES (
  'uuid-do-perfil',
  '{
    "questions": [
      "Como você começou na área?",
      "Qual seu equipamento favorito?",
      "Dicas para iniciantes?"
    ]
  }',
  'invited'
);
```

### **Passo 2: Profissional Responde**
```sql
UPDATE interviews
SET 
  answers_json = '{
    "answers": [
      "Comecei há 10 anos...",
      "Gosto da linha Shure...",
      "Invista em conhecimento..."
    ]
  }',
  photos_json = '{
    "photos": [
      "https://...",
      "https://..."
    ]
  }',
  status = 'answered',
  answered_at = NOW()
WHERE id = 'uuid-da-entrevista';
```

### **Passo 3: Admin Aprova e Gera Post**
```sql
-- 1. Criar post baseado na entrevista
INSERT INTO posts (title, slug, content, author_type, status)
VALUES (
  'Entrevista: Nome do Profissional',
  'entrevista-nome-profissional',
  'Conteúdo gerado...',
  'interviewee',
  'published'
) RETURNING id INTO post_id;

-- 2. Atualizar entrevista
UPDATE interviews
SET 
  generated_post_id = post_id,
  status = 'published',
  approved_at = NOW(),
  published_at = NOW()
WHERE id = 'uuid-da-entrevista';
```

---

## 📊 **Seed Inicial**

Um post de boas-vindas já foi criado:
- **Título:** "Bem-vindo ao Blog do Portal MagnaFest!"
- **Slug:** `bem-vindo-ao-blog-magnafest`
- **Autor:** MagnaFest AI (bot)
- **Status:** published

---

## 🚀 **Como Executar**

### **1. Acesse Supabase Dashboard**
```
https://supabase.com/dashboard/project/seu-projeto/sql
```

### **2. Execute a Migração**
Copie TODO o conteúdo de:
```
supabase/migrations/20251226_create_content_engine.sql
```

Cole no SQL Editor → **RUN**

### **3. Verifique**
```sql
-- Ver posts
SELECT * FROM posts;

-- Ver entrevistas
SELECT * FROM interviews;

-- Testar função de slug
SELECT generate_post_slug('Como Escolher o Melhor Microfone');
```

---

## 💡 **Casos de Uso**

### **Blog Automático (Bot):**
```sql
INSERT INTO posts (
  title,
  slug,
  content,
  category,
  author_type,
  author_name,
  status,
  published_at
) VALUES (
  'Tendências de Som para 2024',
  'tendencias-de-som-2024',
  'Conteúdo gerado por IA...',
  'Tecnologia',
  'bot',
  'MagnaFest AI',
  'published',
  NOW()
);
```

### **Post Manual (Humano):**
```sql
INSERT INTO posts (
  title,
  slug,
  content,
  author_type,
  author_id,
  author_name,
  status
) VALUES (
  'Minha Experiência em Festivais',
  'minha-experiencia-festivais',
  'Conteúdo escrito...',
  'human',
  'uuid-do-usuario',
  'João Silva',
  'draft'
);
```

---

## 📈 **Analytics de Posts**

```sql
-- Posts mais vistos
SELECT 
  title,
  views_count,
  likes_count
FROM posts
WHERE status = 'published'
ORDER BY views_count DESC
LIMIT 10;

-- Views detalhadas com IP
SELECT 
  p.title,
  COUNT(pv.id) as total_views,
  COUNT(DISTINCT pv.ip_address) as unique_visitors
FROM posts p
LEFT JOIN post_views pv ON p.id = pv.post_id
GROUP BY p.id, p.title
ORDER BY total_views DESC;
```

---

## ✅ **Checklist Pós-Migração**

- [ ] Executar SQL no Supabase
- [ ] Verificar que post de boas-vindas foi criado
- [ ] Testar função `generate_post_slug()`
- [ ] Configurar variáveis de ambiente para Service Role (se necessário)
- [ ] Integrar endpoint de visualização no frontend
- [ ] Criar interface de admin para gerenciar entrevistas

---

**Sistema de Blog e Entrevistas pronto para uso! 📝✨**
