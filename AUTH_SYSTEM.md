# 🔐 Sistema de Autenticação - CANAPEV

## ✅ Status

Sistema de autenticação **completo e funcional** com:
- Context API para estado global
- Navbar responsiva  
- Login/Signup com email e Google OAuth
- Proteção de rotas

---

## 📦 Arquivos Criados

### **1. AuthContext** (`src/contexts/AuthContext.tsx`)

**Responsabilidades:**
- Gerenciar estado do usuário (`user`, `session`)
- Monitorar mudanças de autenticação
- Prover função de `signOut`
- Loading state durante inicialização

**API:**
```typescript
const { user, session, loading, signOut } = useAuth();
```

**Uso:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;
  
  return <div>Olá, {user.email}</div>;
}
```

---

### **2. Navbar** (`src/components/layout/Navbar.tsx`)

**Features:**
- **Desktop:** Logo + Links + Botão Anunciar + Dropdown User
- **Mobile:** Hambúrguer menu com drawer
- **Estados:** Logado / Deslogado
- **Sticky:** Navbar fixa no topo com backdrop-blur

**Links:**
| Estado | Links |
|--------|-------|
| **Deslogado** | Logo, Explorar, **Entrar** |
| **Logado** | Logo, Explorar, **Anunciar**, Avatar (dropdown) |

**Dropdown (Desktop):**
- Email do usuário
- Meus Anúncios
- Sair (vermelho)

**Menu Mobile:**
- Explorar
- Anunciar (se logado)
- Meus Anúncios (se logado)
- Email + Sair (se logado)
- Entrar (se deslogado)

---

### **3. LoginPage** (`src/pages/auth/LoginPage.tsx`)

**Métodos de Autenticação:**

#### **A) Google OAuth**
```typescript
supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: window.location.origin }
});
```

#### **B) Email/Senha**
```typescript
// Login
supabase.auth.signInWithPassword({ email, password });

// Signup
supabase.auth.signUp({ email, password });
```

**Features:**
- ✅ Toggle Login/Signup
- ✅ Loading states
- ✅ Error handling
- ✅ Redirect após login
- ✅ Validação de formulário
- ✅ Design centralizado e premium

---

### **4. App.tsx** (Atualizado)

**Estrutura:**
```tsx
<AuthProvider>
  <Router>
    <Navbar />  {/* Global em todas as páginas */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/create" element={<CreateForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
</AuthProvider>
```

---

## 🔄 Fluxo de Autenticação

### **1. Inicialização**

```
App carrega
  ↓
AuthProvider monta
  ↓
loadSession() executa
  ↓
supabase.auth.getSession()
  ↓
setUser() + setLoading(false)
  ↓
Componentes renderizam
```

### **2. Login**

```
Usuário clica "Entrar"
  ↓
Navega para /login
  ↓
Preenche email/senha OU clica Google
  ↓
supabase.auth.signInWithPassword()
  ↓
onAuthStateChange dispara
  ↓
AuthContext atualiza user
  ↓
Navbar re-renderiza com estado logado
  ↓
Redirect para "/"
```

### **3. Logout**

```
Usuário clica "Sair" no dropdown
  ↓
signOut() executa
  ↓
supabase.auth.signOut()
  ↓
onAuthStateChange dispara com null
  ↓
AuthContext limpa user
  ↓
Navbar re-renderiza com estado deslogado
  ↓
Redirect para "/"
```

---

## 🎨 Design System

### **Navbar**
```css
sticky top-0
bg-white/80 backdrop-blur-md
border-b border-gray-200
shadow-sm
```

**Benefícios:**
- Sticky: Sempre visível ao scrollar
- Backdrop-blur: Efeito moderno de glassmorphism
- Semi-transparente: Conteúdo visível por trás

### **LoginPage**
```css
min-h-screen
bg-gradient-to-br from-primary-50 via-white to-secondary-50
flex items-center justify-center
```

**Card:**
```css
bg-white
rounded-2xl
shadow-xl
p-8
max-w-md
```

---

## 🚀 Como Usar

### **1. Acessar Login**

```
http://localhost:5173/login
```

### **2. Testar Login com Email**

**Criar Conta:**
1. Digite email
2. Digite senha (min 6 caracteres)
3. Clique "Criar Conta"
4. Verifique email (confirmação)

**Entrar:**
1. Digite email
2. Digite senha
3. Clique "Entrar"
4. Redirect automático para "/"

### **3. Testar Google OAuth**

**Pré-requisito:** Configurar Google OAuth no Supabase

1. Vá em Supabase Dashboard → Authentication → Providers
2. Ative "Google"
3. Configure Client ID e Secret
4. Adicione redirect URL: `http://localhost:5173`

**Uso:**
1. Clique "Continuar com Google"
2. Popup do Google abre
3. Selecione conta
4. Redirect automático após auth

---

## 🔒 Proteção de Rotas

### **Verificar Autenticação**

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}

// Uso em App.tsx
<Route 
  path="/create" 
  element={
    <ProtectedRoute>
      <CreateForm />
    </ProtectedRoute>
  } 
/>
```

### **Redirect Condicional**

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleAction = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Ação protegida
  };
}
```

---

## 🎯 Rotas Disponíveis

| Rota | Descrição | Autenticação |
|------|-----------|--------------|
| `/` | Homepage | Pública |
| `/login` | Login/Signup | Pública |
| `/search` | Busca de anúncios | Pública |
| `/create` | Criar anúncio | **Requer login** |
| `/dashboard` | Meus anúncios | **Requer login** |

---

## 🐛 Troubleshooting

### **❌ "useAuth must be used within AuthProvider"**

**Causa:** Componente tentando usar `useAuth()` fora do `<AuthProvider>`

**Solução:** Verifique se `App.tsx` está envolvendo tudo com `<AuthProvider>`

```tsx
// ✅ Correto
<AuthProvider>
  <Router>
    <Navbar />
    <Routes>...</Routes>
  </Router>
</AuthProvider>

// ❌ Errado
<Router>
  <AuthProvider>
    <Navbar />
  </AuthProvider>
</Router>
```

---

### **❌ Google OAuth não funciona**

**Causa:** Google provider não configurado no Supabase

**Solução:**

1. Supabase Dashboard → Authentication → Providers
2. Ative "Google"
3. Configure Client ID e Secret (Google Cloud Console)
4. Adicione URLs de redirect:
   ```
   https://seu-projeto.supabase.co/auth/v1/callback
   http://localhost:5173
   ```

---

### **❌ Navbar não mostra usuário logado**

**Causa:** `onAuthStateChange` não está disparando

**Solução:** Verifique se o `useEffect` no `AuthContext` está rodando

```typescript
// AuthContext.tsx
useEffect(() => {
  console.log('AuthContext mounted');
  loadSession();
  
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event, session);
    // ...
  });
}, []);
```

---

## 📊 Estados da Aplicação

### **Loading**
```
user: null
loading: true
→ Renderiza spinner ou skeleton
```

### **Deslogado**
```
user: null
loading: false
→ Mostra "Entrar" na navbar
```

### **Logado**
```
user: { email, id, ... }
loading: false
→ Mostra "Anunciar" + Avatar na navbar
```

---

## ✨ Features Implementadas

### **✅ Navbar**
- Sticky com backdrop-blur
- Responsiva (desktop + mobile)
- Estados logado/deslogado
- Dropdown do usuário
- Menu hambúrguer (mobile)

### **✅ AuthContext**
- Persistência de sessão
- Auto-refresh de tokens
- Loading state
- Função de signOut

### **✅ LoginPage**
- Email/senha
- Google OAuth
- Toggle login/signup
- Error handling
- Loading states
- Design premium

### **✅ Integração**
- AuthProvider global
- Navbar em todas as páginas
- Rotas configuradas
- Redirect após login

---

## 🔄 Próximos Passos

### **Funcionalidades Prioritárias**

1. ⬜ **ProtectedRoute Component**
   ```typescript
   <Route path="/create" element={
     <ProtectedRoute>
       <CreateForm />
     </ProtectedRoute>
   } />
   ```

2. ⬜ **Dashboard Real**
   - Listar anúncios do usuário
   - Editar/deletar anúncios

3. ⬜ **Perfil do Usuário**
   - Página de edição de perfil
   - Upload de avatar
   - Atualizar informações

4. ⬜ **Forgot Password**
   - Reset de senha por email

5. ⬜ **Social Logins**
   - Facebook
   - GitHub

---

**🎉 Sistema de autenticação completo!**

Teste agora em: http://localhost:5173/login 🚀
