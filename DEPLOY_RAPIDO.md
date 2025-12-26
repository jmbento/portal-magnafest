# 🚀 GUIA RÁPIDO DE DEPLOY
**Portal MagnaFest → portalmagnafest.com.br**

## 1️⃣ EXECUTAR SQL (OBRIGATÓRIO)
```bash
# Arquivo: supabase/migrations/20251226_final_update.sql
# Cole no Supabase SQL Editor → RUN
```

## 2️⃣ DEPLOY VERCEL
```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd "/Volumes/bxdMAC/Projetos apps/canapev"
vercel --prod
```

## 3️⃣ CONFIGURAR DOMÍNIO
**No Registro.br:**
```
CNAME @ → cname.vercel-dns.com
CNAME www → cname.vercel-dns.com
```

**No Vercel Dashboard:**
- Settings → Domains → Add: `portalmagnafest.com.br`

## ✅ PRONTO!
Aguardar propagação DNS (2-48h)
Acessar: https://portalmagnafest.com.br
