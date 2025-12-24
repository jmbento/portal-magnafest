/**
 * =====================================================================
 * CANAPEV - App Principal
 * =====================================================================
 * Router e Provider de Autenticação
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CreateListingForm from './components/listings/CreateListingForm';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import DirectoryExamplePage from './pages/DirectoryExamplePage';
import EventsExamplePage from './pages/EventsExamplePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import CompliancePage from './pages/CompliancePage';
import ProvidersPage from './pages/ProvidersPage';
import AgendaPage from './pages/AgendaPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          {/* Navbar Global */}
          <Navbar />

          {/* Routes */}
          <Routes>
            {/* Página de Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Página de Busca */}
            <Route path="/search" element={<SearchPage />} />

            {/* Página de Criar Anúncio */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <main className="py-12">
                    <CreateListingForm />
                  </main>
                </ProtectedRoute>
              }
            />

            {/* Página do Diretório (Exemplo) */}
            <Route path="/guia" element={<DirectoryExamplePage />} />

            {/* Página de Eventos (Real - busca do Supabase) */}
            <Route path="/eventos" element={<EventsPage />} />

            {/* Página de Detalhes do Evento (Dinâmica) */}
            <Route path="/eventos/:slug" element={<EventDetailPage />} />

            {/* Página de Eventos (Demo - dados mockados) */}
            <Route path="/eventos/demo" element={<EventsExamplePage />} />

            {/* Página de Compliance (Bússola Burocrática) */}
            <Route path="/guia-legal" element={<CompliancePage />} />

            {/* Página de Profissionais/Fornecedores */}
            <Route path="/profissionais" element={<ProvidersPage />} />

            {/* Página de Agenda (Timeline) */}
            <Route path="/agenda" element={<AgendaPage />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />

            {/* Página Inicial (Home) */}
            <Route
              path="/"
              element={
                <>
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                      <h2 className="text-5xl font-bold text-gray-900 mb-4">
                        Encontre Tudo para Seu Evento
                      </h2>
                      <p className="text-xl text-gray-600 mb-8">
                        Locais, equipamentos, serviços e produtos para eventos em todo o Brasil
                      </p>
                      <a href="/search" className="btn-primary px-8 py-4 text-lg inline-block">
                        Começar a Buscar
                      </a>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                      <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">📍</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Locais para Eventos</h3>
                        <p className="text-gray-600">
                          Encontre o espaço perfeito para seu evento
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🎵</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Equipamentos</h3>
                        <p className="text-gray-600">
                          Som, iluminação e estruturas profissionais
                        </p>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">📸</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Serviços</h3>
                        <p className="text-gray-600">
                          Fotografia, buffet, decoração e mais
                        </p>
                      </div>
                    </div>
                  </main>

                  <footer className="bg-gray-900 text-white mt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="text-center">
                        <p className="text-gray-400">
                          © 2025 CANAPEV - Marketplace Nacional de Eventos
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Feito com 💜 para a comunidade de eventos do Brasil
                        </p>
                      </div>
                    </div>
                  </footer>
                </>
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 - Not Found */}
            <Route
              path="*"
              element={
                <main className="min-h-[60vh] flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
                    <a href="/" className="btn-primary px-6 py-3">
                      Voltar ao Início
                    </a>
                  </div>
                </main>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
