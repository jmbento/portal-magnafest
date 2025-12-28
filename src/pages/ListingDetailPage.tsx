import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  User, 
  MessageCircle,
  Mail,
  Shield
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number | null;
  condition: string;
  listing_type: string;
  created_at: string;
  profiles_id: string;
  profiles: {
    id: string;
    name: string;
    email: string;
    trust_score: number;
  } | null;
  categories: {
    name: string;
    slug: string;
  } | null;
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  novo: { label: '✨ Novo na Caixa', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  seminovo: { label: '⭐ Seminovo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  usado: { label: '🔧 Usado', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  pecas: { label: '⚙️ Para Peças', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  async function fetchListing() {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price_min,
          price_max,
          condition,
          listing_type,
          created_at,
          profiles_id,
          profiles!profiles_id (id, name, email, trust_score),
          categories!category_id (name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Supabase retorna array, pegar primeiro elemento
      const fixedData = data ? {
        ...data,
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
        categories: Array.isArray(data.categories) ? data.categories[0] : data.categories
      } : null;
      
      setListing(fixedData as Listing);
    } catch (error) {
      console.error('Erro ao buscar anúncio:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatPrice(min: number, max: number | null) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    });
    
    if (max && max !== min) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    }
    return formatter.format(min);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-magna-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-magna-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Anúncio não encontrado</h2>
          <button 
            onClick={() => navigate('/marketplace')}
            className="text-magna-cyan hover:underline"
          >
            Voltar para Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magna-black text-white">
      {/* Header com Voltar */}
      <div className="border-b border-white/10 bg-magna-dark/50 sticky top-0 z-20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Classificados
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal - Detalhes do Produto */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Imagem */}
            <div className="aspect-video bg-gradient-to-br from-magna-violet/20 to-magna-magenta/20 rounded-2xl flex items-center justify-center border border-white/10">
              <Tag className="w-24 h-24 text-white/20" />
            </div>

            {/* Título e Badge */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${CONDITION_LABELS[listing.condition]?.color}`}>
                  {CONDITION_LABELS[listing.condition]?.label || listing.condition}
                </span>
                {listing.categories && (
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    📂 {listing.categories.name}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-black text-white mb-2">
                {listing.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Publicado em {formatDate(listing.created_at)}
                </span>
              </div>
            </div>

            {/* Preço */}
            <div className="bg-magna-dark/50 border border-white/10 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">Preço</p>
              <p className="text-4xl font-black text-magna-cyan">
                {formatPrice(listing.price_min, listing.price_max)}
              </p>
              {listing.listing_type === 'product_rent' && (
                <p className="text-sm text-gray-400 mt-2">💡 Valor por diária</p>
              )}
            </div>

            {/* Descrição */}
            <div className="bg-magna-dark/30 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Descrição</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {listing.description || 'Sem descrição fornecida.'}
              </p>
            </div>
          </div>

          {/* Sidebar - Vendedor */}
          <div className="lg:col-span-1 space-y-6">
            
            {listing.profiles && (
              <div className="bg-magna-dark border border-white/10 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-magna-violet/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-magna-violet" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Vendedor</p>
                    <h3 className="text-lg font-bold text-white">{listing.profiles.name}</h3>
                  </div>
                </div>

                {/* Trust Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Reputação
                    </span>
                    <span className={`font-bold ${
                      listing.profiles.trust_score >= 80 ? 'text-green-400' :
                      listing.profiles.trust_score >= 50 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {listing.profiles.trust_score}/100
                    </span>
                  </div>
                  <div className="h-2 bg-magna-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        listing.profiles.trust_score >= 80 ? 'bg-green-500' :
                        listing.profiles.trust_score >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${listing.profiles.trust_score}%` }}
                    />
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/perfil/${listing.profiles.id}`)}
                    className="w-full bg-magna-violet hover:bg-magna-violet/80 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Ver Perfil Completo
                  </button>

                  <button className="w-full border border-magna-cyan text-magna-cyan hover:bg-magna-cyan hover:text-black py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Enviar Mensagem
                  </button>

                  {listing.profiles.email && (
                    <a
                      href={`mailto:${listing.profiles.email}`}
                      className="w-full border border-white/20 text-gray-300 hover:bg-white/5 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-5 h-5" />
                      E-mail
                    </a>
                  )}
                </div>

                {/* Aviso de Segurança */}
                <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="text-xs text-yellow-400 leading-relaxed">
                    <strong>⚠️ Dica de Segurança:</strong> Sempre teste o equipamento antes de fechar negócio. Prefira trocas presenciais em locais públicos.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
