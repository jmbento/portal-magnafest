# 🚨 CORREÇÃO URGENTE: Cadastro de Usuários

## ❌ Problema
Erro ao tentar criar conta:
```
Could not find the 'email' column of 'profiles' in the schema cache
```

## ✅ Solução

### **1. Executar Migration no Supabase**

Acesse: https://supabase.com/dashboard/project/afguexgrhybzzkjcsvub/sql

**Cole e execute este SQL:**

```sql
-- Fix profiles table for user signup
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS trust_score INTEGER DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp TEXT,
  ADD COLUMN IF NOT EXISTS instagram TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS main_category_id UUID REFERENCES service_categories(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_city_state ON profiles(city, state);

-- RLS Policy para signup
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verificar
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
```

### **2. Aguardar Deploy**
O código já foi corrigido e está sendo deployado agora.

### **3. Testar Novamente**
Após a migration e o deploy:
1. Acesse: https://canapev.vercel.app/cadastro
2. Preencha o formulário
3. Clique em "Criar Conta Grátis"
4. ✅ Deve funcionar!

---

## 📋 O Que Foi Corrigido

### **No Código (SignupPage.tsx):**
- ✅ Removida tentativa de inserir `email` diretamente (vem do auth)
- ✅ Removida coluna `is_banned` (não existe)
- ✅ Adicionado tratamento de erro para perfil duplicado
- ✅ Melhoradas validações

### **No Banco (Migration):**
- ✅ Adicionadas 12 colunas faltantes
- ✅ Criados índices para performance
- ✅ Ajustadas RLS policies
- ✅ Permitido INSERT para usuários autenticados

---

## 🧪 Teste Manual

Execute no SQL Editor do Supabase:

```sql
-- Verificar estrutura da tabela
\d profiles

-- Verificar policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- Testar insert manual (substitua os valores)
INSERT INTO profiles (id, name, description, trust_score, is_verified)
VALUES (
  gen_random_uuid(),
  'Teste',
  'Descrição teste',
  100,
  false
);
```

---

## ⚠️ IMPORTANTE

**Execute a migration ANTES de testar o cadastro!**

Arquivo completo: `supabase/migrations/20251228_fix_profiles_for_signup.sql`

---

**Status:** 🔧 Correção aplicada  
**Deploy:** ⏳ Em andamento  
**Data:** 28/12/2025
