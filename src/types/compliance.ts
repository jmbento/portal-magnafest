/**
 * =====================================================================
 * COMPLIANCE DOCS - Tipagem TypeScript
 * =====================================================================
 * Tipos para guia de documentação e licenças de eventos
 */

// =====================================================================
// ENUMS
// =====================================================================

export type ComplianceScope = 'national' | 'state' | 'municipal';

// =====================================================================
// INTERFACE PRINCIPAL: ComplianceDoc
// =====================================================================

export interface ComplianceDoc {
  // Identificação
  id: string;
  
  // Conteúdo
  title: string;
  description: string;
  issuing_body: string; // Órgão emissor
  official_url: string | null;
  
  // Abrangência
  scope: ComplianceScope;
  region_filter: string | null; // UF ou cidade específica
  
  // Tags
  tags: string[];
  
  // Criticidade
  is_mandatory: boolean;
  
  // Ordenação
  sort_order: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// =====================================================================
// TIPOS PARA OPERAÇÕES
// =====================================================================

export interface ComplianceDocInsert {
  title: string;
  description: string;
  issuing_body: string;
  scope: ComplianceScope;
  official_url?: string;
  region_filter?: string;
  tags?: string[];
  is_mandatory?: boolean;
  sort_order?: number;
}

export interface ComplianceDocUpdate {
  title?: string;
  description?: string;
  issuing_body?: string;
  official_url?: string;
  scope?: ComplianceScope;
  region_filter?: string;
  tags?: string[];
  is_mandatory?: boolean;
  sort_order?: number;
}

// =====================================================================
// INTERFACES DE BUSCA
// =====================================================================

export interface ComplianceSearchParams {
  tags?: string[];
  search_term?: string;
  scope?: ComplianceScope;
  region?: string;
}

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

/**
 * Obter cor do badge de abrangência
 */
export const getScopeColor = (scope: ComplianceScope): string => {
  switch (scope) {
    case 'national': return 'bg-blue-100 text-blue-700';
    case 'state': return 'bg-purple-100 text-purple-700';
    case 'municipal': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Obter label de abrangência
 */
export const getScopeLabel = (scope: ComplianceScope): string => {
  switch (scope) {
    case 'national': return 'Nacional';
    case 'state': return 'Estadual';
    case 'municipal': return 'Municipal';
    default: return scope;
  }
};

/**
 * Obter cor do badge de órgão emissor
 */
export const getIssuingBodyColor = (issuingBody: string): string => {
  const body = issuingBody.toLowerCase();
  
  if (body.includes('bombeiro')) return 'bg-red-100 text-red-700';
  if (body.includes('prefeitura')) return 'bg-blue-100 text-blue-700';
  if (body.includes('ecad')) return 'bg-purple-100 text-purple-700';
  if (body.includes('polícia')) return 'bg-yellow-100 text-yellow-700';
  if (body.includes('vigilância') || body.includes('sanitár')) return 'bg-green-100 text-green-700';
  if (body.includes('ambiental')) return 'bg-teal-100 text-teal-700';
  
  return 'bg-gray-100 text-gray-700';
};

/**
 * Verificar se documento é obrigatório
 */
export const isMandatory = (doc: ComplianceDoc): boolean => {
  return doc.is_mandatory;
};

/**
 * Verificar se documento se aplica a uma região
 */
export const appliesToRegion = (doc: ComplianceDoc, region?: string): boolean => {
  if (!doc.region_filter) return true; // Aplica a todas regiões
  if (!region) return true; // Se não especificou região, mostre todos
  return doc.region_filter === region;
};

/**
 * Filtrar documentos por tags do evento
 */
export const filterByEventType = (docs: ComplianceDoc[], eventTags: string[]): ComplianceDoc[] => {
  if (!eventTags.length) return docs;
  
  return docs.filter(doc => {
    return doc.tags.some(tag => 
      eventTags.some(eventTag => 
        tag.toLowerCase().includes(eventTag.toLowerCase()) ||
        eventTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  });
};

/**
 * Mapear tipo de evento para tags
 */
export const mapEventTypeToTags = (eventType: string): string[] => {
  const type = eventType.toLowerCase();
  const tags: string[] = [];
  
  // Música/Shows
  if (type.includes('show') || type.includes('concert') || type.includes('música')) {
    tags.push('show', 'música', 'palco');
  }
  
  // Festas
  if (type.includes('festa') || type.includes('party') || type.includes('celebração')) {
    tags.push('festa');
  }
  
  // Casamento
  if (type.includes('casamento') || type.includes('wedding')) {
    tags.push('casamento', 'festa');
  }
  
  // Corporativo
  if (type.includes('corporativo') || type.includes('empresa') || type.includes('corporate')) {
    tags.push('corporativo');
  }
  
  // Gastronomia
  if (type.includes('gastronôm') || type.includes('food') || type.includes('comida')) {
    tags.push('comida', 'gastronomia', 'feira');
  }
  
  // Esporte
  if (type.includes('esporte') || type.includes('sport') || type.includes('corrida')) {
    tags.push('esporte', 'público');
  }
  
  // Ao ar livre
  if (type.includes('ar livre') || type.includes('outdoor') || type.includes('parque')) {
    tags.push('ao ar livre', 'parque');
  }
  
  // Rua/Público
  if (type.includes('rua') || type.includes('público') || type.includes('street')) {
    tags.push('rua', 'público');
  }
  
  return tags;
};

/**
 * Agrupar documentos por abrangência
 */
export const groupByScope = (docs: ComplianceDoc[]): Record<ComplianceScope, ComplianceDoc[]> => {
  return docs.reduce((acc, doc) => {
    if (!acc[doc.scope]) {
      acc[doc.scope] = [];
    }
    acc[doc.scope].push(doc);
    return acc;
  }, {} as Record<ComplianceScope, ComplianceDoc[]>);
};

/**
 * Ordenar documentos (obrigatórios primeiro)
 */
export const sortByPriority = (docs: ComplianceDoc[]): ComplianceDoc[] => {
  return [...docs].sort((a, b) => {
    // Obrigatórios primeiro
    if (a.is_mandatory !== b.is_mandatory) {
      return a.is_mandatory ? -1 : 1;
    }
    // Depois por sort_order
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    // Por fim, alfabético
    return a.title.localeCompare(b.title);
  });
};

/**
 * Gerar resumo de documentos necessários
 */
export const generateComplianceSummary = (docs: ComplianceDoc[]): string => {
  const mandatory = docs.filter(d => d.is_mandatory);
  const recommended = docs.filter(d => !d.is_mandatory);
  
  let summary = `${mandatory.length} documento(s) obrigatório(s)`;
  if (recommended.length > 0) {
    summary += ` e ${recommended.length} recomendado(s)`;
  }
  
  return summary;
};

/**
 * Verificar se tem link oficial
 */
export const hasOfficialLink = (doc: ComplianceDoc): boolean => {
  return doc.official_url !== null && doc.official_url !== '';
};

/**
 * Tags comuns para eventos
 */
export const COMMON_EVENT_TAGS = [
  'show',
  'música',
  'festa',
  'casamento',
  'corporativo',
  'comida',
  'bebida',
  'rua',
  'público',
  'esporte',
  'festival',
  'ao ar livre',
] as const;

/**
 * Sugestões de busca
 */
export const SEARCH_SUGGESTIONS = [
  { label: 'Show/Música', tags: ['show', 'música', 'palco'] },
  { label: 'Festa/Casamento', tags: ['festa', 'casamento'] },
  { label: 'Evento Corporativo', tags: ['corporativo'] },
  { label: 'Feira Gastronômica', tags: ['comida', 'gastronomia', 'feira'] },
  { label: 'Evento na Rua', tags: ['rua', 'público'] },
  { label: 'Festival/Grande Porte', tags: ['festival', 'grande porte'] },
] as const;
