import { createClient } from '@supabase/supabase-js';

// Verificar se as env vars existem
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log para debug (apenas em dev)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase URL:', supabaseUrl ? '✅ OK' : '❌ MISSING');
  console.log('🔍 Supabase Key:', supabaseAnonKey ? '✅ OK' : '❌ MISSING');
}

// Criar client com fallback para evitar erro fatal
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Exportar função de verificação
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};

// =====================================================================
// AUTH FUNCTIONS
// =====================================================================

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// =====================================================================
// STORAGE FUNCTIONS
// =====================================================================

export const uploadFile = async (bucket: string, filePath: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, filePath: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// =====================================================================
// CATEGORY FUNCTIONS
// =====================================================================

export const getRootCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .is('parent_id', null)
    .order('name');

  if (error) throw error;
  return data;
};

// =====================================================================
// LISTING FUNCTIONS
// =====================================================================

interface CreateListingData {
  title: string;
  description: string;
  listing_type: string;
  category_id: string;
  price_min: number;
  price_max: number;
  price_unit: string;
  metadata: any;
  location_data: any;
}

export const createListing = async (listingData: CreateListingData) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listingData,
      user_id: user.id,
      status: 'draft'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addListingMedia = async (
  listingId: string,
  url: string,
  type: 'image' | 'video',
  displayOrder: number
) => {
  const { data, error } = await supabase
    .from('listing_media')
    .insert({
      listing_id: listingId,
      url,
      type,
      display_order: displayOrder
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getListingsByOwner = async (userId: string) => {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// =====================================================================
// EVENT FUNCTIONS
// =====================================================================

export const registerForEvent = async (eventId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: user.id,
      status: 'confirmed'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const isUserRegistered = async (eventId: string) => {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
