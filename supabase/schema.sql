-- =====================================================================
-- MAGNAFEST - Schema SQL (Tabela Events)
-- =====================================================================
-- Arquivo: supabase/schema.sql
-- Propósito: Schema de referência para a tabela events
-- Nota: Para produção, use os arquivos em /migrations com timestamp
-- =====================================================================

-- =====================================================================
-- TABELA: events
-- =====================================================================

CREATE TABLE IF NOT EXISTS events (
    -- Chave primária UUID gerada automaticamente
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Timestamp de criação (automático)
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Dados do evento
title TEXT NOT NULL,
description TEXT,
event_date TIMESTAMPTZ NOT NULL,

-- Relacionamento com usuário
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE );

-- =====================================================================
-- SEGURANÇA: Row Level Security (RLS)
-- =====================================================================

-- Habilitar RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Leitura pública
CREATE POLICY "Qualquer um pode ver eventos" ON events FOR
SELECT USING (true);

-- Policy: Inserção apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem criar eventos" ON events FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Policy: Atualização apenas pelo dono
CREATE POLICY "Usuários podem editar seus próprios eventos" ON events FOR
UPDATE USING (auth.uid () = user_id);

-- Policy: Exclusão apenas pelo dono
CREATE POLICY "Usuários podem deletar seus próprios eventos" ON events FOR DELETE USING (auth.uid () = user_id);

-- =====================================================================
-- PERFORMANCE: Índices
-- =====================================================================

-- Índice na data do evento (para ordenação)
CREATE INDEX idx_events_event_date ON events (event_date);

-- Índice no user_id (para filtros por usuário)
CREATE INDEX idx_events_user_id ON events (user_id);