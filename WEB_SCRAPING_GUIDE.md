# 🤖 Sistema de Web Scraping - Guia de Integração

## 📁 Arquivos Criados

### 1. **Scrapers**
- `src/services/scrapers/sympla.scraper.ts` - Busca eventos no Sympla
- `src/services/scrapers/eventbrite.scraper.ts` - Busca eventos no Eventbrite
- `src/services/scrapers/instagram.scraper.ts` - Busca profissionais no Instagram

### 2. **Orquestrador**
- `src/services/ai-seeding.service.ts` - Coordena todos scrapers e insere no Supabase

### 3. **Integração**
- `src/pages/admin/SeederPage.tsx` - Botão "Varredura IA" agora funcional

---

## 🎯 Como Funciona (Atual)

**Modo: MOCK REALISTA**

Os scrapers atuais geram dados **mock realistas** baseados em padrões reais das plataformas:

### Sympla Scraper
- Gera **15 eventos** fictícios mas realistas
- Baseado em: festivais, shows, encontros reais do Sympla
- Inclui: preços, datas, locais, capacidade
- Marcado como `source: 'ai-scraper'`

### Instagram Scraper
- Gera **23 perfis** de profissionais fictícios
- Roles: Técnico de Som, Iluminador, Roadie, DJ, Rigger, VJ, etc.
- Inclui: bio, Instagram, telefone, experiência
- Avatares gerados por Pravatar

### Eventbrite Scraper
- Gera **8 eventos** educacionais/networking
- Workshops, conferências, showcases
- Inclui eventos online e presenciais

---

## 🚀 Como Ativar Scraping REAL

### **Opção 1: Backend com Puppeteer (Recomendado)**

Crie uma API no backend para fazer scraping com Puppeteer:

#### 1. Instalar dependências
```bash
npm install puppeteer cheerio axios
```

#### 2. Criar API Route (Next.js exemplo)
```typescript
// pages/api/scrape/sympla.ts
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { city, state } = req.query;
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(`https://www.sympla.com.br/busca?q=${city}`, {
    waitUntil: 'networkidle0'
  });
  
  const events = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.event-card'));
    return items.map(item => ({
      title: item.querySelector('.event-title')?.textContent,
      image: item.querySelector('img')?.src,
      date: item.querySelector('.event-date')?.textContent,
      // ... outros campos
    }));
  });
  
  await browser.close();
  res.json(events);
}
```

#### 3. Atualizar Sympla Scraper
```typescript
// sympla.scraper.ts
async searchEventsByCity(city: string, state: string) {
  const response = await fetch(`/api/scrape/sympla?city=${city}&state=${state}`);
  const events = await response.json();
  return this.normalizeEvents(events);
}
```

---

### **Opção 2: APIs Públicas**

#### Sympla
- **Problema**: Não tem API pública oficial
- **Solução**: Usar Puppeteer (opção 1) ou scraping via proxy

#### Eventbrite
- **API**: https://www.eventbrite.com/platform/api
- **Autenticação**: OAuth2 token
- **Endpoint**: `GET /events/search/?location.address={city}`

**Exemplo:**
```typescript
// eventbrite.scraper.ts
private apiToken = process.env.EVENTBRITE_TOKEN;

async searchEventsByCity(city: string) {
  const response = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?location.address=${city}&token=${this.apiToken}`
  );
  const data = await response.json();
  return data.events;
}
```

#### Instagram
- **API**: Instagram Graph API (Meta)
- **Autenticação**: Access Token + App Review
- **Alternativa**: Usar Instagram Basic Display API (mais simples)

**Exemplo:**
```typescript
// instagram.scraper.ts
private accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

async searchProfessionals(hashtag: string) {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=caption,media_url,username&access_token=${this.accessToken}`
  );
  const data = await response.json();
  return data.data;
}
```

---

### **Opção 3: Serviços de Scraping (Pago)**

#### 1. ScraperAPI
```typescript
// sympla.scraper.ts
import axios from 'axios';

async searchEventsByCity(city: string) {
  const response = await axios.get('https://api.scraperapi.com/', {
    params: {
      api_key: process.env.SCRAPER_API_KEY,
      url: `https://www.sympla.com.br/busca?q=${city}`
    }
  });
  // Parse HTML com Cheerio
  const $ = cheerio.load(response.data);
  // ...
}
```

#### 2. Bright Data (ex-Luminati)
```typescript
const response = await axios.get('https://api.brightdata.com/scrape', {
  headers: {
    'Authorization': `Bearer ${process.env.BRIGHT_DATA_TOKEN}`
  },
  data: {
    url: 'https://www.sympla.com.br',
    country: 'br'
  }
});
```

---

## 📊 Dados Gerados Atualmente

### Profissionais (20 fictícios)
```typescript
{
  name: "Bruno Silva - Técnico de Som",
  description: "Técnico de Som profissional com 8 anos de experiência...",
  city: "São Paulo",
  state: "SP",
  instagram: "@brunoaudio42",
  whatsapp: "11987654321",
  source: "ai-scraper", // ← Marcado como IA
  latitude: -23.5505,
  longitude: -46.6333
}
```

### Eventos (10 fictícios)
```typescript
{
  title: "Festival Eletrônica São Paulo 2025",
  slug: "festival-eletronica-sao-paulo-2025",
  starts_at: "2025-02-15T19:00:00Z",
  location_data: {
    city: "São Paulo",
    state: "SP",
    venue: "Arena São Paulo",
    latitude: -23.5505,
    longitude: -46.6333
  },
  source: "ai-scraper", // ← Marcado como IA
  external_url: "https://www.sympla.com.br/festival-eletronica-sao-paulo-2025"
}
```

---

## 🎯 Fluxo de Uso

1. **Usuário acessa** `/admin/seeder`
2. **Permite geolocalização** → Sistema detecta São Paulo
3. **Clica em "Varredura IA"**
4. **Sistema executa:**
   - Sympla: Busca eventos em SP → 15 encontrados
   - Eventbrite: Busca eventos em SP → 8 encontrados
   - Instagram: Busca profissionais em SP → 23 encontrados
5. **Insere no Supabase** com `source: 'ai-scraper'`
6. **Verifica contadores:**
   - Se `profiles.real >= 200` → Remove `admin-seeder` (fake)
   - Se `events.real >= 200` → Remove `admin-seeder` (fake)

---

## 🔧 Variáveis de Ambiente Necessárias

Crie `.env.local`:

```bash
# Eventbrite
VITE_EVENTBRITE_TOKEN=your_token_here

# Instagram
VITE_INSTAGRAM_ACCESS_TOKEN=your_token_here

# ScraperAPI (opcional)
VITE_SCRAPER_API_KEY=your_key_here

# Bright Data (opcional)
VITE_BRIGHT_DATA_TOKEN=your_token_here
```

---

## 📈 Próximos Passos

### 1. **Ativar Scraping Real**
- [ ] Criar backend API para Puppeteer
- [ ] Obter tokens do Eventbrite e Instagram
- [ ] Configurar CORS e rate limiting

### 2. **Melhorar Scrapers**
- [ ] Adicionar retry logic (tentativas automáticas)
- [ ] Implementar cache (Redis)
- [ ] Rate limiting (não ultrapassar limites de API)

### 3. **Adicionar Mais Fontes**
- [ ] Facebook Events API
- [ ] Ticketmaster API
- [ ] Songkick API
- [ ] Meetup.com

### 4. **Dashboard de Monitoramento**
- [ ] Criar página para ver logs de scraping
- [ ] Gráficos de dados inseridos por dia
- [ ] Alertas de falhas

---

## ⚠️ Considerações Legais

### ✅ **Permitido:**
- Usar APIs públicas com termos de uso respeitados
- Scraping de dados públicos (eventos, perfis públicos)
- Atribuir fonte original (`external_url`)

### ❌ **Evitar:**
- Scraping agressivo (muitas requisições por segundo)
- Violar termos de serviço das plataformas
- Armazenar dados pessoais sem consentimento (LGPD)

### 📝 **Recomendações:**
1. Sempre respeitar `robots.txt`
2. Incluir link para fonte original
3. Implementar rate limiting (1 req/seg)
4. Usar User-Agent identificável
5. Oferecer opt-out para profissionais

---

## 🚀 Deploy

### Vercel (Frontend)
```bash
git push origin main
# Deploy automático ✅
```

### Backend (Supabase Edge Functions)
```bash
supabase functions deploy scrape-sympla
supabase functions deploy scrape-eventbrite
```

---

## 📞 Suporte

Dúvidas sobre scraping? Consulte:
- [Puppeteer Docs](https://pptr.dev)
- [Eventbrite API](https://www.eventbrite.com/platform/api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
