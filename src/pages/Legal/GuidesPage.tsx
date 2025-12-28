import { useState } from 'react';
import { Search, BookOpen, Shield, FileText, ArrowUpRight, Scale } from 'lucide-react';

const GUIDES = [
  {
    id: 1,
    title: "MEI para Produtores: O Guia Definitivo",
    excerpt: "Descubra quais CNAEs são permitidos, limites de faturamento e como evitar bitributação na emissão de notas para eventos.",
    category: "Tributário",
    readTime: "5 min",
    icon: FileText
  },
  {
    id: 2,
    title: "ECAD e Direitos Autorais",
    excerpt: "A tabela atualizada de cobrança para música ao vivo e mecânica. Saiba calcular e não ser pego de surpresa.",
    category: "Jurídico",
    readTime: "8 min",
    icon: Scale
  },
  {
    id: 3,
    title: "Lei Rouanet & Incentivos Fiscais",
    excerpt: "Como escrever projetos que são aprovados. O passo a passo da captação de recursos federais.",
    category: "Fomento",
    readTime: "12 min",
    icon: BookOpen
  },
  {
    id: 4,
    title: "Contratos de Prestação de Serviço",
    excerpt: "Cláusulas indispensáveis para proteger seu cachê e limitar sua responsabilidade civil em caso de acidentes.",
    category: "Blindagem",
    readTime: "6 min",
    icon: Shield
  }
];

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = GUIDES.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-900/30">
      
      {/* HEADER EDITORIAL */}
      <div className="pt-24 pb-16 border-b border-white/5">
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
              <div key={guide.id} className="group cursor-pointer flex flex-col h-full">
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
    </div>
  );
}
