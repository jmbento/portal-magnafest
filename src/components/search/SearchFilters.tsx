/**
 * =====================================================================
 * CANAPEV - Filtros de Busca
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
    <div className="bg-white rounded-xl shadow-md">
      {/* Header Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-semibold rounded-full">
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
        <div className="hidden lg:flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar tudo
            </button>
          )}
        </div>

        {/* Busca por Texto */}
        <div>
          <label className="label-field">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Equipamento de som, Fotografia..."
              className="input-field pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tipo de Anúncio */}
        <div>
          <label className="label-field flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tipo de Anúncio
          </label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="input-field"
          >
            <option value="">Todos os tipos</option>
            <option value="venue">Locais para Eventos</option>
            <option value="service">Serviços</option>
            <option value="product_rent">Produtos para Aluguel</option>
            <option value="product_sale">Produtos para Venda</option>
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label className="label-field flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categoria
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input-field"
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Faixa de Preço */}
        <div>
          <label className="label-field flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Faixa de Preço (R$)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Mín"
                className="input-field"
                min="0"
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo</p>
            </div>
            <div>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Máx"
                className="input-field"
                min="0"
                step="10"
              />
              <p className="text-xs text-gray-500 mt-1">Máximo</p>
            </div>
          </div>
        </div>

        {/* Botão Limpar (Mobile) */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="lg:hidden w-full btn-secondary flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Limpar Filtros
          </button>
        )}

        {/* Stats */}
        <div className="pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {activeFiltersCount === 0 ? (
              <p>Nenhum filtro aplicado</p>
            ) : (
              <p>
                <span className="font-semibold text-primary-600">
                  {activeFiltersCount}
                </span>{' '}
                {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
