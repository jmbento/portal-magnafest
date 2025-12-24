/**
 * =====================================================================
 * BlogPage - Lista de Artigos
 * =====================================================================
 * Grid de posts do blog otimizado para leitura
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, AlertCircle, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
    if (!category) return 'bg-gray-100 text-gray-700';
    
    const colors: Record<string, string> = {
      'Tecnologia': 'bg-blue-100 text-blue-700',
      'Dicas': 'bg-green-100 text-green-700',
      'Carreira': 'bg-purple-100 text-purple-700',
      'Tutorial': 'bg-orange-100 text-orange-700',
    };

    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 to-zinc-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Newspaper className="w-14 h-14" />
            <h1 className="text-5xl md:text-6xl font-bold">
              Blog
            </h1>
          </div>
          <p className="text-2xl text-slate-300 text-center font-light">
            Conhecimento, dicas e insights para produtores de eventos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Erro ao Carregar Blog
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center max-w-2xl mx-auto">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Nenhum post publicado ainda
            </h3>
            <p className="text-slate-600">
              Em breve teremos conteúdos incríveis para você!
            </p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-zinc-100 overflow-hidden">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Category */}
                  {post.category && (
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-slate-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-auto">
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
