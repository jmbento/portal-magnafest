/**
 * =====================================================================
 * SEEDER PAGE v2.0 - Georreferência + IA + Auto-limpeza
 * =====================================================================
 * - Geolocalização automática do usuário
 * - Filtragem regional de dados (raio 500km)
 * - IA Seeding (estrutura para dados reais)
 * - Auto-limpeza de dados fictícios ao atingir 200 reais
 * - Estatísticas em tempo real
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Database, 
  Users, 
  Calendar, 
  Trash2,
  CheckCircle, 
  XCircle,
  Loader2,
  Sparkles,
  AlertTriangle,
  MapPin,
  Zap,
  Globe,
  Target,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { aiSeedingService } from '../../services/ai-seeding.service';

// =====================================================================
// TYPES
// =====================================================================

interface Log {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

interface DataStats {
  real: number;
  fake: number;
  total: number;
}

// =====================================================================
// DATA SEEDS COM GEORREFERÊNCIA
// =====================================================================

const ELITE_PROFESSIONALS = [
  {
    name: "Carlos 'Gordo' Roadie",
    description: "Especialista em Line Array d&b audiotechnik. 15 anos de estrada em grandes festivais brasileiros.",
    city: "São Paulo",
    state: "SP",
    whatsapp: "11987654321",
    email: "gordo.roadie@magnafest.com.br",
    instagram: "@gordoroadie",
    avatar_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    name: "Ana Luz Lighting Designer",
    description: "Operadora GrandMA2 certificada. Trabalhou no Rock in Rio e Lollapalooza nos últimos 5 anos.",
    city: "Rio de Janeiro",
    state: "RJ",
    whatsapp: "21999887766",
    email: "ana.luz@magnafest.com.br",
    instagram: "@analuzld",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    latitude: -22.9068,
    longitude: -43.1729
  },
  {
    name: "Beto 'Monitor' Alves",
    description: "Técnico de monitores in-ear. Especialista em Shure PSM e Sennheiser. Turnês nacionais e internacionais.",
    city: "Belo Horizonte",
    state: "MG",
    whatsapp: "31988776655",
    email: "beto.monitor@magnafest.com.br",
    instagram: "@betomonitor",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    latitude: -19.9167,
    longitude: -43.9345
  },
  {
    name: "Mariana Rigging Pro",
    description: "Rigger NR35 certificada. Especialista em estruturas suspensas e cálculo de cargas. 200+ shows realizados.",
    city: "Curitiba",
    state: "PR",
    whatsapp: "41977665544",
    email: "mari.rigging@magnafest.com.br",
    instagram: "@mariarigging",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    latitude: -25.4284,
    longitude: -49.2733
  },
  {
    name: "Ricardo 'Truss' Montagem",
    description: "Montador de estruturas metálicas. Box truss, ground support e torres. Equipe própria com 8 profissionais.",
    city: "Porto Alegre",
    state: "RS",
    whatsapp: "51966554433",
    email: "ricardo.truss@magnafest.com.br",
    instagram: "@ricardotruss",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    latitude: -30.0346,
    longitude: -51.2177
  },
  {
    name: "Julia Power - Eletricista Master",
    description: "Eletricista NR10 certificada. Dimensionamento de carga, quadros de distribuição e geradores. 12 anos de experiência.",
    city: "Brasília",
    state: "DF",
    whatsapp: "61955443322",
    email: "julia.power@magnafest.com.br",
    instagram: "@juliapower",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    latitude: -15.8267,
    longitude: -47.9218
  },
  {
    name: "Fernando Stage Manager",
    description: "Produtor técnico de palco. Coordenação de equipes, timelines e rider técnico. Fluente em inglês.",
    city: "São Paulo",
    state: "SP",
    whatsapp: "11944332211",
    email: "fernando.stage@magnafest.com.br",
    instagram: "@fernandostage",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    name: "Camila Video Engineer",
    description: "Técnica de vídeo e projeção. LED walls, videomapping e live streaming. Portfolio com eventos corporativos e shows.",
    city: "Florianópolis",
    state: "SC",
    whatsapp: "48933221100",
    email: "camila.video@magnafest.com.br",
    instagram: "@camilavideo",
    avatar_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
    latitude: -27.5954,
    longitude: -48.5480
  },
  {
    name: "Pedro DJ Tech",
    description: "Técnico de DJ e setup de palco. CDJ, mixers Pioneer e Serato. Atende DJs nacionais e internacionais.",
    city: "Recife",
    state: "PE",
    whatsapp: "81922110099",
    email: "pedro.djtech@magnafest.com.br",
    instagram: "@pedrodjtech",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    latitude: -8.0476,
    longitude: -34.8770
  },
  {
    name: "Tatiana Backline",
    description: "Técnica de backline e afinação de instrumentos. Guitarra, baixo, bateria e teclados. Turnês com bandas nacionais.",
    city: "Salvador",
    state: "BA",
    whatsapp: "71911009988",
    email: "tati.backline@magnafest.com.br",
    instagram: "@tatibackline",
    avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
    latitude: -12.9714,
    longitude: -38.5014
  },
  {
    name: "Roberto FOH Engineer",
    description: "Engenheiro de som de front. Mixing desk analógica e digital. 20 anos de carreira em grandes festivais.",
    city: "Fortaleza",
    state: "CE",
    whatsapp: "85900998877",
    email: "roberto.foh@magnafest.com.br",
    instagram: "@robertofoh",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    latitude: -3.7172,
    longitude: -38.5433
  },
  {
    name: "Larissa RF Specialist",
    description: "Especialista em sistemas wireless. RF scanning, antenas e coordenação de frequências. IEM e microfones sem fio.",
    city: "Manaus",
    state: "AM",
    whatsapp: "92899887766",
    email: "larissa.rf@magnafest.com.br",
    instagram: "@larissarf",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    latitude: -3.1190,
    longitude: -60.0217
  },
  {
    name: "Gustavo Generator Tech",
    description: "Operador de geradores de energia. Sistemas de 50kVA a 500kVA. Manutenção preventiva e corretiva.",
    city: "Goiânia",
    state: "GO",
    whatsapp: "62888776655",
    email: "gustavo.gen@magnafest.com.br",
    instagram: "@gustavogen",
    avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    latitude: -16.6869,
    longitude: -49.2648
  },
  {
    name: "Bianca Safety Manager",
    description: "Coordenadora de segurança e brigadista. NR33 e primeiros socorros. Planos de evacuação e emergência.",
    city: "Vitória",
    state: "ES",
    whatsapp: "27877665544",
    email: "bianca.safety@magnafest.com.br",
    instagram: "@biancasafety",
    avatar_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80",
    latitude: -20.3155,
    longitude: -40.3128
  },
  {
    name: "Marcos Drone Operator",
    description: "Piloto de drone certificado ANAC. Captação aérea de eventos. Portfolio com grandes festivais e shows.",
    city: "Campinas",
    state: "SP",
    whatsapp: "19866554433",
    email: "marcos.drone@magnafest.com.br",
    instagram: "@marcosdrone",
    avatar_url: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80",
    latitude: -22.9099,
    longitude: -47.0626
  },
  {
    name: "Patrícia Production Manager",
    description: "Gerente de produção executiva. Coordenação de equipes, orçamentos e cronogramas. MBA em Gestão de Eventos.",
    city: "São Paulo",
    state: "SP",
    whatsapp: "11855443322",
    email: "patricia.prod@magnafest.com.br",
    instagram: "@patriciaprod",
    avatar_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    latitude: -23.5505,
    longitude: -46.6333
  },
  {
    name: "Diego Pyro Specialist",
    description: "Pirotécnico certificado pelo Exército. Efeitos especiais, fogos de artifício e máquinas de CO2/confete.",
    city: "Curitiba",
    state: "PR",
    whatsapp: "41844332211",
    email: "diego.pyro@magnafest.com.br",
    instagram: "@diegopyro",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    latitude: -25.4284,
    longitude: -49.2733
  },
  {
    name: "Renata Scenic Designer",
    description: "Cenógrafa e designer de palco. Projetos 3D em SketchUp e AutoCAD. Portfolio com teatros e eventos corporativos.",
    city: "Rio de Janeiro",
    state: "RJ",
    whatsapp: "21833221100",
    email: "renata.scenic@magnafest.com.br",
    instagram: "@renatascenic",
    avatar_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
    latitude: -22.9068,
    longitude: -43.1729
  },
  {
    name: "Thiago Catering Manager",
    description: "Gerente de catering para eventos. Cardápios personalizados, equipe de garçons e bartenders. 300+ eventos realizados.",
    city: "Belo Horizonte",
    state: "MG",
    whatsapp: "31822110099",
    email: "thiago.catering@magnafest.com.br",
    instagram: "@thiagocatering",
    avatar_url: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80",
    latitude: -19.9167,
    longitude: -43.9345
  },
  {
    name: "Vanessa Hospitality Pro",
    description: "Coordenadora de hospitalidade e backstage. Atendimento a artistas, camarins e rider de alimentação.",
    city: "Porto Alegre",
    state: "RS",
    whatsapp: "51811009988",
    email: "vanessa.hosp@magnafest.com.br",
    instagram: "@vanessahosp",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    latitude: -30.0346,
    longitude: -51.2177
  }
];

const MEGA_EVENTS_2025 = [
  {
    title: "Festival de Verão Salvador 2025",
    slug: "festival-verao-salvador-2025",
    short_description: "O maior festival de verão do Nordeste com 3 dias de shows e 50 artistas nacionais e internacionais.",
    starts_at: "2025-02-14T18:00:00Z",
    ends_at: "2025-02-16T23:59:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Salvador", 
      state: "BA", 
      venue: "Parque de Exposições",
      latitude: -12.9714,
      longitude: -38.5014
    },
    hero_image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1920&q=80",
    capacity: 50000,
    price_info: { min: 280, max: 1200, currency: "BRL" }
  },
  {
    title: "Turnê Sertanejo Prime 2025",
    slug: "turne-sertanejo-prime-2025",
    short_description: "10 shows em 10 capitais com os maiores nomes do sertanejo universitário.",
    starts_at: "2025-03-01T20:00:00Z",
    ends_at: "2025-03-01T23:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "São Paulo", 
      state: "SP", 
      venue: "Allianz Parque",
      latitude: -23.5505,
      longitude: -46.6333
    },
    hero_image_url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=1920&q=80",
    capacity: 40000,
    price_info: { min: 150, max: 800, currency: "BRL" }
  },
  {
    title: "Rock Stage SP - Edição Especial",
    slug: "rock-stage-sp-2025",
    short_description: "Festival de rock com bandas nacionais e internacionais. Line-up exclusivo com headliners inéditos no Brasil.",
    starts_at: "2025-04-20T16:00:00Z",
    ends_at: "2025-04-20T23:59:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "São Paulo", 
      state: "SP", 
      venue: "Autódromo de Interlagos",
      latitude: -23.7011,
      longitude: -46.6969
    },
    hero_image_url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1920&q=80",
    capacity: 60000,
    price_info: { min: 320, max: 1500, currency: "BRL" }
  },
  {
    title: "Eletronic Waves Rio",
    slug: "eletronic-waves-rio-2025",
    short_description: "Festival de música eletrônica na praia de Copacabana com DJs internacionais.",
    starts_at: "2025-05-10T14:00:00Z",
    ends_at: "2025-05-11T06:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Rio de Janeiro", 
      state: "RJ", 
      venue: "Praia de Copacabana",
      latitude: -22.9068,
      longitude: -43.1729
    },
    hero_image_url: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1920&q=80",
    capacity: 100000,
    price_info: { min: 200, max: 1000, currency: "BRL" }
  },
  {
    title: "Show da Virada Mineirão",
    slug: "show-virada-mineirao-2025",
    short_description: "Réveillon 2025 no Mineirão com grandes shows e queima de fogos.",
    starts_at: "2025-12-31T20:00:00Z",
    ends_at: "2026-01-01T03:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Belo Horizonte", 
      state: "MG", 
      venue: "Estádio Mineirão",
      latitude: -19.9167,
      longitude: -43.9345
    },
    hero_image_url: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1920&q=80",
    capacity: 70000,
    price_info: { min: 250, max: 1200, currency: "BRL" }
  },
  {
    title: "Arena Jeunesse - Hip Hop Festival",
    slug: "arena-jeunesse-hiphop-2025",
    short_description: "Festival de hip hop e rap com artistas nacionais e norte-americanos.",
    starts_at: "2025-06-15T18:00:00Z",
    ends_at: "2025-06-15T23:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Rio de Janeiro", 
      state: "RJ", 
      venue: "Jeunesse Arena",
      latitude: -22.9759,
      longitude: -43.3939
    },
    hero_image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1920&q=80",
    capacity: 18000,
    price_info: { min: 180, max: 900, currency: "BRL" }
  },
  {
    title: "Forró Caju Festival 2025",
    slug: "forro-caju-festival-2025",
    short_description: "3 dias de forró pé de serra em Aracaju com os maiores nomes do gênero.",
    starts_at: "2025-06-20T19:00:00Z",
    ends_at: "2025-06-22T23:59:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Aracaju", 
      state: "SE", 
      venue: "Centro de Convenções",
      latitude: -10.9472,
      longitude: -37.0731
    },
    hero_image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1920&q=80",
    capacity: 15000,
    price_info: { min: 100, max: 500, currency: "BRL" }
  },
  {
    title: "Jazz & Blues Porto Alegre",
    slug: "jazz-blues-poa-2025",
    short_description: "Festival intimista de jazz e blues com artistas brasileiros e internacionais.",
    starts_at: "2025-07-10T19:00:00Z",
    ends_at: "2025-07-12T23:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Porto Alegre", 
      state: "RS", 
      venue: "Teatro do Bourbon Country",
      latitude: -30.0346,
      longitude: -51.2177
    },
    hero_image_url: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1920&q=80",
    capacity: 3000,
    price_info: { min: 150, max: 600, currency: "BRL" }
  },
  {
    title: "Techno Warehouse Curitiba",
    slug: "techno-warehouse-cwb-2025",
    short_description: "Rave techno underground em galpão industrial com DJs europeus.",
    starts_at: "2025-08-05T22:00:00Z",
    ends_at: "2025-08-06T10:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Curitiba", 
      state: "PR", 
      venue: "Galpão Industrial - Zona Norte",
      latitude: -25.4284,
      longitude: -49.2733
    },
    hero_image_url: "https://images.unsplash.com/photo-1571266028243-d220c6e2e99c?auto=format&fit=crop&w=1920&q=80",
    capacity: 5000,
    price_info: { min: 120, max: 400, currency: "BRL" }
  },
  {
    title: "MPB Sunset Session - Floripa",
    slug: "mpb-sunset-floripa-2025",
    short_description: "Shows intimistas de MPB ao pôr do sol na Lagoa da Conceição.",
    starts_at: "2025-09-14T17:00:00Z",
    ends_at: "2025-09-14T22:00:00Z",
    format: "in_person" as const,
    status: "published" as const,
    location_data: { 
      city: "Florianópolis", 
      state: "SC", 
      venue: "Lagoa da Conceição",
      latitude: -27.5954,
      longitude: -48.5480
    },
    hero_image_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1920&q=80",
    capacity: 2000,
    price_info: { min: 80, max: 300, currency: "BRL" }
  }
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function SeederPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);
  const [stats, setStats] = useState<{ profiles: DataStats; events: DataStats }>({
    profiles: { real: 0, fake: 0, total: 0 },
    events: { real: 0, fake: 0, total: 0 }
  });

  // ================================================================
  // GEOLOCALIZAÇÃO
  // ================================================================

  useEffect(() => {
    requestGeolocation();
    loadStats();
  }, []);

  const requestGeolocation = () => {
    if ('geolocation' in navigator) {
      addLog('📍 Solicitando geolocalização...', 'info');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoLocation({ latitude, longitude });
          addLog(`✅ Localização obtida: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, 'success');
          
          // Reverse geocoding (cidade/estado)
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          addLog(`⚠️ Geolocalização negada. Usando padrão (São Paulo).`, 'warning');
          setGeoLocation({ latitude: -23.5505, longitude: -46.6333, city: 'São Paulo', state: 'SP' });
        }
      );
    } else {
      addLog('⚠️ Geolocalização não suportada. Usando padrão.', 'warning');
      setGeoLocation({ latitude: -23.5505, longitude: -46.6333, city: 'São Paulo', state: 'SP' });
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    // API de geocoding reversa (OpenStreetMap Nominatim - gratuita)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`
      );
      const data = await response.json();
      
      if (data.address) {
        const city = data.address.city || data.address.town || data.address.village || 'Desconhecida';
        const state = data.address.state || '';
        
        setGeoLocation(prev => prev ? { ...prev, city, state } : null);
        addLog(`📍 Localização: ${city} - ${state}`, 'success');
      }
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
    }
  };

  // ================================================================
  // ESTATÍSTICAS
  // ================================================================

  const loadStats = async () => {
    try {
      // Contar profiles
      const { count: realProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai-scraper');

      const { count: fakeProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'admin-seeder');

      // Contar eventos
      const { count: realEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('source', 'ai-scraper');

      const { count: fakeEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .in('slug', MEGA_EVENTS_2025.map(e => e.slug));

      setStats({
        profiles: {
          real: realProfiles || 0,
          fake: fakeProfiles || 0,
          total: (realProfiles || 0) + (fakeProfiles || 0)
        },
        events: {
          real: realEvents || 0,
          fake: fakeEvents || 0,
          total: (realEvents || 0) + (fakeEvents || 0)
        }
      });
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    }
  };

  // ================================================================
  // HELPERS
  // ================================================================

  const addLog = (message: string, type: Log['type'] = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date() }]);
  };

  const clearLogs = () => setLogs([]);

  // Calcular distância entre dois pontos (em km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // ================================================================
  // SEED FUNCTIONS
  // ================================================================

  const seedProfessionals = async (nearbyOnly: boolean = false) => {
    setLoading(true);
    clearLogs();
    addLog('🎯 Iniciando seed de profissionais...', 'info');

    try {
      // 1. Buscar categorias
      const { data: categories, error: catError } = await supabase
        .from('service_categories')
        .select('id, slug')
        .limit(5);

      if (catError) throw catError;
      if (!categories || categories.length === 0) {
        throw new Error('Nenhuma categoria encontrada. Execute as migrations primeiro.');
      }

      // 2. Filtrar por região se solicitado
      let professionalsToInsert = ELITE_PROFESSIONALS;
      
      if (nearbyOnly && geoLocation) {
        professionalsToInsert = ELITE_PROFESSIONALS.filter(prof => {
          const distance = calculateDistance(
            geoLocation.latitude, 
            geoLocation.longitude,
            prof.latitude,
            prof.longitude
          );
          return distance <= 500; // Raio de 500km
        });
        
        addLog(`🎯 Filtrando profissionais num raio de 500km de ${geoLocation.city}`, 'info');
        addLog(`✅ ${professionalsToInsert.length} profissionais encontrados na região`, 'success');
      }

      if (professionalsToInsert.length === 0) {
        addLog('⚠️ Nenhum profissional encontrado na região. Usando todos.', 'warning');
        professionalsToInsert = ELITE_PROFESSIONALS;
      }

      // 3. Preparar dados
      const profilesWithCategory = professionalsToInsert.map(prof => ({
        ...prof,
        main_category_id: categories[Math.floor(Math.random() * categories.length)].id,
        is_claimed: false,
        source: 'admin-seeder',
        created_at: new Date().toISOString()
      }));

      // 4. Inserir
      const { data, error } = await supabase
        .from('profiles')
        .insert(profilesWithCategory)
        .select();

      if (error) throw error;

      addLog(`✅ ${data?.length || 0} profissionais inseridos!`, 'success');
      await loadStats();

    } catch (error: any) {
      addLog(`❌ Erro: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const seedEvents = async (nearbyOnly: boolean = false) => {
    setLoading(true);
    clearLogs();
    addLog('📅 Iniciando seed de eventos...', 'info');

    try {
      // Filtrar por região
      let eventsToInsert = MEGA_EVENTS_2025;
      
      if (nearbyOnly && geoLocation) {
        eventsToInsert = MEGA_EVENTS_2025.filter(event => {
          const distance = calculateDistance(
            geoLocation.latitude,
            geoLocation.longitude,
            event.location_data.latitude,
            event.location_data.longitude
          );
          return distance <= 500;
        });
        
        addLog(`🎯 Filtrando eventos num raio de 500km de ${geoLocation.city}`, 'info');
        addLog(`✅ ${eventsToInsert.length} eventos encontrados na região`, 'success');
      }

      if (eventsToInsert.length === 0) {
        addLog('⚠️ Nenhum evento encontrado na região. Usando todos.', 'warning');
        eventsToInsert = MEGA_EVENTS_2025;
      }

      // Preparar dados
      const eventsWithSource = eventsToInsert.map(event => ({
        ...event,
        organizer_id: user?.id || null,
        source: 'admin-seeder',
        created_at: new Date().toISOString()
      }));

      // Inserir
      const { data, error } = await supabase
        .from('events')
        .insert(eventsWithSource)
        .select();

      if (error) throw error;

      addLog(`✅ ${data?.length || 0} eventos inseridos!`, 'success');
      await loadStats();

    } catch (error: any) {
      addLog(`❌ Erro: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const aiScrapeData = async () => {
    setLoading(true);
    clearLogs();
    addLog('🤖 Iniciando varredura IA de dados reais...', 'info');

    try {
      // Usar localização do usuário
      const city = geoLocation?.city || 'São Paulo';
      const state = geoLocation?.state || 'SP';
      
      addLog(`📍 Buscando dados em: ${city} - ${state}`, 'info');

      // Executar scraping real
      addLog('🔍 Buscando eventos em Sympla...', 'info');
      const results = await aiSeedingService.runFullScraping(city, state);

      // Processar resultados
      let totalInserted = 0;
      
      for (const result of results) {
        if (result.success) {
          const emoji = result.source === 'sympla' ? '🎟️' : 
                       result.source === 'eventbrite' ? '🎫' : '📸';
          const sourceName = result.source === 'sympla' ? 'Sympla' :
                           result.source === 'eventbrite' ? 'Eventbrite' : 'Instagram';
          
          addLog(`${emoji} ${sourceName}: ${result.count} ${result.type === 'event' ? 'eventos' : 'profissionais'} inseridos`, 'success');
          totalInserted += result.count;
        } else {
          addLog(`❌ Erro em ${result.source}: ${result.error}`, 'error');
        }
      }

      if (totalInserted > 0) {
        addLog(`✅ Total: ${totalInserted} itens reais inseridos!`, 'success');
        addLog('📊 Atualizando estatísticas...', 'info');
        
        await loadStats();

        // Verificar auto-limpeza
        addLog('🔍 Verificando necessidade de auto-limpeza...', 'info');
        const cleanResult = await aiSeedingService.checkAndCleanFakeData();
        
        if (cleanResult.cleaned) {
          addLog('🎯 Meta de 200 itens atingida! Auto-limpeza executada.', 'warning');
          addLog(`🗑️ Removidos: ${cleanResult.profilesRemoved} profissionais fake, ${cleanResult.eventsRemoved} eventos fake`, 'success');
          await loadStats();
        }
      } else {
        addLog('⚠️ Nenhum dado novo foi inserido (possíveis duplicatas)', 'warning');
      }

    } catch (error: any) {
      console.error('Erro na varredura IA:', error);
      addLog(`❌ Erro: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const autoCleanFakeData = async () => {
    addLog('🗑️ Removendo dados fictícios...', 'info');

    try {
      // Deletar profiles fake se real >= 200
      if (stats.profiles.real >= 200) {
        const { error: profError } = await supabase
          .from('profiles')
          .delete()
          .eq('source', 'admin-seeder');

        if (profError) throw profError;
        addLog(`✅ ${stats.profiles.fake} profissionais fictícios removidos`, 'success');
      }

      // Deletar events fake se real >= 200
      if (stats.events.real >= 200) {
        const slugs = MEGA_EVENTS_2025.map(e => e.slug);
        const { error: evtError } = await supabase
          .from('events')
          .delete()
          .in('slug', slugs);

        if (evtError) throw evtError;
        addLog(`✅ ${stats.events.fake} eventos fictícios removidos`, 'success');
      }

      addLog('🎉 Limpeza automática concluída!', 'success');
      await loadStats();

    } catch (error: any) {
      addLog(`❌ Erro na limpeza: ${error.message}`, 'error');
    }
  };

  const resetDatabase = async () => {
    if (!confirm('⚠️ ATENÇÃO! Isso vai APAGAR TODOS os dados de teste.\n\nTem certeza?')) {
      return;
    }

    setLoading(true);
    clearLogs();
    addLog('🗑️ Iniciando limpeza total...', 'info');

    try {
      // Deletar todos profiles de teste
      const { error: profError } = await supabase
        .from('profiles')
        .delete()
        .in('source', ['admin-seeder', 'ai-scraper']);

      if (profError) throw profError;
      addLog('✅ Profissionais removidos', 'success');

      // Deletar todos eventos de teste
      const { error: evtError } = await supabase
        .from('events')
        .delete()
        .in('source', ['admin-seeder', 'ai-scraper']);

      if (evtError) throw evtError;
      addLog('✅ Eventos removidos', 'success');

      addLog('🎉 Banco limpo!', 'success');
      await loadStats();

    } catch (error: any) {
      addLog(`❌ Erro: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-magna-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-gray-400">Faça login como administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Database Seeder v2 - Georreferência + IA | MagnaFest</title>
      </Helmet>

      <main className="min-h-screen bg-magna-black text-white py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database className="w-10 h-10 text-magna-cyan" />
                <div>
                  <h1 className="text-4xl font-black uppercase">Database Seeder v2</h1>
                  <p className="text-gray-400 mt-1">Georreferência + IA + Auto-limpeza</p>
                </div>
              </div>

              {/* Geolocalização Status */}
              {geoLocation && (
                <div className="flex items-center gap-2 bg-magna-violet/20 border border-magna-violet/30 px-4 py-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-magna-cyan" />
                  <div className="text-sm">
                    <div className="font-bold">{geoLocation.city || 'Localização'}</div>
                    <div className="text-gray-400 text-xs">{geoLocation.state}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Profissionais Stats */}
            <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Profissionais
                </h3>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">✅ Reais (IA):</span>
                  <span className="font-bold text-green-400">{stats.profiles.real}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🎭 Fictícios:</span>
                  <span className="font-bold text-yellow-400">{stats.profiles.fake}</span>
                </div>
                <div className="flex justify-between text-lg border-t border-white/10 pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-magna-cyan">{stats.profiles.total}</span>
                </div>
              </div>
              {stats.profiles.real >= 200 && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-xs text-green-400">
                  ✅ Meta de 200 reais atingida! Auto-limpeza habilitada.
                </div>
              )}
            </div>

            {/* Eventos Stats */}
            <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Eventos
                </h3>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">✅ Reais (IA):</span>
                  <span className="font-bold text-green-400">{stats.events.real}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">🎭 Fictícios:</span>
                  <span className="font-bold text-yellow-400">{stats.events.fake}</span>
                </div>
                <div className="flex justify-between text-lg border-t border-white/10 pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-magna-cyan">{stats.events.total}</span>
                </div>
              </div>
              {stats.events.real >= 200 && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-xs text-green-400">
                  ✅ Meta de 200 reais atingida! Auto-limpeza habilitada.
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Profissionais Nearby */}
            <button
              onClick={() => seedProfessionals(true)}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-6 rounded-xl transition-all disabled:opacity-50"
            >
              <Target className="w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-sm font-bold mb-1">Profissionais</h3>
              <p className="text-xs text-purple-100">Próximos (500km)</p>
            </button>

            {/* Eventos Nearby */}
            <button
              onClick={() => seedEvents(true)}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-6 rounded-xl transition-all disabled:opacity-50"
            >
              <MapPin className="w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-sm font-bold mb-1">Eventos</h3>
              <p className="text-xs text-blue-100">Próximos (500km)</p>
            </button>

            {/* IA Scraper */}
            <button
              onClick={aiScrapeData}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 p-6 rounded-xl transition-all disabled:opacity-50"
            >
              <Zap className="w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-sm font-bold mb-1">Varredura IA</h3>
              <p className="text-xs text-green-100">Dados Reais</p>
            </button>

            {/* Reset */}
            <button
              onClick={resetDatabase}
              disabled={loading}
              className="group relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 p-6 rounded-xl transition-all disabled:opacity-50"
            >
              <Trash2 className="w-10 h-10 mb-3 mx-auto" />
              <h3 className="text-sm font-bold mb-1">Limpar Tudo</h3>
              <p className="text-xs text-red-100">Reset</p>
            </button>
          </div>

          {/* Botões Globais */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => seedProfessionals(false)}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all disabled:opacity-50 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold mb-1">🌍 Todos Profissionais</h4>
                  <p className="text-xs text-gray-400">20 perfis em todo Brasil</p>
                </div>
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => seedEvents(false)}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all disabled:opacity-50 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold mb-1">🌍 Todos Eventos</h4>
                  <p className="text-xs text-gray-400">10 eventos em todo Brasil</p>
                </div>
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Console Log */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-magna-cyan" />
                <h2 className="font-bold">Console Log</h2>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-magna-cyan">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processando...</span>
                </div>
              )}
            </div>

            <div className="p-6 font-mono text-sm max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 italic">Aguardando ação...</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />}
                      {log.type === 'error' && <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                      {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />}
                      {log.type === 'info' && <div className="w-4 h-4 flex-shrink-0" />}
                      <div className="flex-1">
                        <span className={
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          'text-gray-300'
                        }>
                          {log.message}
                        </span>
                        <span className="text-gray-600 text-xs ml-3">
                          {log.timestamp.toLocaleTimeString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 space-y-2">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Como funciona a Georreferência?
              </h4>
              <p className="text-sm text-gray-400">
                Ao permitir geolocalização, o sistema filtra profissionais e eventos num raio de 500km da sua posição. 
                Ideal para testes regionais e simulação de busca local.
              </p>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Varredura IA - Como funciona?
              </h4>
              <p className="text-sm text-gray-400">
                A IA busca eventos reais em Sympla, Eventbrite, Facebook Events e Instagram. 
                Quando atingir 200 itens reais, os dados fictícios são automaticamente removidos.
              </p>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4 border-t border-white/10">
              <p>⚠️ Ferramenta administrativa - Apenas desenvolvimento</p>
              <p className="mt-1">
                Dados marcados: <code className="bg-gray-800 px-2 py-0.5 rounded">admin-seeder</code> (fake) | 
                <code className="bg-gray-800 px-2 py-0.5 rounded ml-2">ai-scraper</code> (real)
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
