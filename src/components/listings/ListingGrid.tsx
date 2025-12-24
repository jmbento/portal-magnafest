/**
 * =====================================================================
 * CANAPEV - Grid de Anúncios
 * =====================================================================
 * Componente responsável por exibir a grid de resultados da busca
 */

import { Package, AlertCircle } from 'lucide-react';
import ListingCard, { ListingCardSkeleton } from './ListingCard';

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

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  onListingClick: (id: string) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onLoadMore?: () => void;
}

export default function ListingGrid({
  listings,
  isLoading,
  error,
  totalCount,
  onListingClick,
  onRetry,
  onClearFilters,
  onLoadMore,
}: ListingGridProps) {
  // ================================================================
  // LOADING STATE
  // ================================================================
  if (isLoading) {
    return (
      <>
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </>
    );
  }

  // ================================================================
  // ERROR STATE
  // ================================================================
  if (error) {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Erro ao Carregar</h2>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-900 mb-2">
            Erro ao Carregar Anúncios
          </h3>
          <p className="text-red-700 mb-6">{error}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Tentar Novamente
            </button>
          )}
        </div>
      </>
    );
  }

  // ================================================================
  // EMPTY STATE
  // ================================================================
  if (listings.length === 0) {
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Nenhum resultado encontrado
          </h2>
        </div>

        {/* Empty Message */}
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            Nenhum anúncio encontrado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Não encontramos anúncios que correspondam aos seus filtros. Tente ajustar os
            critérios de busca ou explorar outras categorias.
          </p>
          {onClearFilters && (
            <button onClick={onClearFilters} className="btn-secondary">
              Limpar Filtros
            </button>
          )}
        </div>
      </>
    );
  }

  // ================================================================
  // RESULTS STATE
  // ================================================================
  return (
    <>
      {/* Header de Resultados */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {totalCount === 1
            ? '1 anúncio encontrado'
            : `${totalCount.toLocaleString('pt-BR')} anúncios encontrados`}
        </h2>

        {/* TODO: Ordenação */}
        {/* <select className="input-field w-auto text-sm">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
          <option>Mais relevantes</option>
        </select> */}
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => {
          // Pegar primeira imagem (sort by sort_order)
          const firstImage = listing.media
            ?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url;

          // Montar localização a partir do JSONB
          const location =
            listing.location_data?.cidade && listing.location_data?.estado
              ? `${listing.location_data.cidade}, ${listing.location_data.estado}`
              : undefined;

          return (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              description={listing.description}
              price_min={listing.price_min}
              price_unit={listing.price_unit}
              listing_type={listing.listing_type}
              categoryName={listing.categories?.name}
              imageUrl={firstImage}
              location={location}
              createdAt={listing.created_at}
              onClick={() => onListingClick(listing.id)}
            />
          );
        })}
      </div>

      {/* Paginação / Load More */}
      {totalCount > listings.length && onLoadMore && (
        <div className="text-center mt-12">
          <button onClick={onLoadMore} className="btn-secondary px-8 py-3">
            Carregar Mais Anúncios
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Mostrando {listings.length} de {totalCount.toLocaleString('pt-BR')} anúncios
          </p>
        </div>
      )}
    </>
  );
}
