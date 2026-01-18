#!/usr/bin/env bash
set -euo pipefail

# scripts/run_migrations_and_seed.sh
# Uso: export DATABASE_URL or export SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY
# Executa o bundle SQL e depois o seed TypeScript.

echo "== Portal MagnaFest: run_migrations_and_seed.sh =="

if [ -z "${PWD}" ]; then
  echo "Erro: não foi possível determinar o diretório atual." >&2
  exit 1
fi

echo "1) Verificando presença do arquivo de migrations..."
if [ ! -f "supabase/AGGREGATED_MIGRATIONS.sql" ]; then
  echo "Arquivo supabase/AGGREGATED_MIGRATIONS.sql não encontrado." >&2
  exit 1
fi

# 1) Apply SQL via psql using DATABASE_URL
if [ -n "${DATABASE_URL:-}" ]; then
  echo "2) Aplicando SQL via psql (DATABASE_URL detectado)..."
  if ! command -v psql >/dev/null 2>&1; then
    echo "Aviso: psql não encontrado. Instale (macOS: brew install libpq) e exporte PATH se necessário." >&2
    exit 1
  fi
  psql "$DATABASE_URL" -f supabase/AGGREGATED_MIGRATIONS.sql
  echo "✅ Migrations aplicadas via psql."
else
  echo "2) DATABASE_URL não encontrado. Pulando aplicação via psql." 
  echo "   Se quiser aplicar automaticamente, exporte DATABASE_URL com a connection string do Supabase." 
fi

# 2) Run seed (requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "3) Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes. Precisam estar definidas para rodar o seed." 
  echo "   Exemplo (substitua pelos seus valores):"
  echo "     export SUPABASE_URL=\"https://<seu-projeto>.supabase.co\""
  echo "     export SUPABASE_SERVICE_ROLE_KEY=\"service_role_xxxxxxxxxxxxxxxxxxxxx\""
  echo "   Após exportar, rode novamente: ./scripts/run_migrations_and_seed.sh"
  exit 0
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "Erro: npx não foi encontrado. Instale Node.js / npm." >&2
  exit 1
fi

# Optional percentage env
if [ -z "${SEED_PERCENT_REGISTERED:-}" ]; then
  export SEED_PERCENT_REGISTERED=0.8
  echo "Usando SEED_PERCENT_REGISTERED=${SEED_PERCENT_REGISTERED} (padrão)."
else
  echo "Usando SEED_PERCENT_REGISTERED=${SEED_PERCENT_REGISTERED}."
fi

echo "4) Executando seed..."
# Run seed and capture output
npx ts-node src/scripts/seed-professionals.ts

echo "✅ Seed finalizado. Verifique no Supabase as inserções (tabela profiles)."

exit 0
