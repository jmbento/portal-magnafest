# 🔍 AUDITORIA COMPLETA - PORTAL MAGNAFEST

## ✅ PÁGINAS EXISTENTES (25 páginas)

### 🏠 PÚBLICAS
- [x] HomePage - **PRECISA:** Hero com pessoas reais
- [x] LoginPage - **PRECISA:** Imagem lateral humanizada
- [x] MarketplacePage - ✅ **TEM HERO** (hero-market.jpg)
- [x] ListingDetailPage - **PRECISA:** Fotos reais dos produtos
- [x] EventsPage - **PRECISA:** Fotos de eventos
- [x] EventDetailPage - **PRECISA:** Banner do evento
- [x] BlogPage - **PRECISA:** Imagens dos posts
- [x] BlogPostPage - **PRECISA:** Imagem destacada
- [x] ProvidersPage - **PRECISA:** Fotos de profissionais
- [x] ProviderDetailPage - **PRECISA:** Foto do profissional
- [x] ProfileDetailsPage - **PRECISA:** Avatar + banner
- [x] AgendaPage - **PRECISA:** Ícones visuais
- [x] TermsPage - ✅ **OK** (estilo sóbrio)

### 🔒 PROTEGIDAS/AUTH
- [x] DashboardPage - **PRECISA:** Gráficos visuais
- [x] MyFavoritesPage - **PRECISA:** Thumbnails

### 🛠️ ADMIN
- [x] SeederPage - ✅ **OK** (admin)
- [x] InterviewApprovalPage - **PRECISA:** Preview de perfis

### ❓ DUPLICADAS/DESNECESSÁRIAS
- [ ] AdvertisePage (2x) - **CONSOLIDAR**
- [ ] LoginPage (2x pasta auth/) - **CONSOLIDAR**
- [ ] SearchPage - **PRECISA:** Resultados visuais
- [ ] ExplorePage - **DELETAR** (não usa mais)

---

## ❌ PÁGINAS FALTANDO (CRÍTICAS)

### 1. ⭐ **CADASTRO DE USUÁRIO** (URGENTE)
**Rota:** `/cadastro` ou `/signup`
**Função:** Criar conta nova (nome, email, senha)
**Design:** Modal ou página full com:
- Foto de fundo de evento
- Formulário clean
- Login social (Google/Facebook)

### 2. 🎯 **CRIAR ANÚNCIO** (URGENTE)
**Rota:** `/criar-anuncio`
**Função:** Formulário para profissionais anunciarem
**Campos:**
- Título do produto
- Descrição
- Preço (min/max)
- Condição (novo/seminovo/usado/peças)
- Categoria
- Upload de fotos (drag & drop)
- WhatsApp/Contato

### 3. 📢 **ANUNCIAR COMIGO (ADS)** (IMPORTANTE)
**Rota:** `/anunciar`
**Função:** Landing page para vender serviço de ADS
**Seções:**
- Hero: "Alcance 10.000 profissionais do setor"
- Benefícios (cards visuais)
- Pacotes de anúncio (preços)
- Depoimentos (fotos reais)
- CTA: "Começar Agora"

### 4. 👤 **EDITAR PERFIL** (IMPORTANTE)
**Rota:** `/perfil/editar`
**Função:** Usuário edita seus dados
**Campos:**
- Upload de avatar
- Bio
- Categoria profissional
- Portfólio (links)
- Contatos

### 5. 📊 **MEUS ANÚNCIOS** (IMPORTANTE)
**Rota:** `/meus-anuncios`
**Função:** Ver anúncios criados pelo usuário
**Features:**
- Lista de anúncios (ativos/inativos)
- Editar/Excluir
- Estatísticas (visualizações, cliques)

---

## 🎨 MELHORIAS VISUAIS NECESSÁRIAS

### 📸 BANCO DE IMAGENS (SUGESTÃO)
```
/public/assets/
├── people/           ← Pessoas reais trabalhando
│   ├── dj-mixing.jpg
│   ├── lighting-tech.jpg
│   ├── sound-engineer.jpg
│   └── event-manager.jpg
├── events/           ← Eventos reais
│   ├── concert-1.jpg
│   ├── corporate-1.jpg
│   └── festival-1.jpg
├── equipment/        ← Equipamentos close
│   ├── mixer-detail.jpg
│   ├── lights-action.jpg
│   └── camera-setup.jpg
└── team/            ← Equipe (sobre nós)
    └── placeholder-avatar.jpg
```

### 🎯 PRIORIDADES DE HUMANIZAÇÃO

**URGENTE (Fazer Agora):**
1. ✅ Marketplace - hero-market.jpg (JÁ TEM)
2. ❌ HomePage - Hero com DJ/Técnico trabalhando
3. ❌ LoginPage - Background de evento + form lateral
4. ❌ Criar Anúncio - Página completa
5. ❌ Cadastro - Modal/Página

**IMPORTANTE (Fazer Depois):**
6. EventsPage - Grid com fotos de eventos
7. ProvidersPage - Cards com fotos de profissionais
8. ProfileDetails - Sistema de avatar/banner
9. Dashboard - Gráficos + métricas visuais

**OPCIONAL (Polimento):**
10. BlogPage - Imagens de capa
11. Footer - Logo + ícones sociais
12. 404 Page - Ilustração divertida

---

## 🚀 PLANO DE AÇÃO (SEQUENCIAL)

### FASE 1: COMPLETAR FUNCIONALIDADES
- [ ] Criar SignupPage (cadastro)
- [ ] Criar CreateListingPage (criar anúncio)
- [ ] Criar AdsLandingPage (anunciar comigo)
- [ ] Criar MyListingsPage (meus anúncios)
- [ ] Criar EditProfilePage (editar perfil)

### FASE 2: HUMANIZAR COM IMAGENS
- [ ] Gerar/buscar imagens com IA
- [ ] Adicionar heroes em todas páginas
- [ ] Avatares de exemplo nos perfis
- [ ] Fotos de equipamentos nos anúncios
- [ ] Background do login

### FASE 3: POLIMENTO
- [ ] Animações micro-interactions
- [ ] Loading states visuais
- [ ] Toasts/Notificações
- [ ] Skeleton loaders
- [ ] Empty states ilustrados

---

## 🎯 SISTEMA DE ADS AUTOMATIZADO

### COMO FUNCIONA:
1. Cliente acessa `/anunciar`
2. Escolhe pacote (Bronze/Prata/Ouro)
3. Preenche dados do anúncio
4. Faz pagamento (PIX/Cartão)
5. Sistema cria post automaticamente:
   - [ ] Tabela `sponsored_ads` (anúncios pagos)
   - [ ] Campo `boost_level` em listings
   - [ ] Query prioriza boosted ads
   - [ ] Aparece em destaque (badge "Patrocinado")

**Precisa:**
- [ ] Integração de pagamento (Stripe/Mercado Pago)
- [ ] Email de confirmação
- [ ] Painel admin para gerenciar
- [ ] Analytics de performance

---

## ✅ RECOMENDAÇÃO IMEDIATA

**FAZER AGORA (próximos 30min):**
1. Criar SignupPage (cadastro de usuário)
2. Criar CreateListingPage (criar anúncio)
3. Adicionar hero na HomePage com imagem

**Quer que eu comece por qual?** 🚀
