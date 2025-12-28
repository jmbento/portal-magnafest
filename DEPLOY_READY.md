# 🚀 DEPLOY PORTAL MAGNAFEST - CHECKLIST COMPLETO

## ✅ PRÉ-REQUISITOS

- [ ] Conta no [Vercel](https://vercel.com) criada
- [ ] Projeto Supabase configurado
- [ ] Variáveis de ambiente coletadas

---

## 📋 PASSO A PASSO

### **1. EXECUTAR SEED DE CONTEÚDO REAL**

No SQL Editor do Supabase, execute:

```sql
-- Arquivo: supabase/SEED_CONTEUDO_REAL.sql
```

Isso vai criar:
- ✅ 20 posts de blog (produção, jurídico, tech, marketing)
- ✅ 10 anúncios marketplace (equipamentos reais)
- ✅ 2 anúncios do próprio portal (demonstração)

---

### **2. BUILD LOCAL (TESTE)**

```bash
npm run build
```

Se der erro, corrigir antes de fazer deploy.

---

### **3. DEPLOY NO VERCEL**

#### **Opção A: Via CLI (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir prompts:
# - Link to existing project? No
# - Project name: portal-magnafest
# - Framework: Vite
# - Deploy? Yes
```

#### **Opção B: Via Dashboard**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório Git
3. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

---

### **4. CONFIGURAR VARIÁVEIS DE AMBIENTE**

No Dashboard do Vercel (Settings → Environment Variables):

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

⚠️ **Importante:** Após adicionar, fazer **Redeploy**.

---

### **5. CONFIGURAR DOMÍNIO CUSTOMIZADO (Opcional)**

No Dashboard do Vercel (Settings → Domains):

1. Adicionar domínio: `portalmagnafest.com.br`
2. Configurar DNS conforme instruções
3. Aguardar propagação (até 48h)

---

## 🎯 PRÓXIMOS PASSOS PÓS-DEPLOY

### **Conteúdo Necessário:**

- [ ] **Hero Image:** `/public/hero-market.jpg` (1920x1080)
- [ ] **Logo MagnaFest:** `/public/logo.svg` ou `.png`
- [ ] **Blog Post Images:** `/public/blog/*.jpg` (20 imagens)
- [ ] **Mídia Kit PDF:** `/public/assets/docs/media-kit-magnafest-2025.pdf`

### **Anúncios de Demonstração:**

Já inseridos no seed:
- ✅ "Anuncie no Portal - Plano Pro" (R$ 1.997/mês)
- ✅ "Banner Homepage" (R$ 497/mês)

Estes aparecerão no marketplace para os visitantes entenderem os formatos.

---

## 🔍 CHECKLIST FINAL

- [ ] Site abre sem erros
- [ ] Marketplace mostra 10 anúncios
- [ ] Blog tem 20 posts
- [ ] Formulários de login/cadastro funcionam
- [ ] Links de "Anuncie Aqui" levam para `/anunciar`
- [ ] Mobile responsivo OK
- [ ] Lighthouse Performance > 80

---

## 📞 SUPORTE

Se algo der errado:
1. Verificar logs no Dashboard Vercel
2. Testar build local: `npm run build && npm run preview`
3. Confirmar variáveis de ambiente no Vercel

---

**🎉 Após deploy, o Portal MagnaFest estará LIVE!** ✨
