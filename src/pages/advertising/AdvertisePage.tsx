/**
 * =====================================================================
 * MAGNAFEST ADS - Landing Page de Publicidade
 * =====================================================================
 * Institucional de venda de mídia inspirado no Meta for Business
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  CheckCircle,
  XCircle,
  Download,
  ArrowRight,
  Users,
  Calendar,
  Search,
  Megaphone
} from 'lucide-react';

type ReachLevel = 'municipal' | 'estadual' | 'nacional';

export default function AdvertisePage() {
  const [reachLevel, setReachLevel] = useState<ReachLevel>('estadual');
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    budget: ''
  });

  const pricing = {
    municipal: { price: 49, reach: '10k+', cities: '1 cidade' },
    estadual: { price: 199, reach: '50k+', cities: '1 estado' },
    nacional: { price: 899, reach: '200k+', cities: 'Todo Brasil' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Lead enviado:', formData);
    alert('Obrigado! Entraremos em contato em até 24h.');
    setFormData({ company: '', email: '', budget: '' });
  };

  return (
    <>
      <Helmet>
        <title>MagnaFest Ads - Anuncie para 200k Profissionais de Eventos</title>
        <meta name="description" content="Alcance produtores, artistas e técnicos em todo o Brasil. Publicidade inteligente no maior marketplace de eventos do país." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Corporate Clean */}
        <section className="relative bg-gradient-to-b from-gray-50 to-white py-24 lg:py-32 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-5 py-2 mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide">MAGNAFEST ADS</span>
              </div>

              {/* Main Title */}
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                Sua marca no centro
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  do Palco.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Alcance <strong className="text-gray-900">produtores, artistas e técnicos</strong> em todo o Brasil com anúncios estratégicos no MagnaFest Ads.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button className="group inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">
                  <Target className="w-6 h-6" />
                  Criar Campanha
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-10 py-5 rounded-xl font-bold text-lg transition-all">
                  <Download className="w-6 h-6" />
                  Baixar Mídia Kit
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-200">
                <div>
                  <div className="text-5xl font-black text-gray-900 mb-2">200k+</div>
                  <div className="text-gray-600 font-medium">Profissionais Ativos</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-gray-900 mb-2">50k+</div>
                  <div className="text-gray-600 font-medium">Newsletter Mensal</div>
                </div>
                <div>
                  <div className="text-5xl font-black text-gray-900 mb-2">98%</div>
                  <div className="text-gray-600 font-medium">Taxa de Aprovação</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formatos e Placements */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                Formatos de Anúncios
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Escolha onde sua marca vai aparecer para milhares de profissionais
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {placements.map((placement, index) => (
                <div key={index} className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-2xl transition-all">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${placement.color}`}>
                    <placement.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{placement.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{placement.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Target className="w-5 h-5" />
                    <span>{placement.reach}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculadora de Alcance */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                Calculadora de Alcance
              </h2>
              <p className="text-xl text-gray-600">
                Escolha sua abrangência e veja o potencial de impacto
              </p>
            </div>

            {/* Reach Selector */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                {(Object.keys(pricing) as ReachLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setReachLevel(level)}
                    className={`flex-1 py-5 px-6 rounded-xl font-bold text-lg transition-all ${
                      reachLevel === level
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>

              {/* Pricing Display */}
              <div className="text-center py-12 border-t border-b border-gray-200">
                <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Investimento Mensal
                </div>
                <div className="text-7xl font-black text-gray-900 mb-4">
                  R$ {pricing[reachLevel].price}
                  <span className="text-2xl text-gray-500 font-medium">/mês</span>
                </div>
                <div className="flex items-center justify-center gap-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{pricing[reachLevel].reach} alcance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">{pricing[reachLevel].cities}</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-8">
                * Valores sujeitos a leilão e disponibilidade. Consulte condições especiais para campanhas anuais.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance e AI Moderation */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-6">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                Nossa IA analisa seu anúncio
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  em tempo real.
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Aprovação em até <strong className="text-gray-900">15 minutos</strong> via Inteligência Artificial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {/* O que aceitamos */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-black text-gray-900">Aprovado Rápido</h3>
                </div>
                <ul className="space-y-3">
                  {approvedContent.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* O que não aceitamos */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <h3 className="text-2xl font-black text-gray-900">Rejeitado</h3>
                </div>
                <ul className="space-y-3">
                  {rejectedContent.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Lead Gen Form */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
                Quer um plano customizado?
              </h2>
              <p className="text-xl text-blue-100">
                Para grandes contas e agências, criamos soluções sob medida
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 font-medium transition-colors"
                    placeholder="Ex: Produtora Megashow"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 font-medium transition-colors"
                    placeholder="contato@empresa.com.br"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-bold text-gray-900 mb-2">
                    Orçamento Mensal Estimado
                  </label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 font-medium transition-colors"
                  >
                    <option value="">Selecione uma faixa</option>
                    <option value="R$ 1k - 5k">R$ 1.000 - R$ 5.000</option>
                    <option value="R$ 5k - 10k">R$ 5.000 - R$ 10.000</option>
                    <option value="R$ 10k - 50k">R$ 10.000 - R$ 50.000</option>
                    <option value="R$ 50k+">Acima de R$ 50.000</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Solicitar Proposta Personalizada
                </button>

                <p className="text-center text-sm text-gray-500">
                  Resposta em até 24 horas úteis. Sem compromisso.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 mb-4">
              Dúvidas? Fale com nosso time comercial
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              Voltar para Home
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

// =====================================================================
// DATA
// =====================================================================

const placements = [
  {
    icon: Search,
    title: 'Card Patrocinado',
    description: 'Destaque seu perfil no topo da busca de profissionais. Apareça antes dos resultados orgânicos.',
    reach: 'Até 100k visualizações/mês',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    icon: Calendar,
    title: 'Banner de Evento',
    description: 'Apareça na home para quem busca diversão. Promova shows, festivais e experiências.',
    reach: 'Até 80k visualizações/mês',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    icon: Mail,
    title: 'Newsletter Exclusiva',
    description: 'Chegue na caixa de entrada de 50k produtores e profissionais cadastrados.',
    reach: 'Até 50k emails/mês',
    color: 'bg-gradient-to-br from-green-500 to-green-600'
  }
];

const approvedContent = [
  'Imagens em alta resolução (mín. 1200px)',
  'Conteúdo relacionado a eventos e produção',
  'Ofertas claras e transparentes',
  'Marcas verificadas e registradas',
  'Campanhas educacionais e institucionais'
];

const rejectedContent = [
  'Imagens de baixa resolução ou borradas',
  'Conteúdo ofensivo, político ou religioso',
  'Promessas financeiras falsas ou enganosas',
  'Produtos não relacionados a eventos',
  'Logos com marca d\'água ou textos ilegíveis'
];
