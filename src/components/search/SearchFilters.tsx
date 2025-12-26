/**
 * =====================================================================
 * MAGNAFEST - Filtros de Busca (Dark Mode)
  * =====================================================================
 * Componente client-side para filtrar anúncios com debounce
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Search, Filter, X, SlidersHorizontal, Tag, DollarSign } from 'lucide-react';

interface SearchFiltersProps {
  categories: Array<{ id: string; name: string }>;
  onFiltersChange?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  q?: string;
  category_id?: string;
  listing_type?: string;
  price_min?: number;
  price_max?: number;
}

export default function SearchFilters({ categories, onFiltersChange }: SearchFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Estados dos filtros
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [listingType, setListingType] = useState(searchParams.get('listing_type') || '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');

  // Debounce do input de busca (300ms)
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  // Atualizar URL quando os filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedQuery) params.set('q', debouncedQuery);
    if (categoryId) params.set('category_id', categoryId);
    if (listingType) params.set('listing_type', listingType);
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    if (newSearch !== currentSearch) {
      navigate(`/search${newSearch ? `?${newSearch}` : ''}`, { replace: true });
      
      // Callback opcional para o componente pai
      if (onFiltersChange) {
        onFiltersChange({
          q: debouncedQuery || undefined,
          category_id: categoryId || undefined,
          listing_type: listingType || undefined,
          price_min: priceMin ? Number(priceMin) : undefined,
          price_max: priceMax ? Number(priceMax) : undefined,
        });
      }
    }
  }, [debouncedQuery, categoryId, listingType, priceMin, priceMax]);

  // Limpar todos os filtros
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryId('');
    setListingType('');
    setPriceMin('');
    setPriceMax('');
    navigate('/search', { replace: true });
  };

  // Contar filtros ativos
  const activeFiltersCount = [categoryId, listingType, priceMin, priceMax].filter(Boolean).length;

  return (
    <div className="bg-magna-dark rounded-xl shadow-lg border border-white/10">
      {/* Header Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 border-b border-white/10"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-white">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-magna-violet text-white text-xs font-semibold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <X
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-0' : 'rotate-45'
            }`}
          />
        </button>
      </div>

      {/* Filtros - Desktop sempre visível, Mobile collapsible */}
      <div className={`p-6 space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Header Desktop */}
        <div className="hidden lg:flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-white">Filtros</h3>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-magna-cyan hover:text-magna-magenta font-medium transition-colors"
            >
              Limpar tudo
            </button>
          )}
        </div>

        {/* Busca */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: mixer, iluminação..."
              className="w-full pl-10 pr-4 py-2 bg-magna-black border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none placeholder-gray-500"
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 bg-magna-black border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Anúncio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tipo de Anúncio
          </label>
          <div className="space-y-2">
            {[
              { value: '', label: 'Todos' },
              { value: 'venue', label: 'Espaços' },
              { value: 'service', label: 'Serviços' },
              { value: 'product_rent', label: 'Aluguel' },
              { value: 'product_sale', label: 'Venda' }
            ].map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="listingType"
                  value={type.value}
                  checked={listingType === type.value}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-4 h-4 text-magna-violet border-white/20 bg-magna-black focus:ring-magna-violet"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Faixa de Preço
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="Mín"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-4 py-2 bg-magna-black border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none placeholder-gray-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Máx"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-4 py-2 bg-magna-black border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Botão Aplicar (Mobile) */}
        <div className="lg:hidden pt-4 border-t border-white/10">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-gradient-to-r from-magna-violet to-magna-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
