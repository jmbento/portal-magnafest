/**
 * =====================================================================
 * InterviewApprovalPage - Painel de Aprovação de Entrevistas
 * =====================================================================
 * Interface administrativa para revisar e publicar entrevistas
 */

import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Eye, 
  Calendar, 
  User,
  Briefcase,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// =====================================================================
// TYPES
// =====================================================================

interface Interview {
  id: string;
  profile_id: string;
  status: string;
  questions_json: {
    questions: string[];
    category: string;
  };
  answers_json?: {
    answers: string[];
  };
  photos_json?: {
    photos: string[];
  };
  topic: string;
  answered_at: string | null;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
    city: string;
    state: string;
  service_categories?: {
      name: string;
    };
  };
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function InterviewApprovalPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingInterviews();
  }, []);

  // ================================================================
  // DATA FETCHING
  // ================================================================

  const fetchPendingInterviews = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          profiles (
            name,
            email,
            city,
            state,
            service_categories (
              name
            )
          )
        `)
        .eq('status', 'answered')
        .order('answered_at', { ascending: false });

      if (error) throw error;

      setInterviews(data || []);
    } catch (error) {
      console.error('Erro ao buscar entrevistas:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleApprove = async (interview: Interview) => {
    if (!confirm(`Publicar entrevista de ${interview.profiles?.name}?`)) {
      return;
    }

    try {
      setProcessing(true);

      // 1. Criar post formatado
      const postContent = formatInterviewAsPost(interview);

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: postContent.title,
          slug: postContent.slug,
          content: postContent.content,
          excerpt: postContent.excerpt,
          cover_image_url: postContent.coverImage,
          category: 'Entrevista',
          tags: ['entrevista', interview.profiles?.service_categories?.name?.toLowerCase() || ''],
          author_type: 'interviewee',
          author_name: interview.profiles?.name,
          status: 'published',
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (postError) throw postError;

      // 2. Atualizar entrevista
      const { error: updateError } = await supabase
        .from('interviews')
        .update({
          status: 'approved',
          generated_post_id: post.id,
          approved_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })
        .eq('id', interview.id);

      if (updateError) throw updateError;

      alert('✅ Entrevista publicada com sucesso!');
      fetchPendingInterviews();
      setSelectedInterview(null);

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao publicar entrevista. Veja o console.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (interviewId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar esta entrevista?')) {
      return;
    }

    try {
      setProcessing(true);

      const { error } = await supabase
        .from('interviews')
        .update({ status: 'rejected' })
        .eq('id', interviewId);

      if (error) throw error;

      alert('Entrevista rejeitada');
      fetchPendingInterviews();
      setSelectedInterview(null);

    } catch (error) {
      console.error('Erro ao rejeitar:', error);
    } finally {
      setProcessing(false);
    }
  };

  // ================================================================
  // HELPERS
  // ================================================================

  const formatInterviewAsPost = (interview: Interview) => {
    const name = interview.profiles?.name || 'Profissional';
    const category = interview.profiles?.service_categories?.name || 'Eventos';
    const location = interview.profiles?.city && interview.profiles?.state
      ? `${interview.profiles.city}, ${interview.profiles.state}`
      : 'Brasil';

    const questions = interview.questions_json?.questions || [];
    const answers = interview.answers_json?.answers || [];
    const photos = interview.photos_json?.photos || [];

    // Montar conteúdo
    let content = `# Entrevista da Semana: ${name}\n\n`;
    content += `**Categoria:** ${category}  \n`;
    content += `**Localização:** ${location}\n\n`;
    content += `---\n\n`;

    // Q&A
    questions.forEach((question, index) => {
      content += `## ${question}\n\n`;
      content += `${answers[index] || '*Sem resposta*'}\n\n`;
    });

    // Galeria de fotos
    if (photos.length > 0) {
      content += `\n## Galeria de Fotos\n\n`;
      photos.forEach((photo, idx) => {
        content += `![Foto ${idx + 1}](${photo})\n\n`;
      });
    }

    return {
      title: `Entrevista: ${name} - ${category}`,
      slug: `entrevista-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      content,
      excerpt: `Conheça a trajetória de ${name}, profissional de ${category} com vasta experiência no mercado de eventos.`,
      coverImage: photos[0] || 'https://source.unsplash.com/1600x900/?interview,professional'
    };
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <main className="min-h-screen bg-magna-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">📝 Aprovação de Entrevistas</h1>
          <p className="text-gray-400">
            Revise e publique entrevistas respondidas pelos profissionais
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-magna-violet animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && interviews.length === 0 && (
          <div className="bg-magna-dark border border-white/10 rounded-xl p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tudo em dia!</h2>
            <p className="text-gray-400">Não há entrevistas pendentes de aprovação.</p>
          </div>
        )}

        {/* Grid de Entrevistas Pendentes */}
        {!loading && interviews.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-magna-dark border border-white/10 rounded-xl p-6 hover:border-magna-cyan/50 transition-all"
              >
                {/* Header do Card */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-magna-violet to-magna-cyan flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-1">
                      {interview.profiles?.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{interview.profiles?.service_categories?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Metadados */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Respondido: {interview.answered_at ? formatDate(interview.answered_at) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>{interview.questions_json?.questions?.length || 0} perguntas</span>
                  </div>
                  {interview.photos_json?.photos && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <ImageIcon className="w-4 h-4" />
                      <span>{interview.photos_json.photos.length} fotos</span>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedInterview(interview)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Revisar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-magna-dark border border-white/20 rounded-xl max-w-4xl w-full my-auto p-8 max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-black mb-2">{selectedInterview.profiles?.name}</h2>
                <p className="text-gray-400">{selectedInterview.profiles?.service_categories?.name}</p>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Perguntas e Respostas */}
            <div className="space-y-6 mb-8">
              {selectedInterview.questions_json?.questions?.map((question, index) => (
                <div key={index} className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h3 className="font-bold text-magna-cyan mb-2">
                    {index + 1}. {question}
                  </h3>
                  <p className="text-gray-300">
                    {selectedInterview.answers_json?.answers?.[index] || '*Sem resposta*'}
                  </p>
                </div>
              ))}
            </div>

            {/* Galeria de Fotos */}
            {selectedInterview.photos_json?.photos && selectedInterview.photos_json.photos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Fotos Enviadas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedInterview.photos_json.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ações Finais */}
            <div className="flex gap-4">
              <button
                onClick={() => handleApprove(selectedInterview)}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                Aprovar & Publicar
              </button>

              <button
                onClick={() => handleReject(selectedInterview.id)}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
