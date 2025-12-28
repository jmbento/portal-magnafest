/**
 * =====================================================================
 * INSTAGRAM SCRAPER - Busca profissionais de eventos
 * =====================================================================
 * Busca perfis públicos com hashtags relacionadas a eventos
 * Hashtags: #tecnicosom #producaoevento #dj #iluminacao etc
 */

interface InstagramProfile {
  username: string;
  full_name: string;
  bio: string;
  profile_pic_url: string;
  follower_count: number;
  location?: string;
  website?: string;
}

interface ScrapedProfessional {
  name: string;
  description: string;
  city: string;
  state: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  avatar_url: string;
  latitude?: number;
  longitude?: number;
  source: 'ai-scraper';
}

export class InstagramScraper {
  private hashtags = [
    'tecnicosom',
    'producaoevento',
    'somaovivo',
    'iluminacaoeventos',
    'djproducer',
    'riggerprofissional',
    'backlinetech',
    'producaotecnica',
    'eventoproducao',
    'tecnicoiluminacao'
  ];

  /**
   * Busca profissionais por hashtag
   */
  async searchProfessionals(city: string, state: string, limit: number = 20): Promise<ScrapedProfessional[]> {
    try {
      console.log(`📸 Buscando profissionais no Instagram: ${city} - ${state}`);
      
      // Simulação realista (em produção, usar Instagram Graph API ou scraping)
      const mockProfiles = this.generateMockProfiles(city, state, limit);
      
      return mockProfiles;

    } catch (error) {
      console.error('Erro ao buscar no Instagram:', error);
      return [];
    }
  }

  /**
   * Gera perfis mock realistas
   * TODO: Substituir por Instagram Graph API ou scraping real
   */
  private generateMockProfiles(city: string, state: string, count: number): ScrapedProfessional[] {
    const roles = [
      { title: 'Técnico de Som', prefix: 'Audio', specialty: 'FOH, monitores e line array' },
      { title: 'Iluminador', prefix: 'Light', specialty: 'GrandMA, moving heads e LED' },
      { title: 'Roadie', prefix: 'Road', specialty: 'Montagem e logística de palco' },
      { title: 'DJ Producer', prefix: 'DJ', specialty: 'CDJ Pioneer e produção eletrônica' },
      { title: 'Rigger', prefix: 'Rigg', specialty: 'NR35 e estruturas suspensas' },
      { title: 'VJ', prefix: 'Visual', specialty: 'Projeção, LED walls e videomapping' },
      { title: 'Produtor Executivo', prefix: 'Prod', specialty: 'Gestão completa de eventos' },
      { title: 'Fotógrafo de Eventos', prefix: 'Foto', specialty: 'Shows, festivais e corporativo' }
    ];

    const names = [
      'Bruno', 'Lucas', 'Gabriel', 'Rafael', 'Felipe', 'Thiago', 'Diego', 'André',
      'Fernanda', 'Juliana', 'Camila', 'Amanda', 'Beatriz', 'Carolina', 'Larissa', 'Mariana'
    ];

    const lastNames = [
      'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Pereira', 'Alves',
      'Ferreira', 'Rodrigues', 'Martins', 'Araújo', 'Melo', 'Barbosa', 'Ribeiro', 'Carvalho'
    ];

    const profiles: ScrapedProfessional[] = [];

    for (let i = 0; i < count; i++) {
      const role = roles[i % roles.length];
      const firstName = names[Math.floor(Math.random() * names.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      
      const username = `${firstName.toLowerCase()}${role.prefix.toLowerCase()}${Math.floor(Math.random() * 99)}`;
      const yearsExp = Math.floor(Math.random() * 15) + 3;

      profiles.push({
        name: `${fullName} - ${role.title}`,
        description: `${role.title} profissional com ${yearsExp} anos de experiência. ${role.specialty}. Atua em ${city} e região.`,
        city,
        state,
        email: `${username}@gmail.com`,
        whatsapp: this.generatePhone(state),
        instagram: `@${username}`,
        avatar_url: `https://i.pravatar.cc/200?u=${username}`,
        latitude: this.getApproximateLatitude(state),
        longitude: this.getApproximateLongitude(state),
        source: 'ai-scraper'
      });
    }

    return profiles;
  }

  /**
   * Gera telefone válido por estado (DDD real)
   */
  private generatePhone(state: string): string {
    const ddds: Record<string, string> = {
      'SP': '11', 'RJ': '21', 'MG': '31', 'BA': '71',
      'PR': '41', 'RS': '51', 'SC': '48', 'DF': '61',
      'CE': '85', 'PE': '81', 'GO': '62', 'ES': '27'
    };
    const ddd = ddds[state] || '11';
    const number = Math.floor(Math.random() * 900000000) + 100000000;
    return `${ddd}9${number}`;
  }

  private getApproximateLatitude(state: string): number {
    const coords: Record<string, number> = {
      'SP': -23.5505, 'RJ': -22.9068, 'MG': -19.9167, 'BA': -12.9714,
      'PR': -25.4284, 'RS': -30.0346, 'SC': -27.5954, 'DF': -15.8267,
      'CE': -3.7172, 'PE': -8.0476, 'GO': -16.6869, 'ES': -20.3155
    };
    return coords[state] || -23.5505;
  }

  private getApproximateLongitude(state: string): number {
    const coords: Record<string, number> = {
      'SP': -46.6333, 'RJ': -43.1729, 'MG': -43.9345, 'BA': -38.5014,
      'PR': -49.2733, 'RS': -51.2177, 'SC': -48.5480, 'DF': -47.9218,
      'CE': -38.5433, 'PE': -34.8770, 'GO': -49.2648, 'ES': -40.3128
    };
    return coords[state] || -46.6333;
  }
}

export const instagramScraper = new InstagramScraper();
