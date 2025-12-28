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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-serif selection:bg-blue-100 antialiased">
      
      {/* HEADER DOCUMENTAL */}
      <div className="pt-24 pb-12 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-gray-600" />
            <span className="text-gray-600 font-semibold tracking-wide text-sm uppercase">
              Documentação Oficial
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Central de Inteligência Jurídica
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
            Guias oficiais sobre tributação, direitos autorais, contratos e legislação para produtores de eventos. Informações técnicas e procedimentos regulamentados.
          </p>

          {/* Search Input Formal */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar documentação (ex: MEI, ECAD, Contratos)..."
              className="w-full bg-white border-2 border-gray-300 rounded-lg py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* GRID DE GUIAS DOCUMENTAIS */}
      <div className="container mx-auto px-6 max-w-4xl py-12">
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <div 
                key={guide.id} 
                onClick={() => setSelectedGuide(guide)}
                className="group cursor-pointer flex flex-col h-full bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all p-6"
              >
                {/* Header do Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 rounded bg-gray-100 text-[11px] font-bold tracking-wider uppercase text-gray-700 border border-gray-300">
                       {guide.category}
                     </span>
                     <span className="text-xs text-gray-500 font-medium">• {guide.readTime}</span>
                  </div>
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>

                {/* Conteúdo */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow font-sans">
                  {guide.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">Clique para ler o documento completo</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              {searchTerm 
                ? `Nenhum documento encontrado para "${searchTerm}"`
                : 'Nenhum documento encontrado.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal DOCUMENTAL */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedGuide(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
            {/* Header Formal */}
            <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded bg-blue-100 text-xs font-bold tracking-wider uppercase text-blue-800 border border-blue-200">
                    {selectedGuide.category}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{selectedGuide.readTime} de leitura</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedGuide.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors ml-4"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content Documental */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] bg-white">
              <div className="prose prose-gray max-w-none font-sans">
                {selectedGuide.content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">{line.replace('# ', '')}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded"></span>
                      {line.replace('## ', '')}
                    </h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={idx} className="text-gray-700 ml-6 mb-2 leading-relaxed">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
                })}
              </div>
            </div>

            {/* Footer Oficial */}
            {selectedGuide.officialLink && (
              <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                <a 
                  href={selectedGuide.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm"
                >
                  <ExternalLink className="w-5 h-5" />
                  Acessar Fonte Oficial do Governo
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
