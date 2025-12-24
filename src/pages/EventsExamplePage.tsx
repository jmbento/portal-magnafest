/**
 * =====================================================================
 * EVENTOS - Página de Exemplo
 * =====================================================================
 * Demonstração do EventCard com diferentes estados
 */

import EventCard, { EventCardSkeleton, EventGrid } from '../components/events/EventCard';
import type { Event } from '../types/events';

// =====================================================================
// MOCK DATA
// =====================================================================

const mockEvents: Event[] = [
  // Evento PUBLICADO - Presencial - Com preço
  {
    id: '1',
    slug: 'rock-in-rio-2025',
    organizer_id: 'user-1',
    title: 'Rock in Rio 2025',
    short_description: 'O maior festival de música do mundo retorna ao Brasil com lineup internacional incrível!',
    full_content: null,
    cover_image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    starts_at: '2025-09-15T14:00:00Z',
    ends_at: '2025-09-22T23:00:00Z',
    format: 'in_person',
    status: 'published',
    location_data: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      address: 'Cidade do Rock',
    },
    metadata: {},
    views_count: 15420,
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-20T15:30:00Z',
    min_price: 350.00,
    max_price: 1200.00,
    tickets_count: 3,
    available_tickets: 45000,
  },

  // Evento ONLINE - Gratuito
  {
    id: '2',
    slug: 'webinar-react-19',
    organizer_id: 'user-2',
    title: 'Webinar: React 19 - Novidades e Melhores Práticas',
    short_description: 'Aprenda sobre as novidades do React 19 com experts da comunidade',
    full_content: null,
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    starts_at: '2025-01-10T19:00:00Z',
    ends_at: '2025-01-10T21:00:00Z',
    format: 'online',
    status: 'published',
    location_data: {
      url: 'https://zoom.us/meeting/123',
    },
    metadata: {},
    views_count: 3240,
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2024-12-15T10:00:00Z',
    min_price: 0,
    tickets_count: 1,
    available_tickets: 450,
  },

  // Evento DRAFT - Híbrido
  {
    id: '3',
    slug: 'conferencia-tech-2025',
    organizer_id: 'user-3',
    title: 'Conferência Tech Brasil 2025',
    short_description: 'O maior encontro de tecnologia e inovação do Brasil',
    full_content: null,
    cover_image_url: null, // Sem imagem - mostra fallback
    starts_at: '2025-03-20T09:00:00Z',
    ends_at: '2025-03-22T18:00:00Z',
    format: 'hybrid',
    status: 'draft',
    location_data: {
      city: 'São Paulo',
      state: 'SP',
    },
    metadata: {},
    views_count: 0,
    created_at: '2024-12-22T10:00:00Z',
    updated_at: '2024-12-22T10:00:00Z',
    tickets_count: 0,
  },

  // Evento CANCELADO
  {
    id: '4',
    slug: 'festival-cancelado',
    organizer_id: 'user-4',
    title: 'Festival de Jazz - CANCELADO',
    short_description: 'Evento cancelado devido a condições climáticas adversas',
    full_content: null,
    cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    starts_at: '2025-02-05T18:00:00Z',
    ends_at: '2025-02-05T23:00:00Z',
    format: 'in_person',
    status: 'cancelled',
    location_data: {
      city: 'Curitiba',
      state: 'PR',
    },
    metadata: {},
    views_count: 2100,
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-12-20T10:00:00Z',
    min_price: 80.00,
    tickets_count: 2,
    available_tickets: 0,
  },

  // Evento CONCLUÍDO
  {
    id: '5',
    slug: 'workshop-design-2024',
    organizer_id: 'user-5',
    title: 'Workshop de Design Thinking',
    short_description: 'Workshop prático sobre metodologias ágeis e design thinking',
    full_content: null,
    cover_image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    starts_at: '2024-12-15T14:00:00Z',
    ends_at: '2024-12-15T18:00:00Z',
    format: 'in_person',
    status: 'completed',
    location_data: {
      city: 'Belo Horizonte',
      state: 'MG',
    },
    metadata: {},
    views_count: 856,
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-12-16T10:00:00Z',
    min_price: 120.00,
    tickets_count: 1,
  },

  // Evento ESGOTADO
  {
    id: '6',
    slug: 'show-esgotado',
    organizer_id: 'user-6',
    title: 'Show Especial - ESGOTADO',
    short_description: 'Evento esgotado! Aguarde novas datas',
    full_content: null,
    cover_image_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    starts_at: '2025-02-14T20:00:00Z',
    ends_at: '2025-02-14T23:00:00Z',
    format: 'in_person',
    status: 'published',
    location_data: {
      city: 'Porto Alegre',
      state: 'RS',
    },
    metadata: {},
    views_count: 8900,
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2024-12-18T10:00:00Z',
    min_price: 150.00,
    tickets_count: 2,
    available_tickets: 0,
  },
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function EventsExamplePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Eventos - Sistema Completo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Demonstração do EventCard com diferentes status, formatos e estados
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Legenda:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Status:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Publicado - Visível para todos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-sm">Rascunho - Apenas organizador</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Cancelado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Concluído</span>
                </div>
              </div>
            </div>

            {/* Format */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Formato:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Presencial - Com localização física</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Online - Remoto via streaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Híbrido - Presencial + Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <EventGrid>
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventGrid>

        {/* Loading State Demo */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Loading State (Skeleton):
          </h2>
          <EventGrid>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </EventGrid>
        </div>
      </div>
    </main>
  );
}
