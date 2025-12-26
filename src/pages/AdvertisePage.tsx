/**
 * =====================================================================
 * AdvertisePage - Sua Marca no Centro do Palco
 * =====================================================================
 * Página de alta conversão para atrair anunciantes e parceiros
 * 
 * INSTRUÇÕES DE SETUP:
 * 1. Baixe uma imagem premium do Envato Elements ou Unsplash
 *    Busque por: "Concert Stage Technology" ou "Business Handshake Dark"
 * 2. Salve a imagem em: /public/assets/hero-advertise.jpg
 * 3. Dimensões recomendadas: 1920x1080px
 * 
 * Alternativamente, use Unsplash Source (temporário):
 * https://source.unsplash.com/1920x1080/?concert-stage,business-meeting
 */

import { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  Zap,
  FileText,
  Mail,
  Download,
  CheckCircle,
  Target,
  Eye,
  BarChart3,
  Sparkles
} from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { siteConfig } from '../config/siteConfig';

// =====================================================================
// COMPONENT
// =====================================================================

export default function AdvertisePage() {
  const [showThankYou, setShowThankYou] = useState(false);

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleContactCommercial = () => {
    const subject = 'Solicitar Mídia Kit Completo - Portal MagnaFest';
    const body = `Olá equipe Comercial MagnaFest!

Gostaria de receber o Mídia Kit completo e informações sobre oportunidades de anúncio no Portal MagnaFest.

Nome da Empresa: 
Segmento: 
Nome do Responsável: 
Telefone: 
Melhor horário para contato: 

Áreas de interesse:
[ ] Banner Homepage
[ ] Publipost / Review de Produto
[ ] E-mail Marketing
[ ] Branded Content
[ ] Patrocínio de Eventos
[ ] Outro: _______________

Aguardo retorno.

Atenciosamente.`;

    window.location.href = `mailto:${siteConfig.emails.comercial}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadMediaKit = () => {
    // TODO: Implementar download real do PDF
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
    alert('📄 Download do Mídia Kit em desenvolvimento.\n\nPor enquanto, entre em contato com nossa equipe comercial!');
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <main className="min-h-screen bg-magna-black text-white">
      {/* Hero Premium */}
      <PageHero 
        title="Sua Marca no Centro do Palco"
        subtitle="Conecte-se com a maior comunidade de produtores e técnicos de eventos do Brasil"
        imageKeyword="concert-stage,business-meeting,technology"
      />

      {/* Why Us - Números Impactantes */}
      <section className="py-16 bg-magna-dark border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
              Por Que Anunciar no MagnaFest?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Mais que visualizações: acesse uma audiência qualificada que realmente importa para seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ImpactCard
              icon={<Users className="w-16 h-16" />}
              number="5.000+"
              label="Profissionais Ativos"
              description="Técnicos, produtores e fornecedores cadastrados"
              color="from-magna-cyan to-blue-500"
            />
            
            <ImpactCard
              icon={<Target className="w-16 h-16" />}
              number="120+"
              label="Eventos Cadastrados/Mês"
              description="Demanda constante por equipamentos e serviços"
              color="from-magna-violet to-purple-500"
            />
            
            <ImpactCard
              icon={<TrendingUp className="w-16 h-16" />}
              number="8.5%"
              label="Taxa de Engajamento B2B"
              description="Muito acima da média do mercado digital"
              color="from-magna-magenta to-pink-500"
            />
          </div>

          {/* Stats Secundárias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <MiniStat icon={<Eye />} value="50K+" label="Pageviews/mês" />
            <MiniStat icon={<BarChart3 />} value="72%" label="Taxa de Retorno" />
            <MiniStat icon={<Sparkles />} value="4.8/5" label="Satisfação" />
            <MiniStat icon={<Zap />} value="+120%" label="Crescimento" />
          </div>
        </div>
      </section>

      {/* Formatos de Mídia (Produtos) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
              Formatos Disponíveis
            </h2>
            <p className="text-xl text-gray-400">
              Soluções flexíveis para cada tipo de objetivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Banner Homepage */}
            <MediaFormatCard
              icon={<Megaphone className="w-12 h-12" />}
              title="Banner Homepage"
              price="A partir de R$ 1.500/mês"
              description="Visibilidade máxima no topo do portal, primeira coisa que os usuários veem."
              features={[
                'Posicionamento Premium',
                'Todas as páginas do site',
                'Design responsivo incluído',
                'Relatório de performance',
                'Segmentação por categoria'
              ]}
              highlight={false}
            />

            {/* Publipost / Review */}
            <MediaFormatCard
              icon={<FileText className="w-12 h-12" />}
              title="Publipost / Review de Produto"
              price="A partir de R$ 2.500"
              description="Artigo técnico completo sobre seu equipamento ou serviço no nosso Blog."
              features={[
                'Conteúdo editorial profissional',
                'SEO otimizado',
                'Galeria de fotos/vídeos',
                'Permanência ilimitada',
                'Compartilhamento em redes sociais'
              ]}
              highlight={true}
            />

            {/* E-mail Marketing */}
            <MediaFormatCard
              icon={<Mail className="w-12 h-12" />}
              title="E-mail Marketing"
              price="A partir de R$ 3.000"
              description="Disparo exclusivo para nossa base qualificada de profissionais."
              features={[
                'Base segmentada por categoria',
                'Criação do layout incluída',
                'Métricas de abertura/clique',
                'Até 3 disparos mensais',
                'Suporte dedicado'
              ]}
              highlight={false}
            />
          </div>

          {/* Opções Adicionais */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Também oferecemos: <strong className="text-white">Branded Content</strong>, <strong className="text-white">Patrocínio de Entrevistas</strong>, <strong className="text-white">Banners Segmentados</strong> e mais.
            </p>
            <button
              onClick={handleContactCommercial}
              className="text-magna-cyan hover:text-magna-magenta transition-colors font-semibold underline"
            >
              Ver todas as opções →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Final (Alta Conversão) */}
      <section className="py-20 bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6">
              Receba Nosso Mídia Kit Completo
            </h2>
            <p className="text-2xl mb-8 text-white/90">
              Todas as informações, formatos, alcance e cases de sucesso em um único documento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleContactCommercial}
                className="flex items-center gap-3 px-8 py-5 bg-white text-magna-violet hover:bg-gray-100 font-black text-lg rounded-xl transition-all shadow-2xl transform hover:scale-105"
              >
                <Mail className="w-6 h-6" />
                Falar com o Comercial
              </button>

              <button
                onClick={handleDownloadMediaKit}
                className="flex items-center gap-3 px-8 py-5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white font-black text-lg rounded-xl transition-all border-2 border-white/30"
              >
                <Download className="w-6 h-6" />
                Baixar Apresentação (PDF)
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
              <a 
                href={`mailto:${siteConfig.emails.comercial}`}
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {siteConfig.emails.comercial}
              </a>
              <span className="hidden sm:inline">•</span>
              <a 
                href={`https://wa.me/${siteConfig.whatsapp.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-2"
              >
                <Megaphone className="w-4 h-4" />
                WhatsApp Comercial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Toast */}
      {showThankYou && (
        <div className="fixed bottom-8 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <p className="font-bold">Obrigado! Nossa equipe entrará em contato em breve.</p>
          </div>
        </div>
      )}
    </main>
  );
}

// =====================================================================
// SUB-COMPONENTS
// =====================================================================

interface ImpactCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  description: string;
  color: string;
}

function ImpactCard({ icon, number, label, description, color }: ImpactCardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-8 hover:border-magna-cyan/50 transition-all group">
      <div className={`bg-gradient-to-br ${color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <p className={`text-5xl font-black mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
        {number}
      </p>
      <h3 className="text-xl font-bold mb-2">{label}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

interface MiniStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function MiniStat({ icon, value, label }: MiniStatProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all">
      <div className="text-magna-cyan mb-2 flex justify-center">
        {icon}
      </div>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

interface MediaFormatCardProps {
  icon: React.ReactNode;
  title: string;
  price: string;
  description: string;
  features: string[];
  highlight: boolean;
}

function MediaFormatCard({ icon, title, price, description, features, highlight }: MediaFormatCardProps) {
  return (
    <div className={`relative bg-magna-dark border rounded-2xl p-8 hover:scale-105 transition-transform ${
      highlight 
        ? 'border-magna-violet shadow-[0_0_40px_rgba(138,43,226,0.4)]' 
        : 'border-white/10'
    }`}>
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-magna-violet to-magna-magenta text-white text-sm font-black rounded-full shadow-lg">
          MAIS POPULAR
        </div>
      )}

      <div className={`${highlight ? 'text-magna-violet' : 'text-white'} mb-4`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className={`text-3xl font-black mb-4 ${highlight ? 'text-magna-violet' : 'text-white'}`}>
        {price}
      </p>
      <p className="text-gray-400 mb-6 text-sm">
        {description}
      </p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          const subject = `Interesse em ${title}`;
          window.location.href = `mailto:${siteConfig.emails.comercial}?subject=${encodeURIComponent(subject)}`;
        }}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          highlight
            ? 'bg-gradient-to-r from-magna-violet to-magna-magenta text-white hover:opacity-90'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        Solicitar Proposta
      </button>
    </div>
  );
}
