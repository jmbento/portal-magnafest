#!/bin/bash

# Navegar para o diretório
cd "/Volumes/bxdMAC/Projetos apps/canapev"

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Deploy completo: Portal MagnaFest v1.0"

# Verificar se tem remote configurado
if git remote | grep -q "origin"; then
  echo "Remote já configurado. Fazendo push..."
  git push
else
  echo "Nenhum remote configurado."
  echo "Execute: git remote add origin https://github.com/SEU-USUARIO/portal-magnafest.git"
  echo "Depois: git push -u origin main"
fi
