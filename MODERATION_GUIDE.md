# 🛡️ SISTEMA DE MODERAÇÃO - Portal MagnaFest

## 📋 OVERVIEW

Sistema completo de moderação com:
- ✅ Banimento de usuários
- ✅ Sistema de strikes (3 = ban automático)
- ✅ Score de confiança (0-100)
- ✅ Moderação de conteúdo (pending/approved/rejected)
- ✅ IA flag reasons
- ✅ Log de auditoria
- ✅ RLS automático (banidos invisíveis)

---

## 🗄️ ESTRUTURA DO BANCO

### **Tabela: profiles**
```sql
is_banned       boolean   DEFAULT false
trust_score     integer   DEFAULT 100    (0-100)
strikes         integer   DEFAULT 0
banned_at       timestamptz
ban_reason      text
```

### **Tabelas de Conteúdo (listings, posts, events)**
```sql
moderation_status  text    DEFAULT 'approved'  ('pending','approved','rejected')
ai_flag_reason     text    nullable
moderated_by       uuid    FK → auth.users
moderated_at       timestamptz
```

### **Tabela: moderation_log**
```sql
id              uuid
target_type     text    ('profile', 'listing', 'post', 'event')
target_id       uuid
action          text    ('ban', 'unban', 'strike', 'approve', 'reject')
reason          text
moderator_id    uuid
automated       boolean  DEFAULT false
created_at      timestamptz
```

---

## 🔧 FUNÇÕES SQL

### **1. Banir Usuário**
```sql
SELECT ban_user(
  '123e4567-e89b-12d3-a456-426614174000', 
  'Assédio sexual comprovado'
);
```

**O que faz:**
- ✅ Define `is_banned = true`
- ✅ Registra timestamp e motivo
- ✅ Zera trust_score
- ✅ Loga ação
- ✅ Conteúdo fica invisível automaticamente (RLS)

---

### **2. Aplicar Strike (Advertência)**
```sql
SELECT apply_strike(
  '123e4567-e89b-12d3-a456-426614174000',
  'Anúncio enganoso de equipamento'
);
```

**O que faz:**
- ✅ Incrementa contador de strikes
- ✅ Loga ação
- ✅ **Auto-ban com 3 strikes**

---

### **3. Rejeitar Conteúdo**
```sql
SELECT reject_content(
  'listings',                    -- tabela
  '456e4567-e89b-12d3-a456-426614174111',  -- id
  'Produto proibido: arma de airsoft'      -- motivo
);
```

**O que faz:**
- ✅ Muda status para 'rejected'
- ✅ Salva motivo
- ✅ Loga moderador e timestamp
- ✅ Conteúdo fica invisível

---

## 🤖 INTEGRAÇÃO COM IA (Futuro)

### **Fluxo de Moderação Automática:**

```typescript
// Edge Function: auto-moderate-listing
const moderateWithAI = async (listingId: string) => {
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();

  // Chamar OpenAI
  const analysis = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: `Você é um moderador. Analise se este anúncio viola regras:
      - Produtos ilegais
      - Linguagem ofensiva
      - Golpes aparentes
      
      Responda JSON: { "approved": boolean, "reason": string }`
    }, {
      role: 'user',
      content: `Título: ${listing.title}\nDescrição: ${listing.description}`
    }]
  });

  const result = JSON.parse(analysis.choices[0].message.content);

  if (!result.approved) {
    // Rejeitar automaticamente
    await supabase.rpc('reject_content', {
      content_table: 'listings',
      content_id: listingId,
      reason: `🤖 IA: ${result.reason}`,
      moderator_id: null  // null = bot
    });

    // Aplicar strike ao autor
    await supabase.rpc('apply_strike', {
      user_id: listing.profiles_id,
      reason: result.reason
    });
  }
};
```

---

## 🎯 CASOS DE USO

### **Exemplo 1: Usuário reportado 3x**
```sql
-- Strike 1
SELECT apply_strike('user-id', 'Anúncio falso');

-- Strike 2  
SELECT apply_strike('user-id', 'Não entregou produto');

-- Strike 3 → AUTO-BAN
SELECT apply_strike('user-id', 'Golpe confirmado');
-- ✅ Usuário banido automaticamente
```

---

### **Exemplo 2: Moderador revisa anúncio flagado por IA**

```typescript
// Dashboard Admin
const PendingListings = () => {
  const { data: flagged } = useQuery(supabase
    .from('listings')
    .select('*')
    .eq('moderation_status', 'pending')
    .not('ai_flag_reason', 'is', null)
  );

  const handleApprove = async (id) => {
    await supabase
      .from('listings')
      .update({ 
        moderation_status: 'approved',
        moderated_by: adminId,
        moderated_at: new Date()
      })
      .eq('id', id);
  };

  const handleReject = async (id, reason) => {
    await supabase.rpc('reject_content', {
      content_table: 'listings',
      content_id: id,
      reason
    });
  };
};
```

---

### **Exemplo 3: Consultar histórico de moderação**

```sql
-- Ver todas ações de um moderador
SELECT * FROM moderation_log
WHERE moderator_id = 'admin-user-id'
ORDER BY created_at DESC;

-- Ver todas ações sobre um usuário
SELECT * FROM moderation_log
WHERE target_type = 'profile'
AND target_id = 'problema-user-id';

-- Ver quantos banimentos automáticos (IA)
SELECT COUNT(*) FROM moderation_log
WHERE action = 'ban' AND automated = true;
```

---

## 🚨 POLÍTICAS RLS

### **Profiles:**
```sql
-- Usuários banidos são invisíveis para o público
-- Mas veem seu próprio perfil
SELECT * FROM profiles WHERE is_banned = false OR auth.uid() = id;
```

### **Listings:**
```sql
-- Apenas anúncios aprovados de não-banidos
SELECT * FROM listings 
WHERE moderation_status = 'approved'
AND NOT is_author_banned(profiles_id);
```

### **Posts/Events:**
```sql
-- Apenas conteúdo publicado de não-banidos
SELECT * FROM posts
WHERE status = 'published'
AND NOT is_author_banned(author_id);
```

---

## 📊 DASHBOARD ADMIN - Componentes React

### **1. Lista de Banidos**
```tsx
const BannedUsers = () => {
  const { data } = useQuery(supabase
    .from('profiles')
    .select('*')
    .eq('is_banned', true)
    .order('banned_at', { ascending: false })
  );

  return (
    <div>
      {data?.map(user => (
        <div key={user.id} className="p-4 bg-red-500/10 border border-red-500/30">
          <h3>{user.name}</h3>
          <p className="text-sm text-red-400">
            Banido em: {new Date(user.banned_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-400">Motivo: {user.ban_reason}</p>
          <button onClick={() => unbanUser(user.id)}>Desbanir</button>
        </div>
      ))}
    </div>
  );
};
```

### **2. Strikes Counter**
```tsx
const UserTrustBadge = ({ userId }: { userId: string }) => {
  const { data: user } = useQuery(supabase
    .from('profiles')
    .select('trust_score, strikes')
    .eq('id', userId)
    .single()
  );

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2 py-1 rounded ${
        user.trust_score >= 80 ? 'bg-green-500/20 text-green-400' :
        user.trust_score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        🛡️ {user.trust_score}
      </div>
      {user.strikes > 0 && (
        <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
          ⚠️ {user.strikes} strikes
        </div>
      )}
    </div>
  );
};
```

---

## ✅ CHECKLIST DE DEPLOY

- [ ] Executar `20251226_moderation_system.sql` no Supabase
- [ ] Verificar que tabela `moderation_log` foi criada
- [ ] Testar função `ban_user()` manual
- [ ] Testar função `apply_strike()`
- [ ] Criar dashboard admin para moderar
- [ ] Integrar Edge Function de IA (opcional)
- [ ] Adicionar botão "Denunciar" em perfis/anúncios
- [ ] Email notification ao usuário banido (opcional)

---

## 🔐 SEGURANÇA

**Apenas admins podem:**
- ✅ Banir usuários
- ✅ Aplicar strikes
- ✅ Ver moderation_log
- ✅ Aprovar/rejeitar conteúdo

**RLS Policy de Admin:**
```sql
CREATE POLICY "Apenas admins podem moderar"
  ON moderation_log FOR ALL
  USING (
    (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
```

---

**🎉 SISTEMA DE MODERAÇÃO COMPLETO E PRONTO!**

Próximo passo: Criar dashboard admin para usar essas funções visualmente.
