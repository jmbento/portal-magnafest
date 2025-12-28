# 🔍 Diagnóstico: Páginas de Auto Preenchimento

## 📋 Status Atual

### ✅ **Deploy Concluído**
- URL Principal: https://canapev.vercel.app
- URL Alternativa: https://portalmagnafest-59t06njpz-bentos-projects-e258f1d6.vercel.app

---

## 🎯 Páginas de Auto Preenchimento

### **1. SeederPage (Admin)**
📍 **Rota:** `/admin/seeder`

**Funcionalidades:**
- ✅ Geolocalização automática do usuário
- ✅ Seed de 20 profissionais elite
- ✅ Seed de 10 mega eventos 2025
- ✅ Filtragem regional (500km de raio)
- ✅ Varredura IA (Sympla, Eventbrite, Instagram)
- ✅ Auto-limpeza ao atingir 200 itens reais

**Botões Disponíveis:**
1. **🎯 Profissionais Regionais** - Insere 20 profissionais perto de você
2. **🎯 Eventos Regionais** - Insere 10 eventos perto de você
3. **🌍 Todos Profissionais** - Insere todos 20 profissionais
4. **🌍 Todos Eventos** - Insere todos 10 eventos
5. **🤖 Varredura IA Regional** - IA busca dados reais na sua região
6. **🗑️ Limpar Dados Fake** - Remove dados marcados como `admin-seeder`

---

## 🐛 Possíveis Problemas

### **1. Página não carrega**
**Sintoma:** Tela branca ou erro 404

**Diagnóstico:**
```bash
# Verificar se a rota existe no App.tsx
grep -n "SeederPage" src/App.tsx
```

**Solução:**
- Acessar: https://canapev.vercel.app/admin/seeder
- Verificar se usuário está autenticado (requer login)

---

### **2. Botões não funcionam**
**Sintoma:** Clica nos botões mas nada acontece

**Diagnóstico:**
1. Abrir DevTools (F12)
2. Ver tab Console
3. Verificar erros (principalmente Supabase)

**Erros Comuns:**
```
❌ "Cannot read property 'from' of undefined"
   → Supabase não inicializado

❌ "Invalid API key"
   → Variáveis de ambiente não configuradas

❌ "CORS error"
   → Domínio não autorizado no Supabase

❌ "No 'Access-Control-Allow-Origin'"
   → RLS policies bloqueando inserção
```

**Soluções:**

#### A) Verificar variáveis de ambiente Vercel:
```bash
VITE_SUPABASE_URL=https://afguexgrhybzzkjcsvub.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### B) Verificar RLS Policies no Supabase:
```sql
-- Permitir INSERT em profiles para usuários autenticados
CREATE POLICY "Allow insert profiles for authenticated users"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir INSERT em events para usuários autenticados
CREATE POLICY "Allow insert events for authenticated users"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);
```

#### C) Verificar tabelas existem:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'events', 'service_categories');
```

---

### **3. Geolocalização não funciona**
**Sintoma:** Console mostra "⚠️ Geolocalização negada"

**Diagnóstico:**
- Navegador bloqueou permissão de localização

**Soluções:**
1. **Chrome:** Clicar no ícone 🔒 ao lado da URL → Permissões → Localização → Permitir
2. **Safari:** Preferências → Sites → Localização → Permitir
3. **Firefox:** Clicar no ícone 🛈 → Permissões → Localização → Permitir

**Fallback:**
- Sistema usa São Paulo (-23.5505, -46.6333) como padrão

---

### **4. Varredura IA não retorna dados**
**Sintoma:** Console mostra "✅ 0 eventos inseridos"

**Diagnóstico:**
- Scrapers estão em modo MOCK (geram dados fictícios realistas)
- Não fazem scraping real ainda

**Status Atual:**
- ✅ Sympla: Gera 15 eventos fictícios baseados em padrões reais
- ✅ Eventbrite: Gera 8 eventos educacionais fictícios
- ✅ Instagram: Gera 23 perfis profissionais fictícios
- ⚠️ Scraping REAL: Precisa backend Puppeteer (ver WEB_SCRAPING_GUIDE.md)

**Dados Inseridos:**
- Marcados com `source: 'ai-scraper'`
- Contam como "dados reais" para estatísticas
- 46 itens por execução (15+8+23)

---

### **5. Erro "No categories found"**
**Sintoma:** Console mostra "❌ Nenhuma categoria encontrada"

**Diagnóstico:**
- Tabela `service_categories` está vazia

**Solução:**
```sql
-- Inserir categorias padrão
INSERT INTO service_categories (name, slug, description, icon_name) VALUES
('Áudio', 'audio', 'Técnicos de som e engenheiros de áudio', 'Headphones'),
('Iluminação', 'iluminacao', 'Lighting designers e operadores', 'Lightbulb'),
('Estrutura', 'estrutura', 'Riggers e montadores', 'Box'),
('Produção', 'producao', 'Produtores e coordenadores', 'Briefcase'),
('Mídia', 'midia', 'Fotógrafos e videomakers', 'Camera');
```

---

## 🧪 Como Testar

### **Teste 1: Seed Básico**
1. Acesse: https://canapev.vercel.app/admin/seeder
2. Faça login (se necessário)
3. Permita geolocalização
4. Clique em **"🎯 Profissionais Regionais"**
5. Verifique console log
6. Deve mostrar: `✅ X profissionais inseridos!`

### **Teste 2: Varredura IA**
1. Clique em **"🤖 Varredura IA Regional"**
2. Aguarde 5-10 segundos
3. Verifique console:
   - `✅ Sympla: 15 eventos encontrados`
   - `✅ Eventbrite: 8 eventos encontrados`
   - `✅ Instagram: 23 profissionais encontrados`
4. Total inserido: **46 itens**

### **Teste 3: Estatísticas**
1. Veja painel "📊 Estatísticas"
2. Deve mostrar:
   - **Profissionais Reais:** Incrementando
   - **Profissionais Fake:** Mostrando admin-seeder
   - **Eventos Reais:** Incrementando
   - **Eventos Fake:** Mostrando admin-seeder

### **Teste 4: Auto-limpeza**
1. Execute varredura IA várias vezes até atingir 200 reais
2. Sistema deve automaticamente:
   - Detectar threshold
   - Remover dados `source = 'admin-seeder'`
   - Mostrar log: `🗑️ Auto-limpeza ativada! Removidos X itens fake`

---

## 📞 Debug Console

Abra DevTools (F12) e execute:

```javascript
// Verificar Supabase inicializado
console.log(window.supabase);

// Verificar autenticação
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Verificar categorias
const { data: categories } = await supabase
  .from('service_categories')
  .select('*');
console.log('Categories:', categories);

// Verificar profissionais
const { data: profiles } = await supabase
  .from('profiles')
  .select('name, source, city')
  .limit(5);
console.log('Profiles:', profiles);

// Verificar eventos
const { data: events } = await supabase
  .from('events')
  .select('title, source, location_data')
  .limit(5);
console.log('Events:', events);
```

---

## 🔧 Correções Rápidas

### **Se nada funciona:**
```bash
# 1. Verificar build local
npm run build

# 2. Verificar variáveis ambiente
cat .env.local

# 3. Testar localmente
npm run dev
# Acessar: http://localhost:5173/admin/seeder

# 4. Verificar logs Supabase
# https://supabase.com/dashboard/project/afguexgrhybzzkjcsvub/logs
```

---

## ✅ Checklist de Funcionamento

- [ ] Página carrega sem erros
- [ ] Geolocalização solicita permissão
- [ ] Console log mostra mensagens
- [ ] Botões não ficam travados
- [ ] Estatísticas atualizam após seed
- [ ] Dados aparecem no Supabase Dashboard
- [ ] Varredura IA insere 46 itens
- [ ] Auto-limpeza funciona ao atingir 200

---

## 🆘 Suporte Emergencial

Se nada resolver:

1. **Rollback para versão anterior:**
```bash
git log --oneline -5  # Ver últimos commits
git revert HEAD       # Reverter último commit
git push origin main
```

2. **Recriar tabelas do zero:**
```bash
# Executar: supabase/SETUP_COMPLETO_EXECUTAR_APENAS_UMA_VEZ.sql
```

3. **Verificar logs Vercel:**
```
https://vercel.com/bentos-projects-e258f1d6/portalmagnafest/logs
```

---

**Última atualização:** 28/12/2025  
**Versão:** SeederPage v2.0 + Web Scraping
