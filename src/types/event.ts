/**
 * =====================================================================
 * GUIA ATLAS PRÓ - Tipos de Eventos Complexos
 * =====================================================================
 * TypeScript types para o schema de eventos
 */

// =====================================================================
// ENUMS
// =====================================================================

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventFormat = 'online' | 'in_person' | 'hybrid';
export type Currency = 'BRL' | 'USD' | 'EUR';

// =====================================================================
// LOCATION DATA (JSONB)
// =====================================================================

export interface EventLocationData {
  // Presencial
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Online
  streaming_url?: string;
  meeting_link?: string;
  platform?: string; // Ex: "Zoom", "Google Meet", "YouTube"
}

// =====================================================================
// METADATA (JSONB)
// =====================================================================

export interface EventMetadata {
  // Requisitos
  dress_code?: string;
  age_rating?: string; // Ex: "18+", "Livre", "14+"
  
  // Programação
  lineup?: Array<{
    artist: string;
    time: string;
    stage?: string;
  }>;
  schedule?: Array<{
    time: string;
    activity: string;
    speaker?: string;
  }>;
  
  // Acessibilidade
  accessibility?: {
    wheelchair_accessible: boolean;
    sign_language: boolean;
    audio_description: boolean;
    parking: boolean;
  };
  
  // Outros
  capacity?: number;
  sponsors?: string[];
  hashtags?: string[];
  [key: string]: any; // Permite campos customizados
}

// =====================================================================
// TABELAS
// =====================================================================

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Event {
  id: string;
  slug: string;
  organizer_id: string;
  title: string;
  short_description: string | null;
  full_content: string | null;
  cover_image_url: string | null;
  starts_at: string; // ISO timestamp
  ends_at: string; // ISO timestamp
  format: EventFormat;
  status: EventStatus;
  location_data: EventLocationData;
  metadata: EventMetadata;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number; // Em decimal
  currency: Currency;
  quantity_total: number;
  quantity_sold: number;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventsCategoriesPivot {
  event_id: string;
  category_id: string;
  created_at: string;
}

// =====================================================================
// TIPOS PARA INSERT
// =====================================================================

export interface EventInsert {
  slug: string;
  organizer_id: string;
  title: string;
  short_description?: string;
  full_content?: string;
  cover_image_url?: string;
  starts_at: string;
  ends_at: string;
  format: EventFormat;
  status?: EventStatus;
  location_data?: EventLocationData;
  metadata?: EventMetadata;
}

export interface TicketInsert {
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency?: Currency;
  quantity_total: number;
  quantity_sold?: number;
  sale_starts_at?: string;
  sale_ends_at?: string;
  active?: boolean;
  sort_order?: number;
}

// =====================================================================
// TIPOS PARA UPDATE
// =====================================================================

export interface EventUpdate {
  slug?: string;
  title?: string;
  short_description?: string;
  full_content?: string;
  cover_image_url?: string;
  starts_at?: string;
  ends_at?: string;
  format?: EventFormat;
  status?: EventStatus;
  location_data?: EventLocationData;
  metadata?: EventMetadata;
}

export interface TicketUpdate {
  name?: string;
  description?: string;
  price?: number;
  currency?: Currency;
  quantity_total?: number;
  quantity_sold?: number;
  sale_starts_at?: string;
  sale_ends_at?: string;
  active?: boolean;
  sort_order?: number;
}

// =====================================================================
// TIPOS PARA QUERIES (com joins)
// =====================================================================

export interface EventWithCategories extends Event {
  categories?: EventCategory[];
}

export interface EventWithTickets extends Event {
  tickets?: Ticket[];
}

export interface EventWithRelations extends Event {
  categories?: EventCategory[];
  tickets?: Ticket[];
  organizer?: {
    id: string;
    email: string;
    // Adicionar campos do profile se existir
  };
}

export interface TicketWithEvent extends Ticket {
  event?: Event;
}

// =====================================================================
// HELPERS E TYPE GUARDS
// =====================================================================

export function isEventPublished(event: Event): boolean {
  return event.status === 'published';
}

export function isEventDraft(event: Event): boolean {
  return event.status === 'draft';
}

export function isEventUpcoming(event: Event): boolean {
  return new Date(event.starts_at) > new Date();
}

export function isEventOngoing(event: Event): boolean {
  const now = new Date();
  return new Date(event.starts_at) <= now && new Date(event.ends_at) >= now;
}

export function isEventPast(event: Event): boolean {
  return new Date(event.ends_at) < new Date();
}

export function isTicketAvailable(ticket: Ticket): boolean {
  if (!ticket.active) return false;
  
  const now = new Date();
  
  // Verifica data de início
  if (ticket.sale_starts_at && new Date(ticket.sale_starts_at) > now) {
    return false;
  }
  
  // Verifica data de fim
  if (ticket.sale_ends_at && new Date(ticket.sale_ends_at) < now) {
    return false;
  }
  
  // Verifica estoque
  return ticket.quantity_sold < ticket.quantity_total;
}

export function getTicketAvailableQuantity(ticket: Ticket): number {
  return Math.max(0, ticket.quantity_total - ticket.quantity_sold);
}

export function formatEventDate(event: Event): string {
  const start = new Date(event.starts_at);
  const end = new Date(event.ends_at);
  
  const sameDay = start.toDateString() === end.toDateString();
  
  if (sameDay) {
    return `${start.toLocaleDateString('pt-BR')} • ${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
}

export function formatTicketPrice(ticket: Ticket): string {
  const formatters: Record<Currency, Intl.NumberFormat> = {
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
  };
  
  return formatters[ticket.currency].format(ticket.price);
}

export function getEventUrl(event: Event): string {
  return `/eventos/${event.slug}`;
}

export function getEventFormatLabel(format: EventFormat): string {
  const labels: Record<EventFormat, string> = {
    online: 'Online',
    in_person: 'Presencial',
    hybrid: 'Híbrido',
  };
  return labels[format];
}

export function getEventStatusLabel(status: EventStatus): string {
  const labels: Record<EventStatus, string> = {
    draft: 'Rascunho',
    published: 'Publicado',
    cancelled: 'Cancelado',
    completed: 'Concluído',
  };
  return labels[status];
}

export function getEventStatusColor(status: EventStatus): string {
  const colors: Record<EventStatus, string> = {
    draft: 'gray',
    published: 'green',
    cancelled: 'red',
    completed: 'blue',
  };
  return colors[status];
}
