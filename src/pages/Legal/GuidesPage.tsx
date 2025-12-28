import { useState } from 'react';
import { Search, BookOpen, Shield, FileText, ArrowUpRight, Scale, X, ExternalLink } from 'lucide-react';

const GUIDES = [
  {
    id: 1,
    title: "MEI para Produtores: O Guia Definitivo",
    excerpt: "Descubra quais CNAEs são permitidos, limites de faturamento e como evitar bitributação na emissão de notas para eventos.",
    category: "Tributário",
    readTime: "5 min",
    icon: FileText,
    content: `
# MEI para Produtores de Eventos

## 📋 O que é MEI?
O Microempreendedor Individual (MEI) é uma categoria tributária simplificada para pequenos negócios com faturamento anual até R$ 81.000,00.

## ✅ CNAEs Permitidos
- **9329-8/01** - Produção de eventos
- **9003-5/00** - Gestão de espaços
- **8230-0/01** - Organização de feiras e eventos

## 💰 Custos Mensais
- INSS: R$ 66,00
- ISS: R$ 5,00
- **Total: R$ 71,00/mês**

## 🚀 Como se cadastrar
1. Acesse gov.br/empresas
2. Clique em "Formalize-se"
3. Processo leva 15 minutos
    `,
    officialLink: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor"
  },
  {
    id: 2,
    title: "ECAD e Direitos Autorais",
    excerpt: "A tabela atualizada de cobrança para música ao vivo e mecânica. Saiba calcular e não ser pego de surpresa.",
    category: "Jurídico",
    readTime: "8 min",
    icon: Scale,
    content: `
# ECAD - Direitos Autorais Musicais

## 🎵 Quando é obrigatório?
- Música ao vivo (bandas, DJs)
- Música mecânica (playlist, Spotify)
- Shows e festivais

## 💰 Valores (2025)
- Eventos até 500 pessoas: R$ 250
- Eventos 500-2000: R$ 800
- Acima de 2000: Consultar

## 📝 Como declarar
1. Acesse ecad.org.br
2. Cadastre seu evento
3. Pague via boleto ou Pix
    `,
    officialLink: "https://www.ecad.org.br"
  },
  {
    id: 3,
    title: "Lei Rouanet & Incentivos Fiscais",
    excerpt: "Como escrever projetos que são aprovados. O passo a passo da captação de recursos federais.",
    category: "Fomento",
    readTime: "12 min",
    icon: BookOpen,
    content: `
# Lei Rouanet - Incentivo à Cultura

## 🎯 O que é?
Lei Federal que permite empresas destinarem até 4% do IR para projetos culturais.

## ✅ Quem pode usar
- Produtores culturais
- Artistas com CNPJ
- Empresas de eventos

## 📋 Processo
1. Criar projeto no SALIC
2. Aguardar aprovação (90-180 dias)
3. Captar recursos
4. Executar e prestar contas

## 💡 Dica
Projetos com impacto social têm mais chance de aprovação.
    `,
    officialLink: "https://www.gov.br/cultura/pt-br/assuntos/lei-rouanet"
  },
  {
    id: 4,
    title: "Contratos de Prestação de Serviço",
    excerpt: "Cláusulas indispensáveis para proteger seu cachê e limitar sua responsabilidade civil em caso de acidentes.",
    category: "Blindagem",
    readTime: "6 min",
    icon: Shield,
    content: `
# Contratos para Eventos

## 📝 Cláusulas Essenciais
1. **Valor e forma de pagamento** - Adiantamento de 50%
2. **Data, hora e local** - Especificar tudo
3. **Rider técnico** - Equipamentos necessários
4. **Cancelamento** - Multas e prazos

## 🛡️ Proteção Legal
- Seguro de responsabilidade civil
- Cláusula de força maior
- Limitação de responsabilidade

## ⚠️ Atenção
Sempre registre no cartório contratos acima de R$ 10.000.
    `,
    officialLink: null
  }
];

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<typeof GUIDES[0] | null>(null);

  const filteredGuides = GUIDES.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#16082a] to-magna-black text-white font-sans selection:bg-purple-900/30 relative overflow-hidden">
      
      {/* Efeitos de luz vibrantes */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-magna-violet/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-magna-magenta/15 blur-[100px] rounded-full pointer-events-none animate-pulse delay-1000"></div>
      
      {/* HEADER EDITORIAL */}
      <div className="pt-24 pb-16 border-b border-magna-violet/20 relative z-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <span className="text-purple-400 font-medium tracking-widest text-xs uppercase mb-4 block">
            Magna Intelligence
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-[1.1]">
            Central de Inteligência
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl font-light">
            O "Oráculo" do produtor. Decodificamos leis, impostos e burocracias para que você foque apenas no show.
          </p>

          {/* Search Input Minimalista */}
          <div className="mt-10 relative max-w-lg">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Busque por 'MEI', 'ECAD' ou 'Contrato'..."
              className="w-full bg-transparent border-b border-white/10 py-3 pl-8 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-lg font-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* GRID DE GUIAS */}
      <div className="container mx-auto px-6 max-w-5xl py-16">
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id} 
                onClick={() => setSelectedGuide(guide)}
                className="group cursor-pointer flex flex-col h-full p-6 rounded-xl bg-gradient-to-br from-magna-violet/10 to-transparent border border-magna-violet/20 hover:border-magna-cyan/50 hover:shadow-[0_0_30px_rgba(138,43,226,0.4)] transition-all backdrop-blur-sm"
              >
                {/* Header do Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase border border-white/10 text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors">
                       {guide.category}
                     </span>
                     <span className="text-xs text-gray-600">• {guide.readTime}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-purple-400 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-purple-200 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {guide.excerpt}
                </p>

                {/* Linha Divisória Sutil */}
                <div className="w-full h-px bg-white/5 group-hover:bg-purple-500/20 transition-colors mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Sutil */
          <div className="text-center py-20">
            <p className="text-gray-500 font-light">
              {searchTerm 
                ? `Nenhum guia encontrado para "${searchTerm}"`
                : 'Nenhum guia encontrado para sua busca.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de Guia */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedGuide(null)}>
          <div className="bg-gradient-to-br from-[#1a0b2e] to-magna-black border-2 border-magna-violet/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 border-b border-magna-violet/30 flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-magna-violet/30 text-magna-violet bg-magna-violet/10">
                  {selectedGuide.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-3">{selectedGuide.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose prose-invert max-w-none">
                {selectedGuide.content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold text-white mb-4">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-xl font-bold text-magna-cyan mt-6 mb-3">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={idx} className="text-gray-300 ml-4">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={idx} />;
                  }
                  return <p key={idx} className="text-gray-300 leading-relaxed mb-3">{line}</p>;
                })}
              </div>
            </div>

            {/* Footer */}
            {selectedGuide.officialLink && (
              <div className="p-6 border-t border-magna-violet/30">
                <a 
                  href={selectedGuide.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-magna-violet to-magna-magenta hover:from-magna-magenta hover:to-magna-violet text-white font-semibold rounded-lg transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Acessar Fonte Oficial
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
