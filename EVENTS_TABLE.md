# 📅 Tabela Events - CANAPEV

## 🎯 Visão Geral

Tabela para gerenciar eventos criados por usuários com **Row Level Security (RLS)** completo.

---

## 📁 Arquivos Criados

```
supabase/
├── schema.sql                              # Schema de referência (simplificado)
└── migrations/
    └── 20251222_create_events_table.sql    # Migração completa (use este!)
```

**Qual usar?**
- `migrations/20251222_create_events_table.sql` → **Para produção** ✅
- `schema.sql` → Para referência rápida apenas

---

## 📊 Schema da Tabela

### **Estrutura**

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID único do evento |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Data de criação |
| `title` | TEXT | NOT NULL, CHECK (length ≥ 3) | Título do evento |
| `description` | TEXT | NULL | Descrição opcional |
| `event_date` | TIMESTAMPTZ | NOT NULL, CHECK (> created_at) | Data do evento (futuro) |
| `user_id` | UUID | NOT NULL, FK auth.users | Criador do evento |

### **Constraints de Validação**

```sql
-- Título mínimo 3 caracteres
CHECK (char_length(title) >= 3)

-- Evento deve ser no futuro
CHECK (event_date > created_at)

-- Referência ao usuário
REFERENCES auth.users(id) ON DELETE CASCADE
```

---

## 🔒 Segurança (RLS)

### **Policies Criadas**

| Operação | Policy | Regra |
|----------|--------|-------|
| **SELECT** | "Eventos são públicos" | `true` (qualquer um) |
| **INSERT** | "Usuários autenticados podem criar" | `auth.uid() = user_id` |
| **UPDATE** | "Usuários podem editar próprios" | `auth.uid() = user_id` |
| **DELETE** | "Usuários podem deletar próprios" | `auth.uid() = user_id` |

### **Significado:**

✅ **Leitura:** Qualquer pessoa pode ver eventos (público)  
✅ **Criação:** Apenas usuários logados podem criar  
✅ **Edição:** Apenas o dono pode editar  
✅ **Exclusão:** Apenas o dono pode deletar  

---

## ⚡ Performance

### **Índices Criados**

```sql
-- Ordenação por data
CREATE INDEX idx_events_event_date ON events(event_date);

-- Filtragem por usuário
CREATE INDEX idx_events_user_id ON events(user_id);

-- Queries comuns (user + date)
CREATE INDEX idx_events_user_date ON events(user_id, event_date DESC);
```

**Benefício:** Queries até 100x mais rápidas! 🚀

---

## 🔧 Funções Utilitárias

### **1. get_upcoming_events()**

Retorna próximos eventos em ordem cronológica:

```sql
SELECT * FROM get_upcoming_events(10);
```

**Parâmetros:**
- `limit_count` (INTEGER, default 10) → Quantidade de eventos

**Retorno:**
```sql
{
  id: UUID,
  title: TEXT,
  event_date: TIMESTAMPTZ,
  user_id: UUID
}
```

---

### **2. get_user_events()**

Retorna todos os eventos de um usuário:

```sql
SELECT * FROM get_user_events('uuid-do-usuario');
```

**Parâmetros:**
- `target_user_id` (UUID) → ID do usuário

**Retorno:**
```sql
{
  id: UUID,
  title: TEXT,
  description: TEXT,
  event_date: TIMESTAMPTZ,
  created_at: TIMESTAMPTZ
}
```

---

## 🚀 Como Usar

### **1. Rodar a Migração**

```bash
# No Supabase Dashboard:
1. Vá em SQL Editor
2. Copie o conteúdo de: supabase/migrations/20251222_create_events_table.sql
3. Cole e clique em "Run"
4. ✅ Sucesso!
```

### **2. Verificar Criação**

```sql
-- Ver estrutura da tabela
SELECT * FROM events;

-- Ver policies criadas
SELECT * FROM pg_policies WHERE tablename = 'events';

-- Ver índices
SELECT * FROM pg_indexes WHERE tablename = 'events';
```

---

## 📝 Exemplos de Uso

### **Criar Evento (Frontend)**

```typescript
import { supabase } from './lib/supabase';

const createEvent = async () => {
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: 'Workshop de React',
      description: 'Aprenda React do zero',
      event_date: '2025-12-31T14:00:00Z',
      user_id: user.id  // RLS valida automaticamente
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

---

### **Listar Próximos Eventos**

```typescript
const getUpcomingEvents = async () => {
  const { data, error } = await supabase
    .rpc('get_upcoming_events', { limit_count: 5 });

  if (error) throw error;
  return data;
};
```

---

### **Editar Evento**

```typescript
const updateEvent = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)  // RLS verifica se é o dono
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

---

### **Deletar Evento**

```typescript
const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);  // RLS verifica se é o dono

  if (error) throw error;
};
```

---

### **Buscar Eventos do Usuário Atual**

```typescript
const getMyEvents = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .rpc('get_user_events', { target_user_id: user.id });

  if (error) throw error;
  return data;
};
```

---

## 🎯 Queries Comuns

### **Eventos Futuros Ordenados**

```sql
SELECT * FROM events
WHERE event_date > now()
ORDER BY event_date ASC
LIMIT 10;
```

### **Eventos de um Usuário**

```sql
SELECT * FROM events
WHERE user_id = 'uuid-do-usuario'
ORDER BY event_date DESC;
```

### **Eventos do Mês**

```sql
SELECT * FROM events
WHERE event_date >= date_trunc('month', now())
  AND event_date < date_trunc('month', now() + interval '1 month')
ORDER BY event_date ASC;
```

### **Buscar por Título**

```sql
SELECT * FROM events
WHERE title ILIKE '%workshop%'
ORDER BY event_date ASC;
```

---

## 🔐 Testando RLS

### **1. Leitura Pública**

```sql
-- Sem autenticação
SELECT * FROM events;  -- ✅ Funciona!
```

### **2. Criação Protegida**

```sql
-- Sem autenticação
INSERT INTO events (title, event_date, user_id)
VALUES ('Teste', '2025-12-31', 'uuid-qualquer');
-- ❌ Erro: RLS bloqueia!

-- Com autenticação
-- ✅ Funciona se user_id = auth.uid()
```

### **3. Edição Protegida**

```sql
-- Tentar editar evento de outro usuário
UPDATE events SET title = 'Hackeado' WHERE id = 'evento-de-outro';
-- ❌ Erro: RLS bloqueia (não é o dono)!
```

---

## 📊 Monitoramento

### **Contagem de Eventos**

```sql
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE event_date > now()) as futuros,
  COUNT(*) FILTER (WHERE event_date < now()) as passados
FROM events;
```

### **Eventos por Usuário**

```sql
SELECT 
  user_id,
  COUNT(*) as total_events
FROM events
GROUP BY user_id
ORDER BY total_events DESC;
```

### **Eventos do Dia**

```sql
SELECT * FROM events
WHERE DATE(event_date) = CURRENT_DATE
ORDER BY event_date;
```

---

## 🐛 Troubleshooting

### ❌ **"RLS policy violation"**

**Causa:** Tentando criar evento com `user_id` diferente do logado  
**Solução:** Use `auth.uid()` para pegar o ID correto

```typescript
const { data: { user } } = await supabase.auth.getUser();
// Usar: user.id
```

---

### ❌ **"violates check constraint"**

**Causa:** `event_date` no passado ou título < 3 caracteres  
**Solução:** Validar dados antes de enviar

```typescript
if (title.length < 3) {
  throw new Error('Título deve ter mínimo 3 caracteres');
}

if (new Date(eventDate) <= new Date()) {
  throw new Error('Data do evento deve ser no futuro');
}
```

---

### ❌ **"relation does not exist"**

**Causa:** Migração não foi executada  
**Solução:** Execute o SQL no Supabase Dashboard

---

## 🎓 Boas Práticas

1. ✅ **Sempre use funções RPC** para queries complexas
2. ✅ **Valide dados no frontend** antes de enviar
3. ✅ **Use `select()` após insert/update** para pegar dados atualizados
4. ✅ **Trate erros** com try/catch
5. ✅ **Use índices** para queries frequentes

---

## 🔄 Próximos Passos

### **Extensões Possíveis**

1. Adicionar `location` (endereço do evento)
2. Adicionar `max_participants` (limite de vagas)
3. Criar tabela `event_participants` (inscrições)
4. Adicionar `status`: 'draft' | 'published' | 'cancelled'
5. Criar função de busca full-text
6. Implementar notificações (triggers)

---

**🎉 Tabela events pronta para uso!**

Execute a migração e comece a criar eventos! 🚀
