/**
 * =====================================================================
 * MAGNAFEST WORLD - Advanced Database Seeding Script
 * =====================================================================
 * Popula o banco com centenas de perfis realistas usando Faker.js
 * 
 * Execução: npx ts-node scripts/seed-magna-world.ts
 * =====================================================================
 */

import { config } from 'dotenv';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
config();

// =====================================================================
// CONFIGURAÇÃO SUPABASE
// =====================================================================
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================================
// SMART KEYWORDS - Contextos Técnicos por Categoria
// =====================================================================
const SPECIALTIES: Record<string, string[]> = {
  'tecnico-de-som': [
    'Operador de PA',
    'Sistemas Line Array',
    'Microfonação Profissional',
    'Mesa Digital Allen & Heath',
    'Mixagem ao Vivo',
    'Roadie de Som',
    'Sonorização de Shows',
    'Áudio para Casamentos',
    'Sistema Meyer Sound',
    'Técnico de Monitores',
    'Som para Festivais',
    'Engenheiro de Áudio',
  ],
  'tecnico-de-iluminacao': [
    'Operador GrandMA2',
    'Moving Lights',
    'Projeto Luminotécnico',
    'Painel de LED',
    'Iluminação Cênica',
    'DMX Programming',
    'Lighting Designer',
    'Iluminação Arquitetural',
    'Wash e Beam',
    'Strobes e Efeitos',
    'Iluminação Robótica',
    'Color Grading ao Vivo',
  ],
  'seguranca-vigilancia': [
    'Vigilância Patrimonial',
    'Controle de Acesso',
    'Segurança VIP',
    'Revista e Detector de Metais',
    'Coordenador de Equipe',
    'Segurança de Shows',
    'Portaria de Eventos',
    'Close Protection',
    'Monitoramento CCTV',
    'Segurança Eletrônica',
    'Plano de Evacuação',
    'Brigada de Incêndio',
  ],
  'bombeiro-civil': [
    'Bombeiro Civil Certificado',
    'Primeiros Socorros',
    'Prevenção de Incêndios',
    'Certificação CBMSP',
    'Suporte Básico de Vida',
    'Combate a Incêndio',
    'Brigada de Emergência',
    'Resgate e Salvamento',
    'NR23 Certificado',
    'Atendimento APH',
    'Evacuação de Público',
    'Plano de Contingência',
  ],
  'produtor-de-eventos': [
    'Produção Executiva',
    'Coordenação de Fornecedores',
    'Timeline de Eventos',
    'Produtor de Casamentos',
    'Eventos Corporativos',
    'Festivais e Shows',
    'Gestão de Crise',
    'Produtor de Palco',
    'Orçamento e Contratos',
    'Logística de Eventos',
    'Produção de Formaturas',
    'Eventos Culturais',
  ],
  'eletricista': [
    'Dimensionamento de Carga',
    'Instalações Temporárias',
    'NR10 Certificado',
    'Quadros de Distribuição',
    'Gerador de Energia',
    'Eletricista de Eventos',
    'Iluminação Elétrica',
    'Sistemas Trifásicos',
    'Energia para Shows',
    'Manutenção Preventiva',
    'Cabeamento Estruturado',
    'Energia Solar para Eventos',
  ],
  'equipe-de-limpeza': [
    'Limpeza Pós-Evento',
    'Higienização de Banheiros',
    'Manutenção Durante Evento',
    'Banheiros Químicos',
    'Limpeza de Palco',
    'Coleta Seletiva',
    'Equipe Noturna',
    'Limpeza Express',
    'Conservação de Espaços',
    'Desinfecção de Áreas',
    'Gestão de Resíduos',
    'Limpeza Hospitalar',
  ],
  'recepcionistas-staff': [
    'Recepção Bilíngue',
    'Credenciamento',
    'Atendimento VIP',
    'Hostess de Eventos',
    'Orientação de Fluxo',
    'Staff Corporativo',
    'Recepção de Casamentos',
    'Atendimento Premium',
    'Organização de Filas',
    'Staff de Apoio',
    'Recepção de Congressos',
    'Briefing de Equipe',
  ],
  'montadores-de-estrutura': [
    'Montagem de Palcos',
    'NR35 Certificado',
    'Estruturas Metálicas',
    'Tendas e Coberturas',
    'Cenografia Pesada',
    'Andaimes Certificados',
    'Rigging de Eventos',
    'Estrutura para Shows',
    'Box Truss',
    'Montagem de Feiras',
    'Estruturas Suspensas',
    'Desmontagem Rápida',
  ],
  'catering-buffet': [
    'Buffet Completo',
    'Gastronomia para Eventos',
    'Coffee Break',
    'Garçons Treinados',
    'Sommelier',
    'Coquetelaria',
    'Cozinha Industrial Móvel',
    'Serviço à Francesa',
    'Buffet de Casamentos',
    'Alta Gastronomia',
    'Banqueteiro',
    'Food Truck Gourmet',
  ],
};

// Tipos de eventos para variação
const EVENT_TYPES = [
  'Eventos Corporativos',
  'Casamentos',
  'Festas de 15 Anos',
  'Shows e Festivais',
  'Formaturas',
  'Aniversários',
  'Eventos Esportivos',
  'Feiras e Exposições',
  'Congressos',
  'Eventos Sociais',
];

// Cidades brasileiras principais
const BRAZILIAN_CITIES = [
  { city: 'São Paulo', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Brasília', state: 'DF' },
  { city: 'Salvador', state: 'BA' },
  { city: 'Fortaleza', state: 'CE' },
  { city: 'Recife', state: 'PE' },
  { city: 'Manaus', state: 'AM' },
  { city: 'Belém', state: 'PA' },
  { city: 'Goiânia', state: 'GO' },
  { city: 'Campinas', state: 'SP' },
  { city: 'São Luís', state: 'MA' },
  { city: 'Maceió', state: 'AL' },
  { city: 'Natal', state: 'RN' },
  { city: 'João Pessoa', state: 'PB' },
  { city: 'Florianópolis', state: 'SC' },
  { city: 'Vitória', state: 'ES' },
  { city: 'Cuiabá', state: 'MT' },
];

// =====================================================================
// FUNÇÕES AUXILIARES
// =====================================================================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateBrazilianPhone(): string {
  const ddd = getRandomInt(11, 99);
  const number = `9${getRandomInt(1000, 9999)}${getRandomInt(1000, 9999)}`;
  return `${ddd}${number}`;
}

function generateImageUrl(categorySlug: string): string {
  const keywords: Record<string, string> = {
    'tecnico-de-som': 'concert,sound,mixing',
    'tecnico-de-iluminacao': 'stage,lights,concert',
    'seguranca-vigilancia': 'security,event,professional',
    'bombeiro-civil': 'firefighter,safety,emergency',
    'produtor-de-eventos': 'event,planning,coordination',
    'eletricista': 'electrician,power,installation',
    'equipe-de-limpeza': 'cleaning,professional,service',
    'recepcionistas-staff': 'receptionist,professional,event',
    'montadores-de-estrutura': 'construction,structure,stage',
    'catering-buffet': 'catering,food,buffet',
  };
  
  const keyword = keywords[categorySlug] || 'event,professional';
  return `https://source.unsplash.com/800x600/?${keyword}`;
}

function generateDescription(categorySlug: string): string {
  const specialties = SPECIALTIES[categorySlug] || [];
  const specialty = getRandomItem(specialties);
  const eventType = getRandomItem(EVENT_TYPES);
  const years = getRandomInt(3, 20);
  
  const templates = [
    `Especialista em ${specialty}. Atendemos ${eventType}. ${years} anos de experiência no mercado.`,
    `${specialty}. Focado em ${eventType}. Mais de ${years} anos de atuação.`,
    `Profissional com expertise em ${specialty}. Trabalhamos com ${eventType} desde ${2025 - years}.`,
    `${specialty} certificado. Atendimento especializado para ${eventType}. ${years}+ anos no mercado.`,
    `Referência em ${specialty}. Portfolio robusto em ${eventType}. Experiência de ${years} anos.`,
  ];
  
  return getRandomItem(templates);
}

function generateProfileName(isCompany: boolean): string {
  if (isCompany) {
    const prefixes = ['Eventos', 'Pro', 'Prime', 'Master', 'Elite', 'Total', 'Express', 'Premium'];
    const suffixes = ['Eventos', 'Produções', 'Profissional', 'Locações', 'Serviços', 'Brasil', 'SP'];
    return `${getRandomItem(prefixes)} ${getRandomItem(suffixes)}`;
  } else {
    return faker.person.fullName();
  }
}

// =====================================================================
// FUNÇÃO PRINCIPAL DE SEEDING
// =====================================================================

async function seedMagnaWorld() {
  console.log('\n🚀 ========================================');
  console.log('   MAGNAFEST WORLD - Database Seeding');
  console.log('========================================\n');

  try {
    // 1. Buscar todas as categorias
    console.log('📋 Buscando categorias do banco...');
    const { data: categories, error: categoriesError } = await supabase
      .from('service_categories')
      .select('*');

    if (categoriesError || !categories || categories.length === 0) {
      console.error('❌ Erro ao buscar categorias:', categoriesError);
      process.exit(1);
    }

    console.log(`✅ ${categories.length} categorias encontradas!`);

    // 2. Gerar perfis para cada categoria
    const allProfiles: any[] = [];

    for (const category of categories) {
      const numProfiles = getRandomInt(20, 35);
      console.log(`\n🎯 Gerando ${numProfiles} perfis para: ${category.name}`);

      for (let i = 0; i < numProfiles; i++) {
        const location = getRandomItem(BRAZILIAN_CITIES);
        const isCompany = Math.random() > 0.4; // 60% empresas, 40% pessoas

        const profile = {
          name: generateProfileName(isCompany),
          description: generateDescription(category.slug),
          city: location.city,
          state: location.state,
          whatsapp: generateBrazilianPhone(),
          email: faker.internet.email().toLowerCase(),
          instagram: `@${faker.internet.username()}`,
          main_category_id: category.id,
          is_claimed: false,
          source: 'faker-seed-v2',
          created_at: new Date().toISOString(),
        };

        allProfiles.push(profile);
      }

      console.log(`   ✓ ${numProfiles} perfis criados para ${category.name}`);
    }

    console.log(`\n📊 Total de perfis gerados: ${allProfiles.length}`);

    // 3. Inserção em lote (Batch Insert)
    console.log('\n💾 Iniciando inserção no banco de dados...');
    
    const BATCH_SIZE = 50;
    let inserted = 0;
    
    for (let i = 0; i < allProfiles.length; i += BATCH_SIZE) {
      const batch = allProfiles.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Erro no lote ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
      } else {
        inserted += batch.length;
        console.log(`   ✓ Lote ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} perfis inseridos`);
      }
    }

    // 4. Resultado Final
    console.log('\n✅ ========================================');
    console.log(`   MAGNAFEST WORLD CREATED!`);
    console.log('========================================');
    console.log(`📈 ${inserted} perfis profissionais inseridos`);
    console.log(`🏢 ${categories.length} categorias populadas`);
    console.log(`🌎 ${BRAZILIAN_CITIES.length} cidades cobertas`);
    console.log('========================================\n');

    // 5. Estatísticas
    const { data: stats } = await supabase
      .from('profiles')
      .select('main_category_id')
      .eq('source', 'faker-seed-v2');

    if (stats) {
      console.log('📊 Distribuição por categoria:');
      const distribution: Record<string, number> = {};
      
      stats.forEach((profile) => {
        const cat = categories.find(c => c.id === profile.main_category_id);
        if (cat) {
          distribution[cat.name] = (distribution[cat.name] || 0) + 1;
        }
      });

      Object.entries(distribution)
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, count]) => {
          console.log(`   • ${name}: ${count} profissionais`);
        });
    }

    console.log('\n🎉 Processo concluído com sucesso!\n');

  } catch (error) {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  }
}

// =====================================================================
// EXECUÇÃO
// =====================================================================

seedMagnaWorld();
