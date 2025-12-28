/**
 * =====================================================================
 * ProvidersPage - Diretório de Profissionais
 * =====================================================================
 * Página de busca e listagem de fornecedores
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import ProviderFilters from '../components/providers/ProviderFilters';
import ProviderCard, { ProviderCardSkeleton } from '../components/providers/ProviderCard';
import { supabase } from '../lib/supabase';
import type { Provider } from '../types/providers';

// =====================================================================
// COMPONENT
// =====================================================================

export default function ProvidersPage() {
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, [searchParams]);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchProviders = async () => {
    setLoading(true);
    setError(null);

    try {
      const searchTerm = searchParams.get('q');
      const city = searchParams.get('city');
      const category = searchParams.get('cat');

      let query = supabase
        .from('profiles')
        .select('*')
        .order('is_claimed', { ascending: false })
        .order('created_at', { ascending: false });

      // Filtro por HABILIDADE/SERVIÇO (busca em description e name)
      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`);
      }

      // Filtro por cidade
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      // Filtro por categoria
      if (category && category !== 'Todos') {
        query = query.ilike('category', `%${category}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProviders(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar profissionais:', err);
      setError(err.message || 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Profissionais
            </h1>
          </div>
          <p className="text-xl text-primary-100 text-center max-w-3xl mx-auto">
            Encontre os melhores fornecedores e prestadores de serviço para o seu evento
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtros */}
        <ProviderFilters />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProviderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Profissionais
            </h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchProviders}
              className="mt-4 btn-primary"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && providers.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum profissional encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar em outra cidade
            </p>
            <button
              onClick={() => window.location.href = '/profissionais'}
              className="btn-primary"
            >
              Ver Todos os Profissionais
            </button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && providers.length > 0 && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {providers.length} {providers.length === 1 ? 'profissional' : 'profissionais'} encontrado
                {providers.length !== 1 ? 's' : ''}
              </h2>
              {(searchParams.get('q') || searchParams.get('city') || searchParams.get('cat')) && (
                <p className="text-gray-600 mt-1">
                  Resultados filtrados
                </p>
              )}
            </div>

            {/* Lista Vertical */}
            <div className="flex flex-col gap-4">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-slate-100 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Você é um profissional?
          </h3>
          <p className="text-gray-600 mb-6">
            Cadastre-se gratuitamente no nosso diretório e seja encontrado por produtores de eventos em todo o Brasil.
          </p>
          <a href="/cadastrar" className="btn-primary inline-block">
            Cadastrar Meu Perfil
          </a>
        </div>
      </div>
    </main>
  );
}
