/**
 * =====================================================================
 * MAGNA COMMAND CENTER - Admin Dashboard
 * =====================================================================
 * Painel administrativo para moderar conteúdo gerado pelos bots
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Activity,
  LogOut,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Loader2,
  MessageSquare,
  TrendingUp,
  Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// =====================================================================
// TYPES
// =====================================================================

interface KPIData {
  totalProfiles: number;
  pendingPosts: number;
  activeInterviews: number;
  todayViews: number;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string;
  author_type: string;
  author_name: string | null;
  status: string;
  created_at: string;
}

interface Interview {
  id: string;
  status: string;
  topic: string;
  created_at: string;
  answered_at: string | null;
  profiles?: {
    name: string;
    service_categories?: {
      name: string;
    };
  };
}

type TabType = 'blog' | 'interviews' | 'users';

// =====================================================================
// COMPONENT
// =====================================================================

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<TabType>('blog');
  const [kpis, setKpis] = useState<KPIData>({
    totalProfiles: 0,
    pendingPosts: 0,
    activeInterviews: 0,
    todayViews: 0
  });
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Simulação de proteção de rota
    if (!user) {
      console.warn('⚠️ Acesso ao admin sem autenticação (modo desenvolvimento)');
    }
    
    loadDashboardData();
  }, []);

  // ================================================================
  // DATA FETCHING
  // ================================================================

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // KPIs
      const [profilesCount, postsCount, interviewsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('interviews').select('id', { count: 'exact', head: true }).in('status', ['invited', 'answered'])
      ]);

      setKpis({
        totalProfiles: profilesCount.count || 0,
        pendingPosts: postsCount.count || 0,
        activeInterviews: interviewsCount.count || 0,
        todayViews: Math.floor(Math.random() * 500) + 100 // Mock por enquanto
      });

      // Posts em draft
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      setPosts(postsData || []);

      // Entrevistas ativas
      const { data: interviewsData } = await supabase
        .from('interviews')
        .select(`
          *,
          profiles (
            name,
            service_categories (
              name
            )
          )
        `)
        .in('status', ['invited', 'answered', 'approved', 'published'])
        .order('created_at', { ascending: false });

      setInterviews(interviewsData || []);

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // HANDLERS - POSTS
  // ================================================================

  const handleApprovePost = async (postId: string) => {
    try {
      setProcessing(true);

      const { error } = await supabase
        .from('posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      alert('✅ Post aprovado e publicado!');
      loadDashboardData();

    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao aprovar post');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectPost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) {
      return;
    }

    try {
      setProcessing(true);

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      alert('Post deletado');
      loadDashboardData();

    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar post');
    } finally {
      setProcessing(false);
    }
  };

  const handleEditPost = (slug: string) => {
    // TODO: Implementar editor de posts
    alert(`Editar post: ${slug} (funcionalidade em desenvolvimento)`);
  };

  // ================================================================
  // HANDLERS - AUTH
  // ================================================================

  const handleLogout = async () => {
    if (confirm('Deseja sair do painel admin?')) {
      await signOut();
      navigate('/');
    }
  };

  // ================================================================
  // HELPERS
  // ================================================================

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      'invited': { label: 'Convite Enviado', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      'answered': { label: 'Respondido', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'approved': { label: 'Aprovado', class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'published': { label: 'Publicado', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'rejected': { label: 'Rejeitado', class: 'bg-red-500/20 text-red-400 border-red-500/30' }
    };

    const badge = badges[status] || { label: status, class: 'bg-gray-500/20 text-gray-400' };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // ================================================================
  // RENDER
  // ================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-magna-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-magna-violet animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-magna-black text-white">
      {/* Header Admin */}
      <header className="bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet border-b border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                <LayoutDashboard className="w-10 h-10" />
                MAGNA COMMAND CENTER
              </h1>
              <p className="text-xl text-white/80 font-light">
                Visão tática do sistema autônomo
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <section className="py-8 bg-magna-dark border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              icon={<Users className="w-8 h-8" />}
              label="Total de Profissionais"
              value={kpis.totalProfiles}
              color="text-magna-cyan"
            />
            <KPICard
              icon={<FileText className="w-8 h-8" />}
              label="Notícias Pendentes"
              value={kpis.pendingPosts}
              color="text-yellow-500"
            />
            <KPICard
              icon={<MessageSquare className="w-8 h-8" />}
              label="Entrevistas em Andamento"
              value={kpis.activeInterviews}
              color="text-magna-magenta"
            />
            <KPICard
              icon={<Activity className="w-8 h-8" />}
              label="Acessos Hoje"
              value={kpis.todayViews}
              color="text-green-500"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            <TabButton
              active={activeTab === 'blog'}
              onClick={() => setActiveTab('blog')}
              icon={<FileText className="w-5 h-5" />}
              label="Redação (Blog)"
              count={posts.length}
            />
            <TabButton
              active={activeTab === 'interviews'}
              onClick={() => setActiveTab('interviews')}
              icon={<MessageSquare className="w-5 h-5" />}
              label="Entrevistas"
              count={interviews.length}
            />
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
              icon={<Users className="w-5 h-5" />}
              label="Usuários"
            />
          </div>

          {/* Tab Content */}
          <div>
            {/* Aba: Blog */}
            {activeTab === 'blog' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">📝 Moderação de Blog</h2>
                
                {posts.length === 0 ? (
                  <div className="bg-magna-dark border border-white/10 rounded-xl p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhum post pendente de aprovação</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-magna-dark border border-white/10 rounded-xl p-6 hover:border-magna-cyan/50 transition-all"
                    >
                      <div className="flex gap-6">
                        {/* Thumbnail */}
                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-magna-violet/20 to-magna-cyan/20">
                          {post.cover_image_url ? (
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-12 h-12 text-white/20" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                            <span className="px-3 py-1 bg-magna-violet/20 text-magna-violet text-xs font-bold rounded-full">
                              {post.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                            {post.excerpt || 'Sem descrição'}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span>📝 {post.author_name || 'Autor'}</span>
                            <span>•</span>
                            <span>{formatDate(post.created_at)}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovePost(post.id)}
                              disabled={processing}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleEditPost(post.slug)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleRejectPost(post.id)}
                              disabled={processing}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors text-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Aba: Interviews */}
            {activeTab === 'interviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">🎤 Sistema de Entrevistas</h2>
                  <button
                    onClick={() => navigate('/admin/interviews')}
                    className="flex items-center gap-2 px-4 py-2 bg-magna-violet hover:bg-magna-magenta text-white font-bold rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    Ver Detalhes
                  </button>
                </div>

                {interviews.length === 0 ? (
                  <div className="bg-magna-dark border border-white/10 rounded-xl p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Nenhuma entrevista ativa</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="bg-magna-dark border border-white/10 rounded-xl p-6 hover:border-magna-cyan/50 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold line-clamp-1">
                            {interview.profiles?.name || 'Candidato'}
                          </h3>
                          {getStatusBadge(interview.status)}
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {interview.profiles?.service_categories?.name || 'Profissional'}
                        </p>

                        <p className="text-xs text-gray-500">
                          Criado: {formatDate(interview.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba: Users */}
            {activeTab === 'users' && (
              <div className="bg-magna-dark border border-white/10 rounded-xl p-12 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Gestão de Usuários</h3>
                <p className="text-gray-400">Em desenvolvimento...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// =====================================================================
// SUB-COMPONENTS
// =====================================================================

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function KPICard({ icon, label, value, color }: KPICardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-xl p-6 hover:border-magna-cyan/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={color}>{icon}</div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <p className={`text-4xl font-black mb-2 ${color}`}>
        {value.toLocaleString('pt-BR')}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${
        active
          ? 'bg-magna-violet text-white shadow-lg'
          : 'bg-magna-dark text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-white/10'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
