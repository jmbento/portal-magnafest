/**
 * =====================================================================
 * GUIA ATLAS PRÓ - Tipos de Dados do Vendor
 * =====================================================================
 * Tipagem TypeScript para a tabela vendors
 */

// =====================================================================
// TIPOS DE CONTATO
// =====================================================================

export interface VendorContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram_url?: string;
}

// =====================================================================
// TIPOS DE ENDEREÇO
// =====================================================================

export interface VendorCoordinates {
  lat: number;
  lng: number;
}

export interface VendorAddressInfo {
  city?: string;
  state?: string;
  neighborhood?: string;
  zip_code?: string;
  coordinates?: VendorCoordinates;
}

// =====================================================================
// TIPOS DE SUBSCRIPTION
// =====================================================================

export type SubscriptionTier = 'free' | 'featured' | 'partner';

// =====================================================================
// TIPO PRINCIPAL VENDOR
// =====================================================================

export interface Vendor {
  id: string;
  owner_id: string | null;  // null = unclaimed listing
  name: string;
  slug: string;
  category: string;
  description: string | null;
  contact_info: VendorContactInfo;
  address_info: VendorAddressInfo;
  is_claimed: boolean;
  subscription_tier: SubscriptionTier;
  created_at: string;  // ISO timestamp
  updated_at: string;  // ISO timestamp
}

// =====================================================================
// TIPO PARA INSERÇÃO (sem campos auto-gerados)
// =====================================================================

export interface VendorInsert {
  owner_id?: string | null;
  name: string;
  slug: string;
  category: string;
  description?: string;
  contact_info?: VendorContactInfo;
  address_info?: VendorAddressInfo;
  subscription_tier?: SubscriptionTier;
}

// =====================================================================
// TIPO PARA ATUALIZAÇÃO (todos campos opcionais)
// =====================================================================

export interface VendorUpdate {
  owner_id?: string | null;
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  contact_info?: VendorContactInfo;
  address_info?: VendorAddressInfo;
  subscription_tier?: SubscriptionTier;
}

// =====================================================================
// TIPO PARA RESULTADO DE BUSCA
// =====================================================================

export interface VendorSearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  contact_info: VendorContactInfo;
  address_info: VendorAddressInfo;
  is_claimed: boolean;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

// =====================================================================
// TIPO PARA PARÂMETROS DE BUSCA
// =====================================================================

export interface VendorSearchParams {
  search_term?: string;
  category_filter?: string;
  city_filter?: string;
  limit_count?: number;
}

// =====================================================================
// TIPO PARA CATEGORIAS (pode ser expandido)
// =====================================================================

export type VendorCategory = 
  | 'DJ'
  | 'Buffet'
  | 'Espaço'
  | 'Fotografia'
  | 'Decoração'
  | 'Som e Iluminação'
  | 'Segurança'
  | 'Transporte'
  | 'Cerimonial'
  | 'Outras';

// =====================================================================
// GUARDS (TYPE GUARDS)
// =====================================================================

export function isValidSubscriptionTier(tier: string): tier is SubscriptionTier {
  return ['free', 'featured', 'partner'].includes(tier);
}

export function isClaimedVendor(vendor: Vendor): boolean {
  return vendor.owner_id !== null && vendor.is_claimed;
}

export function isUnclaimedVendor(vendor: Vendor): boolean {
  return vendor.owner_id === null && !vendor.is_claimed;
}

// =====================================================================
// HELPERS
// =====================================================================

export function getVendorDisplayName(vendor: Vendor): string {
  return vendor.name;
}

export function getVendorUrl(vendor: Vendor): string {
  return `/guia/${vendor.slug}`;
}

export function getVendorLocation(vendor: Vendor): string {
  const { city, state } = vendor.address_info;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return 'Localização não informada';
}

export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Gratuito',
    featured: 'Destaque',
    partner: 'Parceiro',
  };
  return names[tier];
}

export function getTierPriority(tier: SubscriptionTier): number {
  const priorities: Record<SubscriptionTier, number> = {
    partner: 1,
    featured: 2,
    free: 3,
  };
  return priorities[tier];
}
