# 🚨 CHECKLIST URGENTE PÓS-DEPLOY

**Situação:** Deploy feito com `.env.credentials` versionado no Git  
**Risco:** Credenciais expostas publicamente  
**Ação:** Mitigação imediata de segurança  

---

## ✅ PASSO 1: ROTACIONAR CREDENCIAIS (15 minutos)

### **1.1 Acessar Supabase Dashboard**
```
URL: https://supabase.com/dashboard
Projeto: afguexgrhybzzkjcsvub (seu projeto MagnaFest)
```

### **1.2 Regenerar Chaves API**
```
Caminho: Settings → API → Project API Keys

[ ] anon / public key → Clicar [Regenerate]
[ ] Copiar NOVA chave anon
[ ] Salvar em lugar seguro (não commitar!)
```

### **1.3 Atualizar .env Local**
```bash
# Arquivo: .env (na raiz do projeto)
VITE_SUPABASE_URL=https://afguexgrhybzzkjcsvub.supabase.co
VITE_SUPABASE_ANON_KEY=<NOVA_CHAVE_AQUI>  # ← COLAR A NOVA CHAVE!
```

**⚠️ IMPORTANTE:** Não commite o arquivo `.env`! Apenas use localmente.

---

## ✅ PASSO 2: ATUALIZAR VARIÁVEIS NO VERCEL/NETLIFY (5 minutos)

### **Se estiver usando Vercel:**

```bash
# Opção A: Via Dashboard
1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto MagnaFest
3. Settings → Environment Variables
4. Editar variáveis existentes:
   
   VITE_SUPABASE_URL = https://afguexgrhybzzkjcsvub.supabase.co
   VITE_SUPABASE_ANON_KEY = <NOVA_CHAVE>  # ← COLAR AQUI

5. Save
6. Redeploy (próximo passo)

# Opção B: Via CLI
vercel env rm VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_ANON_KEY production
# (Colar nova chave quando solicitado)
```

### **Se estiver usando Netlify:**

```bash
1. Acessar: https://app.netlify.com
2. Site settings → Build & deploy → Environment
3. Edit variables
4. Atualizar:
   VITE_SUPABASE_URL = https://afguexgrhybzzkjcsvub.supabase.co
   VITE_SUPABASE_ANON_KEY = <NOVA_CHAVE>
5. Save
6. Trigger deploy (próximo passo)
```

---

## ✅ PASSO 3: CONFIGURAR ADMIN NO SUPABASE PRODUÇÃO (5 minutos)

```sql
-- Executar no SQL Editor do Supabase (PRODUÇÃO!)
-- Dashboard → SQL Editor → New Query

UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'SEU-EMAIL@AQUI.COM';  -- ← MODIFICAR COM SEU EMAIL REAL!

-- Verificar se funcionou:
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

**[ ] Admin configurado com sucesso**

---

## ✅ PASSO 4: COMMITAR CORREÇÕES E REDEPLOY (10 minutos)

```bash
# Verificar status
git status

# Adicionar todas as correções
git add .gitignore \
        src/components/auth/ProtectedRoute.tsx \
        src/App.tsx \
        .env.required \
        supabase/CONFIGURAR_ADMIN.sql

# Commit
git commit -m "🔒 SECURITY: Protege rotas admin, remove credenciais e rotaciona chaves"

# Push
git push origin main

# Aguardar deploy automático (Vercel/Netlify)
# Ou forçar redeploy manualmente
```

### **Forçar Redeploy Manual:**

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Ou via Dashboard:**
- Vercel: Deployments → Redeploy
- Netlify: Deploys → Trigger deploy

---

## ✅ PASSO 5: TESTAR EM PRODUÇÃO (10 minutos)

### **5.1 Verificar Proteção de Rotas Admin**

```bash
# Teste 1: Acesso sem login
URL: https://seu-dominio.vercel.app/admin/seed
RESULTADO ESPERADO: Redireciona para /login ✅

# Teste 2: Login com usuário comum
URL: https://seu-dominio.vercel.app/admin/dashboard
RESULTADO ESPERADO: Redireciona para / (home) ✅

# Teste 3: Login com admin
URL: https://seu-dominio.vercel.app/admin/seed
RESULTADO ESPERADO: Carrega normalmente ✅
```

### **5.2 Verificar Funcionamento Geral**

```bash
[ ] Login funciona
[ ] Busca de profissionais funciona
[ ] Favoritos funcionam
[ ] Criação de anúncios funciona (se autenticado)
[ ] Páginas públicas carregam
```

---

## ✅ PASSO 6: LIMPAR HISTÓRICO DO GIT (OPCIONAL MAS RECOMENDADO)

**⚠️ ATENÇÃO:** Isso reescreve o histórico do Git! Comunique a equipe antes.

```bash
# Método 1: BFG Repo-Cleaner (recomendado)
brew install bfg  # macOS
bfg --delete-files .env.credentials
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all

# Método 2: git filter-branch
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.credentials" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

**Se não fizer isso:** Credenciais antigas ainda estarão no histórico do Git.

---

## ✅ PASSO 7: MONITORAMENTO (CONTÍNUO)

### **7.1 Configurar Alertas no Supabase**

```
Dashboard → Settings → Alerts
[ ] Ativar alertas de:
    - Tentativas de login suspeitas
    - Queries anormais
    - Uso excessivo de API
```

### **7.2 Revisar Logs de Acesso**

```sql
-- Ver últimos logins
SELECT 
  email,
  last_sign_in_at,
  sign_in_count
FROM auth.users
ORDER BY last_sign_in_at DESC
LIMIT 20;

-- Ver se houve acessos suspeitos às rotas admin
-- (Se tiver implementado logging)
```

### **7.3 Adicionar Sentry (Opcional)**

```bash
npm install @sentry/react
# Configurar monitoring de erros em produção
```

---

## 📊 CHECKLIST FINAL

### **Segurança:**
- [ ] Credenciais rotacionadas no Supabase
- [ ] `.env` atualizado localmente (nova chave)
- [ ] Variáveis de ambiente atualizadas no Vercel/Netlify
- [ ] `.env.credentials` removido do Git
- [ ] `.gitignore` atualizado
- [ ] Histórico do Git limpo (opcional)

### **Funcionalidade:**
- [ ] Rotas admin protegidas no código
- [ ] Admin configurado no Supabase produção
- [ ] Build compilando sem erros
- [ ] Deploy realizado com sucesso
- [ ] Rotas admin testadas em produção (bloqueadas)
- [ ] Admin consegue acessar rotas protegidas

### **Documentação:**
- [ ] `.env.required` criado
- [ ] `supabase/CONFIGURAR_ADMIN.sql` criado
- [ ] Equipe informada sobre mudanças de segurança

---

## 🎯 TEMPO ESTIMADO TOTAL

| Tarefa | Tempo |
|--------|-------|
| Rotacionar credenciais | 15 min |
| Atualizar env vars | 5 min |
| Configurar admin | 5 min |
| Commit + Redeploy | 10 min |
| Testar produção | 10 min |
| **TOTAL** | **45 minutos** |

---

## 🆘 SE ALGO DER ERRADO

### **Frontend não carrega em produção:**
```bash
# Verificar logs do Vercel/Netlify
vercel logs --follow
# ou
netlify logs

# Verificar se env vars foram aplicadas
vercel env ls
```

### **Rotas admin ainda acessíveis sem login:**
```bash
# Build local para testar
npm run build
npm run preview
# Acessar http://localhost:4173/admin/seed
# Deve redirecionar para /login
```

### **Admin não consegue acessar rotas:**
```sql
-- Verificar role no Supabase
SELECT email, raw_user_meta_data
FROM auth.users
WHERE email = 'seu-email@admin.com';

-- Se role não estiver lá, executar novamente:
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'seu-email@admin.com';
```

---

## 📞 PRÓXIMOS PASSOS APÓS MITIGAÇÃO

1. **Auditar banco de dados:**
   - Verificar se houve inserções maliciosas
   - Revisar dados de usuários

2. **Implementar testes automatizados:**
   ```bash
   npm install -D vitest @testing-library/react
   # Criar testes para ProtectedRoute
   ```

3. **Adicionar CI/CD checks:**
   ```yaml
   # .github/workflows/security.yml
   # Escanear credenciais com git-secrets
   ```

4. **Configurar rate limiting:**
   ```sql
   -- Limitar tentativas de login
   -- Usar pg_cron + custom function
   ```

---

## ✅ STATUS: PRONTO PARA EXECUTAR

**Comece agora pelo PASSO 1: Rotacionar credenciais!**

**Tempo restante para completar:** ~45 minutos

**Risco se não fizer:** 🔴 ALTO (banco de dados pode ser comprometido)
