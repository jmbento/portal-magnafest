/**
 * =====================================================================
 * ProviderFilters - Barra de Filtros
 * =====================================================================
 * Filtros de busca para profissionais/fornecedores
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

// =====================================================================
// CATEGORIAS (Hardcoded por enquanto)
// =====================================================================

const CATEGORIES = [
  'Todos',
  'Segurança',
  'Buffet',
  'Foto/Vídeo',
  'Sonorização',
  'Iluminação',
  'Cenografia',
  'Limpeza',
  'Decoração',
  'Transporte',
] as const;

// =====================================================================
// COMPONENT
// =====================================================================

export default function ProviderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || 'Todos');

  // Debounce timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateURL();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, city, category]);

  // ================================================================
  // UPDATE URL
  // ================================================================
  const updateURL = () => {
    const params: Record<string, string> = {};

    if (searchTerm.trim()) params.q = searchTerm.trim();
    if (city.trim()) params.city = city.trim();
    if (category !== 'Todos') params.cat = category;

    setSearchParams(params);
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Filtros de Busca
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Busca por Nome */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por Nome
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: João, Canapev..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Cidade */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: São Paulo, Rio..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || city || category !== 'Todos') && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                  Nome: {searchTerm}
                </span>
              )}
              {category !== 'Todos' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  {category}
                </span>
              )}
              {city && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  {city}
                </span>
              )}
            </div>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setCity('');
                setCategory('Todos');
                setSearchParams({});
              }}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
