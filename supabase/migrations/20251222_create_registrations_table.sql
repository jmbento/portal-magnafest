-- =====================================================================
-- REGISTRATIONS - Sistema de Inscrições em Eventos
-- =====================================================================
-- Migração: Tabela de registros de usuários em eventos
-- =====================================================================

BEGIN;

-- =====================================================================
-- CRIAR TABELA: registrations
-- =====================================================================

CREATE TABLE IF NOT EXISTS registrations (
    -- Identificação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relacionamentos
event_id UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,

-- Ticket selecionado (opcional)
ticket_id UUID REFERENCES tickets (id) ON DELETE SET NULL,

-- Status da inscrição
status TEXT NOT NULL DEFAULT 'confirmed' CHECK (
    status IN (
        'pending',
        'confirmed',
        'cancelled'
    )
),

-- Timestamps
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

-- Constraint: Prevenir duplicatas
CONSTRAINT unique_user_event UNIQUE(event_id, user_id) );

-- Índices de performance
CREATE INDEX idx_registrations_event_id ON registrations (event_id);

CREATE INDEX idx_registrations_user_id ON registrations (user_id);

CREATE INDEX idx_registrations_status ON registrations (status);

-- Índice composto
CREATE INDEX idx_registrations_user_event ON registrations (user_id, event_id);

COMMENT ON
TABLE registrations IS 'Inscrições/registros de usuários em eventos';

COMMENT ON COLUMN registrations.status IS 'Status: pending (aguardando), confirmed (confirmado), cancelled (cancelado)';

-- =====================================================================
-- TRIGGER AUTO-UPDATE
-- =====================================================================

CREATE TRIGGER registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================================

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Leitura: Usuário vê suas próprias inscrições OU organizador do evento
CREATE POLICY "Usuários veem suas próprias inscrições" ON registrations FOR
SELECT USING (
        user_id = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM events
            WHERE
                events.id = registrations.event_id
                AND events.organizer_id = auth.uid ()
        )
    );

-- Inserção: Apenas usuário autenticado pode se inscrever
CREATE POLICY "Usuários podem se inscrever em eventos" ON registrations FOR
INSERT
WITH
    CHECK (
        auth.uid () IS NOT NULL
        AND user_id = auth.uid ()
    );

-- Atualização: Apenas o usuário ou organizador
CREATE POLICY "Usuário ou organizador podem atualizar" ON registrations FOR
UPDATE USING (
    user_id = auth.uid ()
    OR EXISTS (
        SELECT 1
        FROM events
        WHERE
            events.id = registrations.event_id
            AND events.organizer_id = auth.uid ()
    )
);

-- Exclusão: Apenas o usuário pode cancelar
CREATE POLICY "Usuário pode cancelar sua inscrição" ON registrations FOR DELETE USING (user_id = auth.uid ());

-- =====================================================================
-- FUNÇÃO: Verificar se usuário está inscrito
-- =====================================================================

CREATE OR REPLACE FUNCTION is_user_registered(
    target_event_id UUID,
    target_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM registrations 
        WHERE event_id = target_event_id 
        AND user_id = target_user_id
        AND status IN ('pending', 'confirmed')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================================
-- FUNÇÃO: Contar inscrições de um evento
-- =====================================================================

CREATE OR REPLACE FUNCTION get_event_registrations_count(
    target_event_id UUID
)
RETURNS INT AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM registrations 
        WHERE event_id = target_event_id 
        AND status IN ('pending', 'confirmed')
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================================
-- FUNÇÃO: Obter inscrições do usuário
-- =====================================================================

CREATE OR REPLACE FUNCTION get_my_registrations()
RETURNS TABLE (
    id UUID,
    event_id UUID,
    event_title TEXT,
    event_slug TEXT,
    event_starts_at TIMESTAMPTZ,
    status TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.event_id,
        e.title as event_title,
        e.slug as event_slug,
        e.starts_at as event_starts_at,
        r.status,
        r.created_at
    FROM registrations r
    JOIN events e ON e.id = r.event_id
    WHERE r.user_id = auth.uid()
    ORDER BY e.starts_at ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMIT;

-- =====================================================================
-- EXEMPLOS DE USO
-- =====================================================================

-- Inscrever-se em um evento:
-- INSERT INTO registrations (event_id, user_id)
-- VALUES ('event-uuid', auth.uid());

-- Verificar se está inscrito:
-- SELECT is_user_registered('event-uuid');

-- Contar inscrições:
-- SELECT get_event_registrations_count('event-uuid');

-- Ver minhas inscrições:
-- SELECT * FROM get_my_registrations();