/**
 * =====================================================================
 * MAGNAFEST - Página de Busca de Anúncios
 * =====================================================================
 * SPA client-side com URL state management via React Router
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import SearchFilters from '../components/search/SearchFilters';
import ListingGrid from '../components/listings/ListingGrid';
import { supabase, getRootCategories } from '../lib/supabase';

// =====================================================================
// TYPES
// =====================================================================

interface Listing {
  id: string;
  title: string;
  description: string;
  price_min: number;
  price_unit: string;
  listing_type: 'venue' | 'service' | 'product_rent' | 'product_sale';
  status: string;
  created_at: string;
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

interface Category {
  id: string;
  name: string;
  slug: string;
}

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================

export default function SearchPage() {
  // ================================================================
  // STATE MANAGEMENT VIA URL (useSearchParams)
  // ================================================================
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estado local
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // ================================================================
  // EFFECTS
  // ================================================================

  // Carregar categorias ao montar o componente
  useEffect(() => {
    loadCategories();
  }, []);

  // Carregar listings sempre que os searchParams mudarem
  // Isso cria um fluxo URL-driven: URL muda → useEffect dispara → fetch novo
  useEffect(() => {
    searchListings();
  }, [searchParams]);

  // ================================================================
  // DATA FETCHING
  // ================================================================

  /**
   * Carrega categorias do Supabase (uma vez apenas)
   */
  const loadCategories = async () => {
    try {
      const data = await getRootCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Erro ao carregar categorias:', err);
    }
  };

  /**
   * Busca listings no Supabase baseado nos parâmetros da URL
   * Aplica filtros dinamicamente usando o query builder do Supabase
   */
  const searchListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ============================================================
      // 1. EXTRAIR PARÂMETROS DA URL
      // ============================================================
      const query = searchParams.get('q') || '';
      const categoryId = searchParams.get('category_id') || '';
      const listingType = searchParams.get('listing_type') || '';
      const priceMin = searchParams.get('price_min') || '';
      const priceMax = searchParams.get('price_max') || '';

      // ============================================================
      // 2. CONSTRUIR QUERY DO SUPABASE
      // ============================================================
      let supabaseQuery = supabase
        .from('listings')
        .select(
          `
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
        `,
          { count: 'exact' }
        )
        .eq('status', 'active') // Apenas anúncios ativos
        .order('created_at', { ascending: false })
        .limit(20); // Limite de 20 itens (paginação básica)

      // ============================================================
      // 3. APLICAR FILTROS DINAMICAMENTE
      // ============================================================

      // Filtro de busca textual (case-insensitive com ilike)
      if (query) {
        supabaseQuery = supabaseQuery.or(
          `title.ilike.%${query}%,description.ilike.%${query}%`
        );
      }

      // Filtro de categoria
      if (categoryId) {
        supabaseQuery = supabaseQuery.eq('category_id', categoryId);
      }

      // Filtro de tipo de anúncio
      if (listingType) {
        supabaseQuery = supabaseQuery.eq('listing_type', listingType);
      }

      // Filtro de preço mínimo (converter R$ para centavos)
      if (priceMin) {
        supabaseQuery = supabaseQuery.gte('price_min', Number(priceMin) * 100);
      }

      // Filtro de preço máximo (converter R$ para centavos)
      if (priceMax) {
        supabaseQuery = supabaseQuery.lte('price_min', Number(priceMax) * 100);
      }

      // ============================================================
      // 4. EXECUTAR QUERY
      // ============================================================
      const { data, error, count } = await supabaseQuery;

      if (error) throw error;

      // ============================================================
      // 5. ATUALIZAR ESTADO
      // ============================================================
      setListings(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Erro ao buscar anúncios:', err);
      setError(err.message || 'Erro ao carregar anúncios. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleListingClick = (id: string) => {
    navigate(`/listing/${id}`);
  };

  const handleClearFilters = () => {
    navigate('/search', { replace: true });
  };

  const handleRetry = () => {
    searchListings();
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="min-h-screen bg-magna-black">
      {/* ============================================================
          HEADER - Sticky com navegação
          ============================================================ */}
      <header className="bg-magna-dark shadow-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="hover:opacity-80 transition-opacity"
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-magna-violet to-magna-magenta bg-clip-text text-transparent">
                  🎯 Portal MagnaFest
                </h1>
              </button>
              <div className="hidden sm:block h-6 w-px bg-white/20" />
              <div className="hidden sm:flex items-center gap-2 text-gray-300">
                <SearchIcon className="w-5 h-5" />
                <span className="font-medium">Buscar Anúncios</span>
              </div>
            </div>

            {/* Navegação */}
            <nav className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-magna-cyan transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => navigate('/create')}
                className="px-4 py-2 text-sm bg-gradient-to-r from-magna-violet to-magna-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Criar Anúncio
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* ============================================================
          MAIN CONTENT - Layout Flex com Sidebar + Grid
          ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* ========================================================
              SIDEBAR DE FILTROS - Desktop (w-64)
              ======================================================== */}
          <aside className="hidden lg:block lg:w-64 lg:flex-shrink-0 mb-8 lg:mb-0">
            <div className="sticky top-24">
              <SearchFilters categories={categories} />
            </div>
          </aside>

          {/* ========================================================
              ÁREA DE RESULTADOS - Flex-grow
              ======================================================== */}
          <div className="flex-1 min-w-0">
            {/* Filtros Mobile (collapsible) */}
            <div className="lg:hidden mb-6">
              <SearchFilters categories={categories} />
            </div>

            {/* Grid de Resultados */}
            <ListingGrid
              listings={listings}
              isLoading={isLoading}
              error={error}
              totalCount={totalCount}
              onListingClick={handleListingClick}
              onRetry={handleRetry}
              onClearFilters={handleClearFilters}
              // onLoadMore={handleLoadMore} // TODO: Implementar paginação
            />
          </div>
        </div>
      </main>
    </div>
  );
}
