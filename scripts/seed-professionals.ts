/**
 * =====================================================================
 * SCRIPT: Seed Professionals Database
 * =====================================================================
 * Popula o banco com 30 perfis profissionais realistas (3 por categoria)
 * 
 * Como executar:
 * 1. npm install --save-dev ts-node @types/node
 * 2. Criar arquivo .env com SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 * 3. npx ts-node scripts/seed-professionals.ts
 */

import { createClient } from '@supabase/supabase-js';

// =====================================================================
// CONFIGURAÇÃO
// =====================================================================

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Configure VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// =====================================================================
// DADOS DE SEED
// =====================================================================

interface ProfessionalSeed {
  name: string;
  description: string;
  city: string;
  state: string;
  whatsapp: string;
}

const seedDataByCategory: Record<string, ProfessionalSeed[]> = {
  'tecnico-de-som': [
    {
      name: 'AudioVisão Locações',
      description: 'Sonorização completa para grandes eventos corporativos com 15 anos de experiência.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11999887766',
    },
    {
      name: 'Carlos Mendes - Som Profissional',
      description: 'Técnico especializado em casamentos e festas de médio porte. Equipamentos de ponta.',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21987654321',
    },
    {
      name: 'SoundTech Brasil',
      description: 'Empresa de som e áudio para festivais e shows. Equipe técnica certificada.',
      city: 'Belo Horizonte',
      state: 'MG',
      whatsapp: '31988776655',
    },
  ],
  'eletricista': [
    {
      name: 'EletroEventos SP',
      description: 'Dimensionamento de carga elétrica e instalações temporárias para eventos de todos os portes.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11977665544',
    },
    {
      name: 'João Almeida - Eletricista Certificado',
      description: 'Profissional com NR10 e experiência em montagem de estruturas elétricas para eventos.',
      city: 'Curitiba',
      state: 'PR',
      whatsapp: '41988776655',
    },
    {
      name: 'Energia Total Eventos',
      description: 'Fornecimento de geradores e infraestrutura elétrica completa. Atendimento 24h.',
      city: 'Brasília',
      state: 'DF',
      whatsapp: '61999887766',
    },
  ],
  'bombeiro-civil': [
    {
      name: 'Brigada Eventos Seguros',
      description: 'Equipe de bombeiros civis certificados para prevenção e combate a incêndios em eventos.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11966554433',
    },
    {
      name: 'Lucas Ferreira - Bombeiro Civil',
      description: 'Atendimento a primeiros socorros e prevenção de acidentes. Certificação CBMSP.',
      city: 'Campinas',
      state: 'SP',
      whatsapp: '19988776655',
    },
    {
      name: 'Proteção Total Eventos',
      description: 'Serviço completo de brigada de incêndio e plano de emergência para grandes eventos.',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21977665544',
    },
  ],
  'seguranca-vigilancia': [
    {
      name: 'Segurança Prime Eventos',
      description: 'Equipe treinada para controle de acesso e segurança patrimonial em eventos corporativos.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11955443322',
    },
    {
      name: 'Vigilância & Eventos RJ',
      description: 'Segurança especializada em casamentos, festas e eventos de grande porte.',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21966554433',
    },
    {
      name: 'Roberto Silva - Segurança Profissional',
      description: 'Vigilante certificado com experiência em shows e festivais. Atendimento individual.',
      city: 'Salvador',
      state: 'BA',
      whatsapp: '71988776655',
    },
  ],
  'equipe-de-limpeza': [
    {
      name: 'Clean Eventos SP',
      description: 'Limpeza durante e pós-evento. Equipe especializada em grandes volumes.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11944332211',
    },
    {
      name: 'Higieniza Total',
      description: 'Manutenção de banheiros químicos e áreas comuns durante o evento. Monitoramento contínuo.',
      city: 'Porto Alegre',
      state: 'RS',
      whatsapp: '51988776655',
    },
    {
      name: 'Limpex Eventos',
      description: 'Serviço de limpeza express para eventos corporativos e casamentos.',
      city: 'Fortaleza',
      state: 'CE',
      whatsapp: '85977665544',
    },
  ],
  'produtor-de-eventos': [
    {
      name: 'Maria Oliveira - Produtora Executiva',
      description: 'Coordenação completa de casamentos e eventos corporativos. 12 anos de experiência.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11933221100',
    },
    {
      name: 'Produtora Luxo & Estilo',
      description: 'Planejamento e execução de eventos de alto padrão. Equipe multidisciplinar.',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21955443322',
    },
    {
      name: 'Felipe Costa - Producer',
      description: 'Especialista em festivais e shows. Gestão de fornecedores e cronograma.',
      city: 'Belo Horizonte',
      state: 'MG',
      whatsapp: '31966554433',
    },
  ],
  'tecnico-de-iluminacao': [
    {
      name: 'Light Design Eventos',
      description: 'Iluminação cênica e arquitetural para casamentos e eventos corporativos.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11922110099',
    },
    {
      name: 'André Luz - Lighting Designer',
      description: 'Projetos de iluminação personalizados. Especialista em ambientação.',
      city: 'Curitiba',
      state: 'PR',
      whatsapp: '41977665544',
    },
    {
      name: 'Iluminart Eventos',
      description: 'Locação de equipamentos de iluminação profissional. Operador incluso.',
      city: 'Recife',
      state: 'PE',
      whatsapp: '81988776655',
    },
  ],
  'recepcionistas-staff': [
    {
      name: 'Staff Prime Eventos',
      description: 'Recepcionistas bilíngues e equipe de credenciamento para eventos corporativos.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11911009988',
    },
    {
      name: 'Juliana Santos - Recepcionista Freelancer',
      description: 'Atendimento profissional em eventos sociais e corporativos. Experiência em grandes volumes.',
      city: 'Brasília',
      state: 'DF',
      whatsapp: '61966554433',
    },
    {
      name: 'Equipe VIP Eventos',
      description: 'Staff treinado para atendimento de alto padrão. Uniformes personalizados.',
      city: 'Florianópolis',
      state: 'SC',
      whatsapp: '48988776655',
    },
  ],
  'montadores-de-estrutura': [
    {
      name: 'Estrutura Pro Eventos',
      description: 'Montagem de palcos, tendas e estruturas metálicas. Equipe certificada em NR35.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11900998877',
    },
    {
      name: 'Pedro Monteiro - Montador Profissional',
      description: 'Especialista em montagem de cenografia e estruturas complexas para shows.',
      city: 'Manaus',
      state: 'AM',
      whatsapp: '92988776655',
    },
    {
      name: 'Monta Rápido Eventos',
      description: 'Montagem e desmontagem de estruturas em tempo recorde. Disponibilidade 24h.',
      city: 'Goiânia',
      state: 'GO',
      whatsapp: '62977665544',
    },
  ],
  'catering-buffet': [
    {
      name: 'Sabor & Eventos Buffet',
      description: 'Buffet completo para casamentos e eventos corporativos. Cardápio personalizado.',
      city: 'São Paulo',
      state: 'SP',
      whatsapp: '11999887700',
    },
    {
      name: 'Chef Gourmet Eventos',
      description: 'Serviço de alta gastronomia para eventos exclusivos. Sommelier incluso.',
      city: 'Rio de Janeiro',
      state: 'RJ',
      whatsapp: '21988776655',
    },
    {
      name: 'Garçons & Cia',
      description: 'Equipe de garçons e copeiros treinados. Atendimento impecável.',
      city: 'Vitória',
      state: 'ES',
      whatsapp: '27977665544',
    },
  ],
};

// =====================================================================
// FUNÇÕES AUXILIARES
// =====================================================================

async function getCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('id, slug')
    .order('name');

  if (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    process.exit(1);
  }

  return data;
}

async function seedProfessionals() {
  console.log('🚀 Iniciando seed de profissionais...\n');

  // 1. Buscar categorias
  const categories = await getCategories();
  console.log(`✅ ${categories.length} categorias encontradas\n`);

  let totalInserted = 0;

  // 2. Iterar por cada categoria
  for (const category of categories) {
    const professionals = seedDataByCategory[category.slug];

    if (!professionals) {
      console.warn(`⚠️  Sem dados para categoria: ${category.slug}`);
      continue;
    }

    console.log(`📂 Processando categoria: ${category.slug}`);

    // 3. Inserir profissionais da categoria
    for (const prof of professionals) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          name: prof.name,
          description: prof.description,
          city: prof.city,
          state: prof.state,
          whatsapp: prof.whatsapp,
          main_category_id: category.id,
          is_claimed: false,
          source: 'seed-script',
          website: null, // Sem website para alguns
        })
        .select();

      if (error) {
        console.error(`   ❌ Erro ao inserir ${prof.name}:`, error.message);
      } else {
        console.log(`   ✅ ${prof.name}`);
        totalInserted++;
      }
    }

    console.log('');
  }

  console.log(`\n🎉 Seed completo! ${totalInserted} profissionais inseridos.`);
}

// =====================================================================
// EXECUÇÃO
// =====================================================================

seedProfessionals()
  .then(() => {
    console.log('\n✅ Script finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
