/**
 * =====================================================================
 * MAGNAFEST - App Principal (VITE + REACT ROUTER)
 * =====================================================================
 * Roteamento centralizado com React Router DOM
 */

import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import CreateListingForm from './components/listings/CreateListingForm';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
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
import ProviderDetailPage from './pages/ProviderDetailPage';
import ProfileDetailsPage from './pages/ProfileDetailsPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import SeederPage from './pages/admin/SeederPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InterviewApprovalPage from './pages/admin/InterviewApprovalPage';
import AdvertisePage from './pages/AdvertisePage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import SignupPage from './pages/SignupPage';
import CreateListingPage from './pages/CreateListingPage';
import TermsPage from './pages/Legal/TermsPage';
import GuidesPage from './pages/Legal/GuidesPage';
import NotFoundPage from './pages/NotFoundPage';

// =====================================================================
// LAYOUT COMPONENT (Wrapper com Navbar)
// =====================================================================

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      <Outlet />
    </div>
  );
}


// =====================================================================
// APP PRINCIPAL (SEM BrowserRouter - já está no main.tsx)
// =====================================================================

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Layout Wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Home */}
          <Route index element={<HomePage />} />

          {/* Autenticação */}
          <Route path="login" element={<LoginPage />} />
          <Route path="cadastro" element={<SignupPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Busca */}
          <Route path="search" element={<SearchPage />} />
          <Route path="explorar" element={<ExplorePage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="anuncio/:id" element={<ListingDetailPage />} />
          <Route path="criar-anuncio" element={<CreateListingPage />} />

          {/* Eventos */}
          <Route path="eventos">
            <Route index element={<EventsPage />} />
            <Route path="demo" element={<EventsExamplePage />} />
            <Route path=":slug" element={<EventDetailPage />} />
          </Route>

          {/* Profissionais/Fornecedores */}
          <Route path="profissionais">
            <Route index element={<ProvidersPage />} />
            <Route path=":slug" element={<ProviderDetailPage />} />
          </Route>

          {/* Perfil Detalhado (High Conversion) */}
          <Route path="perfil/:id" element={<ProfileDetailsPage />} />

          {/* Meus Favoritos */}
          <Route path="meus-favoritos" element={<MyFavoritesPage />} />

          {/* Agenda */}
          <Route path="agenda" element={<AgendaPage />} />

          {/* Guias/Compliance */}
          <Route path="guia" element={<DirectoryExamplePage />} />
          <Route path="guia-legal" element={<CompliancePage />} />
          <Route path="guias" element={<GuidesPage />} />
          <Route path="termos" element={<TermsPage />} />
          <Route path="terms" element={<TermsPage />} /> {/* Alias em inglês */}

          {/* Blog */}
          <Route path="blog">
            <Route index element={<BlogPage />} />
            <Route path=":slug" element={<BlogPostPage />} />
          </Route>

          {/* Publicidade/Anuncie */}
          <Route path="anuncie" element={<AdvertisePage />} />
          <Route path="anunciar" element={<AdvertisePage />} />

          {/* Dashboard (Protegido) */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Criar Anúncio (Protegido) */}
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <main className="py-12">
                  <CreateListingForm />
                </main>
              </ProtectedRoute>
            }
          />

          {/* Admin: Data Seeder */}
          <Route path="admin/seed" element={<SeederPage />} />
          
          {/* Admin: Dashboard */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/interviews" element={<InterviewApprovalPage />} />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
