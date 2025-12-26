# Scripts de Seed

## seed-professionals.ts

Popula o banco de dados com 30 profissionais realistas distribuídos em 10 categorias.

### Como executar:

#### 1. Instalar dependências
```bash
npm install --save-dev ts-node @types/node
```

#### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

#### 3. Executar o script
```bash
npx ts-node scripts/seed-professionals.ts
```

### O que o script faz:

- Busca todas as categorias de serviço do banco
- Para cada categoria, insere 3 profissionais fictícios mas realistas
- Total: ~30 perfis profissionais
- Dados incluem: nome, descrição, cidade, estado, WhatsApp
- Todos marcados com `is_claimed: false` (estratégia FOMO)
- Source: `seed-script` para rastreamento

### Estrutura dos dados:

Cada profissional tem:
- **Nome:** Empresa ou pessoa física
- **Descrição:** Especialidade e diferenciais
- **Localização:** Cidade e Estado (distribuídos pelo Brasil)
- **Contato:** WhatsApp formatado
- **Categoria:** FK para service_categories

### Categorias seedadas (3 perfis cada):

1. Técnico de Som
2. Eletricista
3. Bombeiro Civil
4. Segurança / Vigilância
5. Equipe de Limpeza
6. Produtor de Eventos
7. Técnico de Iluminação
8. Recepcionistas / Staff
9. Montadores de Estrutura
10. Catering / Buffet

### Exemplo de saída:

```
🚀 Iniciando seed de profissionais...

✅ 10 categorias encontradas

📂 Processando categoria: tecnico-de-som
   ✅ AudioVisão Locações
   ✅ Carlos Mendes - Som Profissional
   ✅ SoundTech Brasil

📂 Processando categoria: eletricista
   ✅ EletroEventos SP
   ✅ João Almeida - Eletricista Certificado
   ✅ Energia Total Eventos

...

🎉 Seed completo! 30 profissionais inseridos.

✅ Script finalizado com sucesso!
```

### Troubleshooting:

**Erro: "Variáveis de ambiente não configuradas"**
- Certifique-se de ter criado o arquivo `.env`
- Verifique se as chaves estão corretas

**Erro: "cannot find module @supabase/supabase-js"**
- Execute: `npm install @supabase/supabase-js`

**Erro: "duplicate key value violates unique constraint"**
- Normal se o script for executado mais de uma vez
- Os perfis já existem no banco
