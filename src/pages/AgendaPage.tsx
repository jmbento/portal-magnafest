/**
 * =====================================================================
 * AgendaPage - Timeline de Eventos
 * =====================================================================
 * Visualização cronológica dos próximos eventos
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Radio, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/events';

// =====================================================================
// HELPERS
// =====================================================================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Resetar horas para comparação
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'HOJE';
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'AMANHÃ';
  } else {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    }).format(date).toUpperCase();
  }
};

const formatTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

const isHappeningNow = (startsAt: string, endsAt: string): boolean => {
  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  return now >= start && now <= end;
};

// Agrupar eventos por dia
const groupByDay = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((groups, event) => {
    const dayKey = formatDate(event.starts_at);
    if (!groups[dayKey]) {
      groups[dayKey] = [];
    }
    groups[dayKey].push(event);
    return groups;
  }, {} as Record<string, Event[]>);
};

// =====================================================================
// COMPONENT
// =====================================================================

export default function AgendaPage() {
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
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(20);

      if (fetchError) throw fetchError;

      // Mapear dados com fallbacks para garantir compatibilidade
      const mappedEvents = (data || []).map((event: any) => ({
        ...event,
        // Fallbacks para campos obrigatórios
        slug: event.slug || event.id,
        starts_at: event.starts_at || event.event_date || new Date().toISOString(),
        ends_at: event.ends_at || event.starts_at || event.event_date || new Date().toISOString(),
        status: event.status || 'published',
        format: event.format || 'in_person',
        location_data: event.location_data || {},
        cover_image_url: event.cover_image_url || null,
      }));

      // Filtrar apenas eventos publicados
      const publishedEvents = mappedEvents.filter(
        (e: any) => !e.status || e.status === 'published'
      );

      setEvents(publishedEvents);
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err);
      setError(err.message || 'Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================
  const groupedEvents = groupByDay(events);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-zinc-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Calendar className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Agenda
            </h1>
          </div>
          <p className="text-xl text-primary-100 text-center">
            Acontecendo agora e nos próximos dias
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading */}
        {loading && (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-32 mb-4" />
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Agenda
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum evento próximo
            </h3>
            <p className="text-gray-600">
              Não há eventos agendados para as próximas semanas
            </p>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && events.length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedEvents).map(([day, dayEvents]) => (
              <div key={day}>
                {/* Day Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {day}
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Events List */}
                <div className="relative pl-8 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

                  {dayEvents.map((event) => {
                    const liveNow = isHappeningNow(event.starts_at, event.ends_at);

                    return (
                      <div key={event.id} className="relative">
                        {/* Timeline Dot */}
                        <div
                          className={`absolute left-[-1.75rem] top-2 w-4 h-4 rounded-full border-4 ${
                            liveNow
                              ? 'bg-red-500 border-red-200 animate-pulse'
                              : 'bg-white border-primary-300'
                          }`}
                        />

                        {/* Event Card */}
                        <Link
                          to={`/eventos/${event.slug}`}
                          className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {/* Live Badge */}
                          {liveNow && (
                            <div className="mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                <Radio className="w-3 h-3" />
                                AO VIVO
                              </span>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {/* Time */}
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(event.starts_at)}
                              </div>

                              {/* Title */}
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {event.title}
                              </h3>

                              {/* Location */}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {event.format === 'online'
                                    ? 'Online'
                                    : event.location_data.city
                                    ? `${event.location_data.city}, ${event.location_data.state || ''}`
                                    : 'Local a confirmar'}
                                </span>
                              </div>
                            </div>

                            {/* Cover Image Small */}
                            {event.cover_image_url && (
                              <div className="flex-shrink-0">
                                <img
                                  src={event.cover_image_url}
                                  alt={event.title}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-800 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Organize seu evento aqui
          </h3>
          <p className="text-slate-300 mb-6">
            Publique seu evento e apareça na agenda vista por milhares de pessoas.
          </p>
          <Link to="/create" className="btn-primary inline-block">
            Criar Evento
          </Link>
        </div>
      </div>
    </main>
  );
}
