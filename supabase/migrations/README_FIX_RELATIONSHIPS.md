# 🔧 Guia de Correção - Relacionamentos Supabase

## ⚠️ Problema Detectado

```
"Could not find a relationship between 'events' and 'tickets'"
```

O PostgREST não está detectando as relações entre tabelas devido a constraints ausentes ou malformadas.

---

## ✅ Solução: Execute as Migrações

### **Opção 1: Correção Específica (Events ↔ Tickets)**

Acesse o Supabase Dashboard:
1. Vá em **SQL Editor**
2. Copie e cole o conteúdo de:
   ```
   supabase/migrations/20251226_fix_events_tickets_relation.sql
   ```
3. Clique em **RUN**
4. ✅ Aguarde a confirmação

---

### **Opção 2: Correção Completa (RECOMENDADO) 🎯**

Para garantir que TODAS as relações funcionem:

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de:
   ```
   supabase/migrations/20251226_fix_all_relationships.sql
   ```
4. Clique em **RUN**
5. Verifique a mensagem de sucesso no console

---

## 🧪 Como Testar

Após executar as migrações, teste no Supabase SQL Editor:

```sql
-- Teste 1: Listar eventos com tickets (JOIN)
SELECT 
  events.id,
  events.name,
  tickets.id as ticket_id,
  tickets.price
FROM events
LEFT JOIN tickets ON tickets.event_id = events.id
LIMIT 5;

-- Teste 2: Listar profissionais com categorias
SELECT 
  profiles.id,
  profiles.name,
  service_categories.name as categoria
FROM profiles
LEFT JOIN service_categories 
  ON service_categories.id = profiles.main_category_id
LIMIT 10;
```

Se as queries retornarem dados SEM erro, as relações foram corrigidas! ✅

---

## 📊 O que as Migrações Fazem

### **Fix Events Tickets Relation:**
- ✅ Remove constraint quebrada
- ✅ Recria FK com `ON DELETE CASCADE`
- ✅ Adiciona índice para performance
- ✅ Força reload do PostgREST

### **Fix All Relationships:**
- ✅ Profiles → Service Categories
- ✅ Profile Specialties → Profiles
- ✅ Profile Specialties → Categories
- ✅ Events → Users
- ✅ Registrations → Events
- ✅ Registrations → Users
- ✅ Tickets → Events
- ✅ Posts → Users (se existir)

---

## 🚨 Troubleshooting

### Se ainda aparecer erro de relacionamento:

1. **Limpe o cache do navegador** (Ctrl+Shift+R)
2. **Aguarde 30 segundos** (PostgREST pode levar tempo para refresh)
3. **Verifique no Supabase Dashboard**:
   - Database → Tables → Relationships
   - Veja se aparecem as setas de relacionamento

### Se a tabela não existir:

Execute primeiro o setup completo:
```
supabase/SETUP_MAGNAFEST_COMPLETO.sql
```

---

## ✨ Resultado Esperado

Após executar as migrações, você poderá:
- ✅ Fazer queries com `select('*, tickets(*)')`
- ✅ Buscar profissionais com `select('*, service_categories(*)')`
- ✅ Ver eventos com registrations no dashboard
- ✅ Sistema de favoritos funcionando

**Dúvidas?** As migrações são idempotentes - você pode executá-las múltiplas vezes sem problemas!
