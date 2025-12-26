# 🚀 Guia de Execução - MAGNAFEST WORLD Seeding

## ⚠️ IMPORTANTE: Execute nesta ordem!

### **Passo 1: Setup do Banco de Dados**

Antes de executar o seeding, você precisa criar as tabelas no Supabase:

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Vá em **SQL Editor** no menu lateral
3. Copie e cole o conteúdo completo do arquivo:
   ```
   supabase/SETUP_MAGNAFEST_COMPLETO.sql
   ```
4. Clique em **RUN** para executar
5. ✅ Aguarde a confirmação de sucesso

### **Passo 2: Executar o Seeding**

Agora você pode popular o banco com centenas de perfis:

```bash
npx ts-node scripts/seed-magna-world.ts
```

### **O que o script faz:**

- 🔍 Busca todas as categorias de serviço no banco
- 🎲 Gera 20-35 perfis realistas para cada categoria usando Faker.js
- 📝 Cria descrições técnicas contextuais (ex: "Operador GrandMA2", "Sistemas Line Array")
- 🌎 Distribui profissionais em 20 cidades brasileiras
- 📱 Gera WhatsApp, email e Instagram automáticos
- 💾 Insere em lotes (batch) para performance máxima
- 📊 Exibe estatísticas detalhadas ao final

### **Resultado Esperado:**

```
✅ MAGNAFEST WORLD CREATED!
📈 250+ perfis profissionais inseridos
🏢 10 categorias populadas
🌎 20 cidades cobertas
```

### **Em caso de erro:**

Se aparecer `Could not find the table 'service_categories'`:
- ✅ Execute primeiro o **Passo 1** (SQL no Supabase Dashboard)
- ⏱️ Aguarde 10-30 segundos para o cache atualizar
- 🔄 Execute novamente o script de seeding

---

## 🎯 Próximos Passos

Após popular o banco:
1. Acesse http://localhost:5173/profissionais
2. Teste a busca por categorias
3. Verifique se os perfis aparecem corretamente
4. Implemente filtros de busca inteligente

**Dúvidas?** O script é idempotente - você pode executar várias vezes!
