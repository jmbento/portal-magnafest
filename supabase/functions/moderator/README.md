# 🤖 MagnaGuardian - Moderador IA Automático

## 📋 OVERVIEW

Edge Function que analisa automaticamente novos anúncios usando:
- **OpenAI Moderation API:** Detecta ódio, violência, conteúdo sexual
- **GPT-4o-mini:** Análise contextual (golpes, spam, produtos ilegais)

**Fluxo:**
```
Novo Anúncio → Database Webhook → Edge Function → OpenAI APIs → Aprovar/Rejeitar
```

---

## 🚀 DEPLOY PASSO A PASSO

### **1. Configurar Variáveis de Ambiente**

No Supabase Dashboard:
1. **Settings** → **Edge Functions** → **Environment Variables**
2. Adicionar:
   ```
   OPENAI_API_KEY = sk-proj-...
   ```

### **2. Fazer Deploy da Função**

```bash
# Instalar Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref [seu-project-ref]

# Deploy
cd "/Volumes/bxdMAC/Projetos apps/canapev"
supabase functions deploy moderator
```

**Output esperado:**
```
Deploying function: moderator
Version: 1.0.0
Status: DEPLOYED ✅
Endpoint: https://[project-ref].supabase.co/functions/v1/moderator
```

### **3. Configurar Database Webhook**

No Supabase Dashboard:
1. **Database** → **Webhooks**
2. **Enable Webhooks**
3. **Create a new hook:**
   - **Name:** MagnaGuardian Auto-Moderate
   - **Table:** `listings`
   - **Events:** `INSERT`
   - **Type:** `HTTP Request`
   - **Method:** `POST`
   - **URL:** `https://[project-ref].supabase.co/functions/v1/moderator`
   - **HTTP Headers:**
     ```
     Authorization: Bearer [YOUR_SERVICE_ROLE_KEY]
     Content-Type: application/json
     ```
4. **Save**

---

## ✅ TESTAR

### **Teste 1: Criar anúncio normal**
```sql
INSERT INTO listings (title, description, price_min, listing_type, profiles_id)
VALUES (
  'Mesa Soundcraft Si Expression 3',
  'Mesa digital em perfeito estado. Pouco usada em eventos. Sem defeitos.',
  15000,
  'product_sale',
  '[user-id-válido]'
);

-- Aguardar 2-3 segundos
-- Verificar:
SELECT moderation_status, ai_flag_reason 
FROM listings 
WHERE title LIKE '%Soundcraft%';

-- Deve retornar: moderation_status = 'approved'
```

### **Teste 2: Anúncio suspeito (golpe)**
```sql
INSERT INTO listings (title, description, price_min, listing_type, profiles_id)
VALUES (
  'MIXER YAMAHA QL5 NOVO NA CAIXA!!!',
  'PROMOCAO RELAMPAGO!!!!! Mixer profissional por apenas R$500! Pagamento só via PIX antecipado. Aceito somente contato por WhatsApp urgente!!!',
  500,
  'product_sale',
  '[user-id-válido]'
);

-- Aguardar 2-3 segundos
-- Verificar:
SELECT moderation_status, ai_flag_reason 
FROM listings 
WHERE title LIKE '%YAMAHA%';

-- Deve retornar: moderation_status = 'rejected'
-- ai_flag_reason: algo como "Preço suspeito + urgência artificial"
```

### **Teste 3: Conteúdo proibido**
```sql
INSERT INTO listings (title, description, price_min, listing_type)
VALUES (
  'Vendo droga',
  'Produto ilegal para teste',
  100,
  'product_sale'
);

-- Deve ser rejeitado imediatamente pela Moderation API
```

---

## 📊 MONITORAR

### **Ver Logs da Edge Function:**
```bash
# Em tempo real
supabase functions logs moderator --tail

# Últimos 100 logs
supabase functions logs moderator --limit 100
```

### **Ver Histórico de Moderação:**
```sql
SELECT 
  ml.created_at,
  ml.action,
  ml.reason,
  ml.automated,
  p.name as user_name,
  l.title as listing_title
FROM moderation_log ml
LEFT JOIN profiles p ON ml.target_id = p.id
LEFT JOIN listings l ON ml.target_id = l.id
WHERE ml.automated = true
ORDER BY ml.created_at DESC
LIMIT 20;
```

---

## 🎯 LÓGICA DE DECISÃO

### **Fluxo da IA:**

```
┌─────────────────────────────────┐
│  Novo Anúncio Inserido          │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│  1. OpenAI Moderation API       │
│  Detecta: ódio, violência, etc  │
└──────────┬──────────────────────┘
           │
           ├─ FLAGGED → ❌ REJEITAR
           │              -20 trust_score
           │
           ├─ OK → Continua...
           ↓
┌─────────────────────────────────┐
│  2. GPT-4o-mini Contextual      │
│  Detecta: golpe, spam, ilegal   │
└──────────┬──────────────────────┘
           │
           ├─ is_safe=false + confiança>70%
           │  → ❌ REJEITAR
           │     -10 trust_score
           │
           ├─ is_safe=true
           │  → ✅ APROVAR
           │     +2 trust_score
           ↓
┌─────────────────────────────────┐
│  3. Log Automático              │
│  moderation_log (automated=true)│
└─────────────────────────────────┘
```

---

## 🔧 TROUBLESHOOTING

### **Função não é chamada:**
1. Verificar webhook configurado
2. Ver logs: `supabase functions logs moderator`
3. Testar manualmente:
   ```bash
   curl -X POST \
     https://[project-ref].supabase.co/functions/v1/moderator \
     -H "Authorization: Bearer [service-role-key]" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "INSERT",
       "table": "listings",
       "record": {
         "id": "test-id",
         "title": "Teste",
         "description": "Descrição teste"
       }
     }'
   ```

### **OpenAI API retorna erro:**
1. Verificar `OPENAI_API_KEY` configurada
2. Verificar créditos na conta OpenAI
3. Ver erro específico nos logs

### **Trust score não atualiza:**
1. Verificar que `profiles_id` existe na tabela profiles
2. Verificar RLS policies em profiles
3. Ver logs para erros

---

## 💰 CUSTOS ESTIMADOS

### **OpenAI:**
- **Moderation API:** Gratuita
- **GPT-4o-mini:** ~$0.00015 por análise
  - 1000 anúncios/mês = ~$0.15
  - 10.000 anúncios/mês = ~$1.50

### **Supabase Edge Functions:**
- Gratuito até 500K invocações/mês
- Depois: $2 por 1M invocações

**Total estimado: < $5/mês** (até 10K anúncios)

---

## 📈 OTIMIZAÇÕES FUTURAS

### **1. Cache de Análises**
```typescript
// Evitar re-analisar título/descrição idênticos
const cacheKey = hash(title + description);
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

### **2. Análise Assíncrona**
```typescript
// Para não travar inserção:
- INSERT com moderation_status = 'pending'
- Edge Function processa em background
- Atualiza depois
```

### **3. Feedback Loop**
```typescript
// Melhorar prompts baseado em falsos positivos:
- Admin aprova manualmente anúncio rejeitado
- Sistema loga para treinar modelo custom
```

---

## ✅ CHECKLIST DE DEPLOY

- [ ] Edge Function deployada
- [ ] Variável `OPENAI_API_KEY` configurada
- [ ] Database Webhook configurado
- [ ] Testado com anúncio normal (aprovado)
- [ ] Testado com anúncio suspeito (rejeitado)
- [ ] Logs funcionando
- [ ] moderation_log registrando
- [ ] Trust score atualizando

---

**🤖 MagnaGuardian está no ar! Moderação automática 24/7!** 🛡️
