-- =====================================================================
-- MAGNAFEST - Tabela de Eventos
-- =====================================================================
-- Migração: Criação da tabela events
-- Data: 2025-12-22
-- Descrição: Tabela para gerenciar eventos criados por usuários
--            com RLS habilitado e políticas de acesso granulares
-- =====================================================================

BEGIN;

-- =====================================================================
-- 1. CRIAR TABELA EVENTS
-- =====================================================================
-- Tabela para armazenar eventos do sistema
-- Usa gen_random_uuid() ao invés de serial/auto-increment para UUIDs

CREATE TABLE IF NOT EXISTS events (
    -- Identificador único do evento
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Timestamp de criação automático
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Informações do evento
title TEXT NOT NULL,
description TEXT, -- Pode ser nulo
event_date TIMESTAMPTZ NOT NULL,

-- Relacionamento com usuário que criou o evento
-- ON DELETE CASCADE: Se o usuário for deletado, eventos também são
user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

-- Constraints de validação
CONSTRAINT title_min_length CHECK (char_length(title) >= 3),
    CONSTRAINT event_date_future CHECK (event_date > created_at)
);

-- Comentários na tabela e colunas
COMMENT ON TABLE events IS 'Eventos criados por usuários do sistema';

COMMENT ON COLUMN events.id IS 'UUID gerado automaticamente via gen_random_uuid()';

COMMENT ON COLUMN events.title IS 'Título do evento (mínimo 3 caracteres)';

COMMENT ON COLUMN events.event_date IS 'Data e hora do evento (deve ser no futuro)';

COMMENT ON COLUMN events.user_id IS 'Referência ao usuário criador (auth.users)';

-- =====================================================================
-- 2. ÍNDICES PARA PERFORMANCE
-- =====================================================================

-- Índice na data do evento (usado em ordenações e filtros)
CREATE INDEX idx_events_event_date ON events (event_date);

-- Índice no user_id (para buscar eventos de um usuário específico)
CREATE INDEX idx_events_user_id ON events (user_id);

-- Índice composto para queries comuns (user + data)
CREATE INDEX idx_events_user_date ON events (user_id, event_date DESC);

COMMENT ON INDEX idx_events_event_date IS 'Otimiza ordenação por data do evento';

COMMENT ON INDEX idx_events_user_id IS 'Otimiza busca de eventos por usuário';

-- =====================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Habilitar RLS na tabela events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 4. POLICIES DE SEGURANÇA
-- =====================================================================

-- Policy de LEITURA: Qualquer pessoa pode ver todos os eventos (público)
CREATE POLICY "Eventos são públicos para leitura" ON events FOR
SELECT USING (true);

COMMENT ON POLICY "Eventos são públicos para leitura" ON events IS 'Permite que qualquer usuário (autenticado ou não) visualize eventos';

-- Policy de INSERÇÃO: Apenas usuários autenticados podem criar eventos
CREATE POLICY "Usuários autenticados podem criar eventos" ON events FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL -- Usuário deve estar autenticado
        AND auth.uid()::uuid = user_id -- E o user_id deve ser o próprio usuário
    );

COMMENT ON POLICY "Usuários autenticados podem criar eventos" ON events IS 'Permite que usuários autenticados criem eventos em seu próprio nome';

-- Policy de ATUALIZAÇÃO: Apenas o dono do evento pode editá-lo
CREATE POLICY "Usuários podem editar seus próprios eventos" ON events FOR
    UPDATE USING (auth.uid()::uuid = user_id)
WITH
    CHECK (auth.uid()::uuid = user_id);

COMMENT ON POLICY "Usuários podem editar seus próprios eventos" ON events IS 'Permite que usuários editem apenas eventos que eles criaram';

-- Policy de EXCLUSÃO: Apenas o dono do evento pode deletá-lo
CREATE POLICY "Usuários podem deletar seus próprios eventos" ON events FOR DELETE USING (auth.uid()::uuid = user_id);

COMMENT ON POLICY "Usuários podem deletar seus próprios eventos" ON events IS 'Permite que usuários deletem apenas eventos que eles criaram';

-- =====================================================================
-- 5. FUNÇÕES UTILITÁRIAS (OPCIONAL)
-- =====================================================================

-- Função para obter eventos futuros
CREATE OR REPLACE FUNCTION get_upcoming_events(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    title TEXT,
    event_date TIMESTAMPTZ,
    user_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.event_date,
        e.user_id
    FROM events e
    WHERE e.event_date > now()
    ORDER BY e.event_date ASC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_upcoming_events IS 'Retorna os próximos eventos em ordem cronológica';

-- Função para obter eventos de um usuário
CREATE OR REPLACE FUNCTION get_user_events(target_user_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    event_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.created_at
    FROM events e
    WHERE e.user_id = target_user_id
    ORDER BY e.event_date DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_user_events IS 'Retorna todos os eventos de um usuário específico';

-- =====================================================================
-- COMMIT DA TRANSAÇÃO
-- =====================================================================

COMMIT;

-- =====================================================================
-- INSTRUÇÕES DE USO
-- =====================================================================
-- 1. Execute este script no SQL Editor do Supabase Dashboard
-- 2. Verifique se a tabela foi criada: SELECT * FROM events;
-- 3. Teste as policies com diferentes usuários
-- 4. Para gerar types TypeScript:
--    npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/supabase.ts
-- =====================================================================

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Inserir um evento (requer autenticação)
-- INSERT INTO events (title, description, event_date, user_id)
-- VALUES ('Meu Evento', 'Descrição do evento', '2025-12-31 20:00:00+00', auth.uid());

-- Buscar próximos eventos
-- SELECT * FROM get_upcoming_events(5);

-- Buscar eventos de um usuário
-- SELECT * FROM get_user_events('uuid-do-usuario');

-- Atualizar um evento
-- UPDATE events SET title = 'Novo título' WHERE id = 'uuid-do-evento';

-- Deletar um evento
-- DELETE FROM events WHERE id = 'uuid-do-evento';