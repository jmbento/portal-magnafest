import { useState, useEffect } from 'react';
import { Search, Filter, PackageOpen, PlusCircle, Tag, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { SpotlightCard } from '../components/ui/SpotlightCard';

interface Listing {
  id: string;
  title: string;
  description: string;
  price_min: number;
  price_max: number | null;
  condition: string;
  listing_type: string;
  created_at: string;
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  novo: { label: '✨ Novo na Caixa', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  seminovo: { label: '⭐ Seminovo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  usado: { label: '🔧 Usado', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  pecas: { label: '⚙️ Peças', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  useEffect(() => {
    fetchListings();
  }, [searchTerm, selectedConditions]);

  async function fetchListings() {
    try {
      setLoading(true);
      
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (selectedConditions.length > 0) {
        query = query.in('condition', selectedConditions);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleCondition(condition: string) {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
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

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[350px] w-full overflow-hidden border-b border-white/10 group">
        <div className="absolute inset-0 bg-gray-900">
           <img 
             src="/assets/hero-market.jpg" 
             alt="Classificados Background" 
             className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
             onError={(e) => {
               e.currentTarget.style.display = 'none'; 
             }}
           />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-bold tracking-widest text-black bg-[#00f0ff] rounded-full uppercase shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                Marketplace Oficial
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" /> Compra & Venda Verificada
              </span>
            </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-3 leading-tight break-words">
                Marketplace Oficial <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">PRO</span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-xl leading-relaxed">
              O ecossistema circular do evento. Venda seu equipamento antigo para financiar o próximo upgrade.
            </p>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE BUSCA */}
      <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#00f0ff] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] sm:text-sm transition-all"
              placeholder="Busque por 'Console Yamaha', 'Shure SM58', 'Case'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            onClick={() => navigate('/criar-anuncio')}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_25px_rgba(138,43,226,0.5)] transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Anunciar Equipamento</span>
          </button>
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTROS (Hidden no Mobile) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6 text-white font-bold">
              <Filter className="w-5 h-5 text-[#00f0ff]" /> Filtros
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Estado de Uso</h3>
              {Object.entries(CONDITION_LABELS).map(([key, { label }]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedConditions.includes(key)}
                    onChange={() => toggleCondition(key)}
                    className="form-checkbox h-4 w-4 text-purple-600 rounded border-gray-600 bg-gray-800 focus:ring-purple-500 focus:ring-offset-gray-900" 
                  />
                  <span className="text-gray-400 group-hover:text-white transition-colors text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* GRID DE RESULTADOS */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#111] rounded-xl border border-white/5 h-80 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((ad) => (
                <div 
                  key={ad.id}
                  className="perspective-[1000px]"
                >
                  <SpotlightCard className="group">
                    <div
                      onClick={() => navigate(`/anuncio/${ad.id}`)}
                      className="bg-[#111] rounded-xl overflow-hidden border border-transparent transition-all duration-500 ease-out transform-gpu md:group-hover:rotate-x-2 md:group-hover:rotate-y-2 md:group-hover:scale-[1.02] group-hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] flex flex-col cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                  <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-2 left-2 z-10">
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${CONDITION_LABELS[ad.condition]?.color || 'bg-gray-500/20 text-gray-400'}`}>
                        {CONDITION_LABELS[ad.condition]?.label || ad.condition}
                      </span>
                    </div>
                    <Tag className="w-16 h-16 text-white/10" />
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {ad.title}
                    </h3>
                    
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xl font-bold text-[#00f0ff]">
                        {formatPrice(ad.price_min, ad.price_max)}
                      </span>
                      <button className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10">
                <PackageOpen className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 tracking-tight break-words">
                {searchTerm 
                  ? `Nenhum resultado para "${searchTerm}"`
                  : 'O Mercado está Vazio'
                }
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                {searchTerm
                  ? 'Tente buscar por outros termos ou ajustar os filtros.'
                  : 'Nenhum equipamento encontrado. Seja o primeiro a anunciar e alcance milhares de profissionais.'
                }
              </p>
              <button 
                onClick={() => navigate('/criar-anuncio')}
                className="bg-white text-black hover:bg-gray-200 font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Criar Primeiro Anúncio
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
