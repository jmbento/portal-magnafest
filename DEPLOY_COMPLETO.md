# 🚀 GUIA COMPLETO - SQL + DEPLOY

## 📋 PASSO 1: EXECUTAR SQLs NO SUPABASE (ORDEM CORRETA)

### **1️⃣ Criar Tabela Listings**
```sql
-- Cole no Supabase SQL Editor:
supabase/migrations/20251226_create_listings.sql

-- Resultado esperado:
📦 TABELA LISTINGS CRIADA COM SUCESSO!
✅ Tabela listings criada
✅ Tabela listings_media criada
✅ Tabela categories criada
```

### **2️⃣ Atualizar Colunas (Events.status + Listings.condition)**
```sql
-- Cole no Supabase SQL Editor:
supabase/migrations/20251226_final_update.sql

-- Resultado esperado:
✅ events.status configurado
✅ listings.condition configurado
🎉 ATUALIZAÇÃO COMPLETA!
```

### **3️⃣ Sistema de Moderação**
```sql
-- Cole no Supabase SQL Editor:
supabase/migrations/20251226_moderation_system.sql

-- Resultado esperado:
✅ Campos de moderação em profiles OK
✅ Tabela moderation_log criada
🛡️ Policy listings atualizada
🛡️ Policy posts criada
🛡️ Policy events criada
🚀 SISTEMA PRONTO!
```

---

## 🚀 PASSO 2: FAZER DEPLOY (VERCEL)

### **Preparação:**
```bash
# 1. Verificar build local
cd "/Volumes/bxdMAC/Projetos apps/canapev"
npm run build

# Deve concluir sem erros
```

### **Deploy:**
```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy de produção
vercel --prod

# Responda:
# - Project name: portal-magnafest
# - Setup: Y
# - Link existing: N
# - Directory: . (atual)
# - Override settings: N
```

### **Output esperado:**
```
✅ Deployed to production
🔗 https://portal-magnafest.vercel.app
🔗 https://portal-magnafest-[hash].vercel.app
```

---

## 🌐 PASSO 3: CONFIGURAR DOMÍNIO (Opcional)

### **No Vercel Dashboard:**
1. Vá em **Settings** → **Domains**
2. Clique **Add Domain**
3. Digite: `portalmagnafest.com.br`
4. Copie os DNS records mostrados

### **No Registro.br:**
1. Faça login
2. Vá em **DNS** → **Editar Zona**
3. Adicione:
   ```
   Tipo: CNAME
   Nome: @
   Valor: cname.vercel-dns.com
   TTL: 3600

   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   TTL: 3600
   ```

### **Propagação:**
- Tempo: 2-48 horas (geralmente < 2h)
- Teste: `dig portalmagnafest.com.br`

---

## ✅ CHECKLIST COMPLETO

### **Banco de Dados:**
- [ ] Tabela listings criada
- [ ] Events.status adicionado
- [ ] Listings.condition adicionado
- [ ] Sistema de moderação ativo
- [ ] Trust scores funcionando

### **Deploy:**
- [ ] Build local OK
- [ ] Vercel CLI instalado
- [ ] Deploy executado
- [ ] Site acessível online
- [ ] Variáveis de ambiente configuradas (se necessário)

### **Domínio (Opcional):**
- [ ] Domínio adicionado no Vercel
- [ ] DNS configurado no Registro.br
- [ ] Aguardando propagação

---

## 🔗 URLs PARA TESTAR

### **Temporária Vercel:**
```
https://portal-magnafest.vercel.app
```

### **Páginas para testar:**
```
/                    → HomePage
/explorar            → Profissionais
/marketplace         → Classificados (NOVO!)
/termos              → Protocolos
/login               → Login
/blog                → Blog
/eventos             → Agenda
```

---

## 🧪 TESTAR MARKETPLACE

```sql
-- Criar anúncio de teste no Supabase:
INSERT INTO listings (
  title, 
  description, 
  price_min, 
  listing_type, 
  condition,
  profiles_id
)
VALUES (
  'Mesa Soundcraft Si Expression 3',
  'Mesa digital em perfeito estado. Pouco usada em eventos corporativos. Sem defeitos, todas as funções operando normalmente.',
  15000,
  'product_sale',
  'seminovo',
  (SELECT id FROM profiles LIMIT 1)
);

-- Verificar no site: /marketplace
```

---

## 🎯 PRÓXIMOS PASSOS PÓS-DEPLOY

1. **Testar funcionalidades:**
   - [ ] Navegação entre páginas
   - [ ] Marketplace exibe anúncios
   - [ ] Login funciona
   - [ ] Página de termos carrega

2. **Performance:**
   - [ ] Lighthouse score
   - [ ] Core Web Vitals
   - [ ] Images otimizadas

3. **SEO:**
   - [ ] Meta tags
   - [ ] Sitemap
   - [ ] Google Search Console

4. **Analytics (Opcional):**
   - [ ] Google Analytics
   - [ ] Hotjar
   - [ ] Vercel Analytics

---

## 📞 SUPORTE

**Erros comuns:**

### **"404 ao navegar"**
```json
// Criar vercel.json na raiz:
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### **"Env variables não carregam"**
1. Dashboard Vercel → Settings → Environment Variables
2. Adicionar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Redeploy

### **"Build falhou"**
```bash
# Limpar e rebuildar
rm -rf node_modules dist .next
npm install
npm run build
```

---

**🎉 PRONTO! Siga os 3 passos e seu site estará no ar!** 🚀
