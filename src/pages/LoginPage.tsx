/**
 * =====================================================================
 * Login Page - Split-Screen Authentication
 * =====================================================================
 * Layout: 50% Showcase Image | 50% Login Form
 *
 * SETUP DE IMAGEM:
 * 1. Baixe uma imagem de backstage/concert do Unsplash ou Pexels
 *    Sugestão: https://unsplash.com/s/photos/backstage-concert
 * 2. Salve em: /public/assets/login-bg.jpg
 * 3. Dimensões recomendadas: 1920x1080px
 */

import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect se já estiver autenticado
  if (user) {
    navigate("/dashboard");
    return null;
  }

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) throw authError;

      if (data.user) {
        console.log("✅ Login bem-sucedido:", data.user.email);

        // Verificar se é admin
        const isAdmin = data.user.user_metadata?.role === "admin";

        // Redirecionar
        navigate(isAdmin ? "/admin/dashboard" : "/dashboard");
      }
    } catch (err: any) {
      console.error("❌ Erro no login:", err);

      // Mensagens de erro amigáveis
      if (err.message?.includes("Invalid login credentials")) {
        setError(
          "Email ou senha incorretos. Verifique seus dados e tente novamente.",
        );
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Por favor, confirme seu email antes de fazer login.");
      } else {
        setError(err.message || "Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <div className="min-h-screen flex bg-magna-black">
      {/* ============================================================
          LADO ESQUERDO - SHOWCASE (Desktop Only)
          ============================================================ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Imagem de Fundo */}
        <img
          src="/assets/login-bg.jpg"
          alt="Backstage"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Fallback para Unsplash se imagem local não existir
            e.currentTarget.src =
              "https://source.unsplash.com/1920x1080/?backstage,concert,stage";
          }}
        />

        {/* Overlay Gradiente (garantir legibilidade) */}
        <div className="absolute inset-0 bg-gradient-to-t from-magna-black via-magna-black/20 to-transparent" />

        {/* Copywriting */}
        <div className="absolute bottom-0 left-0 p-12 z-10">
          <h2 className="text-magna-cyan tracking-[0.2em] font-medium mb-2 uppercase text-sm">
            Bastidores
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-md">
            Onde o espetáculo
            <br />
            começa.
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-md">
            Acesse o maior hub de profissionais de eventos do Brasil
          </p>
        </div>

        {/* Pattern Overlay (opcional) */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      </div>

      {/* ============================================================
          LADO DIREITO - FORMULÁRIO
          ============================================================ */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo e Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <h1 className="text-3xl font-black uppercase tracking-tight">
                <span className="text-white">Portal </span>
                <span className="bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet bg-clip-text text-transparent animate-text-flow">
                  MagnaFest
                </span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-400">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-magna-dark border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-magna-dark border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-magna-violet focus:border-transparent transition-all outline-none"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-white/10 bg-magna-dark text-magna-violet focus:ring-magna-violet"
                />
                Lembrar de mim
              </label>
              <Link
                to="/forgot-password"
                className="text-magna-cyan hover:text-magna-magenta transition-colors"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-magna-violet to-magna-magenta hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
                className="text-magna-cyan hover:text-magna-magenta font-semibold transition-colors"
              >
                Criar conta gratuita
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 mb-6 flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-xs text-gray-500 uppercase">ou</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Social Login (Mock) */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-3"
              disabled
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
