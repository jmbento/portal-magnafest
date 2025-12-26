/**
 * =====================================================================
 * ProfileDetailsPage - Página de Perfil Profissional (High Conversion)
 * =====================================================================
 * Otimizada para conversão com CTAs estratégicos e prova social
 */

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  FileText, 
  Award,
  Instagram,
  Mail,
  Phone,
  Briefcase,
  Zap,
  Shield
} from 'lucide-react';

// =====================================================================
// MOCK DATA (Simula dados do Supabase)
// =====================================================================

const MOCK_PROFILE = {
  id: '1',
  name: 'Carlos Henrique Silva',
  category: 'Técnico de Som',
  categorySlug: 'tecnico-de-som',
  location: 'São Paulo, SP',
  verified: true,
  rating: 4.9,
  totalEvents: 140,
  responseTime: '< 1h',
  whatsapp: '11987654321',
  instagram: '@carlosaudio',
  email: 'contato@carlosaudio.com',
  bio: 'Técnico de som profissional com mais de 10 anos de experiência em eventos corporativos, shows ao vivo e festivais. Especializado em mixagem de bandas, PA de grande porte e instalação de equipamentos. Trabalho com as principais marcas do mercado e possuo equipe de apoio para eventos de qualquer porte.',
  equipment: [
    'Mesa Digital Behringer X32',
    'Caixas Line Array QSC',
    'Microfones Shure SM58/Beta',
    'Sistema In-Ear Sennheiser',
    'Processadores DBX',
    'Cabos e Conectores Profissionais'
  ],
  portfolio: [
    'https://source.unsplash.com/800x600/?concert,sound,mixing',
    'https://source.unsplash.com/800x600/?stage,audio,mixer',
    'https://source.unsplash.com/800x600/?festival,speakers,equipment',
    'https://source.unsplash.com/800x600/?concert,lights,crowd',
    'https://source.unsplash.com/800x600/?sound-engineer,studio',
    'https://source.unsplash.com/800x600/?live-music,stage'
  ]
};

const RELATED_PROFESSIONALS = [
  {
    id: '2',
    name: 'Ana Paula Luz',
    category: 'Técnica de Iluminação',
    categorySlug: 'tecnico-de-iluminacao',
    location: 'São Paulo, SP',
    rating: 4.8,
    avatar: 'https://source.unsplash.com/200x200/?woman,professional'
  },
  {
    id: '3',
    name: 'Roberto Energia',
    category: 'Eletricista/Geradores',
    categorySlug: 'eletricista',
    location: 'São Paulo, SP',
    rating: 4.7,
    avatar: 'https://source.unsplash.com/200x200/?man,engineer'
  },
  {
    id: '4',
    name: 'Marina Eventos',
    category: 'Produtora de Eventos',
    categorySlug: 'produtor-de-eventos',
    location: 'São Paulo, SP',
    rating: 5.0,
    avatar: 'https://source.unsplash.com/200x200/?woman,business'
  }
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function ProfileDetailsPage() {
  const { id } = useParams();
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  // Simula carregamento do perfil (futuramente será Supabase)
  const profile = MOCK_PROFILE;

  // ================================================================
  // HANDLERS
  // ================================================================

  const handleWhatsAppClick = () => {
    const phone = profile.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${profile.name}! Vi seu perfil no Portal MagnaFest e gostaria de solicitar um orçamento.`
    );
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  const handleRequestQuote = () => {
    // TODO: Implementar modal de solicitação de orçamento
    alert('Funcionalidade de orçamento em desenvolvimento!');
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <main className="min-h-screen bg-magna-black text-white pb-24 md:pb-0">
      {/* ================================================================
          HERO SECTION (Imersivo com Capa + Avatar)
          ================================================================ */}
      <div className="relative">
        {/* Capa com Imagem */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          <img
            src={`https://source.unsplash.com/1600x800/?${profile.categorySlug},concert,stage`}
            alt="Capa do perfil"
            className="w-full h-full object-cover"
          />
          {/* Gradiente de Fusão */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-magna-black/60 to-magna-black" />
        </div>

        {/* Container de Informações */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24">
            {/* Avatar Circular Grande */}
            <div className="flex items-end gap-6 mb-6">
              <div className="relative">
                <img
                  src="https://source.unsplash.com/200x200/?man,professional,portrait"
                  alt={profile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-magna-black object-cover shadow-2xl"
                />
                {profile.verified && (
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-magna-black shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Info Principal (Desktop) */}
              <div className="hidden md:block flex-1 pb-4">
                <h1 className="text-4xl font-black mb-2">{profile.name}</h1>
                <div className="flex items-center gap-4 text-lg text-gray-300">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-magna-violet" />
                    <span className="font-semibold">{profile.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-magna-cyan" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Principal (Mobile) */}
            <div className="md:hidden mb-6">
              <h1 className="text-3xl font-black mb-2">{profile.name}</h1>
              <div className="flex flex-col gap-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-magna-violet" />
                  <span className="font-semibold">{profile.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-magna-cyan" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          BARRA DE ESTATÍSTICAS (Prova Social)
          ================================================================ */}
      <div className="bg-magna-dark border-y border-white/10 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 max-w-3xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-5 h-5 text-magna-violet" />
                <p className="text-2xl md:text-3xl font-bold">{profile.totalEvents}+</p>
              </div>
              <p className="text-xs md:text-sm text-gray-400">Eventos Realizados</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <p className="text-2xl md:text-3xl font-bold">{profile.rating}</p>
              </div>
              <p className="text-xs md:text-sm text-gray-400">Avaliação</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-green-500" />
                <p className="text-2xl md:text-3xl font-bold">{profile.responseTime}</p>
              </div>
              <p className="text-xs md:text-sm text-gray-400">Tempo de Resposta</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          LAYOUT DE CONTEÚDO (Grid com Sticky CTA)
          ================================================================ */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========================================================
              COLUNA ESQUERDA - Sobre & Portfolio (2/3)
              ======================================================== */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sobre Mim */}
            <section className="bg-magna-dark border border-white/10 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-magna-violet" />
                Sobre Mim
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </section>

            {/* Equipamentos Próprios (Mobile) */}
            <section className="lg:hidden bg-magna-dark border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-magna-cyan" />
                Equipamentos Próprios
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-magna-violet/20 text-magna-cyan text-sm rounded-full border border-magna-violet/30"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            {/* Galeria de Portfolio */}
            <section className="bg-magna-dark border border-white/10 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-magna-magenta" />
                Portfolio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setShowImageModal(image)}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`Trabalho ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver Ampliado
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================
              COLUNA DIREITA - CTA Sticky (1/3 Desktop)
              ======================================================== */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Card de Contato */}
              <div className="bg-magna-dark border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold mb-4">Entre em Contato</h3>

                {/* Botão WhatsApp Gigante */}
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-green-500/50"
                >
                  <MessageCircle className="w-6 h-6" />
                  Chamar no WhatsApp
                </button>

                {/* Botão Orçamento */}
                <button
                  onClick={handleRequestQuote}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-magna-violet to-magna-magenta hover:opacity-90 text-white font-bold rounded-xl transition-all"
                >
                  <FileText className="w-5 h-5" />
                  Solicitar Orçamento PDF
                </button>

                {/* Contatos Alternativos */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-300 hover:text-magna-magenta transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>{profile.instagram}</span>
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-2 text-gray-300 hover:text-magna-cyan transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{profile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Equipamentos */}
              <div className="bg-magna-dark border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-magna-cyan" />
                  Equipamentos Próprios
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.equipment.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-magna-violet/20 text-magna-cyan text-xs rounded-full border border-magna-violet/30"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          CROSS-SELL - "Quem viu também contratou"
          ================================================================ */}
      <div className="bg-magna-dark border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Quem contratou este profissional também viu:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {RELATED_PROFESSIONALS.map((related) => (
              <Link
                key={related.id}
                to={`/perfil/${related.id}`}
                className="bg-magna-black border border-white/10 rounded-xl p-6 hover:border-magna-cyan/50 hover:shadow-[0_0_20px_rgba(138,43,226,0.2)] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={related.avatar}
                    alt={related.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg line-clamp-1">{related.name}</h3>
                    <p className="text-sm text-gray-400">{related.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-semibold">{related.rating}</span>
                  </div>
                  <span className="text-gray-400">{related.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================
          MOBILE - Fixed WhatsApp Button (Bottom)
          ================================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-magna-dark border-t border-white/20 p-4">
        <button
          onClick={handleWhatsAppClick}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 active:bg-green-700 text-white font-bold text-lg rounded-xl shadow-2xl"
        >
          <MessageCircle className="w-6 h-6" />
          Chamar no WhatsApp
        </button>
      </div>

      {/* Modal de Imagem Ampliada */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(null)}
        >
          <img
            src={showImageModal}
            alt="Portfolio ampliado"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </main>
  );
}
