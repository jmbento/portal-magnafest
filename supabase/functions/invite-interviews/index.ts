/**
 * =====================================================================
 * INTERVIEW HEADHUNTER BOT - Automated Interview System
 * =====================================================================
 * Edge Function que seleciona profissionais e envia convites de entrevista
 * =====================================================================
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =====================================================================
// CONFIGURAÇÃO
// =====================================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Templates de perguntas por categoria
const QUESTION_TEMPLATES: Record<string, string[]> = {
  'tecnico-de-som': [
    'Qual foi o show ou evento mais desafiador da sua carreira e como você lidou?',
    'Analógico vs Digital: qual sua preferência e por quê?',
    'Qual equipamento você considera indispensável e nunca pode faltar no seu setup?',
    'Qual dica você daria para quem está começando na área de sonorização?',
    'Conte sobre um erro que virou aprendizado na sua trajetória profissional.'
  ],
  'tecnico-de-iluminacao': [
    'Como você planeja a iluminação para diferentes tipos de eventos?',
    'Moving Lights ou Par LED: quando usar cada um?',
    'Qual sua maior inspiração quando cria um design de luz?',
    'Equipamento dos sonhos: qual e por quê?',
    'Dica para iluminadores iniciantes?'
  ],
  'seguranca-vigilancia': [
    'Como lidar com multidões em grandes eventos mantendo todos seguros?',
    'Qual curso ou certificação você considera indispensável na área?',
    'Conte sobre uma situação difícil que você resolveu com maestria.',
    'Como é a comunicação entre equipes de segurança em eventos de grande porte?',
    'O que diferencia um profissional experiente de um iniciante?'
  ],
  'dj': [
    'Como você monta seu setlist para diferentes tipos de público?',
    'CDJ vs Controladora: sua preferência?',
    'Qual foi a pista mais difícil que você já animou?',
    'Como você se mantém atualizado com as trends musicais?',
    'Dica essencial para DJs que estão começando?'
  ],
  'fotografo': [
    'Como capturar a energia de um evento ao vivo em uma foto?',
    'Qual equipamento é essencial no seu kit para eventos?',
    'Iluminação natural vs artificial em shows: como você trabalha?',
    'Conte sobre o clique mais marcante da sua carreira.',
    'Dica para fotógrafos que querem trabalhar com eventos?'
  ],
  'produtor-de-eventos': [
    'Qual o maior desafio ao produzir um evento de grande porte?',
    'Como você lida com imprevistos de última hora?',
    'Qual evento você produziu que te deixou mais orgulhoso?',
    'Como gerenciar múltiplas equipes e fornecedores simultaneamente?',
    'Conselho essencial para novos produtores?'
  ],
  'default': [
    'Como você começou a trabalhar na área de eventos?',
    'Qual foi o projeto mais marcante da sua carreira?',
    'O que você mais ama no seu trabalho?',
    'Qual equipamento ou ferramenta você não vive sem?',
    'Que conselho você daria para quem quer entrar nessa área?'
  ]
};

// =====================================================================
// EDGE FUNCTION HANDLER
// =====================================================================

serve(async (req) => {
  try {
    console.log('🎯 Interview Headhunter Bot iniciado...');

    // Inicializar Supabase Client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Buscar candidatos elegíveis
    const { data: alreadyInterviewed } = await supabase
      .from('interviews')
      .select('profile_id');

    const excludedIds = alreadyInterviewed?.map(i => i.profile_id) || [];

    const { data: candidates, error: candidatesError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        email,
        whatsapp,
        service_categories (
          name,
          slug
        )
      `)
      .not('id', 'in', `(${excludedIds.join(',') || 'null'})`)
      .not('name', 'is', null)
      .not('email', 'is', null)
      .limit(10);

    if (candidatesError) {
      throw candidatesError;
    }

    if (!candidates || candidates.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Nenhum candidato elegível encontrado'
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    // 2. Selecionar 1 candidato aleatório
    const selectedCandidate = candidates[Math.floor(Math.random() * candidates.length)];
    
    console.log(`👤 Candidato selecionado: ${selectedCandidate.name}`);

    // 3. Obter categoria e gerar perguntas
    const categorySlug = selectedCandidate.service_categories?.slug || 'default';
    const categoryName = selectedCandidate.service_categories?.name || 'Profissional';
    
    const questions = QUESTION_TEMPLATES[categorySlug] || QUESTION_TEMPLATES['default'];

    // 4. Criar convite de entrevista
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .insert({
        profile_id: selectedCandidate.id,
        status: 'invited',
        interview_type: 'standard',
        topic: `Carreira e Experiência em ${categoryName}`,
        questions_json: {
          questions: questions,
          category: categoryName,
          invited_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (interviewError) {
      throw interviewError;
    }

    console.log(`✅ Convite criado: Interview ID ${interview.id}`);

    // 5. Simular envio de email (futuro: integração com Resend/SMTP)
    console.log('📧 SIMULAÇÃO DE EMAIL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Para: ${selectedCandidate.email}`);
    console.log(`WhatsApp: ${selectedCandidate.whatsapp || 'N/A'}`);
    console.log(`Assunto: 🎤 Convite para Entrevista - Portal MagnaFest`);
    console.log(`Corpo:`);
    console.log(`
Olá ${selectedCandidate.name}!

Você foi selecionado(a) para participar de uma entrevista exclusiva 
no Portal MagnaFest sobre sua experiência em ${categoryName}.

Acesse o link abaixo para responder:
https://magnafest.com/entrevista/${interview.id}

Perguntas:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Estamos ansiosos para conhecer sua história!

Equipe MagnaFest
    `);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 6. Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Convite de entrevista criado com sucesso',
        interview: {
          id: interview.id,
          candidate: selectedCandidate.name,
          category: categoryName,
          questions_count: questions.length,
          status: 'invited'
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Erro:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

/**
 * Logs estruturados
 */
console.log('🎯 Edge Function carregada: interview-headhunter');
console.log('🗄️ Supabase URL:', SUPABASE_URL ? 'Configurado' : 'Ausente');
