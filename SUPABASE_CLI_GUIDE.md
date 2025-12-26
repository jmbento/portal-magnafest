# 🚀 Guia Completo - Supabase CLI

## 📦 Instalação

### Passo 1: Instalar Homebrew (se não tiver)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Passo 2: Instalar Supabase CLI
```bash
brew install supabase/tap/supabase
```

### Passo 3: Verificar Instalação
```bash
supabase --version
```

---

## 🔐 Configuração Inicial

### 1. Fazer Login
```bash
supabase login
```
- Vai abrir o browser para você fazer login
- Copia automaticamente o token de acesso

### 2. Inicializar Projeto Local
```bash
cd "/Volumes/bxdMAC/Projetos apps/canapev"
supabase init
```

### 3. Linkar com Projeto Remoto
```bash
supabase link --project-ref afguexgrhybzzkjcsvub
```
> **Nota:** `afguexgrhybzzkjcsvub` é o ID do seu projeto (vi na URL do dashboard)

---

## 🌱 Executar Seeds

### Método 1: Arquivo Individual
```bash
supabase db execute --file ./supabase/seed/providers_seed.sql
supabase db execute --file ./supabase/seed/events_seed.sql
```

### Método 2: Todos os Seeds de Uma Vez
```bash
# Primeiro providers, depois events (ordem importa!)
supabase db execute --file ./supabase/seed/providers_seed.sql && \
supabase db execute --file ./supabase/seed/events_seed.sql
```

### Método 3: Seed Automático (Configurar)
Edite `supabase/config.toml` e adicione:
```toml
[db]
seed_path = "./supabase/seed"
```

Depois rode:
```bash
supabase db reset
```

---

## 🗄️ Comandos Úteis de Database

### Executar Migrations
```bash
# Criar nova migration
supabase migration new nome_da_migration

# Aplicar migrations pendentes
supabase db push

# Ver status das migrations
supabase migration list
```

### Reset Complete do Database
```bash
# CUIDADO: Apaga TUDO e recria do zero
supabase db reset
```

### Executar Query SQL
```bash
# SQL direto no terminal
supabase db execute "SELECT * FROM providers LIMIT 5"

# SQL de arquivo
supabase db execute --file ./minha_query.sql
```

### Diff do Schema
```bash
# Ver diferenças entre local e remoto
supabase db diff

# Gerar migration a partir das diferenças
supabase db diff --schema public | supabase migration new schema_changes
```

---

## 🔄 Workflow Recomendado

### Para Desenvolvimento Local:

1. **Start Local Supabase**
```bash
supabase start
```
- Sobe containers Docker com Postgres, Auth, Storage, etc.
- Cria database local em `http://localhost:54323`

2. **Rodar Migrations**
```bash
supabase db reset
```

3. **Testar Localmente**
- App conecta em `http://localhost:54321` (API)
- Studio local em `http://localhost:54323` (Dashboard)

4. **Push para Produção**
```bash
supabase db push
```

### Para Executar Seeds no Projeto Remoto (Canapev):

```bash
# Certifique-se que está linkado
supabase link --project-ref afguexgrhybzzkjcsvub

# Execute os seeds
supabase db execute --file ./supabase/seed/providers_seed.sql --db-url "sua-connection-string"
```

---

## 🌍 Ambientes Múltiplos

### Estrutura Recomendada:
```
projetos/
├── canapev/          # Projeto 1
│   ├── supabase/
│   └── .env
├── outro-projeto/    # Projeto 2
│   ├── supabase/
│   └── .env
```

### Comandos por Projeto:
```bash
# Canapev
cd canapev
supabase link --project-ref afguexgrhybzzkjcsvub
supabase db push

# Outro projeto
cd ../outro-projeto
supabase link --project-ref outro-id
supabase db push
```

---

## 📋 Comandos Rápidos Mais Usados

```bash
# Ver projetos linkados
supabase projects list

# Ver status do projeto atual
supabase status

# Ver logs em tempo real
supabase functions logs --tail

# Gerar types TypeScript
supabase gen types typescript --local > src/types/database.ts

# Backup do database
supabase db dump -f backup.sql

# Restore do database
supabase db execute -f backup.sql
```

---

## 🎯 Para Executar os Seeds AGORA

Após instalar o CLI, execute:

```bash
cd "/Volumes/bxdMAC/Projetos apps/canapev"

# Login (só precisa fazer 1 vez)
supabase login

# Link com o projeto
supabase link --project-ref afguexgrhybzzkjcsvub

# Executar seeds
supabase db execute --file ./supabase/seed/providers_seed.sql
supabase db execute --file ./supabase/seed/events_seed.sql

# Verificar se funcionou
supabase db execute "SELECT COUNT(*) as total FROM providers"
supabase db execute "SELECT COUNT(*) as total FROM events"
```

---

## ⚡ Dicas Pro

### 1. Alias Úteis
Adicione no seu `~/.zshrc`:
```bash
alias sb='supabase'
alias sbl='supabase link'
alias sbr='supabase db reset'
alias sbp='supabase db push'
```

### 2. Script de Setup Rápido
Crie `setup.sh` no projeto:
```bash
#!/bin/bash
supabase link --project-ref afguexgrhybzzkjcsvub
supabase db reset
supabase db execute --file ./supabase/seed/providers_seed.sql
supabase db execute --file ./supabase/seed/events_seed.sql
echo "✅ Setup completo!"
```

### 3. Gitignore Supabase
Já está no `.gitignore`:
```
.env
.env.local
supabase/.temp/
```

---

## 🐛 Troubleshooting

### "supabase: command not found" após instalação
```bash
# Adicione Homebrew ao PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### "Project not linked"
```bash
supabase link --project-ref afguexgrhybzzkjcsvub
```

### "Permission denied"
```bash
chmod +x setup.sh
./setup.sh
```

### Ver connection string
```bash
supabase status | grep "DB URL"
```

---

## 📚 Recursos

- **Docs Oficiais:** https://supabase.com/docs/guides/cli
- **GitHub:** https://github.com/supabase/cli
- **Discord:** https://discord.supabase.com

---

🎉 **Com o CLI, você pode gerenciar TODOS os projetos de forma profissional!**

Execute migrations, seeds, backups e muito mais direto do terminal! 🚀
