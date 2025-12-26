/**
 * =====================================================================
 * MediaKitModal - Modal de Mídia Kit / Anuncie Conosco
 * =====================================================================
 * Componente para captar anunciantes com email pré-preenchido
 */

import { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Users, 
  Eye, 
  Target,
  Mail,
  Download,
  ExternalLink
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface MediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaKitModal({ isOpen, onClose }: MediaKitModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  if (!isOpen) return null;

  // Email pré-configurado
  const handleContactCommercial = (packageName?: string) => {
    const subject = packageName 
      ? `Interesse em Anunciar - Pacote ${packageName}`
      : 'Solicitar Mídia Kit e Informações Comerciais';
    
    const body = `Olá equipe MagnaFest!

Gostaria de receber mais informações sobre as oportunidades de anúncio no Portal MagnaFest.

${packageName ? `Pacote de interesse: ${packageName}\n` : ''}
Nome da Empresa: 
Segmento: 
Contato: 
Telefone: 

Aguardo retorno.

Atenciosamente.`;

    const mailtoLink = `mailto:${siteConfig.emails.comercial}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-magna-dark border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-magna-violet to-magna-magenta p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black uppercase mb-2">📢 Anuncie no MagnaFest</h2>
              <p className="text-white/80">Alcance milhares de profissionais do setor de eventos</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Users />} label="Profissionais" value="10K+" color="text-magna-cyan" />
            <StatCard icon={<Eye />} label="Pageviews/mês" value="50K+" color="text-green-500" />
            <StatCard icon={<Target />} label="Taxa de Conversão" value="8.5%" color="text-yellow-500" />
            <StatCard icon={<TrendingUp />} label="Crescimento" value="+120%" color="text-magna-magenta" />
          </div>

          {/* Pacotes */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Pacotes Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Banner Superior */}
              <PackageCard
                name="Banner Superior"
                price="R$ 1.500/mês"
                features={[
                  'Posição Premium no Topo',
                  'Todas as Páginas',
                  'Design Responsivo',
                  'Relatório Mensal'
                ]}
                highlight={false}
                onSelect={() => {
                  setSelectedPackage('Banner Superior');
                  handleContactCommercial('Banner Superior');
                }}
              />

              {/* Banner de Busca */}
              <PackageCard
                name="Banner de Busca"
                price="R$ 2.500/mês"
                features={[
                  'Página de Explorar',
                  'Segmentação por Categoria',
                  'Alta Visibilidade',
                  'CTR Otimizado'
                ]}
                highlight={true}
                onSelect={() => {
                  setSelectedPackage('Banner de Busca');
                  handleContactCommercial('Banner de Busca');
                }}
              />

              {/* Patrocínio de Conteúdo */}
              <PackageCard
                name="Branded Content"
                price="R$ 3.500/mês"
                features={[
                  'Posts no Blog',
                  'Entrevistas Patrocinadas',
                  'Newsletter Dedicada',
                  'Redes Sociais'
                ]}
                highlight={false}
                onSelect={() => {
                  setSelectedPackage('Branded Content');
                  handleContactCommercial('Branded Content');
                }}
              />
            </div>
          </div>

          {/* CTA Principal */}
          <div className="bg-gradient-to-r from-magna-violet/20 to-magna-magenta/20 border border-magna-violet/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Precisa de um Plano Customizado?</h3>
                <p className="text-gray-400">
                  Nossa equipe comercial está pronta para criar uma solução sob medida para sua marca.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleContactCommercial()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-magna-violet to-magna-magenta hover:opacity-90 text-white font-bold rounded-xl transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Falar com Comercial
                </button>
                <button
                  onClick={() => alert('Download do Mídia Kit em desenvolvimento')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                >
                  <Download className="w-5 h-5" />
                  Baixar Mídia Kit
                </button>
              </div>
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="text-center text-sm text-gray-400">
            <p>
              Email direto: <a href={`mailto:${siteConfig.emails.comercial}`} className="text-magna-cyan hover:underline">{siteConfig.emails.comercial}</a>
            </p>
            <p className="mt-2">
              WhatsApp Comercial: <a href={`https://wa.me/${siteConfig.whatsapp.number}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Chamar Agora</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// SUB-COMPONENTS
// =====================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-black border border-white/10 rounded-lg p-4 text-center">
      <div className={`mx-auto mb-2 ${color}`}>
        {icon}
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

interface PackageCardProps {
  name: string;
  price: string;
  features: string[];
  highlight: boolean;
  onSelect: () => void;
}

function PackageCard({ name, price, features, highlight, onSelect }: PackageCardProps) {
  return (
    <div className={`relative bg-black border rounded-xl p-6 hover:scale-105 transition-transform ${
      highlight ? 'border-magna-violet shadow-[0_0_30px_rgba(138,43,226,0.3)]' : 'border-white/10'
    }`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-magna-violet text-xs font-bold rounded-full">
          MAIS POPULAR
        </div>
      )}
      
      <h4 className="text-xl font-bold mb-2">{name}</h4>
      <p className={`text-3xl font-black mb-4 ${highlight ? 'text-magna-violet' : 'text-white'}`}>
        {price}
      </p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="text-green-500">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg transition-all ${
          highlight
            ? 'bg-gradient-to-r from-magna-violet to-magna-magenta text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        <ExternalLink className="w-4 h-4" />
        Solicitar Proposta
      </button>
    </div>
  );
}
