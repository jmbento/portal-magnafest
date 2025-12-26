# 🎆 PORTAL MAGNAFEST - REBRANDING GUIDE

## ⚡ Electric Human Design System

### NOVA IDENTIDADE VISUAL

**De:** CANAPEV (Corporativo, Clean, Branco)  
**Para:** Portal MagnaFest (Dark Mode, Neon, Tech, Electric)

---

## 🎨 PALETA DE CORES OFICIAL

### Cores Principais (TailwindCSS)

```css
/* Uso via Tailwind */
bg-magna-black     /* #000000 - Fundo principal */
bg-magna-dark      /* #0A0A0A - Surface (cards/modals) */
text-magna-violet  /* #8A2BE2 - Cor primária */
text-magna-cyan    /* #00FFFF - Secundária */
text-magna-magenta /* #FF00FF - Acento/CTA */
```

### Aplicação por Contexto

| Elemento | Cor | Classe Tailwind |
|----------|-----|-----------------|
| **Background Global** | Deep Black | `bg-magna-black` |
| **Cards/Modals** | Surface Dark | `bg-magna-dark` |
| **Títulos Principais** | Electric Violet | `text-magna-violet` |
| **Links/Highlights** | Cyber Cyan | `text-magna-cyan` |
| **CTAs/Botões** | Hot Magenta | `bg-magna-magenta` |
| **Texto Corpo** | Cinza Claro | `text-gray-200` |

---

## ✨ EFEITOS NEON

### Texto com Glow

```tsx
<h1 className="text-magna-violet animate-neon-pulse">
  Portal MagnaFest
</h1>
```

### Box Shadow Neon

```css
/* Custom classes */
.neon-box {
  box-shadow: 
    0 0 10px rgba(138, 43, 226, 0.5),
    0 0 20px rgba(138, 43, 226, 0.3),
    0 0 30px rgba(138, 43, 226, 0.1);
}

.neon-border {
  border: 2px solid #8A2BE2;
  box-shadow: 
    0 0 5px rgba(138, 43, 226, 0.7),
    inset 0 0 5px rgba(138, 43, 226, 0.3);
}
```

---

## 📝 DIRETRIZES DE NOMENCLATURA

### ❌ REMOVER (CANAPEV)
- ❌ "Canapev"
- ❌ "Marketplace de Eventos"
- ❌ Referências a "Produtores"
- ❌ Estética corporativa/clean

### ✅ SUBSTITUIR POR (MAGNAFEST)
- ✅ "Portal MagnaFest"
- ✅ "Comunidade de Profissionais"
- ✅ "Talentos do Setor"
- ✅ Estética tech/cyberpunk

---

## 🎭 COMPONENTES A ATUALIZAR

### 1. **Navbar** (`src/components/layout/Navbar.tsx`)

#### Antes (CANAPEV):
```tsx
<nav className="bg-white shadow-md">
  <div className="text-blue-600">CANAPEV</div>
</nav>
```

#### Depois (MAGNAFEST):
```tsx
<nav className="bg-magna-dark border-b border-magna-violet/20">
  <div className="text-magna-violet animate-neon-pulse font-black">
    ⚡ PORTAL MAGNAFEST
  </div>
</nav>
```

### 2. **HomePage** (`src/pages/HomePage.tsx`)

#### Antes:
```tsx
<h1 className="text-gray-900">
  Conecte-se. Vibre. Realize.
</h1>
```

#### Depois:
```tsx
<div className="bg-magna-black min-h-screen">
  <h1 className="text-magna-violet text-8xl font-black animate-neon-pulse">
    MAGNAFEST
  </h1>
  <p className="text-magna-cyan text-2xl">
    Where Electric Meets Human
  </p>
</div>
```

### 3. **ClaimProfileModal** (Já criado)

#### Atualizar para:
```tsx
<div className="bg-magna-dark border border-magna-violet/30">
  <h2 className="text-magna-violet">
    ⚡ Junte-se ao Portal
  </h2>
  
  <button className="bg-magna-magenta hover:bg-magna-violet">
    Entrar na Comunidade
  </button>
</div>
```

### 4. **Footer**

```tsx
<footer className="bg-magna-dark border-t border-magna-cyan/20">
  <div className="text-magna-cyan">
    Portal MagnaFest © 2025
  </div>
  <div className="text-gray-400">
    Electric Human Technology
  </div>
</footer>
```

---

## 🔤 TIPOGRAFIA

### Font Families Sugeridas

```css
/* Adicionar ao index.css */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;500;700&display=swap');

body {
  font-family: 'Rajdhani', sans-serif; /* Corpo */
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', sans-serif; /* Títulos */
}
```

### Font Weights

| Uso | Weight | Classe |
|-----|--------|--------|
| Corpo | Light (300) | `font-light` |
| Subtítulos | Medium (500) | `font-medium` |
| Títulos | Bold (700) | `font-bold` |
| Hero | Black (900) | `font-black` |

---

## 🖼️ IMAGENS E ÍCONES

### Background Patterns

```tsx
// Adicionar ao body ou hero sections
<div className="bg-magna-black relative overflow-hidden">
  {/* Grid pattern */}
  <div 
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: `
        linear-gradient(#8A2BE2 1px, transparent 1px),
        linear-gradient(90deg, #8A2BE2 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px'
    }}
  />
  
  {/* Conteúdo */}
</div>
```

### Ícones (Lucide React)

**Temas preferidos:**
- `Zap` ⚡ - Energia/Elétrico
- `Sparkles` ✨ - Neon/Brilho
- `Activity` 📊 - Tech/Dados
- `Radio` 📡 - Conexão
- `Cpu` 🖥️ - Tecnologia

---

## 🎬 ANIMAÇÕES

### Keyframes Adicionais (já no tailwind.config.js)

```javascript
keyframes: {
  'neon-pulse': {
    '0%, 100%': { 
      textShadow: '0 0 10px currentColor, 0 0 20px currentColor',
      opacity: '1'
    },
    '50%': { 
      textShadow: '0 0 5px currentColor',
      opacity: '0.8'
    },
  },
}
```

### Uso:

```tsx
<h1 className="text-magna-violet animate-neon-pulse">
  Portal MagnaFest
</h1>
```

---

## 📱 RESPONSIVIDADE

### Mobile First (Dark Always)

```tsx
<div className="bg-magna-black text-gray-200">
  {/* Sempre dark mode, sem toggle */}
</div>
```

### Breakpoints

```tsx
<h1 className="
  text-4xl md:text-6xl lg:text-8xl
  text-magna-violet
  font-black
  animate-neon-pulse
">
  MAGNAFEST
</h1>
```

---

## 🔧 CHECKLIST DE REBRANDING

### Arquivos a Modificar:

- [ ] `tailwind.config.js` ✅ (FEITO)
- [ ] `src/index.css` - Adicionar fonts e classes globais
- [ ] `src/components/layout/Navbar.tsx` - Dark + Neon
- [ ] `src/components/layout/Footer.tsx` - Dark + Cyan
- [ ] `src/pages/HomePage.tsx` - Hero electric
- [ ] `src/components/modals/ClaimProfileModal.tsx` - Dark theme
- [ ] `index.html` - Title: "Portal MagnaFest"
- [ ] `package.json` - Name: "portal-magnafest"
- [ ] `README.md` - Atualizar descrição
- [ ] Supabase tables - Rename ou manter schema (opcional)

### Buscar e Substituir Global:

```bash
# VS Code Find & Replace (Cmd+Shift+F)
Find: "CANAPEV"
Replace: "Portal MagnaFest"

Find: "Canapev"
Replace: "MagnaFest"

Find: "canapev"
Replace: "magnafest"
```

---

## 🎨 EXEMPLO COMPLETO: HERO SECTION

```tsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-magna-black relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(#8A2BE2 1px, transparent 1px),
            linear-gradient(90deg, #8A2BE2 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-magna-violet/50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-magna-cyan" />
            <span className="text-magna-cyan text-sm uppercase tracking-wider">
              Electric Human Technology
            </span>
          </div>

          {/* Title */}
          <h1 className="text-7xl lg:text-9xl font-black text-magna-violet animate-neon-pulse mb-4">
            MAGNAFEST
          </h1>

          {/* Subtitle */}
          <p className="text-2xl lg:text-4xl text-magna-cyan mb-12 font-light">
            Where Electric Meets Human
          </p>

          {/* CTA */}
          <button className="
            bg-magna-magenta hover:bg-magna-violet
            text-white font-bold
            px-12 py-5 rounded-full
            text-lg
            transition-all duration-300
            shadow-lg shadow-magna-magenta/50
            hover:shadow-magna-violet/50
            hover:scale-105
          ">
            ⚡ Entrar no Portal
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="border border-magna-cyan/20 rounded-lg p-4 bg-magna-dark/50">
              <div className="text-4xl font-black text-magna-cyan mb-1">200k+</div>
              <div className="text-sm text-gray-400">Profissionais</div>
            </div>
            <div className="border border-magna-violet/20 rounded-lg p-4 bg-magna-dark/50">
              <div className="text-4xl font-black text-magna-violet mb-1">10k+</div>
              <div className="text-sm text-gray-400">Eventos/Mês</div>
            </div>
            <div className="border border-magna-magenta/20 rounded-lg p-4 bg-magna-dark/50">
              <div className="text-4xl font-black text-magna-magenta mb-1">100%</div>
              <div className="text-sm text-gray-400">Gratuito</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Atualizar `tailwind.config.js` (FEITO)
2. Adicionar fonts Google (Orbitron + Rajdhani) no `index.html`
3. Criar classes globais no `index.css`:
   ```css
   .neon-box { ... }
   .neon-border { ... }
   .neon-text { ... }
   ```
4. Atualizar componentes principais (Navbar, Footer, HomePage)
5. Rever ClaimProfileModal com tema dark
6. Buscar/Substituir "CANAPEV" → "Portal MagnaFest"
7. Testar no browser e ajustar contrastes

---

## 🎯 FILOSOFIA DO DESIGN

**Electric Human:**
- ⚡ **Electric:** Neon, brilho, energia, tech, cyberpunk
- 👤 **Human:** Pessoal, acessível, comunidade, pessoas reais

**Sensação desejada:**
- Futurista mas acolhedor
- Tech mas humano
- Neon mas legível
- Dark mas vibrante

---

**Data:** 25/12/2025  
**Status:** Design System Configurado  
**Próximo:** Implementar nos componentes
