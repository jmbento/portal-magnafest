-- =====================================================================
-- DATABASE TRIGGER - MagnaGuardian
-- =====================================================================
-- Chama Edge Function automaticamente quando produto é criado
-- =====================================================================

-- 1. Criar função que chama Edge Function
CREATE OR REPLACE FUNCTION trigger_moderation()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Montar payload
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD)
  );

  -- Chamar Edge Function via HTTP (supabase_functions schema)
  PERFORM
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/moderator',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := payload
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Aplicar trigger em tabela listings (se existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'listings'
  ) THEN
    DROP TRIGGER IF EXISTS on_listing_created_moderate ON public.listings;
    
    CREATE TRIGGER on_listing_created_moderate
      AFTER INSERT ON public.listings
      FOR EACH ROW
      EXECUTE FUNCTION trigger_moderation();
    
    RAISE NOTICE '✅ Trigger MagnaGuardian ativado em listings';
  END IF;
END $$;

-- 3. Aplicar em posts (se existir)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'posts'
  ) THEN
    DROP TRIGGER IF EXISTS on_post_created_moderate ON public.posts;
    
    CREATE TRIGGER on_post_created_moderate
      AFTER INSERT ON public.posts
      FOR EACH ROW
      EXECUTE FUNCTION trigger_moderation();
    
    RAISE NOTICE '✅ Trigger MagnaGuardian ativado em posts';
  END IF;
END $$;

-- =====================================================================
-- ALTERNATIVA: Webhook (Recomendado para Supabase)
-- =====================================================================
-- Se triggers HTTP não funcionarem, usar Database Webhooks no Dashboard:
--
-- 1. Vá em Database → Webhooks
-- 2. Clique "Enable Webhooks"
-- 3. Configuração:
--    - Table: listings
--    - Events: INSERT
--    - HTTP Request:
--      URL: https://[project-ref].supabase.co/functions/v1/moderator
--      Method: POST
--      Headers:
--        Authorization: Bearer [service_role_key]
--        Content-Type: application/json
-- =====================================================================

-- Verificação
RAISE NOTICE '🤖 MagnaGuardian triggers configurados!';

RAISE NOTICE 'ℹ️ Se triggers HTTP não funcionarem, use Database Webhooks no Dashboard';