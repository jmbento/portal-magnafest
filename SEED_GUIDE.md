# 🌱 Script de Seed - Eventos

## ✅ Arquivo Criado

`supabase/seed/events_seed.sql`

Script SQL para popular o banco de dados com 3 eventos realistas de teste.

---

## 📋 O que será criado:

### **1. Rock in Rio 2025** 🎸
- **Status:** Published (Público)
- **Formato:** Presencial
- **Localização:** Rio de Janeiro, RJ
- **Tickets:** 3 lotes (Pista R$350, Premium R$550, Camarote R$1.200)
- **Dados extras:** Lineup, capacity, hashtags

### **2. Webinar React 19** 💻
- **Status:** Published (Público)
- **Formato:** Online
- **Localização:** Link Zoom
- **Tickets:** 1 lote GRATUITO
- **Dados extras:** Schedule, speakers, platform

### **3. Conferência Tech Brasil 2025** 🚀
- **Status:** Draft (Rascunho - só organizador vê)
- **Formato:** Híbrido
- **Localização:** São Paulo + YouTube
- **Tickets:** 3 lotes (Online R$197, Presencial R$497, Empresarial R$1.997)
- **Imagem:** `null` (testa fallback visual)
- **Dados extras:** Sponsors, accessibility, dress_code

---

## 🔧 Como Usar:

### **Passo 1: Obter seu UUID de usuário**

1. Acesse o Supabase Dashboard
2. Vá em **Authentication** → **Users**
3. Copie o **ID** do seu usuário (formato: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### **Passo 2: Editar o script**

Abra o arquivo `supabase/seed/events_seed.sql` e substitua na linha 19:

```sql
user_id UUID := 'SEU-UUID-AQUI'; -- ← COLE SEU UUID AQUI!
```

Por exemplo:
```sql
user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
```

### **Passo 3: Executar no Supabase**

**Opção A - SQL Editor (Dashboard):**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Cole o conteúdo COMPLETO do arquivo (após editar o UUID)
6. Clique em **Run** ▶️

**Opção B - Supabase CLI (Terminal):**
```bash
cd "/Volumes/bxdMAC/Projetos apps/canapev"
supabase db reset --db-url "sua-connection-string"
```

---

## ✅ Verificar se funcionou:

Execute esta query no SQL Editor:

```sql
SELECT 
  id, 
  slug, 
  title, 
  status, 
  format, 
  starts_at 
FROM public.events 
ORDER BY starts_at;
```

**Resultado esperado:**
```
3 linhas retornadas
- webinar-react-19 (published, online)
- conf-tech-brasil-2025 (draft, hybrid)
- rock-in-rio-2025 (published, in_person)
```

---

## 🎯 Testar no App:

Após executar o seed:

1. **Listagem:** http://localhost:5173/eventos
   - Deve mostrar os 2 eventos `published` (Webinar e Rock in Rio)
   - O Draft NÃO aparece (RLS protege)

2. **Detalhes:** http://localhost:5173/eventos/rock-in-rio-2025
   - Deve mostrar página completa
   - Hero image do Unsplash
   - Sidebar com data, local, preço

3. **Sem imagem:** http://localhost:5173/eventos/conf-tech-brasil-2025
   - Só aparece se você for o organizador (está draft)
   - Testa fallback sem imagem (gradient)

---

## 🔄 Rodar múltiplas vezes:

O script usa `ON CONFLICT (slug) DO NOTHING`, então é seguro executar várias vezes sem duplicar dados.

**Para limpar e recomeçar:**
```sql
DELETE FROM public.tickets;
DELETE FROM public.events;
-- Depois execute o seed novamente
```

---

## 📊 Estrutura dos Dados:

### **JSONB: location_data**
```json
{
  "address": "Cidade do Rock",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "zip_code": "22775-004",
  "coordinates": {
    "lat": -22.9068,
    "lng": -43.1729
  }
}
```

### **JSONB: metadata**
```json
{
  "capacity": 100000,
  "age_rating": "16+",
  "hashtags": ["#RockInRio", "#RIR2025"],
  "lineup": [
    {"artist": "Foo Fighters", "time": "22:00", "stage": "Mundo"}
  ]
}
```

---

## 🐛 Troubleshooting:

### ❌ Erro: "violates foreign key constraint"

**Causa:** UUID do usuário não existe ou está errado.

**Solução:** 
1. Verifique o UUID no dashboard
2. Certifique-se de copiar corretamente
3. Cole no script SEM aspas extras

### ❌ Erro: "relation 'events' does not exist"

**Causa:** Tabela events não foi criada ainda.

**Solução:** Execute a migração primeiro:
```sql
-- Execute o conteúdo de:
-- supabase/migrations/20251222_create_complex_events_schema.sql
```

### ❌ Seed executa mas eventos não aparecem no app

**Causa:** RLS está bloqueando (evento draft ou você não é o dono).

**Solução:**
- Eventos `published` são públicos
- Eventos `draft` só aparecem para o organizador
- Verifique se você está logado com o mesmo usuário

---

## ✨ Bônus: Adicionar mais eventos

Use o padrão:

```sql
INSERT INTO public.events (
    slug,
    organizer_id,
    title,
    short_description,
    starts_at,
    ends_at,
    format,
    status,
    location_data
) VALUES (
    'meu-evento-slug',
    user_id,
    'Meu Evento',
    'Descrição curta',
    '2025-12-25T19:00:00Z',
    '2025-12-25T23:00:00Z',
    'in_person',
    'published',
    '{"city": "São Paulo", "state": "SP"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;
```

---

**🎉 Dados de teste prontos para uso!**

Após executar o seed, você terá:
- ✅ 3 eventos com dados realistas
- ✅ 7 tipos de ingressos
- ✅ JSONB com metadata rica
- ✅ Teste de todos os estados (published/draft, online/presencial/híbrido)

**Execute agora e teste seu app!** 🚀
