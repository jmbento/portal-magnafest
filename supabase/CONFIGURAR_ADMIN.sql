-- =====================================================================
-- CONFIGURAR PRIMEIRO ADMIN - PORTAL MAGNAFEST
-- =====================================================================
-- Execute este SQL no SQL Editor do Supabase Dashboard
-- Settings → SQL Editor → New Query → Colar este código
-- =====================================================================

-- =====================================================================
-- PASSO 1: CRIAR FUNÇÃO PARA VERIFICAR SE É ADMIN
-- =====================================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================================
-- PASSO 2: CONFIGURAR SEU USUÁRIO COMO ADMIN
-- =====================================================================
-- ⚠️ IMPORTANTE: Substitua 'seu-email@admin.com' pelo seu email real!

UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'seu-email@admin.com';  -- ← MODIFICAR AQUI!


-- =====================================================================
-- PASSO 3: VERIFICAR SE FUNCIONOU
-- =====================================================================
-- Execute esta query para confirmar:

SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';

-- Deve retornar seu usuário com role = 'admin'


-- =====================================================================
-- PASSO 4 (OPCIONAL): ADICIONAR MAIS ADMINS
-- =====================================================================
-- Para adicionar outros administradores:

-- UPDATE auth.users
-- SET raw_user_meta_data = 
--   COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
-- WHERE email IN ('admin2@example.com', 'admin3@example.com');


-- =====================================================================
-- PASSO 5 (OPCIONAL): RLS POLICIES PARA TABELAS SENSÍVEIS
-- =====================================================================
-- Proteger tabela posts para apenas admins deletarem:

-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Apenas admins podem deletar posts"
--   ON posts FOR DELETE
--   USING (is_admin());

-- CREATE POLICY "Apenas admins podem modificar status de moderação"
--   ON posts FOR UPDATE
--   USING (is_admin())
--   WITH CHECK (is_admin());


-- =====================================================================
-- TESTE NO FRONTEND
-- =====================================================================
-- 1. Faça login com o email configurado como admin
-- 2. Tente acessar: http://localhost:5173/admin/dashboard
-- 3. Deve funcionar normalmente
-- 4. Faça logout e tente acessar novamente
-- 5. Deve redirecionar para "/" (home)
-- 6. Faça login com usuário NÃO-admin
-- 7. Tente acessar /admin/dashboard
-- 8. Deve redirecionar para "/" e mostrar erro no console
-- =====================================================================
