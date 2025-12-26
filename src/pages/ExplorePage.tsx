/**
 * =====================================================================
 * MagnaFest - EXPLORE PAGE 2.0 (Hub de Soluções Inteligente)
 * =====================================================================
 * Search Engine com Cross-Selling, Ads e Recomendações Inteligentes
 */

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, ExternalLink, Loader2, Lightbulb, X, Zap, Shield, Mic2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageHero from '../components/ui/PageHero';

// =====================================================================
// TYPES
// =====================================================================

interface ServiceCategory {
  name: string;
  icon_key: string;
}

interface Profile {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  instagram: string | null;
  service_categories: ServiceCategory | null;
}

// =====================================================================
// SMART RECOMMENDATIONS ENGINE (Cross-Selling Logic)
// =====================================================================

const RELATED_CATEGORIES: Record<string, { label: string; slug: string; icon: any }[]> = {
  'tecnico-de-som': [
    { label: 'Iluminação', slug: 'tecnico-de-iluminacao', icon: Zap },
    { label: 'Energia/Geradores', slug: 'eletricista', icon: Zap }
  ],
  'tecnico-de-iluminacao': [
    { label: 'Som', slug: 'tecnico-de-som', icon: Mic2 },
    { label: 'Energia', slug: 'eletricista', icon: Zap }
  ],
  'seguranca-vigilancia': [
    { label: 'Bombeiros', slug: 'bombeiro-civil', icon: Shield },
    { label: 'Produtor de Eventos', slug: 'produtor-de-eventos', icon: Briefcase }
  ]
};

// =====================================================================
// POPULAR CATEGORIES (Quick Access Chips)
// =====================================================================

const POPULAR_CATEGORIES = [
  { label: 'Som', slug: 'tecnico-de-som', icon: '🎵' },
  { label: 'Luz', slug: 'tecnico-de-iluminacao', icon: '💡' },
  { label: 'Segurança', slug: 'seguranca-vigilancia', icon: '🛡️' },
  { label: 'DJ', slug: 'dj', icon: '🎧' },
  { label: 'Foto/Vídeo', slug: 'fotografo', icon: '📸' },
  { label: 'Produção', slug: 'produtor-de-eventos', icon: '🎬' }
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('categoria') || '';

  useEffect(() => {
    setSearchInput(searchQuery);
    if (categoryFilter && !selectedCategories.includes(categoryFilter)) {
      setSelectedCategories([categoryFilter]);
    }
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    fetchProfiles();
  }, [searchQuery, categoryFilter]);

  // ================================================================
  // DATA FETCHING
  // ================================================================

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          description,
          city,
          state,
          whatsapp,
          instagram,
          service_categories (
            name,
            icon_key
          )
        `);

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (categoryFilter) {
        const { data: categoryData } = await supabase
          .from('service_categories')
          .select('id')
          .eq('slug', categoryFilter)
          .single();

        if (categoryData) {
          query = query.eq('main_category_id', categoryData.id);
        }
      }

      query = query.order('created_at', { ascending: false }).limit(50);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProfiles((data as any || []) as Profile[]);
    } catch (err) {
      console.error('Erro ao buscar perfis:', err);
      setError('Erro ao carregar profissionais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchInput) params.set('q', searchInput);
    if (selectedCategories.length > 0) params.set('categoria', selectedCategories[0]);
    navigate(`/explorar?${params.toString()}`);
  };

  const handleCategoryChipClick = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter(c => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
      navigate(`/explorar?categoria=${slug}`);
    }
  };

  const handleAddRelatedCategory = (slug: string) => {
    navigate(`/explorar?categoria=${slug}`);
  };

  // ================================================================
  // COMPUTED
  // ================================================================

  const recommendations = categoryFilter ? RELATED_CATEGORIES[categoryFilter] : null;

  return (
    <main className="min-h-screen bg-magna-black text-white">
      {/* Hero Conversacional */}
      <PageHero 
        title="O QUE O SEU EVENTO PRECISA HOJE?"
        subtitle="Encontre profissionais, equipamentos e serviços em um só lugar"
        imageKeyword="concert-crowd,festival-lights,stage"
      />

      <div className="container mx-auto px-4 py-12">
        {/* ================================================================
            BARRA DE BUSCA INTELIGENTE (Estilo Google)
            ================================================================ */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ex: DJ para festa corporativa, Iluminador para show..."
              className="w-full pl-16 pr-6 py-6 text-lg bg-white text-gray-800 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-magna-cyan/50 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-gradient-to-r from-magna-violet to-magna-magenta text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Buscar
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <span className="text-sm text-gray-400 font-medium">Categorias Populares:</span>
            {POPULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChipClick(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategories.includes(cat.slug)
                    ? 'bg-magna-violet text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================
            SMART RECOMMENDATIONS (Cross-Selling)
            ================================================================ */}
        {recommendations && recommendations.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-magna-violet/20 to-magna-cyan/20 border-2 border-magna-violet/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-magna-cyan flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    💡 Dica de Produção Inteligente
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Quem contrata profissionais desta categoria geralmente também precisa de:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {recommendations.map((related) => {
                      const Icon = related.icon;
                      return (
                        <button
                          key={related.slug}
                          onClick={() => handleAddRelatedCategory(related.slug)}
                          className="flex items-center gap-2 px-4 py-2 bg-magna-dark border border-white/20 rounded-lg text-sm font-medium hover:border-magna-cyan hover:bg-magna-cyan/10 transition-all"
                        >
                          <Icon className="w-4 h-4" />
                          Adicionar {related.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            ÁREA DE ANÚNCIOS (Monetização Nativa)
            ================================================================ */}
        <div className="w-full h-24 bg-magna-dark border-y border-magna-violet/30 flex items-center justify-between px-8 my-8 rounded-lg">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Patrocinado</span>
            <div className="h-16 px-6 bg-white/10 rounded flex items-center justify-center">
              <span className="text-xl font-bold text-white">🎸 Casa do Roadie</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 px-6 bg-white/10 rounded flex items-center justify-center">
              <span className="text-xl font-bold text-white">🔊 AudioStore Pro</span>
            </div>
            <div className="h-16 px-6 bg-white/10 rounded flex items-center justify-center">
              <span className="text-xl font-bold text-white">💡 Lighting Express</span>
            </div>
          </div>
        </div>

        {/* ================================================================
            RESULTADOS
            ================================================================ */}
        <div className="max-w-7xl mx-auto">
          {/* Header de Resultados */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {searchQuery || categoryFilter ? 'Resultados da Busca' : 'Profissionais em Destaque'}
            </h2>
            <p className="text-gray-400">
              {loading ? 'Carregando...' : `${profiles.length} ${profiles.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-magna-violet animate-spin mb-4" />
              <p className="text-gray-400">Procurando os melhores profissionais...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <button
                onClick={fetchProfiles}
                className="px-6 py-3 bg-magna-violet text-white rounded-lg hover:bg-magna-magenta transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && profiles.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Nenhum profissional encontrado
              </h2>
              <p className="text-gray-400 mb-8">
                Tente ajustar sua busca ou explore outras categorias
              </p>
            </div>
          )}

          {/* Grid de Profissionais */}
          {!loading && !error && profiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// =====================================================================
// PROFILE CARD COMPONENT
// =====================================================================

interface ProfileCardProps {
  profile: Profile;
}

function ProfileCard({ profile }: ProfileCardProps) {
  const categoryName = profile.service_categories?.name || 'Profissional';
  const location = profile.city && profile.state 
    ? `${profile.city}, ${profile.state}` 
    : 'Localização não informada';

  return (
    <div className="group relative bg-magna-dark border border-white/10 rounded-xl overflow-hidden hover:border-magna-cyan/50 hover:shadow-[0_0_20px_rgba(138,43,226,0.2)] transition-all duration-300">
      {/* Avatar/Foto */}
      <div className="h-48 bg-gradient-to-br from-magna-violet/20 to-magna-cyan/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase className="w-16 h-16 text-white/20" />
        </div>
        {/* Badge da Categoria */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-magna-violet/80 backdrop-blur-sm rounded-full">
          <span className="text-xs font-bold uppercase">{categoryName}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {/* Nome */}
        <h3 className="text-xl font-bold mb-2 line-clamp-1">
          {profile.name}
        </h3>

        {/* Localização */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Descrição */}
        {profile.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {profile.description}
          </p>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-magna-violet text-white font-bold text-sm rounded-lg hover:bg-magna-magenta transition-colors">
            Ver Perfil
            <ExternalLink className="w-4 h-4" />
          </button>

          {profile.whatsapp && (
            <a
              href={`https://wa.me/55${profile.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white font-bold text-sm rounded-lg hover:bg-green-700 transition-colors"
              title="Chamar no WhatsApp"
            >
              💬
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
