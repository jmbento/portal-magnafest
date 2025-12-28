#!/bin/bash

# Script de deploy automático via Vercel CLI
# Criado para o Portal MagnaFest

echo "🚀 Iniciando deploy do Portal MagnaFest..."

cd "/Volumes/bxdMAC/Projetos apps/Portal MagnaFest"

# Build local primeiro para validar
echo "📦 Rodando build local..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build local OK!"
  echo ""
  echo "🔐 Agora você precisa fazer login no Vercel"
  echo ""
  echo "Execute manualmente:"
  echo "  cd \"/Volumes/bxdMAC/Projetos apps/Portal MagnaFest\""
  echo "  npx vercel login"
  echo "  npx vercel --prod"
  echo ""
  echo "Durante o deploy, configure:"
  echo "  - Link to existing project? Yes → portal-magnafest"
  echo "  - Environment Variables:"
  echo "    VITE_SUPABASE_URL=https://seu-projeto.supabase.co"
  echo "    VITE_SUPABASE_ANON_KEY=sua-key"
else
  echo "❌ Build falhou! Veja os erros acima."
fi
