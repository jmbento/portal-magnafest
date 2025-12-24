# 🚀 GUIA SUPER SIMPLES - CONFIGURAR BANCO DE DADOS

## ⚡ MÉTODO RÁPIDO (1 Arquivo Único)

### PASSO 1: Abrir Supabase

1. Acesse: https://supabase.com
2. Faça login
3. Selecione seu projeto: **canapev** (ou o nome que você deu)

---

### PASSO 2: Abrir SQL Editor

1. No menu lateral esquerdo, clique em: **SQL Editor**
2. Clique no botão: **+ New query**

---

### PASSO 3: Copiar e Colar o SQL

1. Abra o arquivo:
   ```
   supabase/SETUP_COMPLETO_EXECUTAR_APENAS_UMA_VEZ.sql
   ```

2. **Selecione TUDO** (Ctrl+A ou Cmd+A)

3. **Copie** (Ctrl+C ou Cmd+C)

4. **Cole** no SQL Editor do Supabase (Ctrl+V ou Cmd+V)

---

### PASSO 4: Executar

1. Clique no botão verde: **RUN** (ou pressione Ctrl+Enter)

2. Aguarde alguns segundos...

3. Você deve ver: **"Success. No rows returned"** ✅

OU

**"Setup completo! Todas as tabelas foram criadas com sucesso!"** ✅

---

### PASSO 5: Verificar Tabelas

1. No menu lateral, clique em: **Table Editor**

2. Você deve ver estas tabelas:
   - ✅ `events`
   - ✅ `tickets`
   - ✅ `registrations`
   - ✅ `compliance_docs` (com 3 registros)
   - ✅ `providers`
   - ✅ `posts` (com 3 registros)

---

## ✅ PRONTO! BANCO CONFIGURADO!

Agora volte para o terminal e instale a dependência:

```bash
npm install react-markdown
```

E teste:

```bash
npm run dev
```

Acesse:
- http://localhost:5173/eventos
- http://localhost:5173/blog
- http://localhost:5173/guia-legal
- http://localhost:5173/agenda

---

## 🆘 SE DER ERRO?

### Erro: "relation already exists"
**Solução:** Ignore! Significa que a tabela já existe. Está tudo OK!

### Erro: "permission denied"
**Solução:** Verifique se você é o owner do projeto no Supabase.

### Erro: "syntax error"
**Solução:** 
1. Certifique-se que copiou TODO o arquivo
2. Tente copiar novamente
3. Verifique se não tem caracteres estranhos

---

## 📞 TESTOU E FUNCIONOU?

Abra o navegador:

1. **Blog:** http://localhost:5173/blog
   - Deve mostrar 3 artigos

2. **Guia Legal:** http://localhost:5173/guia-legal
   - Deve mostrar 3 documentos (ECAD, AVCB, Alvará)

3. **Eventos:** http://localhost:5173/eventos
   - Pode estar vazio (precisa criar eventos)

---

**Pronto! Zero erros, tudo automatizado!** 🎉
