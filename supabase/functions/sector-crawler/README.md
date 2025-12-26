# Sector Crawler - Auto-Feed System

Edge Function que automaticamente popula o banco de dados com perfis de empresas do setor de eventos.

## Funcionalidade

- Seleciona aleatoriamente uma keyword do pool de termos do setor
- Gera perfis mockados baseados na keyword
- Insere no banco com `upsert` (evita duplicatas por website)
- Retorna quantidade de perfis inseridos

## Deploy

```bash
supabase functions deploy sector-crawler
```

## Invocar Manualmente

```bash
curl -i --location --request POST 'https://YOUR_PROJECT.supabase.co/functions/v1/sector-crawler' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'
```

## Automação (Cron)

Configure no Supabase Dashboard:
- Schedule: `0 */6 * * *` (a cada 6 horas)
- Function: `sector-crawler`

## Response

```json
{
  "success": true,
  "term": "DJ profissional",
  "inserted_count": 2
}
```
