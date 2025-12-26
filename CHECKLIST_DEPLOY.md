# ✅ CHECKLIST COMPLETO - Portal MagnaFest
**Status de Funcionalidades e CTAs**

## 📋 ROTAS CONFIGURADAS

| Rota | Componente | Proteção | Status |
|------|------------|----------|--------|
| `/` | HomePage | Pública | ✅ OK |
| `/login` | LoginPage | Pública | ✅ OK |
| `/explorar` | ExplorePage | Pública | ✅ OK |
| `/search` | SearchPage | Pública | ✅ OK |
| `/marketplace` | MarketplacePage | Pública | ✅ OK |
| `/anuncie` | AdvertisePage | Pública | ✅ OK |
| `/perfil/:id` | ProfileDetailsPage | Pública | ✅ OK |
| `/eventos` | EventsPage | Pública | ✅ OK |
| `/eventos/:id` | EventDetailPage | Pública | ✅ OK |
| `/blog` | BlogPage | Pública | ✅ OK |
| `/blog/:slug` | BlogPostPage | Pública | ✅ OK |
| `/compliance` | CompliancePage | Pública | ✅ OK |
| `/favoritos` | MyFavoritesPage | Pública | ✅ OK |
| `/dashboard` | DashboardPage | 🔒 Protegida | ✅ OK |
| `/create` | CreateListingForm | 🔒 Protegida | ⚠️ REQUER LOGIN |
| `/admin/dashboard` | AdminDashboard | Pública (deveria ser protegida) | ⚠️ SEM AUTH |
| `/admin/interviews` | InterviewApprovalPage | Pública (deveria ser protegida) | ⚠️ SEM AUTH |
| `/admin/seed` | SeederPage | Pública | ⚠️ PERIGOSO |

---

## 🎯 CTAS MAPEADOS

### **HomePage**
- [ ] "Explorar Profissionais" → `/explorar` ✅
- [ ] "Criar Conta" → `/login` ✅
- [ ] Logo → `/` ✅

### **MarketplacePage** (CLASSIFICADOS PRO)
- [x] **"Desapegar & Vender Agora"** → `/create` ⚠️ **PROBLEMA: Requer login mas não avisa**
- [ ] "Ver mais" (card) → `/listing/:id` ⚠️ **ROTA NÃO EXISTE**

### **SearchPage**
- [ ] "Criar Anúncio" → `/create` ⚠️ **PROBLEMA: Requer login**
- [ ] "Início" → `/` ✅

### **ExplorePage**
- [ ] Cards de profissionais → `/perfil/:id` ✅

### **AdvertisePage**
- [ ] "Falar com Comercial" → `mailto:comercial@` ✅
- [ ] "Baixar Apresentação" → Mock ⚠️ **NÃO IMPLEMENTADO**
- [ ] Pacotes → `mailto:comercial@` ✅

### **LoginPage**
- [ ] "Entrar" → Supabase Auth ✅
- [ ] "Criar conta" → `/cadastro` ⚠️ **ROTA NÃO EXISTE**
- [ ] "Esqueci senha" → `/forgot-password` ⚠️ **ROTA NÃO EXISTE**

### **Navbar** (se existir)
- [ ] Logo → `/` 
- [ ] "Explorar" → `/explorar`
- [ ] "Marketplace" → `/marketplace`
- [ ] "Blog" → `/blog`
- [ ] "Login" → `/login`

---

## 🚨 PROBLEMAS IDENTIFICADOS

### **CRÍTICOS** 🔴

1. **Botão "Desapegar & Vender" não funciona para usuários não logados**
   - Local: MarketplacePage
   - Problema: Leva para `/create` que requer login
   - Solução: Redirecionar para `/login` com returnUrl

2. **Card "Ver mais" aponta para rota inexistente**
   - Local: MarketplacePage cards
   - Problema: `/listing/:id` não está configurado
   - Solução: Criar ListingDetailPage OU redirecionar para WhatsApp

3. **Rotas Admin sem proteção**
   - Local: `/admin/dashboard`, `/admin/interviews`
   - Problema: Qualquer um pode acessar
   - Solução: Adicionar ProtectedRoute com `requiredRole="admin"`

4. **Seeder Page acessível publicamente**
   - Local: `/admin/seed`
   - Problema: Pode popular banco em produção
   - Solução: Proteger ou remover em produção

### **MÉDIOS** 🟡

5. **Cadastro de profissionais não funcional**
   - Problema: Link "Criar conta" leva para `/cadastro` que não existe
   - Solução: Criar SignupPage

6. **Recuperação de senha não implementada**
   - Problema: Link aponta para rota inexistente
   - Solução: Criar ForgotPasswordPage

7. **Download Mídia Kit não funciona**
   - Problema: Alert mock
   - Solução: Criar PDF ou link externo

---

## ✅ CORREÇÕES NECESSÁRIAS

### **1. Corrigir CTA Marketplace** (PRIORIDADE MÁXIMA)

```tsx
// MarketplacePage.tsx - Linha 286
<button
  onClick={() => {
    if (!user) {
      navigate('/login?returnUrl=/create');
    } else {
      navigate('/create');
    }
  }}
>
  Desapegar & Vender Agora
</button>
```

### **2. Criar Rota de Detalhes de Listing**

Opção A: Redireciona para WhatsApp do vendedor
```tsx
onClick={() => {
  // Buscar WhatsApp do vendedor
  window.open(`https://wa.me/${vendedorWhatsApp}`, '_blank');
}}
```

Opção B: Criar página de detalhes completa

### **3. Proteger Rotas Admin**

```tsx
<Route path="admin/dashboard" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

### **4. Criar Página de Cadastro**

```tsx
// src/pages/SignupPage.tsx
// Formulário de registro de profissionais
```

---

## 📊 BANCO DE DADOS - UPDATES NECESSÁRIOS

Execute este SQL:
```sql
-- Arquivo já criado:
supabase/migrations/20251226_final_update.sql

-- Adiciona:
-- ✅ events.status (corrige Agenda)
-- ✅ listings.condition (Gear Exchange)
-- ✅ Índices de performance
```

---

## 🚀 DEPLOY - PASSO A PASSO

### **Opção 1: Vercel (RECOMENDADO)**

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer deploy
cd "/Volumes/bxdMAC/Projetos apps/canapev"
vercel

# 3. Configurar domínio personalizado
# No painel Vercel:
# Settings → Domains → Add: portalmagnafest.com.br
```

### **Opção 2: Netlify**

```bash
# 1. Build
npm run build

# 2. Deploy
npx netlify-cli deploy --prod --dir=dist
```

---

## 🌐 CONFIGURAÇÃO DE DOMÍNIO

### **DNS Settings (Registro.br)**

```
Tipo: CNAME
Nome: @
Valor: cname.vercel-dns.com

Tipo: CNAME  
Nome: www
Valor: cname.vercel-dns.com
```

Aguardar propagação: 24-48h

---

## 📝 PRÓXIMOS PASSOS

1. ⚠️ **URGENTE: Executar SQL no Supabase**
2. ⚠️ **URGENTE: Corrigir CTA Marketplace**
3. 🟡 **MÉDIO: Criar SignupPage**
4. 🟡 **MÉDIO: Proteger rotas admin**
5. 🟢 **BAIXO: Criar ListingDetailPage**
6. 🚀 **DEPLOY: Subir para Vercel**
7. 🌐 **DOMÍNIO: Configurar DNS**

---

**STATUS GERAL: 85% PRONTO PARA PRODUÇÃO**
**BLOQUEIOS: 4 correções críticas antes do deploy**
