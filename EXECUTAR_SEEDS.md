# 🚀 Guia de Execução dos Seeds

## ✅ Scripts Prontos

Você tem 2 scripts de seed prontos para executar:

1. **providers_seed.sql** - Insere 4 fornecedores de teste
2. **events_seed.sql** - Insere 3 eventos de teste

---

## 🎯 Passo a Passo - Execução Manual

### **1. Fazer Login no Supabase**

Acesse: https://supabase.com/dashboard

### **2. Abrir SQL Editor**

1. Selecione seu projeto **Canapev**
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**

### **3. Executar Script de Providers (Fornecedores)**

1. **Copie TODO o conteúdo** do arquivo:
   ```
   supabase/seed/providers_seed.sql
   ```

2. **Cole no SQL Editor**

3. Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)

4. ✅ Deve aparecer: "Success. No rows returned"

### **4. Executar Script de Events (Eventos)**

⚠️ **IMPORTANTE: Você precisa editar o UUID primeiro!**

1. **Copie TODO o conteúdo** do arquivo:
   ```
   supabase/seed/events_seed.sql
   ```

2. **ANTES de colar**, você precisa do seu UUID de usuário:
   - No Supabase Dashboard, vá em **Authentication** → **Users**
   - Copie o **ID** do seu usuário (ex: `6443ae57-e411-4c6c-a10c-20806bf6fc08`)

3. **No script**, procure a linha 10:
   ```sql
   user_id UUID := '6443ae57-e411-4c6c-a10c-20806bf6fc08';
   ```

4. **Substitua** pelo UUID que você copiou

5. **Cole no SQL Editor**

6. Clique em **Run**

7. ✅ Deve aparecer: "Success. 3 rows returned" (mostrando os 3 eventos criados)

---

## ✅ Verificar se Funcionou

Execute esta query no SQL Editor:

```sql
-- Verificar Providers
SELECT name, category, city, is_verified 
FROM providers 
ORDER BY name;

-- Verificar Events
SELECT title, status, format, starts_at 
FROM events 
ORDER BY starts_at;
```

### Resultado Esperado:

**Providers (4 linhas):**
- Ana Fotografia Pro
- Buffet Delícia
- Canapev Segurança VIP
- João Eletricista

**Events (3 linhas):**
- Webinar: React 19 - Novidades e Melhores Práticas
- Conferência Tech Brasil 2025
- Rock in Rio 2025

---

## 🎨 Testar no App

Após executar os seeds com sucesso:

### 1. **Página de Busca de Fornecedores**
```
http://localhost:5173/buscar
```
- Deve mostrar os 4 fornecedores
- Teste os filtros por categoria e localização

### 2. **Página de Eventos**
```
http://localhost:5173/eventos
```
- Deve mostrar os eventos públicos (published)
- Deve mostrar imagens, preços, datas

### 3. **Detalhes de Evento**
```
http://localhost:5173/eventos/rock-in-rio-2025
```
- Deve mostrar página completa do evento
- Tickets, descrição, localização

---

## 🔄 Executar Novamente (Limpar e Recriar)

Se quiser começar do zero:

```sql
-- Limpar tudo
DELETE FROM tickets;
DELETE FROM events;
DELETE FROM providers;

-- Depois execute os seeds novamente
```

---

## 🐛 Problemas Comuns

### ❌ "violates foreign key constraint"
- **Causa:** UUID do usuário não existe
- **Solução:** Verifique se copiou o UUID correto em Authentication → Users

### ❌ "relation 'providers' does not exist"
- **Causa:** Tabelas não foram criadas
- **Solução:** Execute as migrações primeiro (veja SUPABASE_CONFIG.md)

### ❌ "duplicate key value violates unique constraint"
- **Causa:** Dados já foram inseridos
- **Solução:** Isso é normal! Os scripts usam `ON CONFLICT DO NOTHING` para evitar duplicatas

---

## 📞 UUID Atual Configurado

O script de eventos já está configurado com este UUID:
```
6443ae57-e411-4c6c-a10c-20806bf6fc08
```

**Se este não for o seu UUID**, edite a linha 10 do `events_seed.sql` antes de executar!

---

🎉 **Pronto! Seus dados de teste estão configurados!**
