/**
 * =====================================================================
 * GUIA ATLAS PRÓ - Página de Exemplo do Diretório
 * =====================================================================
 * Demonstração do VendorCard com diferentes tiers
 */

import VendorCard, { VendorCardSkeleton, VendorGrid } from '../components/directory/VendorCard';

// =====================================================================
// MOCK DATA
// =====================================================================

const mockVendors = [
  // PARTNER (Top Tier)
  {
    id: '1',
    name: 'Espaço Grand Buffet Premium',
    slug: 'espaco-grand-buffet-premium',
    category: 'Buffet',
    address_info: {
      city: 'São Paulo',
      state: 'SP',
    },
    subscription_tier: 'partner' as const,
    is_claimed: true,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
  },

  // FEATURED
  {
    id: '2',
    name: 'DJ Alok',
    slug: 'dj-alok',
    category: 'DJ',
    address_info: {
      city: 'Rio de Janeiro',
      state: 'RJ',
    },
    subscription_tier: 'featured' as const,
    is_claimed: true,
    rating: 5.0,
    image_url: 'https://images.unsplash.com/photo-1571266028243-d220c2f579fa?w=800',
  },

  // FREE (Claimed)
  {
    id: '3',
    name: 'Fotografia Artística Silva',
    slug: 'fotografia-artistica-silva',
    category: 'Fotografia',
    address_info: {
      city: 'Curitiba',
      state: 'PR',
    },
    subscription_tier: 'free' as const,
    is_claimed: true,
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
  },

  // FREE (Unclaimed) - Growth Hacking
  {
    id: '4',
    name: 'Decorações Encantadas',
    slug: 'decoracoes-encantadas',
    category: 'Decoração',
    address_info: {
      city: 'Belo Horizonte',
      state: 'MG',
    },
    subscription_tier: 'free' as const,
    is_claimed: false, // ← Perfil não reivindicado
    rating: 4.3,
  },

  // PARTNER (Unclaimed)
  {
    id: '5',
    name: 'Som & Luz Profissional JBL',
    slug: 'som-luz-profissional-jbl',
    category: 'Som e Iluminação',
    address_info: {
      city: 'Brasília',
      state: 'DF',
    },
    subscription_tier: 'partner' as const,
    is_claimed: false, // ← Perfil não reivindicado (admin criou)
  },

  // FEATURED (No Image)
  {
    id: '6',
    name: 'Cerimonial Elegance',
    slug: 'cerimonial-elegance',
    category: 'Cerimonial',
    address_info: {
      city: 'Fortaleza',
      state: 'CE',
    },
    subscription_tier: 'featured' as const,
    is_claimed: true,
    rating: 4.8,
  },

  // FREE (Only City)
  {
    id: '7',
    name: 'Transporte Executivo VIP',
    slug: 'transporte-executivo-vip',
    category: 'Transporte',
    address_info: {
      city: 'Porto Alegre',
    },
    subscription_tier: 'free' as const,
    is_claimed: true,
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
  },

  // FREE (Unclaimed, No Location)
  {
    id: '8',
    name: 'Segurança e Portaria',
    slug: 'seguranca-e-portaria',
    category: 'Segurança',
    address_info: {},
    subscription_tier: 'free' as const,
    is_claimed: false,
  },
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function DirectoryExamplePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Guia Atlas Pró - Diretório de Fornecedores
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre os melhores fornecedores para seu evento. Perfis verificados e não reivindicados.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Legenda:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Partner (⭐ Recomendado)</p>
                <p className="text-xs text-gray-600">Borda dourada, destaque premium</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Featured</p>
                <p className="text-xs text-gray-600">Borda roxa, maior visibilidade</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-semibold text-sm">Free</p>
                <p className="text-xs text-gray-600">Listagem gratuita</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">💡 Dica:</span> Perfis com botão "Reivindicar Perfil" foram criados pela nossa equipe e aguardam o dono reivindicar.
            </p>
          </div>
        </div>

        {/* Grid */}
        <VendorGrid>
          {mockVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </VendorGrid>

        {/* Loading Example */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Loading State:</h2>
          <VendorGrid>
            <VendorCardSkeleton />
            <VendorCardSkeleton />
            <VendorCardSkeleton />
          </VendorGrid>
        </div>
      </div>
    </main>
  );
}
