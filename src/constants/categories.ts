/**
 * =====================================================================
 * GUIA ATLAS PRÓ - Taxonomia de Categorias
 * =====================================================================
 * Constantes centralizadas para categorias e subcategorias de fornecedores
 */

import type { LucideIcon } from 'lucide-react';

// =====================================================================
// TYPES
// =====================================================================

export interface VendorCategory {
  id: string;
  label: string;
  icon: string; // Nome do ícone do Lucide React
  subcategories: string[];
}

// =====================================================================
// CATEGORIAS PRINCIPAIS
// =====================================================================

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    id: 'espacos',
    label: 'Espaços para Eventos',
    icon: 'Building2',
    subcategories: [
      'Salão de Festas',
      'Sítio',
      'Chácara',
      'Hotel',
      'Restaurante',
      'Casa de Eventos',
      'Buffet com Espaço',
      'Espaço ao Ar Livre',
      'Tenda',
      'Galpão Industrial',
    ],
  },
  {
    id: 'gastronomia',
    label: 'Gastronomia & Bar',
    icon: 'UtensilsCrossed',
    subcategories: [
      'Buffet Completo',
      'Buffet Infantil',
      'Buffet Corporativo',
      'Bartenders',
      'Barista',
      'Confeitaria',
      'Doceria',
      'Food Truck',
      'Churrasqueiro',
      'Catering',
    ],
  },
  {
    id: 'musica',
    label: 'Música & Entretenimento',
    icon: 'Music',
    subcategories: [
      'DJ',
      'Banda',
      'Cantor(a)',
      'Músico',
      'Orquestra',
      'Coral',
      'Violinista',
      'Saxofonista',
      'Pianista',
      'Animador de Festas',
    ],
  },
  {
    id: 'tecnologia',
    label: 'Som, Luz & Tecnologia',
    icon: 'Sparkles',
    subcategories: [
      'Som Profissional',
      'Iluminação',
      'Projeção e Telão',
      'Palco e Estrutura',
      'Efeitos Especiais',
      'Gerador de Energia',
      'Telão LED',
      'Equipamento Audiovisual',
    ],
  },
  {
    id: 'foto-video',
    label: 'Fotografia & Vídeo',
    icon: 'Camera',
    subcategories: [
      'Fotografia',
      'Filmagem',
      'Drone',
      'Cabine de Fotos',
      'Álbum Digital',
      'Live Streaming',
      'Edição de Vídeo',
      'Making Of',
    ],
  },
  {
    id: 'decoracao',
    label: 'Decoração & Ambientação',
    icon: 'Palette',
    subcategories: [
      'Decoração Completa',
      'Florista',
      'Mobiliário',
      'Painel de Flores',
      'Balões',
      'Cenografia',
      'Mesa de Doces',
      'Sousplat',
      'Tapetes',
    ],
  },
  {
    id: 'organizacao',
    label: 'Organização & Apoio',
    icon: 'Briefcase',
    subcategories: [
      'Cerimonial',
      'Assessoria de Eventos',
      'Segurança',
      'Valet Parking',
      'Limpeza',
      'Recepcionista',
      'Garçom',
      'Copeiro',
      'Manobrista',
    ],
  },
  {
    id: 'transporte',
    label: 'Transporte & Logística',
    icon: 'Car',
    subcategories: [
      'Carro de Noiva',
      'Van',
      'Ônibus',
      'Limousine',
      'Carruagem',
      'Moto Luxury',
      'Transfer',
    ],
  },
  {
    id: 'beleza',
    label: 'Beleza & Bem-Estar',
    icon: 'Sparkle',
    subcategories: [
      'Maquiagem',
      'Penteado',
      'Manicure',
      'Spa Day',
      'Massagem',
      'Esteticista',
    ],
  },
  {
    id: 'convites',
    label: 'Convites & Papelaria',
    icon: 'Mail',
    subcategories: [
      'Convites Impressos',
      'Convites Digitais',
      'Identidade Visual',
      'Cardápio',
      'Placa de Boas-Vindas',
      'Tags',
      'Lembrancinha',
    ],
  },
  {
    id: 'brindes',
    label: 'Brindes & Lembrancinhas',
    icon: 'Gift',
    subcategories: [
      'Lembrancinha Adulto',
      'Lembrancinha Infantil',
      'Bem Casado',
      'Bomboniere',
      'Cesta de Café',
      'Brinde Corporativo',
    ],
  },
  {
    id: 'outros',
    label: 'Outros Serviços',
    icon: 'MoreHorizontal',
    subcategories: [
      'Celebrante',
      'Mestre de Cerimônias',
      'Tradutor',
      'Intérprete de Libras',
      'Consultor de Eventos',
      'Designer de Eventos',
      'Aluguel de Itens',
      'Serviços Diversos',
    ],
  },
];

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

/**
 * Retorna todas as subcategorias em um array plano
 * Útil para popular select inputs
 */
export function getAllSubcategories(): string[] {
  return VENDOR_CATEGORIES.flatMap((category) => category.subcategories);
}

/**
 * Retorna a categoria pai de uma subcategoria
 * @param subcategory Nome da subcategoria
 * @returns Objeto da categoria ou undefined se não encontrado
 */
export function getCategoryBySubcategory(subcategory: string): VendorCategory | undefined {
  return VENDOR_CATEGORIES.find((category) =>
    category.subcategories.includes(subcategory)
  );
}

/**
 * Retorna o ID da categoria pai de uma subcategoria
 * @param subcategory Nome da subcategoria
 * @returns ID da categoria ou undefined
 */
export function getCategoryIdBySubcategory(subcategory: string): string | undefined {
  const category = getCategoryBySubcategory(subcategory);
  return category?.id;
}

/**
 * Retorna o label da categoria pai de uma subcategoria
 * @param subcategory Nome da subcategoria
 * @returns Label da categoria ou undefined
 */
export function getCategoryLabelBySubcategory(subcategory: string): string | undefined {
  const category = getCategoryBySubcategory(subcategory);
  return category?.label;
}

/**
 * Verifica se uma subcategoria existe
 * @param subcategory Nome da subcategoria
 */
export function isValidSubcategory(subcategory: string): boolean {
  return getAllSubcategories().includes(subcategory);
}

/**
 * Retorna uma categoria por ID
 * @param categoryId ID da categoria
 */
export function getCategoryById(categoryId: string): VendorCategory | undefined {
  return VENDOR_CATEGORIES.find((category) => category.id === categoryId);
}

/**
 * Retorna todos os IDs de categorias
 */
export function getAllCategoryIds(): string[] {
  return VENDOR_CATEGORIES.map((category) => category.id);
}

/**
 * Retorna o nome do ícone de uma categoria
 * @param categoryId ID da categoria
 */
export function getCategoryIcon(categoryId: string): string | undefined {
  const category = getCategoryById(categoryId);
  return category?.icon;
}

/**
 * Busca categorias por termo de pesquisa
 * @param searchTerm Termo para buscar nos labels
 */
export function searchCategories(searchTerm: string): VendorCategory[] {
  const term = searchTerm.toLowerCase();
  return VENDOR_CATEGORIES.filter(
    (category) =>
      category.label.toLowerCase().includes(term) ||
      category.subcategories.some((sub) => sub.toLowerCase().includes(term))
  );
}

/**
 * Agrupa subcategorias em formato para <optgroup>
 * Útil para selects com grupos
 */
export function getSubcategoriesGrouped(): Array<{ label: string; options: string[] }> {
  return VENDOR_CATEGORIES.map((category) => ({
    label: category.label,
    options: category.subcategories,
  }));
}

// =====================================================================
// CONSTANTES ADICIONAIS
// =====================================================================

/**
 * Total de categorias disponíveis
 */
export const TOTAL_CATEGORIES = VENDOR_CATEGORIES.length;

/**
 * Total de subcategorias disponíveis
 */
export const TOTAL_SUBCATEGORIES = getAllSubcategories().length;

/**
 * Mapa de ID -> Label para acesso rápido
 */
export const CATEGORY_LABEL_MAP = Object.fromEntries(
  VENDOR_CATEGORIES.map((cat) => [cat.id, cat.label])
);

/**
 * Mapa de ID -> Ícone para acesso rápido
 */
export const CATEGORY_ICON_MAP = Object.fromEntries(
  VENDOR_CATEGORIES.map((cat) => [cat.id, cat.icon])
);
