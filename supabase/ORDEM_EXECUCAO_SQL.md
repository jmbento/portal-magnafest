# ⚠️ ORDEM CORRETA DE EXECUÇÃO DOS SQLs

## 🎯 IMPORTANTE: Execute UM de cada vez!

Você tem 2 opções dependendo do que quer:

---

## **OPÇÃO 1: Sistema Básico (SEM Marketplace)**

Se você NÃO vai usar Classificados/Marketplace agora:

### **Execute APENAS:**
```sql
-- Arquivo: 20251226_moderation_system.sql
-- Contém TUDO de moderação
```

**O que faz:**
- ✅ Cria campos de moderação em `profiles`
- ✅ Cria tabela `moderation_log`
- ✅ Cria funções `ban_user()`, `apply_strike()`
- ✅ Cria RLS policies
- ⚠️ Ignora `listings` se não existir (não dá erro)

**Resultado esperado:**
```
✅ Campos de moderação em profiles OK
✅ Tabela moderation_log criada
ℹ️ Tabela listings não existe - criação de marketplace pendente
🛡️ Policy posts criada (genérica)
🛡️ Policy events criada (genérica)
🚀 SISTEMA PRONTO!
```

---

## **OPÇÃO 2: Sistema Completo (COM Marketplace)**

Se você QUER usar Classificados/Marketplace:

### **1º - Execute:**
```sql
-- Arquivo: 20251226_final_update.sql  
-- Cria coluna condition em listings
```

### **2º - Execute:**
```sql
-- Arquivo: 20251226_moderation_system.sql
-- Sistema de moderação completo
```

**Resultado esperado:**
```
-- Do primeiro SQL:
✅ Tabela listings existe
  └─ ✅ Coluna condition OK
🎉 SCRIPT CONCLUÍDO SEM ERROS!

-- Do segundo SQL:
✅ Campos de moderação em profiles OK
✅ Tabela moderation_log criada
🛡️ Policy listings atualizada
🛡️ Policy posts criada
🛡️ Policy events criada
🚀 SISTEMA PRONTO!
```

---

## **OPÇÃO 3: Criar Tabela Listings do Zero**

Se `listings` não existe e você quer criar:

### **Execute ESTE antes dos outros:**

```sql
-- Criar tabela listings básica
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price_min DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_unit TEXT DEFAULT 'unit',
  listing_type TEXT NOT NULL DEFAULT 'product_sale',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  profiles_id UUID REFERENCES public.profiles(id),
  
  CONSTRAINT listings_type_check 
    CHECK (listing_type IN ('venue', 'service', 'product_rent', 'product_sale')),
  CONSTRAINT listings_status_check 
    CHECK (status IN ('active', 'inactive', 'sold'))
);

-- Índices básicos
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_type ON public.listings(listing_type);
CREATE INDEX idx_listings_profile ON public.listings(profiles_id);

-- RLS básico
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings públicos são visíveis"
  ON public.listings FOR SELECT
  USING (status = 'active');

RAISE NOTICE '✅ Tabela listings criada!';
```

**Depois execute:**
1. `20251226_final_update.sql` (adiciona coluna condition)
2. `20251226_moderation_system.sql` (moderação)

---

## 🔍 **DIAGNÓSTICO: Qual SQL deu erro?**

Você executou qual dos arquivos SQL que deu esse erro?

**Se foi `20251226_final_update.sql`:**
- ✅ Está OK! O erro é esperado se listings não existe
- ✅ Ele deve ter mostrado: "⚠️ Tabela listings não existe - ignorando"
- ✅ Continue normalmente

**Se foi `20251226_moderation_system.sql`:**
- ⚠️ Não deveria dar erro (tem proteção)
- 🔍 Pode ter executado versão antiga sem proteção
- ✅ Use a versão corrigida que acabei de atualizar

---

## ✅ **RECOMENDAÇÃO PARA VOCÊ:**

Baseado em que você não tem tabela `listings`:

```bash
# Execute APENAS isto:
1. Cole: 20251226_moderation_system.sql
2. Execute (RUN)
3. Pronto! Sistema de moderação funcionando

# Marketplace você cria depois quando precisar
```

**Ignore** o erro de listings se ele aparecer como WARNING. 
O importante é que apareça:
```
✅ Campos de moderação em profiles OK
✅ Tabela moderation_log criada
🚀 SISTEMA PRONTO!
```

---

**O sistema de moderação vai funcionar mesmo sem listings!** 🎉
