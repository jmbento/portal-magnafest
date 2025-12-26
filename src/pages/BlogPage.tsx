/**
 * =====================================================================
 * BlogPage - Lista de Artigos (REVISTA DIGITAL - NEON NIGHT)
 * =====================================================================
 * Grid de posts com imagens vibrantes - Estilo Wired/Rolling Stone
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, AlertCircle, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PageHero from '../components/ui/PageHero';

// =====================================================================
// TYPES
// =====================================================================

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string;
  created_at: string;
}

// Palavras-chave para imagens aleatórias por categoria
const CATEGORY_IMAGES: Record<string, string> = {
  'Tecnologia': 'technology,innovation,digital',
  'Dicas': 'tips,success,growth',
  'Carreira': 'career,professional,office',
  'Tutorial': 'learning,computer,code',
  'default': 'concert,music,event,festival'
};

// =====================================================================
// COMPONENT
// =====================================================================

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, slug, title, excerpt, cover_image_url, category, published_at, created_at')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar posts:', err);
      setError(err.message || 'Erro ao carregar blog');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HELPERS
  // ================================================================
  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  const getCategoryColor = (category: string | null): string => {
    if (!category) return 'bg-magna-violet/20 text-magna-cyan';
    
    const colors: Record<string, string> = {
      'Tecnologia': 'bg-magna-violet/20 text-magna-violet',
      'Dicas': 'bg-green-500/20 text-green-400',
      'Carreira': 'bg-magna-magenta/20 text-magna-magenta',
      'Tutorial': 'bg-magna-cyan/20 text-magna-cyan',
    };

    return colors[category] || 'bg-magna-violet/20 text-magna-cyan';
  };

  const getPostImage = (post: Post, index: number): string => {
    // Se tem cover_image_url, use ela
    if (post.cover_image_url) return post.cover_image_url;
    
    // Caso contrário, gere uma imagem do Unsplash baseada na categoria
    const keyword = CATEGORY_IMAGES[post.category || 'default'] || CATEGORY_IMAGES['default'];
    // Adicione um seed baseado no index para variar as imagens
    return `https://source.unsplash.com/800x450/?${keyword}&sig=${index}`;
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="min-h-screen bg-magna-black">
      {/* Hero com Imagem de Fundo */}
      <PageHero 
        title="Blog MagnaFest"
        subtitle="Conhecimento, insights e tendências para produtores de eventos"
        imageKeyword="concert,stage,crowd,festival"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-magna-dark rounded-xl overflow-hidden">
                <div className="h-48 bg-white/10" />
                <div className="p-6">
                  <div className="h-4 bg-white/10 rounded w-20 mb-3" />
                  <div className="h-6 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Erro ao Carregar Blog
            </h3>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-magna-dark border border-white/10 rounded-xl p-12 text-center max-w-2xl mx-auto">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Nenhum post publicado ainda
            </h3>
            <p className="text-gray-400">
              Em breve teremos conteúdos incríveis para você!
            </p>
          </div>
        )}

        {/* Posts Grid - REVISTA DIGITAL */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-magna-dark rounded-xl overflow-hidden border border-white/10 hover:border-magna-cyan/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.3)] transition-all duration-300"
              >
                {/* Imagem de Capa */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-magna-violet/20 to-magna-cyan/20">
                  <img
                    src={getPostImage(post, index)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-magna-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Category Badge */}
                  {post.category && (
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-magna-cyan transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-400 mb-4 line-clamp-3 flex-1 text-sm">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto pt-4 border-t border-white/5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.published_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
