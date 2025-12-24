/**
 * =====================================================================
 * PROFESSIONALS & REVIEWS - Tipagem TypeScript
 * =====================================================================
 * Tipos sincronizados com schema SQL do Supabase
 */

// =====================================================================
// JSONB STRUCTURES
// =====================================================================

/**
 * Informações de contato do profissional (JSONB)
 */
export interface ProfessionalContactInfo {
  whatsapp?: string;
  instagram?: string;
  website?: string;
  email?: string;
  phone?: string;
}

/**
 * Localização do profissional (JSONB)
 */
export interface ProfessionalLocation {
  city?: string;
  state?: string;
  address?: string;
  zip_code?: string;
  google_maps_link?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// =====================================================================
// INTERFACE PRINCIPAL: Professional
// =====================================================================

export interface Professional {
  // Identificação
  id: string;
  user_id: string;
  
  // Identificação Pública
  name: string;
  slug: string;
  niche: string;
  bio: string | null;
  
  // JSONB fields
  contact_info: ProfessionalContactInfo;
  location: ProfessionalLocation;
  
  // Trust Signals
  is_verified: boolean;
  address_verified: boolean;
  phone_verified: boolean;
  
  // Estatísticas
  total_reviews: number;
  average_rating: number; // 0.00 a 5.00
  
  // Media
  avatar_url: string | null;
  banner_url: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// =====================================================================
// INTERFACE: Review
// =====================================================================

export interface Review {
  id: string;
  professional_id: string;
  author_id: string;
  
  // Avaliação
  rating: number; // 1 a 5
  comment: string | null;
  
  // Contexto
  service_date: string | null; // ISO date
  verified_hire: boolean;
  
  // Moderação
  is_approved: boolean;
  flagged: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Campos relacionais opcionais
  author?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  professional?: {
    id: string;
    name: string;
    slug: string;
  };
}

// =====================================================================
// TIPOS PARA OPERAÇÕES
// =====================================================================

export interface ProfessionalInsert {
  user_id: string;
  name: string;
  slug: string;
  niche: string;
  bio?: string;
  contact_info?: ProfessionalContactInfo;
  location?: ProfessionalLocation;
  avatar_url?: string;
  banner_url?: string;
}

export interface ProfessionalUpdate {
  name?: string;
  slug?: string;
  niche?: string;
  bio?: string;
  contact_info?: ProfessionalContactInfo;
  location?: ProfessionalLocation;
  avatar_url?: string;
  banner_url?: string;
}

export interface ReviewInsert {
  professional_id: string;
  author_id: string;
  rating: number; // 1-5
  comment?: string;
  service_date?: string;
}

export interface ReviewUpdate {
  rating?: number;
  comment?: string;
  service_date?: string;
}

// =====================================================================
// INTERFACES DE BUSCA
// =====================================================================

export interface ProfessionalSearchParams {
  niche?: string;
  city?: string;
  min_rating?: number;
  verified_only?: boolean;
}

export interface ProfessionalSearchResult {
  id: string;
  name: string;
  slug: string;
  niche: string;
  city: string | null;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
}

// =====================================================================
// HELPER FUNCTIONS / TYPE GUARDS
// =====================================================================

/**
 * Verificar se profissional é verificado
 */
export const isVerifiedProfessional = (professional: Professional): boolean => {
  return professional.is_verified;
};

/**
 * Verificar se profissional tem todas as verificações
 */
export const isFullyVerified = (professional: Professional): boolean => {
  return professional.is_verified && 
         professional.address_verified && 
         professional.phone_verified;
};

/**
 * Verificar se review é válida
 */
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

/**
 * Obter badge de verificação
 */
export const getVerificationLevel = (professional: Professional): 'none' | 'basic' | 'full' => {
  if (isFullyVerified(professional)) return 'full';
  if (professional.is_verified) return 'basic';
  return 'none';
};

/**
 * Formatar rating com estrelas
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(2);
};

/**
 * Gerar slug a partir do nome
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
};

/**
 * Obter URL do perfil
 */
export const getProfessionalUrl = (slug: string): string => {
  return `/profissionais/${slug}`;
};

/**
 * Verificar se pode avaliar (não avaliou nos últimos 30 dias)
 */
export const canReview = (lastReviewDate: string | null): boolean => {
  if (!lastReviewDate) return true;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return new Date(lastReviewDate) < thirtyDaysAgo;
};

/**
 * Obter cor do badge de verificação
 */
export const getVerificationBadgeColor = (level: 'none' | 'basic' | 'full'): string => {
  switch (level) {
    case 'full': return 'text-green-600 bg-green-100';
    case 'basic': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Distribuição de estrelas (para exibir gráfico)
 */
export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export const calculateRatingDistribution = (reviews: Review[]): RatingDistribution => {
  const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating as keyof RatingDistribution]++;
    }
  });
  
  return distribution;
};
