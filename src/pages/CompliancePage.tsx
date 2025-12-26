/**
 * =====================================================================
 * Central de Inteligência do Produtor - Knowledge Base de Compliance
 * =====================================================================
 * Página com guias práticos sobre regularização de eventos
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  FileText, 
  DollarSign, 
  Music,
  ExternalLink,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Globe
} from 'lucide-react';
import PageHero from '../components/ui/PageHero';

// =====================================================================
// TYPES
// =====================================================================

interface Article {
  id: string;
  title: string;
  category: 'Tributário' | 'Licença' | 'Direitos Autorais' | 'Financiamento';
  scope: 'federal' | 'state' | 'municipal';
  uf?: string; // Ex: 'SP', 'RJ', 'MG', etc.
  icon: any;
  summary: string;
  content: string;
  officialSource?: {
    label: string;
    url: string;
  };
  tags: string[];
  isMandatory: boolean;
}

// =====================================================================
// DATA - Knowledge Base Hardcoded
// =====================================================================

const ARTICLES: Article[] = [
  {
    id: 'mei-eventos',
    title: 'MEI para Produtores de Eventos',
    category: 'Tributário',
    scope: 'federal',
    icon: FileText,
    summary: 'Como formalizar sua empresa como MEI e quais CNAEs são permitidos para produção de eventos.',
    content: `# MEI para Produtores de Eventos

## 📋 O que é MEI?
O Microempreendedor Individual (MEI) é uma categoria tributária simplificada para pequenos negócios com faturamento anual até R$ 81.000,00.

## ✅ CNAEs Permitidos para Eventos
- **9329-8/01** - Produção de eventos de entretenimento
- **9003-5/00** - Gestão de espaços para eventos
- **8230-0/01** - Serviços de organização de feiras, congressos e eventos similares

## 💰 Custos Mensais
- **INSS:** R$ 66,00
- **ISS:** R$ 5,00
- **Total:** R$ 71,00/mês

## 🚀 Como se cadastrar
1. Acesse o [Portal do Empreendedor](https://www.gov.br/empresas-e-negocios/pt-br/empreendedor)
2. Clique em "Formalize-se"
3. Tenha em mãos CPF, título de eleitor e endereço
4. O processo leva cerca de 15 minutos

## ⚠️ Limitações
- Não pode ter participação em outra empresa
- Não pode contratar mais de 1 funcionário
- Faturamento anual limitado a R$ 81.000`,
    officialSource: {
      label: 'Portal do Empreendedor',
      url: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor'
    },
    tags: ['MEI', 'CNPJ', 'Formalização', 'Tributário'],
    isMandatory: true
  },
  {
    id: 'ecad',
    title: 'ECAD - Direitos Autorais Musicais',
    category: 'Direitos Autorais',
    scope: 'federal',
    icon: Music,
    summary: 'Quando pagar ECAD, como calcular o valor e como fazer a declaração corretamente.',
    content: `# ECAD - Escritório Central de Arrecadação e Distribuição

## 🎵 Quando é obrigatório?
Você DEVE pagar ECAD sempre que houver:
- 🎤 Música ao vivo (bandas, DJs, shows)
- 🔊 Música mecânica (som ambiente, playlists)
- 📺 Telões com videoclipes
- 🎸 Qualquer execução pública de música

## 💰 Como calcular?
O valor varia conforme:
- Tipo de evento (show, festa, corporativo)
- Capacidade do local
- Duração do evento
- Tipo de música (ao vivo ou mecânica)

**Exemplo Prático:**
- Festa corporativa, 200 pessoas, 4h de duração
- Música mecânica (DJ)
- Valor aproximado: R$ 150 a R$ 300

## 📝 Como declarar?
1. Acesse [ecad.org.br](https://www.ecad.org.br)
2. Vá em "Declaração de Evento"
3. Preencha dados do evento com 5 dias de antecedência
4. Pague via boleto ou PIX
5. Guarde a GRE (Guia de Recolhimento)

## ⚠️ E se não pagar?
- Multa de 2x a 20x o valor devido
- Possível embargo do evento
- Ação judicial por violação de direitos autorais

## 🎯 Dica de Ouro
Use apenas playlists com "Música Livre de Direitos" ou instrumentais livres para economizar!`,
    officialSource: {
      label: 'ECAD Oficial',
      url: 'https://www.ecad.org.br'
    },
    tags: ['ECAD', 'Direitos Autorais', 'Música', 'Shows'],
    isMandatory: true
  },
  {
    id: 'alvara-temporario',
    title: 'Alvará de Funcionamento Temporário',
    category: 'Licença',
    scope: 'municipal',
    icon: Shield,
    summary: 'Como obter licença para eventos temporários junto à Prefeitura e Corpo de Bombeiros.',
    content: `# Alvará de Funcionamento Temporário

## 🏛️ O que é?
Autorização da Prefeitura para realização de evento temporário em local específico.

## 📋 Quando é necessário?
- Eventos em vias públicas (ruas, praças, parques)
- Eventos em locais sem alvará permanente
- Festas com mais de 100 pessoas
- Eventos com venda de bebidas alcoólicas
- Shows e apresentações artísticas

## 📄 Documentos Necessários
### Da Empresa:
- CNPJ ou CPF
- Contrato Social (se for empresa)
- Comprovante de endereço

### Do Evento:
- Descrição detalhada do evento
- Planta baixa do local
- Laudo do Corpo de Bombeiros (AVCB temporário)
- Contrato de locação ou autorização do proprietário
- Plano de contingência (evacuação, primeiros socorros)

## ⏱️ Prazos
- **Solicitar:** 30 a 60 dias antes do evento
- **Análise:** 15 a 30 dias úteis
- **Validade:** Apenas para as datas especificadas

## 💰 Custos
Variam por município:
- **Capitais:** R$ 500 a R$ 2.000
- **Interior:** R$ 200 a R$ 800

## 🚨 Corpo de Bombeiros
Paralelamente, solicite:
- Vistoria técnica prévia
- Laudo de segurança contra incêndio
- Pode exigir: extintores, iluminação de emergência, saídas de emergência sinalizadas

## 📍 Onde solicitar?
Cada cidade tem seu processo:
- SP: [Portal 156](https://sp156.prefeitura.sp.gov.br)
- RJ: [Carioca Digital](https://carioca.rio)
- BH: [Portal PBH](https://prefeitura.pbh.gov.br)

Procure por "Alvará Temporário" ou "Licença para Evento"`,
    officialSource: {
      label: 'Consulte sua Prefeitura',
      url: '#'
    },
    tags: ['Alvará', 'Licença', 'Prefeitura', 'Bombeiros'],
    isMandatory: true
  },
  {
    id: 'lei-rouanet',
    title: 'Lei Rouanet (Lei Federal de Incentivo à Cultura)',
    category: 'Financiamento',
    scope: 'federal',
    icon: DollarSign,
    summary: 'A principal ferramenta de fomento à cultura do Brasil. Permite captar até 4% do I.R. de empresas.',
    content: `# Lei Rouanet - Lei Federal de Incentivo à Cultura

## 🎭 O que é?
Mecanismo de financiamento cultural onde empresas podem destinar parte do Imposto de Renda para projetos culturais.

## ✅ Eventos que se enquadram
- Shows musicais
- Festivais de cinema, teatro, dança
- Exposições de arte
- Feiras literárias
- Eventos culturais gratuitos ou com ingressos populares

## 💡 Como funciona?
1. **Você cria** um projeto cultural detalhado
2. **Submete** ao Ministério da Cultura (MinC)
3. **Aprovado**, pode captar recursos com empresas
4. **Empresas** doam e deduzem até 4% do IR
5. **Você** realiza o evento e presta contas

## 📊 Valores
- Até R$ 1 milhão (pessoa jurídica)
- Até R$ 200 mil (pessoa física)

## 📝 Passo a Passo
### 1. Cadastro no SALIC
- Acesse [salic.cultura.gov.br](http://salic.cultura.gov.br)
- Crie conta PJ ou PF
- Cadastre o proponente

### 2. Elaboração do Projeto
Precisa conter:
- Justificativa cultural
- Objetivos e metas
- Cronograma detalhado
- Planilha orçamentária (com valores de mercado)
- Contrapartidas sociais

### 3. Submissão
- Prazo médio de análise: 6 a 12 meses
- Pode ser solicitada documentação complementar

### 4. Capitação (após aprovação)
- Validade: 24 meses
- Busque empresas patrocinadoras
- Emita recibos oficiais de doação

### 5. Execução e Prestação de Contas
- Realize evento conforme projeto
- Documente tudo (fotos, vídeos, listas de presença)
- Preste contas em até 60 dias após a execução

## ⚠️ Atenção
- **Não pode** ser usado para eventos 100% privados
- **Exige** contrapartida social (ingressos gratuitos, ações educativas)
- **Auditoria** rigorosa - guarde todos os comprovantes

## 🚀 Dica
Contrate um produtor cultural experiente para elaborar o projeto. A taxa de aprovação é de apenas 20-30%.`,
    officialSource: {
      label: 'SALIC - Sistema de Apoio às Leis de Incentivo à Cultura',
      url: 'http://salic.cultura.gov.br'
    },
    tags: ['Lei Rouanet', 'Incentivo Fiscal', 'Captação', 'Cultura', 'Patrocínio', 'Federal'],
    isMandatory: false
  },
  // =====================================================================
  // LEIS ESTADUAIS E MUNICIPAIS
  // =====================================================================
  {
    id: 'proac-sp',
    title: 'ProAC ICMS (Programa de Ação Cultural - SP)',
    category: 'Financiamento',
    scope: 'state',
    uf: 'SP',
    icon: DollarSign,
    summary: 'Permite que empresas destinem parte do ICMS para patrocinar eventos em SP. Vital para produtores paulistas.',
    content: `# ProAC ICMS - Programa de Ação Cultural de São Paulo

## 🏛️ O que é?
O ProAC ICMS é um programa do Governo de São Paulo que permite que empresas patrocinadoras destinem parte do ICMS devido para projetos culturais.

## 💰 Como funciona?
- Empresas podem destinar até **3% do ICMS** devido ao estado
- O patrocínio é **deduzido integralmente** do imposto
- Não há desembolso efetivo da empresa

## ✅ Quem pode se beneficiar?
- Produtores culturais com projetos em SP
- Shows, festivais, teatro, cinema, artes visuais
- Projetos com contrapartida social

## 📊 Valores e Prazos
- **Captação:** Até R$ 500 mil por projeto
- **Prazo de captação:** 12 meses após aprovação
- **Execução:** 24 meses

## 📝 Como inscrever seu projeto
1. Acesse [proac.sp.gov.br](https://proac.sp.gov.br)
2. Aguarde abertura de edital (geralmente 1-2 vezes por ano)
3. Submeta projeto detalhado com orçamento
4. Prazo de análise: 3 a 6 meses

### Documentos Necessários:
- Projeto cultural completo
- Planilha orçamentária detalhada
- Portfólio do proponente
- Contrapartidas sociais

## 🎯 Diferença para Lei Rouanet
- **ProAC:** ICMS estadual (São Paulo)
- **Rouanet:** IR federal (todo Brasil)
- Você pode usar **ambos** no mesmo projeto!

## ⚠️ Atenção
- Apenas empresas **sediadas em SP** podem patrocinar
- Exige no mínimo **20% de ingressos gratuitos**
- Prestação de contas rigorosa

## 📞 Contato
Secretaria de Cultura e Economia Criativa do Estado de SP
- Site: proac.sp.gov.br
- Email: proac@sp.gov.br`,
    officialSource: {
      label: 'ProAC São Paulo',
      url: 'https://proac.sp.gov.br'
    },
    tags: ['ProAC', 'ICMS', 'São Paulo', 'Incentivo Estadual', 'SP'],
    isMandatory: false
  },
  {
    id: 'lei-iss-rj',
    title: 'Lei do ISS (Lei Municipal de Incentivo à Cultura - RJ)',
    category: 'Financiamento',
    scope: 'municipal',
    uf: 'RJ',
    icon: DollarSign,
    summary: 'A "Lei do ISS" é o principal mecanismo do Rio. Empresas destinam até 20% do ISS devido para projetos culturais.',
    content: `# Lei do ISS - Lei Municipal de Incentivo à Cultura do Rio de Janeiro

## 🎭 O que é?
A Lei do ISS (Lei nº 5.553/2013) é o principal mecanismo de incentivo fiscal à cultura da cidade do Rio de Janeiro.

## 💰 Como funciona?
- Empresas prestadoras de serviço no Rio podem destinar até **20% do ISS** devido
- Dedução integral do imposto
- Sem custo efetivo para a empresa patrocinadora

## ✅ Quem pode participar?

### Proponentes:
- Pessoas físicas ou jurídicas residentes no Rio
- Produtores culturais com projeto aprovado

### Patrocinadores:
- Empresas que pagam ISS no município do Rio
- Prestadores de serviço tributados pelo município

## 📊 Valores
- **Captação máxima:** Varia conforme edital (média R$ 300 mil)
- **Prazo captação:** 12 meses
- **Execução:** 18 a 24 meses

## 📝 Como inscrever
1. Cadastro no sistema da Secretaria Municipal de Cultura
2. Aguardar edital (geralmente anual)
3. Submeter projeto com:
   - Justificativa cultural
   - Orçamento detalhado
   - Cronograma
   - Contrapartidas (mínimo 10% gratuidade)

## 🎯 Áreas contempladas
- Artes cênicas (teatro, dança, circo)
- Música (shows, festivais)
- Audiovisual (cinema, vídeo)
- Artes visuais (exposições)
- Literatura (feiras, saraus)

## ⚠️ Importante
- Projeto deve ser realizado **no Rio de Janeiro**
- Exige comprovação de público e democratização
- Prestação de contas rigorosa (financeira + cultural)

## 📞 Contato
Secretaria Municipal de Cultura - Rio de Janeiro
- Site: cultura.rio
- Email: cultura@rio.rj.gov.br`,
    officialSource: {
      label: 'Secretaria Municipal de Cultura RJ',
      url: 'https://cultura.rio'
    },
    tags: ['ISS', 'Rio de Janeiro', 'Incentivo Municipal', 'RJ', 'Lei do ISS'],
    isMandatory: false
  },
  {
    id: 'leic-mg',
    title: 'LEIC (Lei Estadual de Incentivo à Cultura - MG)',
    category: 'Financiamento',
    scope: 'state',
    uf: 'MG',
    icon: DollarSign,
    summary: 'Mecanismo de dedução de ICMS para apoio a projetos culturais em Minas Gerais.',
    content: `# LEIC - Lei Estadual de Incentivo à Cultura de Minas Gerais

## 🎨 O que é?
A LEIC (Lei nº 17.615/2008) permite que empresas contribuintes do ICMS em Minas Gerais apoiem projetos culturais através de renúncia fiscal.

## 💰 Mecanismo de Incentivo
- Empresas podem destinar até **1,5% do ICMS** devido
- Dedução integral do imposto
- Apoio direto à cultura mineira

## ✅ Projetos Elegíveis
- Shows e festivais de música
- Teatro, dança e circo
- Cinema e audiovisual
- Museus e patrimônio histórico
- Literatura e formação cultural
- Artesanato e cultura popular

## 📊 Valores e Normas
- **Limite por projeto:** Até R$ 500 mil
- **Captação:** 18 meses
- **Execução:** 24 meses após captação
- **Contrapartida:** Mínimo 15% de gratuidade

## 📝 Processo de Aprovação
### 1. Inscrição
- Acesse o site da Secretaria de Cultura de MG
- Cadastre-se como proponente
- Aguarde abertura de edital

### 2. Documentação
- Projeto cultural detalhado
- Orçamento com cotações (mínimo 3 por item)
- Cronograma de execução
- Plano de contrapartida social
- Currículo do proponente

### 3. Análise
- Comissão avaliadora técnica
- Prazo: 60 a 90 dias
- Publicação no Diário Oficial

### 4. Captação
- Busca ativa de patrocinadores
- Apresentação do projeto para empresas
- Emissão de recibos de doação

## 🎯 Diferenciais da LEIC
- Foco em **descentralização cultural** (interior de MG)
- Apoio a **culturas tradicionais** mineiras
- Incentivo a **novos talentos**

## ⚠️ Regras Importantes
- Projeto deve ser realizado em **Minas Gerais**
- Proponente deve ser **residente em MG**
- Empresas patrocinadoras devem ser **contribuintes ICMS em MG**
- Vedado pagamento de cachês acima do mercado

## 📞 Contato
Secretaria de Estado de Cultura de Minas Gerais
- Site: cultura.mg.gov.br
- Email: leic@cultura.mg.gov.br`,
    officialSource: {
      label: 'LEIC Minas Gerais',
      url: 'https://cultura.mg.gov.br'
    },
    tags: ['LEIC', 'Minas Gerais', 'ICMS', 'Incentivo Estadual', 'MG'],
    isMandatory: false
  },
  {
    id: 'fazcultura-ba',
    title: 'Fazcultura (Programa de Incentivo ao Patrocínio Cultural - BA)',
    category: 'Financiamento',
    scope: 'state',
    uf: 'BA',
    icon: DollarSign,
    summary: 'Programa de Incentivo ao Patrocínio Cultural do Estado da Bahia via ICMS.',
    content: `# Fazcultura - Programa de Incentivo Cultural da Bahia

## 🌴 O que é?
O Fazcultura é o programa de incentivo fiscal à cultura do Estado da Bahia, gerido pela Secretaria de Cultura (SecultBA).

## 💰 Funcionamento
- Empresas destinam até **5% do ICMS** devido
- Abatimento integral no imposto
- Maior percentual de incentivo do Brasil!

## ✅ Áreas Contempladas
- **Música:** Shows, festivais, produção de álbuns
- **Artes cênicas:** Teatro, dança, circo
- **Audiovisual:** Cinema, documentários
- **Artes visuais:** Exposições, intervenções urbanas
- **Culturas populares:** Capoeira, festas tradicionais, quilombos
- **Literatura:** Publicações, feiras literárias
- **Patrimônio:** Restauração, memória cultural

## 📊 Valores e Categorias
### Categorias de Projeto:
- **Categoria A:** Até R$ 50 mil (análise simplificada)
- **Categoria B:** R$ 50 mil a R$ 200 mil
- **Categoria C:** R$ 200 mil a R$ 500 mil
- **Categoria D:** Acima de R$ 500 mil (super projetos)

## 📝 Como Submeter
1. Cadastro no Sistema FazCultura
2. Elaboração do projeto (template disponível)
3. Submissão digital com anexos
4. Análise por comissão técnica (45-90 dias)
5. Publicação de aprovação
6. Captação de recursos

### Documentação Base:
- Projeto executivo completo
- Orçamento detalhado e justificado
- Portfolio do proponente
- Plano de mídia e divulgação
- Contrapartida sociocultural

## 🎯 Diferenciais do Fazcultura
- **Maior alíquota:** 5% ICMS (vs 3% ProAC, 1,5% LEIC)
- **Foco em diversidade:** Afro-brasileira, indígena, sertaneja
- **Descentralização:** Incentivo ao interior da Bahia

## ⚠️ Requisitos Importantes
- Proponente deve ser **pessoa física ou jurídica residente na BA**
- Projeto executado **majoritariamente na Bahia**
- Contrapartida mínima: **10% de gratuidade**
- Patrocinadores: empresas contribuintes ICMS na BA

## 🌟 Destaques
- Apoio especial a **Carnaval de Salvador**
- Fomento a **festas populares** (São João, Lavagem do Bonfim)
- Valorização de **mestres da cultura popular**

## 📞 Contato
Secretaria de Cultura do Estado da Bahia
- Site: cultura.ba.gov.br
- Email: fazcultura@cultura.ba.gov.br
- Tel: (71) 3116-7300`,
    officialSource: {
      label: 'Fazcultura Bahia',
      url: 'https://cultura.ba.gov.br'
    },
    tags: ['Fazcultura', 'Bahia', 'ICMS', 'Incentivo Estadual', 'BA'],
    isMandatory: false
  }
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedState, setSelectedState] = useState<string>('Todos');
  const [locationNotification, setLocationNotification] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);

  // Estados disponíveis (movido para cima para usar no useEffect)
  const states = [
    { value: 'Todos', label: 'Todos os Estados' },
    { value: 'SP', label: 'São Paulo (SP)' },
    { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
    { value: 'MG', label: 'Minas Gerais (MG)' },
    { value: 'BA', label: 'Bahia (BA)' }
  ];

  // Detecção automática de localização por IP
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const userState = data.region_code; // Ex: "SP", "RJ"
        
        // Verificar se o estado detectado está na nossa lista
        const validStates = states.map(s => s.value).filter(v => v !== 'Todos');
        
        if (validStates.includes(userState)) {
          setSelectedState(userState);
          const stateName = states.find(s => s.value === userState)?.label || userState;
          setLocationNotification(`📍 Detectamos que você está em ${stateName}. Mostrando leis locais!`);
          
          // Esconder notificação após 5 segundos
          setTimeout(() => {
            setLocationNotification(null);
          }, 5000);
        } else {
          console.log(`Estado ${userState} detectado, mas não temos leis regionais cadastradas ainda.`);
        }
      } catch (error) {
        console.log('Não foi possível detectar localização, mantendo "Todos os Estados"');
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectLocation();
  }, []); // Executar apenas uma vez ao montar o componente

  // Filtrar artigos
  const filteredArticles = ARTICLES.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'Todos' || 
      article.category === selectedCategory;

    // Filtro geográfico
    const matchesState = 
      selectedState === 'Todos' ||
      article.scope === 'federal' || // Sempre mostrar federais
      article.uf === selectedState;

    return matchesSearch && matchesCategory && matchesState;
  });

  const categories = ['Todos', ...Array.from(new Set(ARTICLES.map(a => a.category)))];

  const getCategoryColor = (category: Article['category']) => {
    const colors = {
      'Tributário': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Licença': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Direitos Autorais': 'bg-magna-violet/20 text-magna-violet border-magna-violet/30',
      'Financiamento': 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
    return colors[category] || 'bg-white/10 text-gray-300 border-white/20';
  };

  const getScopeColor = (scope: Article['scope']) => {
    const colors = {
      'federal': 'bg-blue-500 text-white',
      'state': 'bg-green-500 text-white',
      'municipal': 'bg-orange-500 text-white'
    };
    return colors[scope] || 'bg-gray-500 text-white';
  };

  const getScopeLabel = (scope: Article['scope'], uf?: string) => {
    if (scope === 'federal') return 'Federal';
    if (scope === 'state') return `Estadual${uf ? ` (${uf})` : ''}`;
    if (scope === 'municipal') return `Municipal${uf ? ` (${uf})` : ''}`;
    return scope;
  };

  return (
    <main className="min-h-screen bg-magna-black">
      {/* Toast de Notificação de Localização */}
      {locationNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-indigo-500 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm leading-relaxed">
                  {locationNotification}
                </p>
              </div>
              <button
                onClick={() => setLocationNotification(null)}
                className="flex-shrink-0 text-white hover:text-indigo-200 transition-colors"
                aria-label="Fechar notificação"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero com Imagem de Fundo Cinematográfica */}
      <PageHero 
        title="Central de Inteligência"
        subtitle='O "Oráculo" do Produtor de Eventos - Tudo que você precisa saber para não levar multa e não ser embargado'
        imageKeyword="contract,lawyer,meeting,agreement,business"
      />

      {/* Search Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-magna-dark rounded-2xl shadow-xl p-8 border border-white/10">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="O que você precisa regularizar? (Ex: MEI, ECAD, Alvará...)"
              className="w-full pl-16 pr-6 py-5 text-lg bg-white/5 border-2 border-white/20 text-white rounded-xl focus:border-magna-cyan focus:ring-4 focus:ring-magna-cyan/20 outline-none transition-all font-medium placeholder-gray-500"
            />
          </div>

          {/* Filtro Geográfico */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Seu Estado:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-3 border-2 border-white/20 rounded-xl focus:border-magna-cyan focus:ring-4 focus:ring-magna-cyan/20 outline-none transition-all font-medium text-white bg-white/5"
            >
              {states.map((state) => (
                <option key={state.value} value={state.value} className="bg-magna-dark text-white">
                  {state.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              <Globe className="w-3 h-3 inline mr-1" />
              Leis <strong>Federais</strong> aparecem sempre. Leis <strong>Estaduais/Municipais</strong> filtradas por estado.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 font-semibold py-2">Filtrar por:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-magna-violet text-white shadow-md'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'guia encontrado' : 'guias encontrados'}
          </h2>
          {searchTerm && (
            <p className="text-gray-400">
              Resultados para: <strong>"{searchTerm}"</strong>
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            const Icon = article.icon;
            const isExpanded = expandedArticle === article.id;

            return (
              <div
                key={article.id}
                className="bg-magna-dark rounded-xl border-2 border-white/10 hover:border-magna-cyan hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] transition-all overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-magna-violet/20 rounded-lg">
                        <Icon className="w-6 h-6 text-magna-violet" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {article.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(article.category)}`}>
                            {article.category}
                          </span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getScopeColor(article.scope)}`}>
                            {getScopeLabel(article.scope, article.uf)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {article.isMandatory && (
                      <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-red-400">OBRIGATÓRIO</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-400 mb-4">{article.summary}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-magna-cyan/20 text-magna-cyan text-xs rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setExpandedArticle(isExpanded ? null : article.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-magna-violet hover:bg-magna-magenta text-white font-semibold rounded-lg transition-colors"
                    >
                      {isExpanded ? 'Fechar Guia' : 'Ler Guia Completo'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {article.officialSource && (
                      <a
                        href={article.officialSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-white/5 border-2 border-white/20 hover:border-magna-cyan text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Fonte Oficial
                      </a>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t border-white/10 bg-black/20">
                    <div className="prose prose-sm max-w-none mt-4">
                      {article.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return <h2 key={idx} className="text-2xl font-bold text-white mt-6 mb-3">{line.replace("# ", "")}</h2>;
                        }
                        if (line.startsWith('## ')) {
                          return <h3 key={idx} className="text-xl font-bold text-gray-200 mt-5 mb-2">{line.replace("## ", "")}</h3>;
                        }
                        if (line.startsWith('### ')) {
                          return <h4 key={idx} className="text-lg font-semibold text-gray-300 mt-4 mb-2">{line.replace("### ", "")}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={idx} className="ml-4 text-gray-400">{line.replace("- ", "")}</li>;
                        }
                        if (line.trim() === '') {
                          return <div key={idx} className="h-2" />;
                        }
                        return <p key={idx} className="text-gray-400 leading-relaxed mb-2">{line}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="bg-magna-dark border-2 border-dashed border-white/20 rounded-xl p-12 text-center">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Nenhum guia encontrado
            </h3>
            <p className="text-gray-400 mb-6">
              Tente buscar por: "MEI", "ECAD", "Alvará", "Lei Rouanet"
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setSelectedState('Todos');
              }}
              className="px-6 py-3 bg-magna-violet hover:bg-magna-magenta text-white font-semibold rounded-lg transition-colors"
            >
              Ver Todos os Guias
            </button>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-slate-900 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold mb-3">⚠️ Disclaimer Legal</h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Este guia é <strong>informativo e educacional</strong>, baseado em regulamentações federais e práticas comuns no Brasil. 
                As exigências <strong>variam significativamente</strong> por cidade, estado e tipo de evento.
              </p>
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">
                    <strong>Sempre confirme</strong> com os órgãos competentes locais (Prefeitura, Corpo de Bombeiros, Receita Federal) 
                    antes do seu evento. A MagnaFest <strong>não se responsabiliza</strong> por informações desatualizadas, incorretas ou 
                    pela aplicação inadequada deste conteúdo.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm text-center">
            💡 <strong>Dica:</strong> Consulte sempre um contador ou advogado especializado em eventos para orientação personalizada.
          </p>
        </div>
      </div>
    </main>
  );
}
