# 🔧 CORREÇÃO DO ERRO - Tabela Listings

## ❌ ERRO ENCONTRADO:
```
ERROR: 42P01: relation "public.listings" does not exist
```

**Causa:** O banco não tem a tabela de anúncios/marketplace ainda.

---

## ✅ SOLUÇÃO RÁPIDA

### **Opção 1: Executar SQL Corrigido (RECOMENDADO)**

```sql
-- Arquivo: supabase/migrations/20251226_final_update.sql
-- NOVAMENTE: Agora está seguro, não vai dar erro
```

**O que faz:**
- ✅ Verifica se tabelas existem antes de alterar
- ✅ Só adiciona `events.status` (crítico para Agenda)
- ✅ Ignora `listings` se não existir
- ✅ Mostra relatório do que foi feito

---

### **Opção 2: Desabilitar MarketplacePage Temporariamente**

Se você não vai usar Marketplace agora, pode desabilitar:

```tsx
// src/App.tsx - Linha ~92
// COMENTAR esta linha:
// <Route path="marketplace" element={<MarketplacePage />} />

// OU criar página placeholder:
<Route path="marketplace" element={
  <div className="min-h-screen bg-magna-black text-white flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">🚧 Em Breve</h1>
      <p className="text-gray-400">Marketplace em desenvolvimento</p>
    </div>
  </div>
} />
```

---

### **Opção 3: Criar Tabela Listings**

Se você QUER o Marketplace, precisa criar a tabela:

```sql
-- Criar tabela listings básica
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_unit TEXT DEFAULT 'unit',
  listing_type TEXT NOT NULL DEFAULT 'product_sale',
  condition TEXT DEFAULT 'usado',
  status TEXT DEFAULT 'active',
  location_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT listings_type_check 
    CHECK (listing_type IN ('venue', 'service', 'product_rent', 'product_sale')),
  CONSTRAINT listings_condition_check 
    CHECK (condition IN ('novo', 'seminovo', 'usado', 'pecas')),
  CONSTRAINT listings_status_check 
    CHECK (status IN ('active', 'inactive', 'sold'))
);

-- Índices
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_type ON public.listings(listing_type);
CREATE INDEX idx_listings_condition ON public.listings(condition);

-- RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings públicos são visíveis"
  ON public.listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Usuários podem criar listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Tabela de mídia (imagens)
CREATE TABLE IF NOT EXISTS public.listings_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_media_listing ON public.listings_media(listing_id);
```

---

## 🎯 QUAL OPÇÃO ESCOLHER?

| Situação | Opção Recomendada |
|----------|-------------------|
| **Só quero Agenda funcionando** | Opção 1 (SQL seguro) |
| **Não vou usar Marketplace agora** | Opção 2 (Desabilitar) |
| **Quero Marketplace completo** | Opção 1 + Opção 3 |

---

## 📋 PASSO A PASSO RECOMENDADO

### **1. Executar SQL Seguro**
```sql
-- supabase/migrations/20251226_final_update.sql
-- Execute no Supabase SQL Editor
```

**Resultado esperado:**
```
✅ Tabela events existe
  └─ ✅ Coluna status OK
ℹ️ Tabela listings não existe (OK se não usar Marketplace)
🎉 SCRIPT CONCLUÍDO!
```

### **2. Se quiser Marketplace:**
```sql
-- Cole o SQL da Opção 3 acima
-- Execute no Supabase SQL Editor
```

### **3. Fazer Deploy**
```bash
vercel --prod
```

---

## 🚀 DEPLOY SEM MARKETPLACE

Se você quer fazer deploy AGORA sem marketplace:

```bash
# 1. Execute SQL seguro no Supabase
# (apenas corrige events.status)

# 2. Navegador, acesse Navbar ou HomePage
# Remova link para /marketplace se existir

# 3. Deploy
vercel --prod
```

**Tudo vai funcionar EXCETO:**
- ❌ /marketplace (404 ou página vazia)
- ✅ /explorar (profissionais) → FUNCIONA
- ✅ /blog → FUNCIONA  
- ✅ /eventos → FUNCIONA
- ✅ /login → FUNCIONA

---

## ✅ QUAL É O MAIS RÁPIDO?

**Para deploy IMEDIATO:**
1. Execute `20251226_final_update.sql` (versão corrigida)
2. Comente rota marketplace no `App.tsx`
3. Deploy!

**Marketplace você cria depois com calma** 😉

---

**Quer que eu:**
- A) Crie script SQL completo com tabela listings?
- B) Desabilite marketplace e faça deploy direto?
- C) Outro?
