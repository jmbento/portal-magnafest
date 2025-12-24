/**
 * =====================================================================
 * ProviderCard - Cartão de Visita Digital
 * =====================================================================
 * Card inteligente que se adapta aos dados disponíveis
 */

import { MapPin, Phone, Instagram, Globe, CheckCircle, User } from 'lucide-react';
import type { Provider } from '../../types/providers';

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
  // Extrair contatos do JSONB
  const contacts = provider.contact_info || {};
  const hasAnyContact = !!(contacts.whatsapp || contacts.instagram || contacts.website || contacts.email);

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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {provider.avatar_url ? (
              <img
                src={provider.avatar_url}
                alt={provider.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {getInitials(provider.name)}
                </span>
              </div>
            )}
          </div>

          {/* Nome e Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">
                {provider.name}
              </h3>
              {provider.is_verified && (
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-100" />
                </div>
              )}
            </div>

            {/* Categoria e Localização */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {provider.category && (
                <>
                  <span className="font-medium">{provider.category}</span>
                  <span className="text-gray-400">•</span>
                </>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{provider.city}, {provider.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      {provider.description && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {provider.description}
          </p>
        </div>
      )}

      {/* Footer com Ações */}
      <div className="px-6 pb-6 pt-2">
        {hasAnyContact ? (
          <div className="grid grid-cols-2 gap-2">
            {/* WhatsApp */}
            {contacts.whatsapp && (
              <a
                href={`https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            )}

            {/* Instagram */}
            {contacts.instagram && (
              <a
                href={contacts.instagram.startsWith('http') ? contacts.instagram : `https://instagram.com/${contacts.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            )}

            {/* Website */}
            {contacts.website && (
              <a
                href={contacts.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors col-span-2"
              >
                <Globe className="w-4 h-4" />
                Visitar Site
              </a>
            )}

            {/* Email */}
            {contacts.email && !contacts.website && (
              <a
                href={`mailto:${contacts.email}`}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors col-span-2"
              >
                <Globe className="w-4 h-4" />
                Enviar Email
              </a>
            )}
          </div>
        ) : (
          // Perfil "Fantasma" - Sem contatos
          <div className="space-y-2">
            <button
              disabled
              className="w-full px-3 py-2 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Sem contato online
            </button>
            <button className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:border-primary-400 hover:text-primary-600 transition-colors">
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                É você? Reivindique este perfil
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// SKELETON
// =====================================================================

export function ProviderCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar Skeleton */}
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          
          {/* Content Skeleton */}
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="px-6 pb-4">
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Buttons Skeleton */}
      <div className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 bg-gray-200 rounded-lg" />
          <div className="h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
