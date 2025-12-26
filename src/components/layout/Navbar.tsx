/**
 * =====================================================================
 * MAGNAFEST - Navbar
 * =====================================================================
 * Menu de navegação responsivo com autenticação e active state
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  PlusCircle, 
  User, 
  LogOut,
  Calendar,
  Users,
  Shield,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// =====================================================================
// NAVIGATION LINKS
// =====================================================================

const NAV_LINKS = [
  { label: 'Eventos', href: '/eventos', icon: Calendar },
  { label: 'Agenda', href: '/agenda', icon: Calendar },
  { label: 'Profissionais', href: '/profissionais', icon: Users },
  { label: 'Guia Legal', href: '/guia-legal', icon: Shield },
  { label: 'Blog', href: '/blog', icon: Newspaper },
] as const;

// =====================================================================
// COMPONENT
// =====================================================================

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ================================================================
  // ACTIVE STATE HELPER
  // ================================================================
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <nav className="sticky top-0 z-50 bg-magna-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-lg font-normal text-gray-300">Portal</span>
                <span className="text-2xl font-extrabold uppercase tracking-tight text-white">MAGNA</span>
                <span className="text-2xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet bg-clip-text text-transparent animate-text-flow">FEST</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Search */}
            <Link
              to="/search"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                isActive('/search')
                  ? 'text-magna-cyan bg-magna-cyan/10'
                  : 'text-gray-300 hover:text-magna-cyan hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4" />
              Explorar
            </Link>

            {/* Dynamic Links */}
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                    isActive(link.href)
                      ? 'text-magna-cyan bg-magna-cyan/10'
                      : 'text-gray-300 hover:text-magna-cyan hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Botão Anunciar */}
                <Link
                  to="/create"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-magna-violet to-magna-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <PlusCircle className="w-4 h-4" />
                  Anunciar
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-magna-violet to-magna-magenta rounded-full flex items-center justify-center text-white font-semibold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />

                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-magna-dark rounded-lg shadow-lg border border-white/20 py-2 z-20">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Meus Anúncios
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-magna-violet to-magna-magenta text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-magna-dark">
          <div className="px-4 py-4 space-y-2">
            {/* Search */}
            <Link
              to="/search"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/search')
                  ? 'bg-magna-cyan/10 text-magna-cyan font-semibold'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
              onClick={closeMobileMenu}
            >
              <Search className="w-5 h-5" />
              <span className="font-medium">Explorar</span>
            </Link>

            {/* Dynamic Links */}
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-magna-cyan/10 text-magna-cyan font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-white/10 my-3" />

            {user ? (
              <>
                {/* Criar Anúncio */}
                <Link
                  to="/create"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90 transition-opacity"
                  onClick={closeMobileMenu}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Anunciar</span>
                </Link>

                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-magna-cyan/10 text-magna-cyan font-semibold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Meus Anúncios</span>
                </Link>

                {/* User Info & Logout */}
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="px-3 py-2 text-sm text-gray-400 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sair</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center font-medium hover:opacity-90 transition-opacity"
                onClick={closeMobileMenu}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
