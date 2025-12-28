# 📦 Guia de Deploy - Portal MagnaFest v1.0

Este documento descreve como fazer o deploy inicial do Portal MagnaFest.

## Pré-requisitos

- Git instalado
- Conta no GitHub
- Navegador web

## 🚀 Deploy Inicial

### 1. Preparar o Repositório Local

Se você está começando um novo projeto:

```bash
cd "/seu/diretorio/do/projeto"
git init
git add .
git commit -m "Portal MagnaFest v1.0 - Deploy inicial"
```

### 2. Configurar o Repositório Remoto

```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portal-magnafest.git
git push -u origin main
```

**Nota:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

### 3. Verificar o Deploy

Após o push, verifique se todos os arquivos foram enviados corretamente:

```bash
git status
git log --oneline
```

## 🌐 Opções de Hospedagem

### GitHub Pages

1. Acesse as configurações do seu repositório no GitHub
2. Vá para a seção "Pages"
3. Selecione a branch `main` e a pasta `/` (root)
4. Clique em "Save"
5. Seu site estará disponível em: `https://SEU-USUARIO.github.io/portal-magnafest/`

### Netlify

1. Acesse [Netlify](https://www.netlify.com)
2. Faça login com sua conta GitHub
3. Clique em "New site from Git"
4. Selecione o repositório `portal-magnafest`
5. Configure:
   - Build command: (deixe vazio)
   - Publish directory: `.` ou `/`
6. Clique em "Deploy site"

### Vercel

1. Acesse [Vercel](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Import Project"
4. Selecione o repositório `portal-magnafest`
5. Clique em "Deploy"

## 🔧 Configurações Adicionais

### Domínio Customizado

Para usar um domínio próprio:

1. Configure o DNS do seu domínio
2. Adicione um registro CNAME apontando para o servidor de hospedagem
3. Configure o domínio customizado nas configurações do serviço de hospedagem

### SSL/HTTPS

A maioria dos serviços de hospedagem (GitHub Pages, Netlify, Vercel) fornece SSL gratuito automaticamente.

## 📝 Comandos Git Úteis

```bash
# Verificar status
git status

# Ver histórico de commits
git log --oneline

# Criar uma nova branch
git checkout -b nome-da-branch

# Fazer merge de branches
git checkout main
git merge nome-da-branch

# Atualizar repositório local
git pull origin main

# Enviar alterações
git add .
git commit -m "Descrição das alterações"
git push origin main
```

## 🐛 Troubleshooting

### Erro: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/portal-magnafest.git
```

### Erro: "failed to push some refs"

```bash
git pull origin main --rebase
git push origin main
```

### Erro de permissão

Verifique se você tem permissão de escrita no repositório e se está autenticado corretamente.

## 📚 Recursos Adicionais

- [Documentação Git](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [GitHub Pages](https://pages.github.com)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)

---

**Portal MagnaFest v1.0** - Desenvolvido com ❤️
