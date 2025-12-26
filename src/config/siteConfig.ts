/**
 * =====================================================================
 * SITE CONFIG - Configuração Centralizada do Portal MagnaFest
 * =====================================================================
 * Single Source of Truth para informações do site
 */

export const siteConfig = {
  // Informações Básicas
  name: 'Portal MagnaFest',
  tagline: 'Conectando Profissionais de Eventos',
  description: 'A maior plataforma de networking e contratação para o mercado de eventos no Brasil',
  
  // URLs
  url: 'https://magnafest.com.br',
  domain: 'magnafest.com.br',
  
  // Contatos (Estratégia Tática)
  emails: {
    // 🎯 Porta de entrada - Rodapé principal
    contato: 'contato@magnafest.com.br',
    
    // 🛟 Ajuda técnica - Esqueci senha, Central de Ajuda
    suporte: 'suporte@magnafest.com.br',
    
    // 💼 Negócios - Mídia Kit, Banner "Anuncie Aqui"
    comercial: 'comercial@magnafest.com.br',
    
    // 📰 Imprensa Oficial - Remetente do Bot Headhunter
    // Este email assina os convites de entrevista
    press: 'press@magnafest.com.br'
  },
  
  // Redes Sociais
  social: {
    instagram: 'https://instagram.com/magnafest',
    facebook: 'https://facebook.com/magnafest',
    twitter: 'https://twitter.com/magnafest',
    linkedin: 'https://linkedin.com/company/magnafest',
    youtube: 'https://youtube.com/@magnafest'
  },
  
  // WhatsApp (Suporte Comercial)
  whatsapp: {
    number: '5511999999999',
    message: 'Olá! Gostaria de saber mais sobre o Portal MagnaFest'
  },
  
  // Endereço
  address: {
    street: 'Av. Paulista, 1000',
    complement: 'Conjunto 123',
    city: 'São Paulo',
    state: 'SP',
    cep: '01310-100',
    country: 'Brasil'
  },
  
  // Legal
  cnpj: '00.000.000/0001-00',
  razaoSocial: 'MagnaFest Tecnologia e Eventos LTDA',
  
  // Links Úteis
  links: {
    termsOfService: '/termos-de-uso',
    privacyPolicy: '/politica-de-privacidade',
    faq: '/faq',
    help: '/ajuda',
    about: '/sobre',
    contact: '/contato',
    mediaKit: '/midia-kit',
    careers: '/carreiras'
  },
  
  // Metadata (SEO)
  metadata: {
    title: 'Portal MagnaFest - Profissionais de Eventos',
    titleTemplate: '%s | Portal MagnaFest',
    description: 'Encontre e contrate os melhores profissionais para seu evento. Som, iluminação, segurança, produção e muito mais.',
    keywords: [
      'eventos',
      'profissionais de eventos',
      'técnico de som',
      'iluminador',
      'segurança de eventos',
      'backstage',
      'produção de eventos',
      'contratar profissionais',
      'networking eventos'
    ],
    ogImage: '/og-image.png',
    twitterCard: 'summary_large_image'
  },
  
  // Features (Flags)
  features: {
    enableBlog: true,
    enableInterviews: true,
    enableAds: true,
    enableAnalytics: true,
    enableNewsletterft: true
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX',
    facebookPixelId: 'XXXXXXXXXX'
  }
} as const;

// Type-safe access
export type SiteConfig = typeof siteConfig;
