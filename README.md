# 🎯 MAGNAFEST - Portal de Profissionais para Eventos

Sistema completo para marketplace de eventos com Supabase + React/Vue/Next.js

## 🚀 Começando

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se não tiver)
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: MAGNAFEST
   - **Database Password**: Escolha uma senha forte
   - **Region**: South America (São Paulo)
5. Aguarde ~2 minutos até o projeto ser criado

### 2. Rodar a Migração SQL

1. No Dashboard do Supabase, vá em **SQL Editor** (ícone de raio ⚡)
2. Clique em **"New query"**
3. Copie todo o conteúdo de `supabase/migrations/0001_initial_canapev_schema.sql`
4. Cole no editor
5. Clique em **"Run"** (ou `Ctrl/Cmd + Enter`)
6. ✅ Deve aparecer "Success. No rows returned"

### 3. Obter Credenciais

1. Vá em **Settings** (ícone de engrenagem) → **API**
2. Copie:
   - **Project URL** (ex: `https://xyz.supabase.co`)
   - **anon/public key** (chave longa começando com `eyJ...`)

### 4. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env e cole suas credenciais
```

Exemplo do `.env`:

```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...sua-chave-aqui
```

### 5. Instalar Dependências

```bash
npm install
```

### 6. Rodar o Projeto

```bash
npm run dev
```

---

## 📁 Estrutura do Projeto

```
canapev/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Cliente Supabase + helpers
│   ├── components/              # Componentes React/Vue
│   ├── pages/                   # Páginas da aplicação
│   └── main.js                  # Entry point
├── supabase/
│   ├── config.toml              # Configuração local CLI
│   └── migrations/
│       └── 0001_initial_canapev_schema.sql  # Schema completo
├── .env                         # Credenciais (NÃO COMITAR!)
├── .env.example                 # Exemplo de credenciais
└── package.json
```

---

## 🛠️ Funcionalidades Implementadas

### ✅ Banco de Dados

- [x] Extensões: PostGIS, pg_trgm, uuid-ossp
- [x] Tabelas: profiles, categories, listings, media
- [x] Row Level Security (RLS) configurado
- [x] Triggers automáticos (updated_at, search_vector, location_point)
- [x] Índices otimizados (GIN, GIST, trigram)
- [x] Funções utilitárias (busca geoespacial + full-text)

### 📦 Helpers Disponíveis (em `src/lib/supabase.js`)

```javascript
import {
  supabase,
  getCurrentUser,
  getCurrentProfile,
  searchListingsByRadius,
  searchListingsFulltext,
  getRootCategories,
  getSubcategories,
  getListingsByOwner,
  getListingById,
} from "./lib/supabase";

// Exemplo: Buscar anúncios próximos
const nearbyListings = await searchListingsByRadius(-23.55052, -46.633308, 50);

// Exemplo: Busca textual
const results = await searchListingsFulltext("fotografia casamento");

// Exemplo: Categorias raiz
const categories = await getRootCategories();
```

---

## 🔒 Segurança (RLS)

| Tabela         | Leitura               | Escrita            |
| -------------- | --------------------- | ------------------ |
| **profiles**   | 🌐 Pública            | 🔒 Apenas dono     |
| **categories** | 🌐 Pública            | 👑 Apenas admins   |
| **listings**   | 🌐 Apenas ativos      | 🔒 Dono ou admin   |
| **media**      | 🌐 De listings ativos | 🔒 Dono do listing |

---

## 🗂️ Categorias Pré-cadastradas

- **Locais** → Espaços para eventos
- **Equipamentos** → Som, Iluminação, Estruturas
- **Serviços** → Fotografia, Filmagem, Cerimonial
- **Decoração** → Itens decorativos
- **Alimentação** → Buffets
- **Entretenimento** → Shows e DJs

---

## 📍 Busca Geoespacial

```javascript
// Buscar anúncios em um raio de 50km de São Paulo
const results = await searchListingsByRadius(
  -23.55052, // latitude
  -46.633308, // longitude
  50 // raio em km
);
```

---

## 🔍 Busca Full-Text

```javascript
// Busca inteligente com ranking de relevância
const results = await searchListingsFulltext("som iluminação");
// Retorna: [{listing_id, title, rank}, ...]
```

---

## 🎨 Próximos Passos

### Backend

- [ ] Sistema de favoritos
- [ ] Avaliações e reviews
- [ ] Chat entre usuários
- [ ] Sistema de reservas/agendamento
- [ ] Notificações em tempo real (Realtime do Supabase)

### Frontend

- [ ] Dashboard do fornecedor
- [ ] Página de listagem de anúncios
- [ ] Filtros avançados (categoria, preço, localização)
- [ ] Mapa interativo (Mapbox/Leaflet)
- [ ] Upload de imagens para Storage do Supabase

---

## 📚 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [PostGIS Docs](https://postgis.net/documentation/)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - Veja LICENSE para detalhes.

---

**Feito com 💜 para a comunidade de eventos do Brasil**
