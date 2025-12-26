/**
 * =====================================================================
 * ProviderCard - Cartão de Profissional (Layout Horizontal - Job Board Style)
 * =====================================================================
 * Card horizontal com avatar à esquerda, dados no centro, ações à direita
 */

import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle } from 'lucide-react';
import type { Provider } from '../../types/providers';
import FavoriteButton from '../ui/FavoriteButton';

// =====================================================================
// PROPS
// =====================================================================

interface ProviderCardProps {
  provider: Provider;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function ProviderCard({ provider }: ProviderCardProps) {
  // Verificar se tem algum contato disponível
  const hasWhatsApp = !!provider.whatsapp;

  // Gerar iniciais para avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Coluna 1: Identidade (Avatar + Nome + Categoria) */}
        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
          {/* Avatar Quadrado */}
          {provider.avatar_url || provider.logo_url ? (
            <img
              src={provider.avatar_url || provider.logo_url || ''}
              alt={provider.name}
              className="rounded-lg w-16 h-16 object-cover flex-shrink-0"
            />
          ) : (
            <div className="rounded-lg w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xl">
                {getInitials(provider.name)}
              </span>
            </div>
          )}

          {/* Nome e Categoria */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link 
                to={`/profissionais/${provider.slug}`}
                className="hover:text-indigo-600 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors truncate">
                  {provider.name}
                </h3>
              </Link>
              {provider.is_verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100 flex-shrink-0" />
              )}
            </div>
            {provider.category && (
              <p className="text-sm text-gray-500">{provider.category}</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Metadados (Badges Pills) */}
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          {/* Localização */}
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{provider.city}</span>
          </div>
          
          {/* Contador de Favoritos */}
          {provider.favorites_count !== undefined && provider.favorites_count > 0 && (
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              ❤️ {provider.favorites_count}
            </span>
          )}
        </div>

        {/* Coluna 3: Ações (Direita) */}
        <div className="flex items-center gap-2">
          {/* Botão Favorito */}
          <FavoriteButton
            providerId={provider.id}
            initialIsFavorited={provider.is_favorited}
            initialCount={provider.favorites_count || 0}
          />
          
          {/* Botão Principal - Ver Perfil */}
          <Link
            to={`/profissionais/${provider.slug}`}
            className="rounded-full px-6 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
          >
            Ver Perfil
          </Link>

          {/* Botão WhatsApp (se disponível) */}
          {hasWhatsApp && (
            <a
              href={`https://wa.me/${provider.whatsapp!.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SKELETON
// =====================================================================

export function ProviderCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Avatar + Nome */}
        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
          <div className="rounded-lg w-16 h-16 bg-gray-200 flex-shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
          <div className="h-8 w-28 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
