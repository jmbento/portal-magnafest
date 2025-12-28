import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, Briefcase, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: ''
  });

  const CATEGORIES = [
    'DJ / Produtor Musical',
    'Técnico de Som',
    'Iluminador',
    'Videomaker',
    'Fotógrafo',
    'Cenógrafo',
    'Produtor de Eventos',
    'Outro'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            category: formData.category
          }
        }
      });

      if (authError) throw authError;

      // 2. Criar perfil no banco (sem email - já vem do auth)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            description: formData.category,
            trust_score: 100,
            is_verified: false
          });

        if (profileError) {
          // Se erro for por perfil já existir, ignorar
          if (!profileError.message.includes('duplicate') && !profileError.message.includes('already exists')) {
            throw profileError;
          }
        }
      }

      // Sucesso! Redirecionar
      navigate('/login', { 
        state: { 
          message: 'Conta criada! Verifique seu email e faça login.' 
        } 
      });

    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-magna-black flex">
      {/* LADO ESQUERDO - Imagem/Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/sound01bg.jpg"
            alt="DJ Console"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-magna-violet/80 to-magna-magenta/60" />
        </div>

        {/* Content Over Image */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Junte-se aos<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-magna-cyan to-white">
              +5.000 profissionais
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-md">
            Conecte-se com os melhores do setor de eventos. Encontre oportunidades, 
            venda equipamentos e expanda sua rede.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              '✨ Perfil profissional verificado',
              '🎯 Acesso a milhares de oportunidades',
              '🛒 Marketplace exclusivo',
              '🤝 Networking com outros profissionais'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-100">
                <div className="w-2 h-2 bg-magna-cyan rounded-full" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LADO DIREITO - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          
          {/* Logo Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-black text-white">
              MAGNA<span className="text-magna-violet">FEST</span>
            </h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-magna-violet/20 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-magna-violet" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Criar Conta</h2>
                <p className="text-gray-400">Comece gratuitamente</p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Categoria Profissional
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-magna-violet transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-magna-violet to-magna-magenta hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Criando conta...'
              ) : (
                <>
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-magna-cyan hover:underline font-bold">
                Fazer Login
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link to="/termos" className="text-magna-violet hover:underline">
              Termos de Uso
            </Link>
            {' '}e{' '}
            <Link to="/termos" className="text-magna-violet hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
