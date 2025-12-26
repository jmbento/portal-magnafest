# 🚀 GUIA DE DEPLOY - SISTEMA DE AUTO-ALIMENTAÇÃO

## ⚠️ DEPLOY MANUAL (via Supabase Dashboard)

Como o Supabase CLI não está instalado, siga este processo manual:

---

## 📊 PASSO 1: APLICAR MIGRAÇÕES SQL

### 1.1 Acesse o SQL Editor do Supabase
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto **Canapev**
3. Clique em **SQL Editor** no menu lateral

### 1.2 Execute a Migração de Profiles
Cole e execute o conteúdo de:
```
supabase/migrations/20251224_create_profiles_feed.sql
```

**Resultado esperado:** Tabela `profiles` criada com políticas RLS ✅

### 1.3 Execute a Migração de Events
Cole e execute o conteúdo de:
```
supabase/migrations/20251224_create_events.sql
```

**Resultado esperado:** Tabela `events` criada com políticas RLS ✅

---

## ⚡ PASSO 2: DEPLOY DA EDGE FUNCTION

### 2.1 Acesse Edge Functions
1. No dashboard do Supabase, clique em **Edge Functions**
2. Clique em **Create a new function**

### 2.2 Configure a Function
**Nome:** `sector-crawler`

### 2.3 Cole o Código
Copie todo o conteúdo de:
```
supabase/functions/sector-crawler/index.ts
```

### 2.4 Deploy
1. Clique em **Deploy function**
2. Aguarde confirmação de sucesso

---

## 🧪 PASSO 3: TESTAR A FUNCTION

### 3.1 Via Dashboard
1. Na página da Edge Function, clique em **Invoke**
2. Método: **POST**
3. Body: `{}` (vazio)
4. Clique em **Send request**

### 3.2 Verificar Response
Você deve receber algo como:
```json
{
  "success": true,
  "term": "DJ profissional",
  "inserted_count": 2
}
```

### 3.3 Verificar no Banco
1. Vá para **Table Editor**
2. Selecione a tabela `profiles`
3. Você deve ver os novos registros inseridos com:
   - `is_claimed: false`
   - `source: auto-bot`

---

## ⏰ PASSO 4: AUTOMATIZAR (OPCIONAL)

### 4.1 Criar Cron Job
1. No dashboard, vá em **Database** → **Cron Jobs** (se disponível)
2. Ou use **pg_cron** via SQL:

```sql
-- Executar crawler a cada 6 horas
SELECT cron.schedule(
  'sector-crawler-job',
  '0 */6 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://SEU_PROJETO.supabase.co/functions/v1/sector-crawler',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer SEU_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
```

### 4.2 Ou use Serviço Externo
- **Cron-job.org**: https://cron-job.org
- **EasyCron**: https://www.easycron.com
- **GitHub Actions** (se o repo for público)

**Configuração:**
- **URL:** `https://SEU_PROJETO.supabase.co/functions/v1/sector-crawler`
- **Método:** POST
- **Headers:** 
  ```
  Authorization: Bearer SUA_ANON_KEY
  Content-Type: application/json
  ```
- **Frequência:** A cada 6 horas (ou conforme preferir)

---

## 🔑 OBTER CREDENCIAIS

### Service Role Key (para cron interno)
1. Vá em **Settings** → **API**
2. Copie o **service_role key** (NUNCA exponha publicamente!)

### Anon Key (para cron externo)
1. Mesma página (**Settings** → **API**)
2. Copie o **anon/public key** (seguro para expor)

### Project URL
```
https://SEU_PROJETO_ID.supabase.co
```

---

## 📋 CHECKLIST DE DEPLOY

- [ ] Migração `20251224_create_profiles_feed.sql` executada
- [ ] Migração `20251224_create_events.sql` executada
- [ ] Edge Function `sector-crawler` criada
- [ ] Edge Function deployed com sucesso
- [ ] Teste manual executado (POST na function)
- [ ] Verificado insert no banco (tabela `profiles`)
- [ ] (Opcional) Cron job configurado para execução automática

---

## 🆘 TROUBLESHOOTING

### Erro: "relation profiles does not exist"
**Solução:** Execute a migração SQL primeiro antes de testar a function.

### Erro: "permission denied for table profiles"
**Solução:** Verifique se as políticas RLS estão ativas:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

### Function não retorna dados
**Solução:** Verifique logs da Edge Function no dashboard.

### Duplicatas aparecendo
**Solução:** Normal! O `upsert` com `onConflict: 'website'` previne duplicatas.

---

## 📊 MONITORAMENTO

### Verificar quantidade de perfis auto-gerados
```sql
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE is_claimed = false) as nao_reivindicados,
  COUNT(*) FILTER (WHERE is_claimed = true) as reivindicados
FROM public.profiles;
```

### Ver últimos perfis inseridos
```sql
SELECT name, category, website, created_at 
FROM public.profiles 
WHERE source = 'auto-bot'
ORDER BY created_at DESC 
LIMIT 10;
```

### Categorias mais populares
```sql
SELECT category, COUNT(*) as quantidade
FROM public.profiles
GROUP BY category
ORDER BY quantidade DESC;
```

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

1. **Página de Claim de Perfis**
   - Criar `/reivindicar` route
   - Permitir usuários acharem seu perfil e marcarem `is_claimed = true`

2. **Dashboard de Estatísticas**
   - Mostrar total de empresas no setor
   - Percentual de perfis reivindicados

3. **Campanha Viral**
   - "Sua empresa já está aqui! Reivindique agora"
   - Email marketing com perfis não-reivindicados

---

## ✅ STATUS

Aguardando execução manual dos passos acima.

**Arquivos prontos:**
- ✅ `supabase/migrations/20251224_create_profiles_feed.sql`
- ✅ `supabase/migrations/20251224_create_events.sql`
- ✅ `supabase/functions/sector-crawler/index.ts`
- ✅ `supabase/functions/sector-crawler/README.md`
- ✅ Este guia (`DEPLOY_GUIDE.md`)

**Seu trabalho:**
1. Acessar dashboard do Supabase
2. Executar SQLs
3. Criar e deploy da Edge Function
4. Testar
5. Reportar sucesso ou erros
