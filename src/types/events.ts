/**
 * =====================================================================
 * EVENTOS - Tipagem TypeScript
 * =====================================================================
 * Tipos sincronizados com o schema SQL do Supabase
 */

// =====================================================================
// ENUMS (sincronizados com PostgreSQL ENUMs)
// =====================================================================

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventFormat = 'online' | 'in_person' | 'hybrid';
export type Currency = 'BRL' | 'USD' | 'EUR';

// =====================================================================
// JSONB STRUCTURES
// =====================================================================

/**
 * Estrutura do campo location_data (JSONB)
 */
export interface EventLocationData {
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  url?: string; // URL para eventos online
  streaming_url?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Estrutura do campo metadata (JSONB)
 * Flexível para campos customizados
 */
export type EventMetadata = Record<string, any>;

// =====================================================================
// INTERFACE PRINCIPAL: Event
// =====================================================================

export interface Event {
  // Identificação
  id: string;
  slug: string;
  
  // Organizador
  organizer_id: string;
  
  // Conteúdo
  title: string;
  short_description: string | null;
  full_content: string | null;
  cover_image_url: string | null;
  
  // Link externo para ingressos (Sympla, Eventbrite, etc)
  external_ticket_url: string | null;
  
  // Data e hora
  starts_at: string; // ISO 8601 timestamp
  ends_at: string; // ISO 8601 timestamp
  
  // Formato e status
  format: EventFormat;
  status: EventStatus;
  
  // JSONB fields
  location_data: EventLocationData;
  metadata: EventMetadata;
  
  // Estatísticas
  views_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Campos calculados/joins opcionais (retornados pelo Supabase)
  tickets_count?: number;
  min_price?: number;
  max_price?: number;
  available_tickets?: number;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  organizer?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

// =====================================================================
// INTERFACE: Ticket
// =====================================================================

export interface Ticket {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
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

// =====================================================================
// TIPOS PARA OPERAÇÕES
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
  format?: EventFormat;
  status?: EventStatus;
  location_data?: EventLocationData;
  metadata?: EventMetadata;
}

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
