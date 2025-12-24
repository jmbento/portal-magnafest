# ⚙️ Configuração do Cliente Supabase - CANAPEV

## ✅ Status da Configuração

Infraestrutura base do Supabase **configurada e otimizada** para Vite + TypeScript.

---

## 📦 Arquivos Configurados

### **1. `.env` (Raiz do Projeto)**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://afguexgrhybzzkjcsvub.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__c-B0PGLk...
```

**Características:**
- ✅ Configurado corretamente
- ✅ Protegido no `.gitignore`
- ✅ Usa prefixo `VITE_` (obrigatório para Vite)
- ⚠️ **NUNCA commite este arquivo**

---

### **2. `src/lib/supabase.ts` (TypeScript)**

**Melhorias implementadas:**

#### **✅ Validação de Ambiente**
```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    ❌ ERRO: Variáveis de ambiente não encontradas!
    
    Certifique-se de criar .env com:
    VITE_SUPABASE_URL=...
    VITE_SUPABASE_ANON_KEY=...
  `);
  throw new Error('Configuração do Supabase incompleta');
}
```

**Benefício:** Debug rápido se algo estiver errado

---

#### **✅ Type Safety**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
```

**Benefício:** TypeScript sabe que são strings válidas

---

#### **✅ Export Default + Named**
```typescript
export const supabase = createClient(...);
export default supabase;
```

**Uso:**
```typescript
// Named import (recomendado)
import { supabase } from './lib/supabase';

// Default import (também funciona)
import supabase from './lib/supabase';
```

---

#### **✅ Configuração Otimizada**
```typescript
createClient(url, key, {
  auth: {
    persistSession: true,      // Manter login após F5
    autoRefreshToken: true,     // Renovar token automaticamente
    detectSessionInUrl: true,   // OAuth callbacks
  },
});
```

---

## 🎯 Helpers Disponíveis

### **Autenticação**
```typescript
getCurrentUser()        // Obter usuário logado
getCurrentProfile()     // Obter perfil completo
```

### **Storage**
```typescript
uploadFile(bucket, path, file)
getPublicUrl(bucket, path)
deleteFile(bucket, path)
```

### **Busca**
```typescript
searchListingsByRadius(lat, long, radiusKm)
searchListingsFulltext(query, limitCount)
```

### **Categorias**
```typescript
getRootCategories()
getSubcategories(parentId)
```

### **Listings**
```typescript
getListingsByOwner(ownerId)
getListingById(id)
createListing(data)
addListingMedia(listingId, url, type, order)
```

### **Events** 🆕
```typescript
createEvent(data)
getUpcomingEvents(limit)
getMyEvents()
```

---

## 🚀 Como Usar

### **1. Import no Componente**

```typescript
import { supabase, getCurrentUser } from '@/lib/supabase';

// Ou
import supabase from '@/lib/supabase';
```

### **2. Exemplo: Criar Evento**

```typescript
import { createEvent } from '@/lib/supabase';

const handleCreate = async () => {
  try {
    const event = await createEvent({
      title: 'Workshop React',
      description: 'Aprenda React 19',
      event_date: '2025-12-31T14:00:00Z',
    });
    
    console.log('Evento criado:', event);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};
```

### **3. Exemplo: Buscar Anúncios**

```typescript
import { supabase } from '@/lib/supabase';

const getListings = async () => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .limit(10);

  if (error) throw error;
  return data;
};
```

---

## 🔒 Segurança

### **✅ Variáveis de Ambiente**

- `VITE_SUPABASE_URL` → **Pública** (pode expor)
- `VITE_SUPABASE_ANON_KEY` → **Pública** (pode expor)

**Por quê?**  
São chaves **anônimas** (públicas), protegidas por **Row Level Security (RLS)**.

**⚠️ NUNCA exponha:**
- `SUPABASE_SERVICE_ROLE_KEY` → Esta é privada!

### **✅ RLS (Row Level Security)**

Todas as tabelas têm RLS habilitado:

```sql
-- Exemplo: Apenas o dono pode editar
CREATE POLICY "users_update_own"
  ON events
  FOR UPDATE
  USING (auth.uid() = user_id);
```

**Proteção:** Mesmo com a chave pública, só pode acessar dados autorizados

---

## 🐛 Troubleshooting

### **❌ Erro: "Configuração do Supabase incompleta"**

**Causa:** Arquivo `.env` não existe ou está vazio

**Solução:**
```bash
# Verifique se o arquivo existe
cat .env

# Deve mostrar:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

**Se não existir:**
```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

---

### **❌ Erro: "import.meta.env is undefined"**

**Causa:** Tentando usar fora do Vite (ex: Node.js puro)

**Solução:** Este cliente é para **frontend apenas** (Vite/Browser)

Para backend, use:
```typescript
import 'dotenv/config';
const url = process.env.SUPABASE_URL;
```

---

### **❌ Erro: "Cannot find module '@/lib/supabase'"**

**Causa:** Alias `@` não configurado no `tsconfig.json`

**Solução:**

**Opção 1:** Use path relativo
```typescript
import { supabase } from '../../lib/supabase';
```

**Opção 2:** Configure alias em `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

E em `vite.config.ts`:
```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 📊 Verificação de Status

### **1. Ver variáveis carregadas**

```typescript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20) + '...');
```

### **2. Testar conexão**

```typescript
import { supabase } from './lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Conexão falhou:', error.message);
  } else {
    console.log('✅ Conexão OK!');
  }
};
```

### **3. Verificar autenticação**

```typescript
import { getCurrentUser } from './lib/supabase';

const user = await getCurrentUser();
console.log('User:', user);
```

---

## 📝 Próximos Passos

### **Funcionalidades Prontas**

✅ Cliente Supabase configurado  
✅ Helpers de autenticação  
✅ Helpers de storage  
✅ Helpers de busca  
✅ Helpers de listings  
✅ Helpers de events  

### **A Implementar**

⬜ Componente de login/signup  
⬜ Hook `useAuth()` customizado  
⬜ Context API para estado global  
⬜ Páginas protegidas (PrivateRoute)  
⬜ Refresh automático de dados  

---

## ✨ Best Practices Implementadas

1. ✅ **Type Safety** - TypeScript strict mode
2. ✅ **Error Handling** - Throw errors com mensagens claras
3. ✅ **Validação** - Verifica env vars na inicialização
4. ✅ **Comments** - Código documentado em português
5. ✅ **Single Responsibility** - Cada helper faz uma coisa
6. ✅ **Export Pattern** - Named + default exports
7. ✅ **Async/Await** - Código limpo e legível

---

**🎉 Cliente Supabase pronto para uso!**

Importe e comece a usar em seus componentes React! 🚀
