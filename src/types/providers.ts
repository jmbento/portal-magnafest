/**
 * =====================================================================
 * PROVIDERS - Tipagem TypeScript
 * =====================================================================
 * Tipos para fornecedores com suporte a enriquecimento automático
 */

// =====================================================================
// ENUMS
// =====================================================================

export type EnrichmentStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// =====================================================================
// INTERFACE PRINCIPAL: Provider
// =====================================================================

export interface Provider {
  // Identificação
  id: string;
  
  // Dados Principais
  name: string;
  slug: string | null;
  category: string | null;
  
  // Localização (OBRIGATÓRIO)
  city: string;
  state: string; // UF
  full_address: string | null;
  
  // Dados de Contato (NULLABLE - Enriquecidos)
  website: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  
  // Descrição
  description: string | null;
  logo_url: string | null;
  
  // Metadados de Automação
  source_url: string | null;
  last_enriched_at: string | null; // ISO timestamp
  enrichment_status: EnrichmentStatus;
  enrichment_attempts: number;
  
  // Verificação
  is_verified: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// =====================================================================
// TIPOS PARA OPERAÇÕES
// =====================================================================

export interface ProviderInsert {
  name: string;
  city: string;
  state: string; // UF
  category?: string;
  slug?: string;
  full_address?: string;
  website?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  description?: string;
  logo_url?: string;
  source_url?: string;
  enrichment_status?: EnrichmentStatus;
}

export interface ProviderUpdate {
  name?: string;
  slug?: string;
  category?: string;
  city?: string;
  state?: string;
  full_address?: string;
  website?: string;
  instagram_url?: string;
  linkedin_url?: string;
  whatsapp?: string;
  email?: string;
  phone?: string;
  description?: string;
  logo_url?: string;
  enrichment_status?: EnrichmentStatus;
  last_enriched_at?: string;
  enrichment_attempts?: number;
  is_verified?: boolean;
}

// =====================================================================
// INTERFACES DE BUSCA
// =====================================================================

export interface ProviderSearchParams {
  state?: string;
  city?: string;
  category?: string;
  search_term?: string;
  verified_only?: boolean;
}

export interface ProviderSearchResult {
  id: string;
  name: string;
  slug: string | null;
  category: string | null;
  city: string;
  state: string;
  website: string | null;
  enrichment_status: EnrichmentStatus;
  is_verified: boolean;
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

/**
 * Verificar se provider está completamente preenchido
 */
export const isFullyEnriched = (provider: Provider): boolean => {
  return !!(
    provider.website &&
    (provider.instagram_url || provider.linkedin_url) &&
    (provider.whatsapp || provider.email || provider.phone) &&
    provider.description
  );
};

/**
 * Verificar se provider precisa enriquecimento
 */
export const needsEnrichment = (provider: Provider): boolean => {
  return provider.enrichment_status === 'pending' || 
         provider.enrichment_status === 'failed';
};

/**
 * Calcular completude do perfil (0-100%)
 */
export const calculateCompleteness = (provider: Provider): number => {
  const fields = [
    provider.website,
    provider.instagram_url,
    provider.linkedin_url,
    provider.whatsapp,
    provider.email,
    provider.phone,
    provider.description,
    provider.logo_url,
    provider.full_address,
    provider.category,
  ];
  
  const filledFields = fields.filter(field => field !== null && field !== '').length;
  return Math.round((filledFields / fields.length) * 100);
};

/**
 * Obter cor de status do enrichment
 */
export const getEnrichmentStatusColor = (status: EnrichmentStatus): string => {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-100';
    case 'in_progress': return 'text-blue-600 bg-blue-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'failed': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Obter label de status do enrichment
 */
export const getEnrichmentStatusLabel = (status: EnrichmentStatus): string => {
  switch (status) {
    case 'completed': return 'Completo';
    case 'in_progress': return 'Em Progresso';
    case 'pending': return 'Pendente';
    case 'failed': return 'Falhou';
    default: return 'Desconhecido';
  }
};

/**
 * Verificar se pode tentar enriquecer novamente
 */
export const canRetryEnrichment = (provider: Provider): boolean => {
  if (provider.enrichment_status === 'completed') return false;
  if (provider.enrichment_attempts >= 3) return false; // Máximo 3 tentativas
  
  // Se nunca tentou
  if (!provider.last_enriched_at) return true;
  
  // Se última tentativa foi há mais de 7 dias
  const lastAttempt = new Date(provider.last_enriched_at);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return lastAttempt < sevenDaysAgo;
};

/**
 * Obter URL do perfil
 */
export const getProviderUrl = (slug: string | null): string => {
  if (!slug) return '#';
  return `/fornecedores/${slug}`;
};

/**
 * Gerar slug a partir do nome
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Validar UF (estado)
 */
const VALID_UF = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const isValidUF = (uf: string): boolean => {
  return VALID_UF.includes(uf.toUpperCase());
};

/**
 * Obter nome completo do estado
 */
const UF_NAMES: Record<string, string> = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
  'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
  'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
  'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins',
};

export const getStateName = (uf: string): string => {
  return UF_NAMES[uf.toUpperCase()] || uf;
};

/**
 * Formatar localização completa
 */
export const formatLocation = (provider: Provider): string => {
  return `${provider.city}, ${provider.state}`;
};

/**
 * Verificar se tem pelo menos um meio de contato
 */
export const hasContactInfo = (provider: Provider): boolean => {
  return !!(
    provider.website ||
    provider.instagram_url ||
    provider.whatsapp ||
    provider.email ||
    provider.phone
  );
};

/**
 * Obter prioridade de enriquecimento
 */
export const getEnrichmentPriority = (provider: Provider): 'high' | 'medium' | 'low' => {
  if (provider.enrichment_status === 'failed' && provider.enrichment_attempts < 2) {
    return 'high';
  }
  
  if (provider.enrichment_status === 'pending' && !provider.last_enriched_at) {
    return 'high';
  }
  
  if (provider.enrichment_status === 'in_progress') {
    return 'medium';
  }
  
  return 'low';
};

/**
 * Categorias disponíveis (pode vir de uma API futuramente)
 */
export const PROVIDER_CATEGORIES = [
  'Produtora',
  'Buffet',
  'Segurança',
  'Cenografia',
  'Iluminação',
  'Som',
  'Fotografia',
  'Filmagem',
  'Decoração',
  'Locação',
  'Transporte',
  'Limpeza',
  'Recepção',
  'Outro',
] as const;

export type ProviderCategory = typeof PROVIDER_CATEGORIES[number];
