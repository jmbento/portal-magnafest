/**
 * =====================================================================
 * GUIA ATLAS PRÓ - VendorCard
 * =====================================================================
 * Card de fornecedor com hierarquia visual por tier e unclaimed logic
 */

import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Star, Store } from 'lucide-react';
import type { SubscriptionTier } from '../../types/vendor';

// =====================================================================
// TYPES
// =====================================================================

interface VendorCardProps {
  vendor: {
    id: string;
    name: string;
    slug: string;
    category: string;
    address_info: {
      city?: string;
      state?: string;
    };
    subscription_tier: SubscriptionTier;
    is_claimed: boolean;
    rating?: number;
    image_url?: string;
  };
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function VendorCard({ vendor }: VendorCardProps) {
  const {
    name,
    slug,
    category,
    address_info,
    subscription_tier,
    is_claimed,
    rating,
    image_url,
  } = vendor;

  // ================================================================
  // TIER STYLES
  // ================================================================
  const tierStyles = {
    free: {
      container: 'bg-white border border-gray-200 hover:shadow-md',
      badge: '',
      showBadge: false,
      badgeText: '',
    },
    featured: {
      container: 'bg-white border-2 border-purple-500 hover:shadow-lg',
      badge: 'bg-purple-500 text-white',
      showBadge: false,
      badgeText: '',
    },
    partner: {
      container: 'bg-gradient-to-br from-amber-50 to-white border-2 border-amber-400 shadow-md hover:shadow-xl',
      badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
      showBadge: true,
      badgeText: '⭐ Recomendado',
    },
  };

  const currentTier = tierStyles[subscription_tier];

  // ================================================================
  // LOCATION STRING
  // ================================================================
  const getLocation = () => {
    const { city, state } = address_info;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return 'Localização não informada';
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div
      className={`
        rounded-xl overflow-hidden transition-all duration-300
        ${currentTier.container}
      `}
    >
      {/* Partner Badge (Top) */}
      {currentTier.showBadge && (
        <div className={`px-4 py-2 text-center text-sm font-bold ${currentTier.badge}`}>
          {currentTier.badgeText}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Rating Badge (if exists) */}
        {rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header: Name + Verified */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
            {name}
          </h3>
          {is_claimed && (
            <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{getLocation()}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Ver Detalhes Button */}
          <Link
            to={`/guia/${slug}`}
            className="w-full text-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Ver Detalhes
          </Link>

          {/* Unclaimed CTA */}
          {!is_claimed && (
            <Link
              to={`/claim/${slug}`}
              className="w-full text-center px-4 py-2 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50 transition-colors text-sm"
            >
              É dono deste negócio? <span className="font-bold">Reivindicar Perfil</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SKELETON LOADER
// =====================================================================

export function VendorCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />

        {/* Badge */}
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse mb-3" />

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// =====================================================================
// GRID CONTAINER (Helper Component)
// =====================================================================

interface VendorGridProps {
  children: React.ReactNode;
}

export function VendorGrid({ children }: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
