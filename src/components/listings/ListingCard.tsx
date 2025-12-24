/**
 * =====================================================================
 * CANAPEV - Card de Anúncio
 * =====================================================================
 * Componente reutilizável para exibir um listing em formato card
 */

import { MapPin, Clock, Tag, Heart } from 'lucide-react';
import { useState } from 'react';

interface ListingCardProps {
  id: string;
  title: string;
  description?: string;
  price_min: number; // Em centavos
  price_unit: string;
  listing_type: 'venue' | 'service' | 'product_rent' | 'product_sale';
  categoryName?: string;
  imageUrl?: string;
  location?: string;
  createdAt?: string;
  onClick?: () => void;
}

const LISTING_TYPE_LABELS: Record<string, string> = {
  venue: 'Local',
  service: 'Serviço',
  product_rent: 'Aluguel',
  product_sale: 'Venda',
};

const LISTING_TYPE_COLORS: Record<string, string> = {
  venue: 'bg-blue-100 text-blue-700',
  service: 'bg-purple-100 text-purple-700',
  product_rent: 'bg-green-100 text-green-700',
  product_sale: 'bg-orange-100 text-orange-700',
};

export default function ListingCard({
  id,
  title,
  description,
  price_min,
  price_unit,
  listing_type,
  categoryName,
  imageUrl,
  location,
  createdAt,
  onClick,
}: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Formatar preço de centavos para reais
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price_min / 100);

  // Formatar data relativa
  const getRelativeTime = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
    return `${Math.floor(diffInDays / 30)} meses atrás`;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Implementar lógica de favoritar no backend
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Imagem */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Tag className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Badge de Tipo */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              LISTING_TYPE_COLORS[listing_type]
            }`}
          >
            {LISTING_TYPE_LABELS[listing_type]}
          </span>
        </div>

        {/* Botão de Favoritar */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Categoria */}
        {categoryName && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Tag className="w-3 h-3" />
            <span>{categoryName}</span>
          </div>
        )}

        {/* Título */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Descrição */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Localização */}
        {location && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          {/* Preço */}
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {formattedPrice}
            </p>
            <p className="text-xs text-gray-500">por {price_unit}</p>
          </div>

          {/* Data */}
          {createdAt && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{getRelativeTime(createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader para loading state
 */
export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between pt-3">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
