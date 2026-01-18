/**
 * =====================================================================
 * EVENTOS - Página de Listagem
 * =====================================================================
 * Página real que busca eventos do Supabase e renderiza com EventCard
 */

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import EventCard, { EventCardSkeleton, EventGrid } from '../components/events/EventCard';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/events';

// =====================================================================
// COMPONENT
// =====================================================================

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      // Query principal - sem filtro de status para evitar erro se coluna não existir
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(12);

      if (eventsError) throw eventsError;

      // Processar dados para incluir campos calculados e fallbacks
      const processedEvents: Event[] = (eventsData || []).map((event: any) => {
        const tickets = event.tickets || [];
        const activeTickets = tickets.filter((t: any) => t.active);

        // Calcular preço mínimo
        const prices = activeTickets.map((t: any) => t.price).filter((p: any) => p > 0);
        const min_price = prices.length > 0 ? Math.min(...prices) : undefined;

        // Calcular tickets disponíveis
        const available_tickets = activeTickets.reduce(
          (sum: number, t: any) => sum + (t.quantity_total - t.quantity_sold),
          0
        );

        return {
          ...event,
          // Fallbacks para campos obrigatórios
          slug: event.slug || event.id,
          starts_at: event.starts_at || event.event_date || new Date().toISOString(),
          ends_at: event.ends_at || event.starts_at || event.event_date || new Date().toISOString(),
          status: event.status || 'published',
          format: event.format || 'in_person',
          location_data: event.location_data || {},
          cover_image_url: event.cover_image_url || null,
          short_description: event.short_description || event.description || null,
          // Campos calculados
          tickets_count: tickets.length,
          min_price,
          available_tickets,
        };
      });

      // Filtrar apenas eventos publicados (se coluna existir)
      const publishedEvents = processedEvents.filter(
        (e) => !e.status || e.status === 'published'
      );

      setEvents(publishedEvents);
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // LOADING STATE
  // ================================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mb-3" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-96" />
          </div>

          {/* Grid Skeleton */}
          <EventGrid>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </EventGrid>
        </div>
      </main>
    );
  }

  // ================================================================
  // ERROR STATE
  // ================================================================
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Eventos
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button onClick={fetchEvents} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // EMPTY STATE
  // ================================================================
  if (events.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Próximos Eventos
            </h1>
            <p className="text-xl text-gray-600">
              Fique por dentro dos melhores eventos do Brasil
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Nenhum Evento Disponível
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Não há eventos publicados no momento. Volte em breve para descobrir novos eventos incríveis!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary px-6 py-3"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // CONTENT
  // ================================================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Próximos Eventos
          </h1>
          <p className="text-xl text-gray-600">
            {events.length} {events.length === 1 ? 'evento' : 'eventos'} disponíveis
          </p>
        </div>

        {/* Events Grid */}
        <EventGrid>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventGrid>
      </div>
    </main>
  );
}
