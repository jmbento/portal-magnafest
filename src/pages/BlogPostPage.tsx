/**
 * =====================================================================
 * BlogPostPage - Artigo Individual
 * =====================================================================
 * Renderização de post com Markdown + Tailwind Typography
 * 
 * DEPENDÊNCIAS NECESSÁRIAS:
 * npm install react-markdown @tailwindcss/typography
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, AlertCircle, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

// =====================================================================
// TYPES
// =====================================================================

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  tags: string[];
  published_at: string;
  created_at: string;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // ================================================================
  // DATA FETCHING
  // ================================================================
  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Post não encontrado');

      setPost(data);
    } catch (err: any) {
      console.error('Erro ao buscar post:', err);
      setError(err.message || 'Post não encontrado');
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
  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32" />
            <div className="aspect-video bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">
            Post Não Encontrado
          </h3>
          <p className="text-red-700 mb-6">{error}</p>
          <Link to="/blog" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="w-full max-h-96 overflow-hidden bg-gradient-to-br from-slate-100 to-zinc-100">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Metadata */}
        <div className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(post.category)}`}>
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-5 h-5" />
            <time dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-12" />

        {/* Markdown Content */}
        <div className="prose prose-lg prose-slate max-w-none
          prose-headings:font-bold prose-headings:text-slate-900
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-primary-600 prose-a:no-underline prose-a:font-medium hover:prose-a:text-primary-700
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-ul:my-6 prose-li:my-2
          prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700
          prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-pre:bg-slate-900 prose-pre:text-slate-100
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Back to Top / Related */}
      <div className="bg-slate-50 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Gostou do conteúdo?
          </h3>
          <p className="text-slate-600 mb-6">
            Explore mais artigos no nosso blog e fique por dentro das novidades.
          </p>
          <Link to="/blog" className="btn-primary inline-block">
            Ver Mais Artigos
          </Link>
        </div>
      </div>
    </main>
  );
}
