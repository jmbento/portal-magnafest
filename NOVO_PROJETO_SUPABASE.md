# 🚀 CRIANDO NOVO PROJETO SUPABASE - PORTAL MAGNAFEST

## ✅ CHECKLIST DE MIGRAÇÃO

Siga este guia na ordem. Marque cada item conforme completar.

---

## 📍 PASSO 1: CRIAR PROJETO NO SUPABASE

### 1.1 Acessar Dashboard
```
https://supabase.com/dashboard
```

### 1.2 Criar Novo Projeto
- [ ] Clicar em **"New Project"** (botão verde)
- [ ] Preencher formulário:
  - **Organization:** (escolha sua org ou pessoal)
  - **Name:** `Portal MagnaFest` ou `magnafest`
  - **Database Password:** (ANOTE EM LUGAR SEGURO!)
    - Sugestão: Use gerador do Supabase ou crie senha forte
    - Exemplo: `Mg@F3st2025!Secure`
  - **Region:** `South America (São Paulo)` (mais perto do Brasil)
  - **Pricing Plan:** Free (ou Pro se quiser)
  
- [ ] Clicar em **"Create new project"**
- [ ] Aguardar ~2-3 minutos (setup automático do banco)

### 1.3 Confirmação
Você verá:
```
✅ Project created successfully
📊 Dashboard carregando...
```

---

## 🔑 PASSO 2: COPIAR CREDENCIAIS

### 2.1 Navegar para API Settings
- [ ] No menu lateral: **Settings** → **API**

### 2.2 Copiar Informações

Você verá uma tela com:

#### Project URL:
```
https://ALGUMID.supabase.co
```
- [ ] **COPIAR** este URL

#### API Keys:

**anon public (pública):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- [ ] **COPIAR** esta chave

**service_role (SECRETA - NUNCA EXPONHA!):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
- [ ] **COPIAR** esta chave

---

## 📝 PASSO 3: ATUALIZAR .ENV LOCAL

### 3.1 Criar/Editar arquivo `.env`

Na raiz do projeto (`/Volumes/bxdMAC/Projetos apps/canapev/`):

```bash
# Criar ou editar .env
# Se não existir, criar novo arquivo
```

### 3.2 Colar as credenciais

```env
# =============================================
# PORTAL MAGNAFEST - Supabase Credentials
# =============================================

# Project URL (copie da etapa 2.2)
VITE_SUPABASE_URL=https://SEU-PROJECT-ID.supabase.co

# Anon Key (pública - pode usar no frontend)
VITE_SUPABASE_ANON_KEY=eyJhbG...COLE-AQUI

# Service Role Key (SECRETA - só backend/scripts)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...COLE-AQUI
```

- [ ] Substituir `SEU-PROJECT-ID` pelo ID real
- [ ] Colar chave anon completa
- [ ] Colar service_role key completa
- [ ] Salvar arquivo

### 3.3 Verificar .gitignore

- [ ] Confirmar que `.env` está no `.gitignore`
```bash
# Abrir .gitignore e verificar se tem:
.env
.env.local
```

---

## 🗄️ PASSO 4: EXECUTAR MIGRAÇÕES SQL

### 4.1 Acessar SQL Editor
- [ ] No menu lateral do Supabase: **SQL Editor**
- [ ] Clicar em **"New query"**

### 4.2 Executar Script Consolidado

#### Opção A: Script Único (RECOMENDADO)

- [ ] Abrir arquivo local: `supabase/DEPLOY_COMPLETO.sql`
- [ ] Copiar TODO o conteúdo (Cmd+A, Cmd+C)
- [ ] Colar no SQL Editor do Supabase
- [ ] Clicar em **"Run"** (ou Cmd+Enter)
- [ ] Aguardar execução (~5-10 segundos)

**Resultado esperado:**
```
✅ Success. Rows returned: X
Tabelas criadas:
- profiles ✅
- events ✅
```

#### Opção B: Scripts Individuais (se der erro no consolidado)

Execute na ordem:

**1. Categories:**
- [ ] Abrir: `supabase/migrations/20251225_create_and_seed_categories.sql`
- [ ] Copiar, colar no SQL Editor, executar
- [ ] Verificar: 10 categorias inseridas

**2. Profiles Feed:**
- [ ] Abrir: `supabase/migrations/20251224_create_profiles_feed.sql`
- [ ] Copiar, colar, executar
- [ ] Verificar: tabela `profiles` criada

**3. Events:**
- [ ] Abrir: `supabase/migrations/20251224_create_events.sql`
- [ ] Copiar, colar, executar
- [ ] Verificar: tabela `events` criada

**4. Link Profiles → Categories:**
- [ ] Abrir: `supabase/migrations/20251225_link_profiles_categories.sql`
- [ ] Copiar, colar, executar
- [ ] Verificar: coluna `main_category_id` adicionada

### 4.3 Verificar Tabelas Criadas

- [ ] No menu lateral: **Table Editor**
- [ ] Verificar que existem:
  - ✅ `profiles`
  - ✅ `events`
  - ✅ `service_categories`
  - ✅ `profile_specialties`

---

## 🌱 PASSO 5: SEED DE DADOS (OPCIONAL)

### 5.1 Instalar ts-node (se ainda não tiver)

```bash
npm install --save-dev ts-node @types/node
```

### 5.2 Executar Script de Seed

```bash
npx ts-node scripts/seed-professionals.ts
```

**Resultado esperado:**
```
🚀 Iniciando seed de profissionais...
✅ 10 categorias encontradas

📂 Processando categoria: tecnico-de-som
   ✅ AudioVisão Locações
   ✅ Carlos Mendes - Som Profissional
   ✅ SoundTech Brasil

[...]

🎉 Seed completo! 30 profissionais inseridos.
```

- [ ] 30 perfis inseridos com sucesso

### 5.3 Verificar no Table Editor

- [ ] Abrir tabela `profiles` no dashboard
- [ ] Verificar que há ~30 registros
- [ ] Verificar que têm `main_category_id` preenchido

---

## 🧪 PASSO 6: TESTAR CONEXÃO LOCAL

### 6.1 Reiniciar Dev Server

```bash
# Parar servidor atual (Ctrl+C)
# Reiniciar:
npm run dev
```

### 6.2 Abrir Aplicação

```
http://localhost:5173
```

### 6.3 Verificar Console

- [ ] Abrir DevTools (F12)
- [ ] Console deve estar SEM erros de Supabase
- [ ] Network: Requisições para `SEU-ID.supabase.co` funcionando

### 6.4 Testar Funcionalidade Básica

- [ ] Tentar fazer login (se tiver auth)
- [ ] Carregar lista de profissionais/eventos
- [ ] Verificar se dados aparecem

---

## ✅ PASSO 7: VALIDAÇÃO FINAL

### 7.1 Checklist de Funcionamento

- [ ] Projeto MagnaFest criado no Supabase
- [ ] URL nova: `https://NOVO-ID.supabase.co`
- [ ] `.env` atualizado com novas credenciais
- [ ] Tabelas criadas no banco:
  - [ ] `profiles`
  - [ ] `events`
  - [ ] `service_categories`
  - [ ] `profile_specialties`
- [ ] RLS habilitado em todas as tabelas
- [ ] (Opcional) Dados seedados (30 profissionais)
- [ ] Dev server conectando no novo banco
- [ ] Frontend funcionando sem erros

### 7.2 Teste de Query Manual

No SQL Editor do Supabase, execute:

```sql
-- Verificar categorias
SELECT * FROM service_categories;

-- Deve retornar 10 categorias

-- Verificar profiles
SELECT COUNT(*) FROM profiles;

-- Deve retornar 30 (se fez seed) ou 0 (se não fez)
```

---

## 🗑️ PASSO 8: LIMPAR PROJETO ANTIGO (DEPOIS!)

### ⚠️ NÃO FAÇA AGORA!

Aguarde alguns dias usando o novo projeto antes de deletar o antigo.

### Quando estiver 100% seguro:

- [ ] Dashboard do Supabase
- [ ] Selecionar projeto antigo "canapev"
- [ ] Settings → General
- [ ] Scroll até o final: "Danger Zone"
- [ ] "Delete Project"
- [ ] Confirmar digitando nome do projeto

---

## 🆘 TROUBLESHOOTING

### ❌ Erro: "Invalid API key"

**Causa:** Chave errada no `.env`

**Solução:**
1. Voltar no dashboard: Settings → API
2. Copiar novamente (anon ou service_role conforme o caso)
3. Atualizar `.env`
4. Reiniciar: `npm run dev`

---

### ❌ Erro: "relation 'profiles' does not exist"

**Causa:** Migração SQL não executada

**Solução:**
1. Dashboard → SQL Editor
2. Executar `DEPLOY_COMPLETO.sql` novamente
3. Verificar no Table Editor se tabelas apareceram

---

### ❌ Frontend não conecta

**Causa:** `.env` não carregado ou dev server não reiniciado

**Solução:**
1. Parar dev server (Ctrl+C)
2. Verificar `.env` (deve ter `VITE_SUPABASE_URL`)
3. Reiniciar: `npm run dev`
4. Hard refresh no browser (Cmd+Shift+R)

---

### ❌ Seed script falha

**Causa:** Credenciais erradas ou tabelas não existem

**Solução:**
1. Verificar se `SUPABASE_SERVICE_ROLE_KEY` está no `.env`
2. Verificar se tabelas `profiles` e `service_categories` existem
3. Executar novamente: `npx ts-node scripts/seed-professionals.ts`

---

## 📊 RESUMO

### Tempo estimado total: ~20-30 minutos

| Passo | Tempo | Dificuldade |
|-------|-------|-------------|
| 1. Criar projeto | 3 min | Fácil |
| 2. Copiar credenciais | 2 min | Fácil |
| 3. Atualizar .env | 2 min | Fácil |
| 4. Executar SQL | 5 min | Médio |
| 5. Seed dados | 2 min | Fácil |
| 6. Testar | 5 min | Médio |

---

## 🎉 PARABÉNS!

Quando completar todos os passos acima, você terá:

✅ Novo projeto "Portal MagnaFest" no Supabase  
✅ Banco de dados estruturado  
✅ 30 profissionais em 10 categorias (se fez seed)  
✅ Application conectando no novo backend  
✅ URL profissional: `magnafest.supabase.co`  

---

**Comece pelo PASSO 1 e me avise quando chegar em cada etapa!** 🚀

**Estou aqui para ajudar em qualquer erro que aparecer!** 💪
