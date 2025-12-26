/**
 * =====================================================================
 * MagnaGuardian - Moderador IA Automático
 * =====================================================================
 * Edge Function que analisa novos anúncios usando OpenAI
 * - Moderation API (ódio, violência, sexual)
 * - GPT-4o-mini (golpes, spam, ilegalidades)
 * =====================================================================
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =====================================================================
// TYPES
// =====================================================================

interface ModeratePayload {
  type: 'INSERT' | 'UPDATE';
  table: string;
  record: {
    id: string;
    title: string;
    description: string;
    profiles_id?: string;
  };
  old_record: any;
}

interface OpenAIModerationResult {
  flagged: boolean;
  categories: {
    hate: boolean;
    'hate/threatening': boolean;
    'self-harm': boolean;
    sexual: boolean;
    'sexual/minors': boolean;
    violence: boolean;
    'violence/graphic': boolean;
  };
  category_scores: Record<string, number>;
}

interface ContextualAnalysisResult {
  is_safe: boolean;
  reason: string;
  confidence: number;
}

// =====================================================================
// CONFIGURAÇÃO
// =====================================================================

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// =====================================================================
// FUNÇÕES DE ANÁLISE
// =====================================================================

/**
 * Análise usando OpenAI Moderation API
 */
async function moderateContent(text: string): Promise<OpenAIModerationResult> {
  const response = await fetch('https://api.openai.com/v1/moderations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      input: text
    })
  });

  if (!response.ok) {
    throw new Error(`Moderation API failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results[0];
}

/**
 * Análise contextual usando GPT-4o-mini
 */
async function analyzeContext(
  title: string,
  description: string
): Promise<ContextualAnalysisResult> {
  const prompt = `Você é o MagnaGuardian, um moderador especializado em equipamentos de eventos.

Analise este anúncio e detecte se é:
- GOLPE: preço muito abaixo do mercado, urgência artificial, pagamento antecipado exigido
- SPAM: texto genérico, links suspeitos, repetição excessiva
- PRODUTO ILEGAL: armas, drogas, pirataria

ANÚNCIO:
Título: ${title}
Descrição: ${description}

Responda APENAS com JSON válido:
{
  "is_safe": boolean,
  "reason": "explicação curta se não for seguro",
  "confidence": number entre 0-1
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um moderador de conteúdo. Responda apenas JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    })
  });

  if (!response.ok) {
    throw new Error(`GPT API failed: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse GPT response:', content);
    // Fallback seguro
    return {
      is_safe: true,
      reason: 'Análise inconclusiva',
      confidence: 0.5
    };
  }
}

/**
 * Atualizar status do produto
 */
async function updateProductStatus(
  productId: string,
  table: string,
  approved: boolean,
  reason?: string
) {
  const { error } = await supabase
    .from(table)
    .update({
      moderation_status: approved ? 'approved' : 'rejected',
      ai_flag_reason: reason || null,
      moderated_at: new Date().toISOString()
    })
    .eq('id', productId);

  if (error) throw error;
}

/**
 * Atualizar trust score do usuário
 */
async function updateUserTrustScore(
  userId: string,
  delta: number
) {
  // Buscar score atual
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('trust_score')
    .eq('id', userId)
    .single();

  if (fetchError || !profile) return;

  const newScore = Math.max(0, Math.min(100, profile.trust_score + delta));

  const { error } = await supabase
    .from('profiles')
    .update({ trust_score: newScore })
    .eq('id', userId);

  if (error) throw error;
}

/**
 * Registrar no log de moderação
 */
async function logModeration(
  targetType: string,
  targetId: string,
  action: string,
  reason: string
) {
  const { error } = await supabase
    .from('moderation_log')
    .insert({
      target_type: targetType,
      target_id: targetId,
      action,
      reason,
      automated: true, // Flag de IA
      moderator_id: null
    });

  if (error) console.error('Failed to log moderation:', error);
}

// =====================================================================
// HANDLER PRINCIPAL
// =====================================================================

serve(async (req) => {
  try {
    // CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { 
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        } 
      });
    }

    const payload: ModeratePayload = await req.json();

    console.log('🤖 MagnaGuardian ativado:', {
      table: payload.table,
      id: payload.record.id,
      title: payload.record.title
    });

    const { title, description, id, profiles_id } = payload.record;
    const fullText = `${title}\n${description || ''}`;

    // ================================================================
    // ETAPA 1: OpenAI Moderation API
    // ================================================================
    console.log('📡 Executando Moderation API...');
    const moderationResult = await moderateContent(fullText);

    if (moderationResult.flagged) {
      const flaggedCategories = Object.entries(moderationResult.categories)
        .filter(([_, flagged]) => flagged)
        .map(([cat]) => cat)
        .join(', ');

      const reason = `🚫 Conteúdo inapropriado detectado: ${flaggedCategories}`;

      console.log('❌ REJEITADO:', reason);

      // Rejeitar
      await updateProductStatus(id, payload.table, false, reason);
      
      // Penalizar usuário
      if (profiles_id) {
        await updateUserTrustScore(profiles_id, -20);
      }

      // Log
      await logModeration(payload.table, id, 'reject', reason);

      return new Response(
        JSON.stringify({ 
          status: 'rejected',
          reason,
          flagged_categories: flaggedCategories
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // ================================================================
    // ETAPA 2: Análise Contextual (GPT-4o-mini)
    // ================================================================
    console.log('🧠 Executando análise contextual...');
    const contextAnalysis = await analyzeContext(title, description || '');

    if (!contextAnalysis.is_safe && contextAnalysis.confidence > 0.7) {
      const reason = `🤖 IA: ${contextAnalysis.reason} (confiança: ${Math.round(contextAnalysis.confidence * 100)}%)`;

      console.log('❌ REJEITADO:', reason);

      // Rejeitar
      await updateProductStatus(id, payload.table, false, reason);
      
      // Penalizar levemente
      if (profiles_id) {
        await updateUserTrustScore(profiles_id, -10);
      }

      // Log
      await logModeration(payload.table, id, 'reject', reason);

      return new Response(
        JSON.stringify({ 
          status: 'rejected',
          reason: contextAnalysis.reason,
          confidence: contextAnalysis.confidence
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // ================================================================
    // APROVADO!
    // ================================================================
    console.log('✅ APROVADO:', title);

    await updateProductStatus(id, payload.table, true);

    // Pequeno boost de confiança
    if (profiles_id) {
      await updateUserTrustScore(profiles_id, 2);
    }

    // Log
    await logModeration(
      payload.table, 
      id, 
      'approve', 
      '🤖 Aprovado automaticamente pela IA'
    );

    return new Response(
      JSON.stringify({ 
        status: 'approved',
        message: 'Anúncio aprovado automaticamente',
        moderation_passed: true,
        context_analysis_confidence: contextAnalysis.confidence
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('💥 Erro no MagnaGuardian:', error);

    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
