/**
 * =====================================================================
 * MyFavoritesPage - Página de Favoritos do Usuário
 * =====================================================================
 * Lista os profissionais/fornecedores favoritados pelo usuário
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Provider } from '../types/providers';
import ProviderCard from '../components/providers/ProviderCard';

// =====================================================================
// COMPONENT
// =====================================================================

export default function MyFavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ================================================================
  // FETCH FAVORITES
  // ================================================================
  useEffect(() => {
    async function fetchFavorites() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar IDs dos providers favoritados
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('provider_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (favoritesError) throw favoritesError;

        if (!favoritesData || favoritesData.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Buscar dados completos dos providers
        const providerIds = favoritesData.map(fav => fav.provider_id);
        
        const { data: providersData, error: providersError } = await supabase
          .rpc('search_providers_with_stats', {
            search_state: null,
            search_city: null,
            search_category: null,
            search_term: null,
            verified_only: false,
            sort_by: 'recent',
            current_user_id: user.id,
          })
          .in('id', providerIds);

        if (providersError) throw providersError;

        setFavorites(providersData || []);
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setError('Erro ao carregar seus favoritos');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  // ================================================================
  // REQUIRE AUTH
  // ================================================================
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-lg p-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Login Necessário
          </h1>
          <p className="text-gray-600 mb-8">
            Você precisa estar logado para ver seus favoritos.
          </p>
          <a
            href="/login"
            className="btn-primary px-8 py-3 inline-block"
          >
            Fazer Login
          </a>
        </div>
      </main>
    );
  }

  // ================================================================
  // LOADING STATE
  // ================================================================
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // ERROR STATE
  // ================================================================
  if (error) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-xl shadow-lg p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Erro ao Carregar Favoritos
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-8 py-3"
          >
            Tentar Novamente
          </button>
        </div>
      </main>
    );
  }

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <>
      <Helmet>
        <title>Meus Favoritos | MagnaFest</title>
        <meta name="description" content="Lista de profissionais e fornecedores que você favoritou no MagnaFest" />
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="text-4xl font-bold text-gray-900">
                Meus Favoritos
              </h1>
            </div>
            <p className="text-gray-600">
              {favorites.length === 0 
                ? 'Você ainda não favoritou nenhum profissional'
                : `${favorites.length} ${favorites.length === 1 ? 'profissional favoritado' : 'profissionais favoritados'}`
              }
            </p>
          </div>

          {/* Empty State */}
          {favorites.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Nenhum Favorito Ainda
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Explore profissionais e fornecedores e favorite os que você mais gosta para encontrá-los facilmente aqui!
              </p>
              <a
                href="/profissionais"
                className="btn-primary px-8 py-3 inline-block"
              >
                Explorar Profissionais
              </a>
            </div>
          )}

          {/* Grid de Favoritos */}
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((provider) => (
                <div key={provider.id}>
                  <ProviderCard 
                    provider={{
                      ...provider,
                      is_favorited: true, // Já está nos favoritos
                    }} 
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dica */}
          {favorites.length > 0 && (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    💡 Dica
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Compartilhe os perfis que você gostou e ajude os profissionais a subirem no ranking! 
                    Quanto mais favoritos eles tiverem, mais visibilidade terão na plataforma.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
