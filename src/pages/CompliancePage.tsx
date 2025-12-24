/**
 * =====================================================================
 * Bússola Burocrática - Guia Legal de Compliance
 * =====================================================================
 * Página de busca de documentos e licenças necessárias
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Shield, AlertCircle } from 'lucide-react';
import ComplianceCard, { ComplianceCardSkeleton } from '../components/compliance/ComplianceCard';
import { supabase } from '../lib/supabase';
import type { ComplianceDoc } from '../types/compliance';
import { SEARCH_SUGGESTIONS, mapEventTypeToTags } from '../types/compliance';

// =====================================================================
// COMPONENT
// =====================================================================

export default function CompliancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [docs, setDocs] = useState<ComplianceDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    fetchDocs();
  }, [searchParams]);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchDocs = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = searchParams.get('q');

      let supabaseQuery = supabase
        .from('compliance_docs')
        .select('*')
        .order('is_mandatory', { ascending: false })
        .order('sort_order', { ascending: true });

      if (query) {
        // Mapear termo de busca para tags
        const tags = mapEventTypeToTags(query);
        
        // Buscar por tags OU no título/descrição
        if (tags.length > 0) {
          supabaseQuery = supabaseQuery.or(
            `tags.cs.{${tags.join(',')}},title.ilike.%${query}%,description.ilike.%${query}%`
          );
        } else {
          supabaseQuery = supabaseQuery.or(
            `title.ilike.%${query}%,description.ilike.%${query}%`
          );
        }
      }

      const { data, error: fetchError } = await supabaseQuery;

      if (fetchError) throw fetchError;

      setDocs(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar documentos:', err);
      setError(err.message || 'Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Debounce: atualizar URL após 500ms
    const timeout = setTimeout(() => {
      if (value.trim()) {
        setSearchParams({ q: value.trim() });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  const handleSuggestionClick = (suggestion: typeof SEARCH_SUGGESTIONS[number]) => {
    const searchValue = suggestion.label;
    setSearchTerm(searchValue);
    setSearchParams({ q: searchValue });
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 to-zinc-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Bússola Burocrática
            </h1>
          </div>
          <p className="text-xl text-slate-300 text-center max-w-3xl mx-auto">
            Encontre as licenças e documentos necessários para o seu evento <strong>não ser embargado</strong>.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ex: Show, Festa, Feira Gastronômica, Casamento..."
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-colors"
            />
          </div>

          {/* Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-medium">Sugestões:</span>
            {SEARCH_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-full transition-colors"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ComplianceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Documentos
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && docs.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente buscar por: "Show", "Festa", "Comida", "Rua"
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSearchParams({});
              }}
              className="btn-primary"
            >
              Ver Todos os Documentos
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && docs.length > 0 && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {docs.length} {docs.length === 1 ? 'documento' : 'documentos'} encontrado
                {docs.length !== 1 ? 's' : ''}
              </h2>
              {searchParams.get('q') && (
                <p className="text-gray-600 mt-1">
                  Resultados para: <strong>"{searchParams.get('q')}"</strong>
                </p>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docs.map((doc) => (
                <ComplianceCard key={doc.id} doc={doc} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-slate-900 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            ⚠️ Importante
          </h3>
          <p className="text-slate-300 leading-relaxed">
            Este guia é informativo e baseado em regulamentações comuns no Brasil. 
            As exigências podem variar por cidade e estado. Sempre confirme com os órgãos 
            competentes locais antes do seu evento. A Canapev não se responsabiliza por 
            informações desatualizadas ou incorretas.
          </p>
        </div>
      </div>
    </main>
  );
}
