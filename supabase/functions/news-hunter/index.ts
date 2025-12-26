/**
 * =====================================================================
 * NEWS HUNTER BOT - Auto-Blogging System
 * =====================================================================
 * Edge Function que gera posts automáticos sobre o setor de eventos
 * usando OpenAI. Rodar via Cron Job a cada 6 horas.
 * =====================================================================
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =====================================================================
// CONFIGURAÇÃO
// =====================================================================

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Tópicos rotativos sobre o setor de eventos
const TOPICS = [
  {
    theme: 'Lançamento de Moving Lights LED',
    category: 'Tecnologia',
    unsplashKeyword: 'stage-lighting,concert-lights'
  },
  {
    theme: 'Segurança em Grandes Festivais',
    category: 'Segurança',
    unsplashKeyword: 'festival-crowd,security'
  },
  {
    theme: 'Dicas Essenciais para Roadies',
    category: 'Dicas',
    unsplashKeyword: 'stage-crew,backstage'
  },
  {
    theme: 'Novidades em Mesas de Som Digital',
    category: 'Tecnologia',
    unsplashKeyword: 'sound-mixer,audio-console'
  },
  {
    theme: 'Legislação de Eventos no Brasil',
    category: 'Regulamentação',
    unsplashKeyword: 'contract,business-meeting'
  },
  {
    theme: 'Tendências em Iluminação Cenotécnica',
    category: 'Tecnologia',
    unsplashKeyword: 'stage-design,theater-lights'
  },
  {
    theme: 'Como Montar uma Equipe de Som Profissional',
    category: 'Carreira',
    unsplashKeyword: 'sound-engineer,team'
  },
  {
    theme: 'Sistemas de In-Ear para Músicos',
    category: 'Tutorial',
    unsplashKeyword: 'earphone,musician-stage'
  }
];

// =====================================================================
// EDGE FUNCTION HANDLER
// =====================================================================

serve(async (req) => {
  try {
    console.log('🤖 News Hunter Bot iniciado...');

    // Inicializar Supabase Client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Escolher tópico aleatório
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    console.log(`📰 Tópico escolhido: ${topic.theme}`);

    // 2. Gerar conteúdo com OpenAI
    const articleContent = await generateArticle(topic.theme);
    
    if (!articleContent) {
      throw new Error('Falha ao gerar conteúdo com OpenAI');
    }

    // 3. Gerar slug
    const slug = generateSlug(articleContent.title);

    // 4. Obter imagem do Unsplash
    const coverImage = `https://source.unsplash.com/1600x900/?${topic.unsplashKeyword}`;

    // 5. Inserir no banco de dados
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: articleContent.title,
        slug: slug,
        content: articleContent.content,
        excerpt: articleContent.excerpt,
        cover_image_url: coverImage,
        category: topic.category,
        tags: articleContent.tags,
        author_type: 'bot',
        author_name: 'MagnaBot AI',
        status: 'published', // Altere para 'draft' se quiser curadoria
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`✅ Post criado com sucesso: ${data.title}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Post gerado e publicado com sucesso',
        post: {
          id: data.id,
          title: data.title,
          slug: data.slug
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

// =====================================================================
// FUNÇÕES AUXILIARES
// =====================================================================

/**
 * Gera artigo usando OpenAI
 */
async function generateArticle(theme: string) {
  const prompt = `Você é um jornalista tech especializado em backstage de eventos e equipamentos profissionais. Seu tom é profissional, direto e entusiasta, com uma vibe cyberpunk.

Escreva uma notícia REALISTA e ATUAL sobre: "${theme}"

A notícia deve:
- Ser baseada em tendências reais do mercado
- Ter entre 400-600 palavras
- Estar formatada em Markdown
- Incluir informações técnicas relevantes
- Ser interessante para profissionais do setor

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título impactante (máx 80 caracteres)",
  "excerpt": "Resumo atrativo (máx 160 caracteres)",
  "content": "Conteúdo completo em Markdown com ## subtítulos",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Ou 'gpt-3.5-turbo' para economia
        messages: [
          {
            role: 'system',
            content: 'Você é um jornalista especializado em tecnologia para eventos. Sempre retorne JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    return JSON.parse(content);

  } catch (error) {
    console.error('Erro ao gerar com OpenAI:', error);
    return null;
  }
}

/**
 * Gera slug a partir do título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não alfanuméricos por hífen
    .replace(/^-+|-+$/g, '') // Remove hífens das pontas
    .substring(0, 100) + '-' + Date.now(); // Adiciona timestamp para unicidade
}

/**
 * Logs estruturados para monitoramento
 */
console.log('📝 Edge Function carregada: news-hunter');
console.log('🔑 OpenAI API configurada:', OPENAI_API_KEY ? 'Sim' : 'Não');
console.log('🗄️ Supabase URL:', SUPABASE_URL ? 'Configurado' : 'Ausente');
