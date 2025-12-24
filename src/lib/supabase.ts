/**
 * =====================================================================
 * CANAPEV - Cliente Supabase
 * =====================================================================
 * Cliente singleton do Supabase configurado para Vite + TypeScript
 */

import { createClient } from '@supabase/supabase-js';

// =====================================================================
// CONFIGURAÇÃO E VALIDAÇÃO
// =====================================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validação das variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = `
    ❌ ERRO DE CONFIGURAÇÃO DO SUPABASE ❌
    
    As variáveis de ambiente não foram encontradas!
    
    Certifique-se de criar o arquivo .env na raiz do projeto com:
    
    VITE_SUPABASE_URL=https://seu-projeto.supabase.co
    VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
    
    Veja o arquivo .env.example para referência.
  `;
  
  console.error(errorMsg);
  throw new Error('Configuração do Supabase incompleta. Verifique o arquivo .env');
}

// =====================================================================
// CLIENTE SUPABASE
// =====================================================================

/**
 * Instância do cliente Supabase
 * - Autenticação persistente (localStorage)
 * - Auto-refresh de tokens
 * - Row Level Security (RLS) habilitado
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // Manter sessão após refresh
    autoRefreshToken: true,     // Renovar token automaticamente
    detectSessionInUrl: true,   // Detectar sessão em callbacks OAuth
  },
});

// Export default para import direto
export default supabase;

// =====================================================================
// HELPERS DE AUTENTICAÇÃO
// =====================================================================

/**
 * Obter usuário autenticado atual
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Obter perfil completo do usuário atual
 */
export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  return data;
};

// =====================================================================
// HELPERS DE STORAGE
// =====================================================================

/**
 * Upload de arquivo para Supabase Storage
 */
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

/**
 * Obter URL pública de um arquivo
 */
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Deletar arquivo do storage
 */
export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// =====================================================================
// HELPERS DE BUSCA
// =====================================================================

/**
 * Buscar anúncios por raio geográfico
 */
export const searchListingsByRadius = async (
  lat: number,
  long: number,
  radiusKm: number = 50
) => {
  const { data, error } = await supabase
    .rpc('search_listings_by_radius', {
      user_lat: lat,
      user_long: long,
      radius_km: radiusKm,
    });
  
  if (error) throw error;
  return data;
};

/**
 * Busca full-text em anúncios
 */
export const searchListingsFulltext = async (
  query: string,
  limitCount: number = 20
) => {
  const { data, error } = await supabase
    .rpc('search_listings_fulltext', {
      search_query: query,
      limit_count: limitCount,
    });
  
  if (error) throw error;
  return data;
};

// =====================================================================
// HELPERS DE CATEGORIAS
// =====================================================================

/**
 * Listar categorias raiz (sem parent_id)
 */
export const getRootCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('sort_order');
  
  if (error) throw error;
  return data;
};

/**
 * Listar subcategorias de uma categoria
 */
export const getSubcategories = async (parentId: string) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .order('sort_order');
  
  if (error) throw error;
  return data;
};

// =====================================================================
// HELPERS DE LISTINGS
// =====================================================================

/**
 * Listar anúncios de um fornecedor
 */
export const getListingsByOwner = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*, media(*), categories(*)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Obter detalhes de um anúncio
 */
export const getListingById = async (id: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*, media(*), categories(*), profiles(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Criar novo anúncio
 */
export const createListing = async (listingData: {
  title: string;
  description: string;
  listing_type: string;
  category_id: string;
  price_min?: number;
  price_max?: number;
  price_unit?: string;
  metadata?: Record<string, any>;
  location_data?: Record<string, any>;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listingData,
      owner_id: user.id,
      status: 'draft',
      slug: listingData.title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Adicionar mídia a um anúncio
 */
export const addListingMedia = async (
  listingId: string,
  url: string,
  mediaType: 'image' | 'video' = 'image',
  sortOrder: number = 0
) => {
  const { data, error } = await supabase
    .from('media')
    .insert({
      listing_id: listingId,
      url,
      media_type: mediaType,
      sort_order: sortOrder
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// =====================================================================
// HELPERS DE EVENTS
// =====================================================================

/**
 * Criar novo evento
 */
export const createEvent = async (eventData: {
  title: string;
  description?: string;
  event_date: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obter próximos eventos
 */
export const getUpcomingEvents = async (limitCount: number = 10) => {
  const { data, error } = await supabase
    .rpc('get_upcoming_events', { limit_count: limitCount });

  if (error) throw error;
  return data;
};

/**
 * Obter eventos do usuário atual
 */
export const getMyEvents = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .rpc('get_user_events', { target_user_id: user.id });

  if (error) throw error;
  return data;
};

// =====================================================================
// REGISTRATIONS (INSCRIÇÕES EM EVENTOS)
// =====================================================================

/**
 * Registrar usuário em um evento
 */
export const registerForEvent = async (eventId: string, ticketId?: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Você precisa estar logado para se inscrever');
  }

  const { data, error } = await supabase
    .from('registrations')
    .insert({
      event_id: eventId,
      user_id: user.id,
      ticket_id: ticketId || null,
      status: 'confirmed',
    })
    .select()
    .single();

  if (error) {
    // Erro de duplicata
    if (error.code === '23505') {
      throw new Error('Você já está inscrito neste evento');
    }
    throw error;
  }

  return data;
};

/**
 * Verificar se usuário está inscrito em um evento
 */
export const isUserRegistered = async (eventId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabase
    .rpc('is_user_registered', { target_event_id: eventId });

  return data || false;
};

/**
 * Cancelar inscrição em evento
 */
export const cancelRegistration = async (eventId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { error } = await supabase
    .from('registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw error;
};

/**
 * Obter minhas inscrições
 */
export const getMyRegistrations = async () => {
  const { data, error } = await supabase
    .rpc('get_my_registrations');

  if (error) throw error;
  return data;
};

/**
 * Contar inscrições de um evento
 */
export const getEventRegistrationsCount = async (eventId: string): Promise<number> => {
  const { data, error } = await supabase
    .rpc('get_event_registrations_count', { target_event_id: eventId });

  if (error) throw error;
  return data || 0;
};
