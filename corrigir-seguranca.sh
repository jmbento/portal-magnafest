#!/bin/bash

# =====================================================================
# SCRIPT DE CORREÇÃO PÓS-DEPLOY - PORTAL MAGNAFEST
# =====================================================================
# Automatiza passos de segurança após deploy com credenciais expostas
# =====================================================================

set -e  # Sair se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${RED}🚨 CORREÇÃO DE SEGURANÇA PÓS-DEPLOY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =====================================================================
# PASSO 1: VERIFICAR SE ESTÁ NA RAIZ DO PROJETO
# =====================================================================
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Projeto detectado: Portal MagnaFest${NC}"
echo ""

# =====================================================================
# PASSO 2: VERIFICAR SE AS CORREÇÕES FORAM APLICADAS
# =====================================================================
echo -e "${BLUE}📋 Verificando correções aplicadas...${NC}"

if ! grep -q "requireAdmin" src/components/auth/ProtectedRoute.tsx; then
    echo -e "${RED}❌ ProtectedRoute não foi modificado!${NC}"
    echo "Execute as correções primeiro."
    exit 1
fi

if ! grep -q ".env.credentials" .gitignore; then
    echo -e "${RED}❌ .gitignore não foi atualizado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Correções de código aplicadas${NC}"
echo ""

# =====================================================================
# PASSO 3: TESTAR BUILD LOCAL
# =====================================================================
echo -e "${BLUE}🔨 Testando build local...${NC}"

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build funcionando${NC}"
else
    echo -e "${RED}❌ Build falhou! Corrija os erros antes de continuar.${NC}"
    exit 1
fi
echo ""

# =====================================================================
# PASSO 4: VERIFICAR CREDENCIAIS DO SUPABASE
# =====================================================================
echo -e "${YELLOW}⚠️  AÇÃO NECESSÁRIA: ROTACIONAR CREDENCIAIS${NC}"
echo ""
echo "1. Acesse: https://supabase.com/dashboard"
echo "2. Selecione seu projeto: afguexgrhybzzkjcsvub"
echo "3. Settings → API → Regenerate anon key"
echo "4. Copie a NOVA chave"
echo ""
read -p "Pressione ENTER após rotacionar a chave no Supabase..."
echo ""

# =====================================================================
# PASSO 5: ATUALIZAR .env LOCAL
# =====================================================================
echo -e "${BLUE}🔑 Atualizando .env local...${NC}"
echo ""
echo "Cole a NOVA chave anon do Supabase (ou pressione ENTER para pular):"
read -r NEW_ANON_KEY

if [ ! -z "$NEW_ANON_KEY" ]; then
    # Criar ou atualizar .env
    cat > .env << EOF
# Variáveis de ambiente - Portal MagnaFest
# NÃO COMITE ESTE ARQUIVO!

VITE_SUPABASE_URL=https://afguexgrhybzzkjcsvub.supabase.co
VITE_SUPABASE_ANON_KEY=$NEW_ANON_KEY
EOF
    echo -e "${GREEN}✅ .env atualizado localmente${NC}"
else
    echo -e "${YELLOW}⚠️  Pulado. Lembre-se de atualizar .env manualmente!${NC}"
fi
echo ""

# =====================================================================
# PASSO 6: ATUALIZAR VARIÁVEIS NO VERCEL
# =====================================================================
echo -e "${YELLOW}⚠️  AÇÃO NECESSÁRIA: ATUALIZAR VERCEL${NC}"
echo ""
echo "Opção A: Via CLI (recomendado)"
echo "  vercel env rm VITE_SUPABASE_ANON_KEY production"
echo "  vercel env add VITE_SUPABASE_ANON_KEY production"
echo ""
echo "Opção B: Via Dashboard"
echo "  https://vercel.com/dashboard → Seu projeto"
echo "  Settings → Environment Variables"
echo "  Editar VITE_SUPABASE_ANON_KEY"
echo ""
read -p "Pressione ENTER após atualizar no Vercel..."
echo ""

# =====================================================================
# PASSO 7: COMMITAR E PUSH
# =====================================================================
echo -e "${BLUE}📦 Preparando commit...${NC}"

git add .gitignore \
        src/components/auth/ProtectedRoute.tsx \
        src/App.tsx \
        .env.required \
        supabase/CONFIGURAR_ADMIN.sql \
        URGENTE_POS_DEPLOY.md 2>/dev/null || true

echo ""
git status --short
echo ""

read -p "Fazer commit e push? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "🔒 SECURITY: Protege rotas admin, remove credenciais e rotaciona chaves"
    
    echo ""
    echo -e "${BLUE}🚀 Fazendo push...${NC}"
    git push origin main
    
    echo ""
    echo -e "${GREEN}✅ Push realizado! Deploy automático iniciado.${NC}"
else
    echo -e "${YELLOW}⚠️  Commit cancelado. Execute manualmente:${NC}"
    echo "  git commit -m \"🔒 SECURITY: Protege rotas admin\""
    echo "  git push origin main"
fi
echo ""

# =====================================================================
# PASSO 8: CONFIGURAR ADMIN NO SUPABASE
# =====================================================================
echo -e "${YELLOW}⚠️  AÇÃO NECESSÁRIA: CONFIGURAR ADMIN${NC}"
echo ""
echo "Execute no SQL Editor do Supabase (PRODUÇÃO):"
echo ""
echo -e "${BLUE}UPDATE auth.users"
echo "SET raw_user_meta_data = "
echo "  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{\"role\": \"admin\"}'::jsonb"
echo -e "WHERE email = 'SEU-EMAIL@AQUI.COM';${NC}"
echo ""
read -p "Pressione ENTER após configurar admin no Supabase..."
echo ""

# =====================================================================
# PASSO 9: AGUARDAR DEPLOY
# =====================================================================
echo -e "${BLUE}⏳ Aguardando deploy...${NC}"
echo ""
echo "Acompanhe em: https://vercel.com/dashboard"
echo ""
read -p "Pressione ENTER quando o deploy finalizar..."
echo ""

# =====================================================================
# PASSO 10: TESTES FINAIS
# =====================================================================
echo -e "${BLUE}🧪 TESTES EM PRODUÇÃO${NC}"
echo ""
echo "Execute manualmente:"
echo "1. Acesse: https://seu-dominio.vercel.app/admin/seed (sem login)"
echo "   → Deve redirecionar para /login ✅"
echo ""
echo "2. Faça login com usuário comum"
echo "   Acesse: /admin/dashboard"
echo "   → Deve redirecionar para / ✅"
echo ""
echo "3. Faça login com admin configurado"
echo "   Acesse: /admin/seed"
echo "   → Deve carregar normalmente ✅"
echo ""

# =====================================================================
# FINALIZAÇÃO
# =====================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ PROCESSO DE CORREÇÃO CONCLUÍDO!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Checklist final:${NC}"
echo "  ✅ Credenciais rotacionadas"
echo "  ✅ Código corrigido"
echo "  ✅ Deploy realizado"
echo "  ✅ Admin configurado"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "  • Testar rotas admin em produção"
echo "  • Monitorar logs do Supabase"
echo "  • Considerar limpar histórico do Git (ver URGENTE_POS_DEPLOY.md)"
echo ""
echo -e "${BLUE}Documentação completa:${NC} URGENTE_POS_DEPLOY.md"
echo ""
