/**
 * =====================================================================
 * CANAPEV - Dashboard do Usuário
 * =====================================================================
 * Página privada para gerenciar anúncios próprios
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Loader2, 
  FolderOpen, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getListingsByOwner, supabase } from '../../lib/supabase';

interface Listing {
  id: string;
  title: string;
  description: string;
  price_min: number;
  price_unit: string;
  listing_type: string;
  status: string;
  created_at: string;
  categories?: {
    name: string;
  };
  media?: Array<{
    url: string;
    sort_order: number;
  }>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadListings();
    }
  }, [user]);

  const loadListings = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getListingsByOwner(user.id);
      setListings(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar anúncios:', err);
      setError(err.message || 'Erro ao carregar seus anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string, listingTitle: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o anúncio "${listingTitle}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    setDeletingId(listingId);

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      // Atualizar lista localmente
      setListings(listings.filter(l => l.id !== listingId));
    } catch (err: any) {
      console.error('Erro ao excluir anúncio:', err);
      alert(`Erro ao excluir: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-700',
      draft: 'bg-gray-100 text-gray-700',
      archived: 'bg-red-100 text-red-700',
    };

    const labels = {
      active: 'Ativo',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // ================================================================
  // LOADING STATE
  // ================================================================
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Carregando seus anúncios...</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">
            Erro ao Carregar Anúncios
          </h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button onClick={loadListings} className="btn-primary">
            Tentar Novamente
          </button>
        </div>
      </main>
    );
  }

  // ================================================================
  // EMPTY STATE
  // ================================================================
  if (listings.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FolderOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Nenhum anúncio ainda
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Você ainda não criou nenhum anúncio. Comece agora e alcance milhares de organizadores de eventos!
          </p>
          <Link to="/create" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            <PlusCircle className="w-5 h-5" />
            Criar Meu Primeiro Anúncio
          </Link>
        </div>
      </main>
    );
  }

  // ================================================================
  // CONTENT
  // ================================================================
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Anúncios
          </h1>
          <p className="text-gray-600">
            {listings.length} {listings.length === 1 ? 'anúncio' : 'anúncios'}
          </p>
        </div>
        <Link to="/create" className="btn-primary flex items-center gap-2 px-6 py-3">
          <PlusCircle className="w-5 h-5" />
          Novo Anúncio
        </Link>
      </div>

      {/* Grid de Anúncios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          const firstImage = listing.media
            ?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url;

          return (
            <div
              key={listing.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagem */}
              <div className="relative aspect-video bg-gray-100">
                {firstImage ? (
                  <img
                    src={firstImage}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(listing.status)}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                {/* Categoria */}
                {listing.categories && (
                  <p className="text-xs text-gray-500 mb-2">
                    {listing.categories.name}
                  </p>
                )}

                {/* Título */}
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                  {listing.title}
                </h3>

                {/* Descrição */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {listing.description}
                </p>

                {/* Preço */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xl font-bold text-primary-600">
                    {formatPrice(listing.price_min)}
                  </p>
                  <p className="text-xs text-gray-500">por {listing.price_unit}</p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>

                  <button
                    onClick={() => navigate(`/edit/${listing.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(listing.id, listing.title)}
                    disabled={deletingId === listing.id}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === listing.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
