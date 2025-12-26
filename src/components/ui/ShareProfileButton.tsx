/**
 * =====================================================================
 * ShareProfileButton - Botão de Compartilhar Perfil
 * =====================================================================
 * Usa Web Share API (mobile) com fallback para clipboard (desktop)
 */

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

// =====================================================================
// PROPS
// =====================================================================

interface ShareProfileButtonProps {
  providerName: string;
  providerSlug: string | null;
  variant?: 'default' | 'outline' | 'compact';
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function ShareProfileButton({
  providerName,
  providerSlug,
  variant = 'default',
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  // Gerar URL do perfil
  const profileUrl = providerSlug 
    ? `${window.location.origin}/fornecedores/${providerSlug}`
    : window.location.href;

  // Mensagem de compartilhamento - VIRAL!
  const shareMessage = `🌟 Gostou do meu trabalho? Vote em mim no MagnaFest para eu subir no ranking!\n\n${providerName}\n\nAcesse: ${profileUrl}`;

  const handleShare = async () => {
    try {
      // Tentar usar Web Share API (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `${providerName} | MagnaFest`,
          text: shareMessage,
          url: profileUrl,
        });
        return;
      }

      // Fallback: Copiar para clipboard (desktop)
      await navigator.clipboard.writeText(shareMessage);
      
      // Feedback visual
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      
      // Fallback manual: prompt com texto
      prompt('Copie o link abaixo:', shareMessage);
    }
  };

  // Variantes de estilo
  const getButtonClasses = () => {
    const baseClasses = 'flex items-center gap-2 font-medium transition-all duration-200 transform active:scale-95';
    
    switch (variant) {
      case 'outline':
        return `${baseClasses} px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50`;
      
      case 'compact':
        return `${baseClasses} px-2 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-50 hover:border-gray-300`;
      
      default: // 'default'
        return `${baseClasses} px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg hover:scale-105`;
    }
  };

  return (
    <button
      onClick={handleShare}
      className={getButtonClasses()}
      title="Compartilhar perfil"
    >
      {copied ? (
        <>
          <Check className={`w-4 h-4 ${variant === 'default' ? 'text-white' : 'text-green-600'}`} />
          <span className={variant === 'default' ? 'text-white' : 'text-green-600'}>
            Link copiado!
          </span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className={variant === 'compact' ? 'hidden sm:inline' : ''}>
            Compartilhar
          </span>
        </>
      )}
    </button>
  );
}

// =====================================================================
// ICON VERSION (Apenas ícone)
// =====================================================================

export function ShareProfileButtonIcon({
  providerName,
  providerSlug,
}: Omit<ShareProfileButtonProps, 'variant'>) {
  const [copied, setCopied] = useState(false);

  const profileUrl = providerSlug 
    ? `${window.location.origin}/fornecedores/${providerSlug}`
    : window.location.href;

  const shareMessage = `🌟 Vote em ${providerName} no MagnaFest!\n${profileUrl}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${providerName} | MagnaFest`,
          text: shareMessage,
          url: profileUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"
      title="Compartilhar perfil"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
    </button>
  );
}
