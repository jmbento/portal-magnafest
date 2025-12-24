# 📝 Formulário de Criação de Anúncios - CANAPEV

## 🎯 O Que Foi Criado

Sistema completo de cadastro de anúncios com:
- **React 19** + **TypeScript**
- **React Hook Form** + **Zod Validation**
- **Tailwind CSS** (design premium e responsivo)
- **Upload de Imagens** para Supabase Storage
- **Drag & Drop** de arquivos
- **Preview** de imagens antes do envio
- **Feedback visual** com loading states

---

## 📦 Dependências Instaladas

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "zod": "latest",
    "lucide-react": "latest",
    "@supabase/supabase-js": "^2.47.15"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "latest",
    "tailwindcss": "latest",
    "typescript": "latest"
  }
}
```

---

## 🗂️ Estrutura de Arquivos

```
src/
├── components/
│   └── listings/
│       └── CreateListingForm.tsx    # 📝 Formulário principal
├── lib/
│   └── supabase.ts                  # 🔧 Cliente + helpers
├── App.tsx                           # 🏠 App principal
├── main.tsx                          # 🚀 Entry point
└── index.css                         # 🎨 Estilos Tailwind

supabase/migrations/
├── 0001_initial_canapev_schema.sql         # ✅ Schema principal
└── 20251222_create_storage_bucket.sql      # 📁 Storage bucket
```

---

## ⚙️ Configuração Obrigatória

### 1. **Rodar a Migração do Storage**

Antes de usar o formulário, você DEVE criar o bucket de imagens:

1. Acesse: https://supabase.com/dashboard/project/afguexgrhybzzkjcsvub/sql
2. Abra: `supabase/migrations/20251222_create_storage_bucket.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em **"Run"**

### 2. **Verificar Bucket Criado**

1. Vá em: **Storage** (menu lateral)
2. Deve aparecer o bucket **`listing-images`**
3. Status: **Público** ✅

---

## 🎨 Funcionalidades do Formulário

### ✅ **Validação Completa (Zod)**

| Campo | Validação |
|-------|-----------|
| **Título** | 5-100 caracteres |
| **Descrição** | 20-2000 caracteres |
| **Tipo** | venue / service / product_rent / product_sale |
| **Categoria** | ID válido de categoria |
| **Preço** | Número > 0 (convertido para centavos) |
| **Unidade** | hora / dia / evento / unidade / pessoa |
| **Imagens** | 1-10 arquivos, máx 5MB cada, JPG/PNG/WEBP |

### 📸 **Upload de Imagens**

- **Drag & Drop**: Arraste imagens direto para a área
- **Multi-select**: Selecione várias imagens de uma vez
- **Preview**: Veja as imagens antes de enviar
- **Primeira = Principal**: A 1ª imagem é marcada como destaque
- **Remover**: Botão X para remover imagens

### 🔄 **Fluxo de Envio**

```
1. Usuário preenche o formulário
   ↓
2. Validação do Zod é executada
   ↓
3. Upload das imagens para Supabase Storage
   │  Path: {user_id}/{timestamp}-{filename}
   │  Bucket: listing-images
   ↓
4. URLs públicas são geradas
   ↓
5. Anúncio é criado na tabela `listings`
   ↓
6. Mídias são vinculadas na tabela `media`
   ↓
7. ✅ Sucesso! Redireciona para /dashboard
```

### 🎯 **Estados Visuais**

- **Loading**: Spinner + "Criando Anúncio..."
- **Sucesso**: Badge verde + "Anúncio criado com sucesso!"
- **Erro**: Badge vermelho + mensagem de erro detalhada

---

## 🚀 Como Usar

### **1. Rodar o Servidor**

```bash
npm run dev
```

### **2. Acessar o Formulário**

Abra: http://localhost:5173/

### **3. Testando com Usuário Logado**

Para testar, você precisa estar autenticado. Opções:

#### **Opção A: Mock Temporário (Desenvolvimento)**

No arquivo `src/lib/supabase.ts`, modifique temporariamente:

```typescript
// APENAS PARA TESTE - REMOVER EM PRODUÇÃO
export const getCurrentUser = async () => {
  return {
    id: 'user-mock-id-123',  // ID fictício
    email: 'teste@canapev.com'
  };
};
```

#### **Opção B: Sistema de Login Real**

Crie uma página de login usando Supabase Auth:

```typescript
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
};
```

---

## 📐 Schema do Formulário (Zod)

```typescript
const listingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(2000),
  listing_type: z.enum(['venue', 'service', 'product_rent', 'product_sale']),
  category_id: z.string().min(1),
  price_min: z.number().min(1).transform(val => val * 100), // → centavos
  price_unit: z.string().min(1),
  images: z.array(
    z.instanceof(File)
      .refine(file => file.size <= 5MB)
      .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
  ).min(1).max(10)
});
```

---

## 🎨 Customização do Design

### **Cores (Tailwind)**

Edite `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#667eea',  // Azul principal
    600: '#5568d3',
  },
  secondary: {
    500: '#764ba2',  // Roxo secundário
  }
}
```

### **Classes CSS Personalizadas**

Em `src/index.css`:

```css
.btn-primary { ... }    /* Botão primário */
.input-field { ... }    /* Campo de input */
.error-message { ... }  /* Mensagem de erro */
```

---

## 🛠️ Troubleshooting

### ❌ **Erro: "Bucket not found"**

**Solução:** Execute o script `20251222_create_storage_bucket.sql` no SQL Editor

### ❌ **Erro: "User not authenticated"**

**Solução:** Implemente sistema de login ou use mock temporário

### ❌ **Erro: "Failed to upload image"**

**Causas possíveis:**
- Arquivo > 5MB
- Formato não suportado (use JPG/PNG/WEBP)
- Policies do Storage incorretas

**Solução:** Verifique as policies em Storage → Policies

### ❌ **Categorias não aparecem**

**Solução:** Execute a migração `0001_initial_canapev_schema.sql` completa

---

## 📊 Próximos Passos

### **Backend**
- [ ] Validação de slug único (não permitir títulos duplicados)
- [ ] Compressão automática de imagens
- [ ] Detecção de conteúdo impróprio (moderação)
- [ ] Webhooks para notificações

### **Frontend**
- [ ] Sistema de autenticação completo
- [ ] Dashboard para gerenciar anúncios
- [ ] Preview do anúncio antes de publicar
- [ ] Editor de imagens (crop, rotate, filtros)
- [ ] Arrastar para reordenar imagens

---

## 📝 Type Generation

Para gerar types TypeScript do banco:

```bash
npx supabase gen types typescript --project-id afguexgrhybzzkjcsvub > src/types/supabase.ts
```

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12)
2. Terminal do Vite (erros de build)
3. Supabase Dashboard → Logs

---

**Feito com 💜 para CANAPEV**
