# 🗄️ SUPABASE - GUIA DE REBRANDING

## ⚠️ SUPABASE PROJECT: PRECISA MUDAR?

**Resposta curta:** NÃO necessariamente, mas RECOMENDO criar um novo projeto para o Portal MagnaFest.

---

## 🎯 OPÇÃO 1: MANTER PROJETO ATUAL (Mais Rápido)

### ✅ Vantagens:
- ✅ Nenhuma migração de dados necessária
- ✅ Zero downtime
- ✅ Todas as tabelas já criadas
- ✅ Configurações mantidas

### ❌ Desvantagens:
- ❌ URL fica `canapev.supabase.co` (confuso)
- ❌ Nome interno do projeto: "canapev"
- ❌ Logs e dashboards com nome antigo

### 📝 O que fazer:

#### 1. Apenas atualizar variáveis de ambiente locais
```bash
# .env (mantém as mesmas URLs)
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-atual
```

#### 2. Nada mais! Backend continua funcionando.

**Use esta opção se:**
- Você quer economizar tempo AGORA
- Já tem dados importantes no banco
- É projeto pessoal/testes

---

## 🚀 OPÇÃO 2: CRIAR NOVO PROJETO "MAGNAFEST" (Recomendado)

### ✅ Vantagens:
- ✅ URL limpa: `magnafest.supabase.co`
- ✅ Nome do projeto correto
- ✅ Começo limpo e organizado
- ✅ Profissional

### ❌ Desvantagens:
- ❌ Precisa recriar tabelas
- ❌ Precisa reconfigurar RLS
- ❌ ~15-30 minutos de trabalho

### 📝 Passo a Passo:

---

## 🔧 PASSO A PASSO: CRIAR NOVO PROJETO

### **1. Criar Novo Projeto no Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** `Portal MagnaFest` ou `magnafest`
   - **Database Password:** (crie uma senha forte)
   - **Region:** Choose closest to you (ex: South America)
4. Clique **"Create new project"**
5. Aguarde ~2 minutos (setup do banco)

---

### **2. Copiar Credenciais do Novo Projeto**

No novo projeto, vá em **Settings → API**:

```bash
# Copiar:
Project URL: https://NOVO-PROJECT-ID.supabase.co
anon public key: eyJhbG...
service_role key: eyJhbG... (NUNCA EXPONHA!)
```

---

### **3. Atualizar `.env` Local**

```env
# .env (ATUALIZAR com novo projeto)
VITE_SUPABASE_URL=https://NOVO-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=nova-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=nova-service-role-key-aqui
```

---

### **4. Migrar Estrutura do Banco (Rápido!)**

Você já tem os scripts SQL prontos! 

#### Opção A: Usar o script consolidado

1. Vá em **SQL Editor** no novo projeto
2. Cole TODO o conteúdo de:
   ```
   supabase/DEPLOY_COMPLETO.sql
   ```
3. Execute (Run)

#### Opção B: Scripts individuais

Execute nesta ordem:

```sql
-- 1. Categories
supabase/migrations/20251225_create_and_seed_categories.sql

-- 2. Profiles + Events  
supabase/DEPLOY_COMPLETO.sql

-- 3. Link Profiles → Categories
supabase/migrations/20251225_link_profiles_categories.sql
```

---

### **5. Seed de Dados (Opcional)**

Se quiser popular com os 30 profissionais:

```bash
# Atualizar .env com novas credenciais
# Depois executar:
npx ts-node scripts/seed-professionals.ts
```

---

### **6. Testar Conexão**

```bash
# Reiniciar dev server
npm run dev

# Abrir: http://localhost:5173
# Verificar se conecta no novo banco
```

---

## 📊 COMPARAÇÃO DAS OPÇÕES

| Critério | Opção 1: Manter | Opção 2: Novo |
|----------|-----------------|---------------|
| **Tempo** | 0 min | ~20 min |
| **URL** | canapev.supabase.co ❌ | magnafest.supabase.co ✅ |
| **Dados** | Mantém tudo | Precisa migrar |
| **Profissional** | ❌ | ✅ |
| **Recomendo?** | Testes rápidos | Produção |

---

## 🎯 MINHA RECOMENDAÇÃO

### **Para Produção:** OPÇÃO 2 (Novo Projeto)
**Por quê?**
- URL bonita e profissional
- Nome correto em todos os dashboards
- Começar limpo é sempre melhor
- 20 minutos de setup vale a pena

### **Para Testes Rápidos:** OPÇÃO 1 (Manter)
**Por quê?**
- Se você só quer testar o frontend novo
- Economiza tempo AGORA
- Pode migrar depois se quiser

---

## ⚠️ IMPORTANTE: NÃO DELETAR O PROJETO ANTIGO AINDA

**Depois de criar o novo:**
1. ✅ Teste tudo no novo projeto
2. ✅ Valide que está funcionando 100%
3. ✅ Espere alguns dias
4. ❌ **SÓ ENTÃO** delete o projeto antigo

---

## 🔐 SEGURANÇA: VARIÁVEIS DE AMBIENTE

### Arquivos que precisam atualização:

#### **`.env`** (raiz do projeto)
```env
VITE_SUPABASE_URL=https://NOVO-ID.supabase.co
VITE_SUPABASE_ANON_KEY=nova-chave-anon
SUPABASE_SERVICE_ROLE_KEY=nova-service-role-key
```

#### **Verificar em:**
- `src/lib/supabase.ts` (se tiver)
- `src/config/supabase.ts` (se tiver)
- Scripts que usam Supabase

---

## 📝 CHECKLIST DE MIGRAÇÃO

- [ ] 1. Criar novo projeto "Portal MagnaFest" no Supabase
- [ ] 2. Copiar URL e chaves
- [ ] 3. Atualizar `.env` local
- [ ] 4. Executar `DEPLOY_COMPLETO.sql` no novo projeto
- [ ] 5. Executar migração de categories
- [ ] 6. Executar migração de profiles→categories link
- [ ] 7. (Opcional) Rodar seed de profissionais
- [ ] 8. Testar conexão com `npm run dev`
- [ ] 9. Validar que tabelas foram criadas
- [ ] 10. Testar CRUD básico
- [ ] 11. Aguardar alguns dias
- [ ] 12. Deletar projeto antigo "canapev"

---

## 🆘 TROUBLESHOOTING

### Erro: "Invalid API key"
**Solução:** Verifique se copiou a chave correta (anon vs service_role)

### Erro: "relation does not exist"
**Solução:** Execute os scripts SQL no SQL Editor do novo projeto

### Frontend não conecta
**Solução:** 
1. Verifique `.env`
2. Reinicie o dev server: `npm run dev`
3. Limpe cache do navegador

### Dados sumiram
**Solução:** Você está olhando o projeto certo no dashboard?

---

## ✅ MINHA SUGESTÃO FINAL

**FAÇA ASSIM:**

```bash
# 1. Criar novo projeto "Portal MagnaFest"
# 2. Copiar credenciais
# 3. Atualizar .env
# 4. Executar DEPLOY_COMPLETO.sql
# 5. Testar
# 6. Deletar projeto antigo depois
```

**Tempo total:** ~20 minutos  
**Resultado:** Projeto 100% rebranded e profissional

---

**Qual opção você prefere? Te ajudo com qualquer uma!** 🚀
