/**
 * =====================================================================
 * EVENTO - Página de Detalhes
 * =====================================================================
 * Exibe informações completas de um evento específico
 */

import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Ticket, 
  User,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types/events';
import EventActionButton from '../components/events/EventActionButton';

// =====================================================================
// COMPONENT
// =====================================================================

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchEvent = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          tickets (
            id,
            name,
            price,
            currency,
            quantity_total,
            quantity_sold,
            active
          )
        `)
        .eq('slug', slug)
        .single();

      if (eventError) {
        if (eventError.code === 'PGRST116') {
          setNotFound(true);
        } else {
          throw eventError;
        }
        return;
      }

      // Calcular campos derivados
      const tickets = data.tickets || [];
      const activeTickets = tickets.filter((t: any) => t.active);
      
      const prices = activeTickets.map((t: any) => t.price).filter((p: any) => p > 0);
      const min_price = prices.length > 0 ? Math.min(...prices) : undefined;
      
      const available_tickets = activeTickets.reduce(
        (sum: number, t: any) => sum + (t.quantity_total - t.quantity_sold),
        0
      );

      setEvent({
        ...data,
        tickets_count: tickets.length,
        min_price,
        available_tickets,
      });
    } catch (err: any) {
      console.error('Erro ao buscar evento:', err);
      setError(err.message || 'Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // FORMATTERS
  // ================================================================
  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // ================================================================
  // NOT FOUND
  // ================================================================
  if (notFound) {
    return <Navigate to="/eventos" replace />;
  }

  // ================================================================
  // LOADING
  // ================================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Hero Skeleton */}
        <div className="w-full aspect-video bg-gray-200 animate-pulse" />

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // ERROR
  // ================================================================
  if (error || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Evento
            </h2>
            <p className="text-red-700 mb-6">{error || 'Evento não encontrado'}</p>
            <button onClick={fetchEvent} className="btn-primary">
              Tentar Novamente
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // STATUS & FORMAT CONFIG
  // ================================================================
  const statusConfig = {
    draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-700' },
    published: { label: 'Publicado', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
    completed: { label: 'Concluído', className: 'bg-blue-100 text-blue-700' },
  };

  const formatConfig = {
    online: { label: 'Online', icon: Video, className: 'bg-purple-100 text-purple-700' },
    in_person: { label: 'Presencial', icon: MapPin, className: 'bg-blue-100 text-blue-700' },
    hybrid: { label: 'Híbrido', icon: ExternalLink, className: 'bg-orange-100 text-orange-700' },
  };

  const currentStatus = statusConfig[event.status];
  const currentFormat = formatConfig[event.format];
  const FormatIcon = currentFormat.icon;

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Image */}
      <div className="w-full aspect-video bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-32 h-32 text-white opacity-20" />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-6 right-6 flex gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStatus.className}`}>
            {currentStatus.label}
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${currentFormat.className}`}>
            <FormatIcon className="w-4 h-4" />
            {currentFormat.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              {event.short_description && (
                <p className="text-xl text-gray-600">
                  {event.short_description}
                </p>
              )}
            </div>

            {/* About */}
            {event.full_content && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Sobre o Evento
                </h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {event.full_content}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 space-y-6">
              {/* Date & Time */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Data e Horário</h3>
                </div>
                <p className="text-gray-700 font-medium capitalize">
                  {formatFullDate(event.starts_at)}
                </p>
              </div>

              <div className="border-t border-gray-100" />

              {/* Location */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <FormatIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Localização</h3>
                </div>
                {event.format === 'online' ? (
                  <p className="text-gray-700">
                    Link enviado após confirmação
                  </p>
                ) : (
                  <p className="text-gray-700">
                    {event.location_data.address && <>{event.location_data.address}<br /></>}
                    {event.location_data.city && event.location_data.state && (
                      <>{event.location_data.city}, {event.location_data.state}</>
                    )}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100" />

              {/* Price */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Ingressos</h3>
                </div>
                {event.min_price ? (
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(event.min_price)}
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-green-600">
                    Entrada Gratuita
                  </p>
                )}
                {event.available_tickets !== undefined && (
                  <p className="text-sm text-gray-600 mt-2">
                    {event.available_tickets} ingressos disponíveis
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <EventActionButton
                event={event}
                onSuccess={fetchEvent}
              />

              {/* Organizer */}
              {event.organizer && (
                <>
                  <div className="border-t border-gray-100" />
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Organizado por:</span>
                    </div>
                    <p className="text-gray-700">{event.organizer.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
