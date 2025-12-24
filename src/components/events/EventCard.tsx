/**
 * =====================================================================
 * EventCard - Card de Visualização de Evento
 * =====================================================================
 * Componente de apresentação para exibir eventos em grids/listas
 */

import { Link } from 'react-router-dom';
import { MapPin, Video, Calendar, Ticket, Clock, ExternalLink } from 'lucide-react';
import type { Event } from '../../types/events';

// =====================================================================
// PROPS
// =====================================================================

interface EventCardProps {
  event: Event;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function EventCard({ event }: EventCardProps) {
  // ================================================================
  // STATUS BADGE CONFIG
  // ================================================================
  const statusConfig = {
    draft: {
      label: 'Rascunho',
      className: 'bg-gray-100 text-gray-700',
    },
    published: {
      label: 'Publicado',
      className: 'bg-green-100 text-green-700',
    },
    cancelled: {
      label: 'Cancelado',
      className: 'bg-red-100 text-red-700',
    },
    completed: {
      label: 'Concluído',
      className: 'bg-blue-100 text-blue-700',
    },
  };

  const currentStatus = statusConfig[event.status];

  // ================================================================
  // FORMAT BADGE CONFIG
  // ================================================================
  const formatConfig = {
    online: {
      label: 'Online',
      icon: Video,
      className: 'bg-purple-100 text-purple-700',
    },
    in_person: {
      label: 'Presencial',
      icon: MapPin,
      className: 'bg-blue-100 text-blue-700',
    },
    hybrid: {
      label: 'Híbrido',
      icon: ExternalLink,
      className: 'bg-orange-100 text-orange-700',
    },
  };

  const currentFormat = formatConfig[event.format];
  const FormatIcon = currentFormat.icon;

  // ================================================================
  // DATE FORMATTING
  // ================================================================
  const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
    
    const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    const day = dayFormatter.format(date).toUpperCase();
    const time = timeFormatter.format(date);
    
    return `${day} • ${time}`;
  };

  // ================================================================
  // PRICE LOGIC
  // ================================================================
  const getPriceDisplay = (): string => {
    if (event.min_price !== undefined && event.min_price > 0) {
      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      return `A partir de ${formatter.format(event.min_price)}`;
    }
    
    if (event.tickets_count === 0 || !event.tickets_count) {
      return 'Entrada Gratuita';
    }
    
    return 'Sob Consulta';
  };

  // ================================================================
  // LOCATION
  // ================================================================
  const getLocationDisplay = (): string => {
    const { city, state } = event.location_data;
    
    if (event.format === 'online') {
      return 'Evento Online';
    }
    
    if (city && state) {
      return `${city}, ${state}`;
    }
    
    if (city) {
      return city;
    }
    
    return 'Local a definir';
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <Link
      to={`/eventos/${event.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.className}`}
          >
            {currentStatus.label}
          </span>
        </div>

        {/* Format Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${currentFormat.className}`}
          >
            <FormatIcon className="w-3 h-3" />
            {currentFormat.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        {event.short_description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.short_description}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
          <Clock className="w-4 h-4 text-primary-600" />
          <span className="font-medium">{formatEventDate(event.starts_at)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {event.format === 'online' ? (
            <Video className="w-4 h-4" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{getLocationDisplay()}</span>
        </div>

        {/* Footer: Price & Tickets */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-gray-900">
              {getPriceDisplay()}
            </span>
          </div>

          {/* Available Tickets Indicator */}
          {event.available_tickets !== undefined && event.available_tickets > 0 && (
            <span className="text-xs text-green-600 font-medium">
              {event.available_tickets} disponíveis
            </span>
          )}

          {event.available_tickets === 0 && (
            <span className="text-xs text-red-600 font-medium">Esgotado</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// =====================================================================
// SKELETON LOADER
// =====================================================================

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4" />

        {/* Description */}
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-5/6" />

        {/* Date */}
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-1/2" />

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-2/3" />

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GRID CONTAINER (Helper)
// =====================================================================

interface EventGridProps {
  children: React.ReactNode;
}

export function EventGrid({ children }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
