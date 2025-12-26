/**
 * =====================================================================
 * ProviderDetailPage - Página de Detalhes do Profissional/Fornecedor
 * =====================================================================
 * Estilo "Instagram dos Profissionais" com galeria de portfólio
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MapPin, 
  Phone, 
  Instagram, 
  Globe, 
  Mail, 
  CheckCircle, 
  ArrowLeft,
  ExternalLink 
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Provider } from '../types/providers';
import FavoriteButton from '../components/ui/FavoriteButton';
import ShareProfileButton from '../components/ui/ShareProfileButton';

// =====================================================================
// COMPONENT
// =====================================================================

export default function ProviderDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ================================================================
  // FETCH PROVIDER DATA
  // ================================================================
  useEffect(() => {
    async function fetchProvider() {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Buscar provider com estatísticas
        const { data: providerData, error: providerError } = await supabase
          .rpc('search_providers_with_stats', {
            search_state: null,
            search_city: null,
            search_category: null,
            search_term: null,
            verified_only: false,
            sort_by: 'recent',
            current_user_id: user?.id || null,
          })
          .eq('slug', slug)
          .single();

        if (providerError) throw providerError;
        if (!providerData) {
          setError('Profissional não encontrado');
          return;
        }

        setProvider(providerData as Provider);
      } catch (err) {
        console.error('Erro ao carregar profissional:', err);
        setError('Erro ao carregar dados do profissional');
      } finally {
        setLoading(false);
      }
    }

    fetchProvider();
  }, [slug, user?.id]);

  // ================================================================
  // LOADING STATE
  // ================================================================
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    );
  }

  // ================================================================
  // ERROR STATE
  // ================================================================
  if (error || !provider) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {error || 'Profissional não encontrado'}
          </h1>
          <button
            onClick={() => navigate('/profissionais')}
            className="btn-primary px-6 py-3"
          >
            Voltar para Profissionais
          </button>
        </div>
      </main>
    );
  }

  // ================================================================
  // META TAGS (Open Graph para WhatsApp)
  // ================================================================
  const pageTitle = `${provider.name} | MagnaFest`;
  const pageDescription = provider.description || `${provider.category || 'Profissional'} em ${provider.city}, ${provider.state}. Confira o portfólio!`;
  const pageImage = provider.avatar_url || provider.logo_url || 'https://magnafest.com/og-image.jpg';
  const pageUrl = `${window.location.origin}/profissionais/${provider.slug}`;

  return (
    <>
      {/* SEO & Open Graph */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph (WhatsApp/Facebook) */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="profile" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <main className="container mx-auto px-4 py-8 pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {/* Header com Avatar e Informações */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {provider.avatar_url || provider.logo_url ? (
                  <img
                    src={provider.avatar_url || provider.logo_url || ''}
                    alt={provider.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-4xl">
                      {provider.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {provider.name}
                  </h1>
                  {provider.is_verified && (
                    <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-100" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
                  {provider.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {provider.category}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.city}, {provider.state}</span>
                  </div>
                </div>

                {provider.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {provider.description}
                  </p>
                )}

                {/* Ações Sociais */}
                <div className="flex flex-wrap gap-3">
                  <FavoriteButton
                    providerId={provider.id}
                    initialIsFavorited={provider.is_favorited}
                    initialCount={provider.favorites_count || 0}
                  />
                  <ShareProfileButton
                    providerName={provider.name}
                    providerSlug={provider.slug}
                    variant="default"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Galeria de Portfólio */}
          {provider.portfolio_images && provider.portfolio_images.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Portfólio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {provider.portfolio_images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <img
                      src={imageUrl}
                      alt={`Portfólio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Informações de Contato */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entre em Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.whatsapp && (
                <a
                  href={`https://wa.me/${provider.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium text-gray-900">{provider.whatsapp}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </a>
              )}

              {provider.instagram_url && (
                <a
                  href={provider.instagram_url.startsWith('http') ? provider.instagram_url : `https://instagram.com/${provider.instagram_url.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Instagram</p>
                    <p className="font-medium text-gray-900">@{provider.instagram_url.replace(/^@/, '').replace(/^.*instagram\.com\//, '')}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </a>
              )}

              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium text-gray-900 truncate">{provider.website.replace(/^https?:\/\//, '')}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </a>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 truncate">{provider.email}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Botão Flutuante WhatsApp (Mobile) */}
        {provider.whatsapp && (
          <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
            <a
              href={`https://wa.me/${provider.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-full shadow-2xl text-center transition-all transform active:scale-95"
            >
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5" />
                <span>Chamar no WhatsApp</span>
              </div>
            </a>
          </div>
        )}

        {/* Modal de Imagem */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Portfólio ampliado"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </main>
    </>
  );
}
