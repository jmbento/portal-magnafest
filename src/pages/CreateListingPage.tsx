import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Tag, 
  DollarSign, 
  FileText, 
  Package,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
  'Áudio Profissional',
  'Iluminação',
  'Estruturas/Box',
  'Painéis de LED',
  'Cabos & Acessórios',
  'DJ Equipment',
  'Cases & Road Cases',
  'Geradores',
  'Outro'
];

const CONDITIONS = [
  { value: 'novo', label: '✨ Novo na Caixa', desc: 'Lacrado, nunca usado' },
  { value: 'seminovo', label: '⭐ Seminovo', desc: 'Impecável, pouco uso' },
  { value: 'usado', label: '🔧 Usado', desc: 'Marcas de uso normais' },
  { value: 'pecas', label: '⚙️ Para Peças', desc: 'Com defeito ou incompleto' }
];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_min: '',
    price_max: '',
    condition: '',
    listing_type: 'product_sale',
    category: '',
    whatsapp: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Você precisa estar logado para criar um anúncio');
      navigate('/login');
      return;
    }

    // Validações
    if (!formData.title || !formData.description || !formData.price_min || !formData.condition) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { data, error: insertError } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price_min: parseFloat(formData.price_min),
          price_max: formData.price_max ? parseFloat(formData.price_max) : null,
          condition: formData.condition,
          listing_type: formData.listing_type,
          status: 'active',
          moderation_status: 'pending', // Vai para moderação
          profiles_id: user.id
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      
      // Redirecionar após 2s
      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);

    } catch (err: any) {
      console.error('Erro ao criar anúncio:', err);
      setError(err.message || 'Erro ao criar anúncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-magna-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Anúncio Criado!</h2>
          <p className="text-gray-400 mb-6">Seu anúncio está em análise e será publicado em breve.</p>
          <div className="w-6 h-6 border-4 border-magna-violet border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magna-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-magna-dark/50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black text-white mb-2">Criar Anúncio</h1>
            <p className="text-gray-400">
              Venda ou alugue seu equipamento para milhares de profissionais do setor
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          
          {/* Error Alert */}
          {error && (
            <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Tipo de Anúncio */}
            <div className="bg-magna-dark/30 border border-white/10 rounded-2xl p-6">
              <label className="block text-sm font-bold text-gray-300 mb-4">
                Tipo de Anúncio
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="listing_type"
                    value="product_sale"
                    checked={formData.listing_type === 'product_sale'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-white/10 rounded-xl p-4 text-center peer-checked:border-magna-violet peer-checked:bg-magna-violet/10 transition-all">
                    <DollarSign className="w-8 h-8 text-gray-400 peer-checked:text-magna-violet mx-auto mb-2" />
                    <span className="font-bold text-white">Venda</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="listing_type"
                    value="product_rent"
                    checked={formData.listing_type === 'product_rent'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-white/10 rounded-xl p-4 text-center peer-checked:border-magna-violet peer-checked:bg-magna-violet/10 transition-all">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="font-bold text-white">Aluguel</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Título do Anúncio *
              </label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Mesa de Som Yamaha QL1 Seminova"
                  maxLength={100}
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.title.length}/100 caracteres
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Descrição Detalhada *
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o estado do equipamento, tempo de uso, acessórios inclusos, motivo da venda..."
                  rows={6}
                  maxLength={1000}
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors resize-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {formData.description.length}/1000 caracteres
              </p>
            </div>

            {/* Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  {formData.listing_type === 'product_rent' ? 'Preço Diária (R$) *' : 'Preço (R$) *'}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="price_min"
                    required
                    value={formData.price_min}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Preço Máximo (Opcional)
                </label>
                <input
                  type="number"
                  name="price_max"
                  value={formData.price_max}
                  onChange={handleChange}
                  placeholder="8000"
                  min="0"
                  step="0.01"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Para faixa de preço negociável
                </p>
              </div>
            </div>

            {/* Condição */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-4">
                Condição do Equipamento *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONDITIONS.map((cond) => (
                  <label key={cond.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="condition"
                      value={cond.value}
                      checked={formData.condition === cond.value}
                      onChange={handleChange}
                      required
                      className="sr-only peer"
                    />
                    <div className="border-2 border-white/10 rounded-xl p-4 peer-checked:border-magna-violet peer-checked:bg-magna-violet/10 transition-all">
                      <div className="font-bold text-white mb-1">{cond.label}</div>
                      <div className="text-sm text-gray-400">{cond.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-magna-violet transition-colors"
              >
                <option value="">Selecione...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                WhatsApp para Contato
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-magna-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-magna-violet transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Opcional: os interessados poderão te contatar diretamente
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/marketplace')}
                className="flex-1 border border-white/20 text-gray-300 hover:bg-white/5 font-bold py-4 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-magna-violet to-magna-magenta hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Publicar Anúncio'}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-magna-violet/10 border border-magna-violet/20 rounded-xl p-6">
            <p className="text-sm text-gray-400 leading-relaxed">
              <strong className="text-white">📋 Moderação:</strong> Seu anúncio passará por uma análise rápida para garantir qualidade. 
              Geralmente leva menos de 24h para ser aprovado. Você será notificado por email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
