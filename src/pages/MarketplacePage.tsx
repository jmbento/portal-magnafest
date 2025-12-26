/**
 * =====================================================================
 * CLASSIFICADOS PRO - Gear Exchange (Marketplace de Usados)
 * =====================================================================
 * "Venda o velho para comprar o novo" - Ciclo de vida do equipamento
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Loader2, 
  AlertCircle, 
  Plus,
  MapPin,
  DollarSign,
  ExternalLink,
  Filter,
  Recycle
} from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { supabase } from '../lib/supabase';

// =====================================================================
// TYPES
// =====================================================================

type EquipmentCondition = 'novo' | 'seminovo' | 'usado' | 'pecas';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price_min: number;
  price_unit: string;
  listing_type: 'venue' | 'service' | 'product_rent' | 'product_sale';
  status: string;
  created_at: string;
  condition?: EquipmentCondition; // Nova propriedade
  categories?: {
    name: string;
  };
  media?: Array<{
    url: string;
    sort_order: number;
  }>;
  location_data?: {
    cidade?: string;
    estado?: string;
  };
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function MarketplacePage() {
  const navigate = useNavigate();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [selectedConditions, setSelectedConditions] = useState<EquipmentCondition[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    fetchListings();
  }, [selectedConditions, selectedType]);

  // ================================================================
  // DATA FETCHING
  // ================================================================

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          price_min,
          price_unit,
          listing_type,
          status,
          created_at,
          location_data,
          categories (
            name
          ),
          media (
            url,
            sort_order
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Filtro por tipo
      if (selectedType) {
        query = query.eq('listing_type', selectedType);
      }

      const { data, error: fetchError } = await query.limit(50);

      if (fetchError) throw fetchError;

      // Simular condição aleatória (em produção virá do banco)
      const listingsWithCondition = (data || []).map(listing => ({
        ...listing,
        condition: getRandomCondition()
      }));

      // Filtrar por condição (client-side por enquanto)
      let filtered = listingsWithCondition;
      if (selectedConditions.length > 0) {
        filtered = listingsWithCondition.filter(l => 
          l.condition && selectedConditions.includes(l.condition)
        );
      }

      setListings(filtered);
    } catch (err: any) {
      console.error('Erro ao buscar anúncios:', err);
      setError('Erro ao carregar anúncios. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HANDLERS
  // ================================================================

  const toggleCondition = (condition: EquipmentCondition) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSelectedConditions([]);
    setSelectedType('');
  };

  // ================================================================
  // HELPERS
  // ================================================================

  const getRandomCondition = (): EquipmentCondition => {
    const conditions: EquipmentCondition[] = ['novo', 'seminovo', 'usado', 'pecas'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // ================================================================
  // RENDER
  // ================================================================

  const activeFiltersCount = selectedConditions.length + (selectedType ? 1 : 0);

  return (
    <main className="min-h-screen bg-magna-black text-white">
      {/* Hero Section - NOVA NARRATIVA */}
      <PageHero 
        title="CLASSIFICADOS PRO"
        subtitle="Venda o que parou de usar. Compre o que falta para crescer. O mercado de usados oficial do setor."
        imageUrl="/assets/hero-market.jpg"
        imageKeyword="flight-cases,audio-equipment,stage-gear"
      />

      {/* Container Principal */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ================================================
              SIDEBAR - FILTROS
              ================================================ */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-magna-dark rounded-xl p-6 border border-white/10 sticky top-4">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-magna-cyan" />
                  <h3 className="font-bold text-lg">Filtros</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-magna-magenta hover:text-magna-cyan transition-colors font-semibold"
                  >
                    Limpar ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Condição do Equipamento */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Condição do Equipamento
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'novo' as EquipmentCondition, label: 'Novo na Caixa', icon: '📦' },
                    { value: 'seminovo' as EquipmentCondition, label: 'Seminovo', icon: '✨' },
                    { value: 'usado' as EquipmentCondition, label: 'Usado (Guerreiro)', icon: '🔧' },
                    { value: 'pecas' as EquipmentCondition, label: 'Defeito/Peças', icon: '⚙️' }
                  ].map((condition) => (
                    <label
                      key={condition.value}
                      className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition.value)}
                        onChange={() => toggleCondition(condition.value)}
                        className="w-4 h-4 text-magna-violet border-white/20 bg-magna-black rounded focus:ring-magna-violet"
                      />
                      <span className="text-xl">{condition.icon}</span>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">
                        {condition.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de Negócio */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Tipo de Negócio
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-magna-black border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none"
                >
                  <option value="">Todos</option>
                  <option value="product_sale">💰 Venda</option>
                  <option value="product_rent">📦 Aluguel</option>
                  <option value="service">🔧 Serviço</option>
                </select>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Recycle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-400 mb-1">
                      Ciclo Sustentável
                    </p>
                    <p className="text-xs text-gray-400">
                      Dê nova vida aos equipamentos. Cada venda gera oportunidade!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================
              MAIN CONTENT - GRID
              ================================================ */}
          <div className="flex-1">
            
            {/* Header com CTA */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-black mb-2">Equipamentos Disponíveis</h2>
                <p className="text-gray-400">
                  {listings.length} {listings.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
                </p>
              </div>
              
              <button
                onClick={() => {
                  // Verificar se está logado antes de criar anúncio
                  const isLoggedIn = localStorage.getItem('supabase.auth.token');
                  if (!isLoggedIn) {
                    if (confirm('Você precisa fazer login para criar um anúncio. Ir para login?')) {
                      navigate('/login');
                    }
                  } else {
                    navigate('/create');
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Desapegar & Vender Agora
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-magna-violet animate-spin mb-4" />
                <p className="text-gray-400">Carregando classificados...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 flex flex-col items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-2">Erro ao Carregar</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                  onClick={fetchListings}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && listings.length === 0 && (
              <div className="bg-magna-dark border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <Package className="w-24 h-24 text-gray-600 mb-6" />
                <h3 className="text-2xl font-bold mb-2">Nenhum Equipamento Ainda</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Seja o primeiro a desapegar! Venda aquele gear que está parado e financie o próximo upgrade.
                </p>
                <button
                  onClick={() => navigate('/create')}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                  Desapegar & Vender Agora
                </button>
              </div>
            )}

            {/* Grid de Anúncios */}
            {!loading && !error && listings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// =====================================================================
// SUB-COMPONENT: ListingCard com Badge de Condição
// =====================================================================

interface ListingCardProps {
  listing: Listing;
}

function ListingCard({ listing }: ListingCardProps) {
  const navigate = useNavigate();
  
  // Primeira imagem ou placeholder
  const imageUrl = listing.media?.[0]?.url || 'https://source.unsplash.com/800x600/?audio-equipment,stage-gear';
  
  // Localização
  const location = listing.location_data?.cidade && listing.location_data?.estado
    ? `${listing.location_data.cidade}, ${listing.location_data.estado}`
    : 'Localização não informada';

  // Badge de Condição
  const getConditionBadge = (condition?: EquipmentCondition) => {
    if (!condition) return null;

    const badges = {
      'novo': { label: 'Novo na Caixa', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'seminovo': { label: 'Seminovo', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'usado': { label: 'Usado (Guerreiro)', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      'pecas': { label: 'Para Peças', class: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };

    const badge = badges[condition];

    return (
      <div className={`absolute top-3 right-3 px-3 py-1 ${badge.class} backdrop-blur-sm border font-bold text-xs rounded-full shadow-lg`}>
        {badge.label}
      </div>
    );
  };

  return (
    <div className="bg-magna-dark border border-white/10 rounded-xl overflow-hidden hover:border-magna-cyan/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.3)] transition-all duration-300 group">
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-magna-violet/20 to-magna-cyan/20">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Badge de Condição (Nova Feature!) */}
        {getConditionBadge(listing.condition)}

        {/* Preço */}
        <div className="absolute bottom-3 left-3 px-4 py-2 bg-black/70 backdrop-blur-sm text-white font-bold rounded-lg flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          {formatPrice(listing.price_min, listing.price_unit)}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        {/* Categoria */}
        {listing.categories && (
          <span className="inline-block px-2 py-1 bg-magna-violet/20 text-magna-cyan text-xs font-semibold rounded mb-3">
            {listing.categories.name}
          </span>
        )}

        {/* Título */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-magna-cyan transition-colors">
          {listing.title}
        </h3>

        {/* Descrição */}
        {listing.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>

          <button
            onClick={() => navigate(`/listing/${listing.id}`)}
            className="flex items-center gap-1 text-sm text-magna-cyan hover:text-magna-magenta font-semibold transition-colors"
          >
            Ver mais
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

function formatPrice(price: number, unit: string): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);

  return `${formatted}${unit === 'day' ? '/dia' : unit === 'hour' ? '/hora' : ''}`;
}
