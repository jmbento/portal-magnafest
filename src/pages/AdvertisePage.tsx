import { useState } from 'react';
import { Check, Mail, Download } from 'lucide-react';

// --- CONFIGURAÇÃO DOS FORMATOS E ONDE ELES APARECEM ---
const FORMATS = [
  {
    id: 'billboard',
    label: 'Billboard Homepage',
    desc: 'O espaço nobre. Banner full-width no topo inicial.',
    highlightArea: 'header' 
  },
  {
    id: 'native',
    label: 'Native Ads (Feed)',
    desc: 'Artigos patrocinados integrados ao feed de notícias.',
    highlightArea: 'feed'
  },
  {
    id: 'sidebar',
    label: 'Destaque Lateral/Busca',
    desc: 'Cards em áreas estratégicas de navegação e busca.',
    highlightArea: 'sidebar'
  }
];

export default function AdvertisePage() {
  const [activeFormat, setActiveFormat] = useState(FORMATS[0]);

  const isHighlighted = (area: string) => activeFormat.highlightArea === area;

  const highlightClass = "bg-gradient-to-r from-purple-500/80 to-pink-500/80 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white flex items-center justify-center font-bold text-[10px] tracking-widest uppercase animate-pulse transition-all duration-500";
  const normalClass = "bg-white/5 border-white/10";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 pt-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <div className="container mx-auto px-6 py-20 text-center max-w-4xl relative z-10">
        <span className="inline-block px-3 py-1 mb-6 text-[11px] font-bold tracking-[0.2em] text-purple-400 border border-purple-500/20 rounded-full uppercase">
          Magna Media Kit
        </span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight break-words">
          Sua marca no <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Backstage</span> mais exclusivo.
        </h1>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
          Alcance a elite técnica e produtiva de eventos no Brasil. B2B real, sem desperdício de verba.
        </p>
      </div>

      {/* VITRINE INTERATIVA (DUAL DEVICE MOCKUP) */}
      <div className="bg-[#0A0A0A] border-y border-white/5 py-24 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                
                {/* ESQUERDA: MENU DE SELEÇÃO */}
                <div className="lg:col-span-4 space-y-4 relative z-10 order-2 lg:order-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8 tracking-tight">Escolha o Formato</h2>
                    {FORMATS.map((format) => (
                        <button
                            key={format.id}
                            onClick={() => setActiveFormat(format)}
                            className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 group ${
                                activeFormat.id === format.id 
                                ? 'bg-white/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] translate-x-2' 
                                : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10 hover:translate-x-1'
                            }`}
                        >
                            <h3 className={`text-sm md:text-base font-semibold mb-1 transition-colors ${
                                activeFormat.id === format.id ? 'text-white' : 'text-gray-300'
                            }`}>
                                {format.label}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 font-light leading-relaxed">{format.desc}</p>
                        </button>
                    ))}
                </div>

                {/* DIREITA: MOCKUP CENA (MacBook + iPhone) */}
                <div className="lg:col-span-8 relative perspective-[2000px] order-1 lg:order-2 mb-12 lg:mb-0">
                    
                    {/* Cena Container */}
                    <div className="relative flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-8">
                        
                        {/* === MACBOOK PRO === */}
                        <div className="relative w-full max-w-[600px] hidden md:block">
                            {/* Tampa/Tela */}
                            <div className="relative bg-[#1d1d1f] rounded-[18px] p-[14px] border-[2px] border-[#3d3d3f] shadow-2xl overflow-hidden">
                                {/* Notch */}
                                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-xl z-20 flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#0a0a0a] border border-[#1d1d1f]"></div>
                                </div>
                                
                                {/* TELA */}
                                <div className="aspect-[16/10] bg-[#050505] rounded-[10px] overflow-hidden relative">
                                    {/* Navbar */}
                                    <div className="h-12 bg-black/50 border-b border-white/10 flex items-center px-6 gap-4">
                                        <div className="w-24 h-4 bg-white/20 rounded-full"></div>
                                        <div className="flex gap-4 ml-auto">
                                            <div className="w-12 h-3 bg-white/10 rounded-full"></div>
                                            <div className="w-12 h-3 bg-white/10 rounded-full"></div>
                                            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                                        </div>
                                    </div>
                                    
                                    {/* CONTEÚDO */}
                                    <div className="p-6 flex gap-6 h-full">
                                        <div className="flex-1 space-y-6">
                                            {/* HEADER/BILLBOARD */}
                                            <div className={`h-48 w-full rounded-xl border transition-all duration-500 ${isHighlighted('header') ? highlightClass : normalClass}`}>
                                                {isHighlighted('header') && "SUA MARCA AQUI"}
                                            </div>
                                            
                                            {/* Feed */}
                                            <div className="space-y-4">
                                                <div className="w-1/2 h-6 bg-white/10 rounded-lg"></div>
                                                <div className="flex gap-4">
                                                    {/* NATIVE AD */}
                                                    <div className={`flex-1 h-32 rounded-xl border transition-all duration-500 ${isHighlighted('feed') ? highlightClass : normalClass}`}>
                                                        {isHighlighted('feed') && "NATIVE AD"}
                                                    </div>
                                                    <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10"></div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10"></div>
                                                    <div className="flex-1 h-32 bg-white/5 rounded-xl border border-white/10"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Sidebar */}
                                        <div className="w-64 flex flex-col gap-4">
                                             <div className="w-full h-10 bg-white/10 rounded-lg mb-4"></div>
                                             {/* SIDEBAR DESTAQUE */}
                                             <div className={`w-full h-64 rounded-xl border transition-all duration-500 ${isHighlighted('sidebar') ? highlightClass : normalClass}`}>
                                                {isHighlighted('sidebar') && "DESTAQUE LATERAL"}
                                             </div>
                                             <div className="flex-1 bg-white/5 rounded-xl border border-white/10"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Base */}
                            <div className="relative -mt-1 h-4 bg-[#2d2d2f] rounded-b-[20px] border-t border-[#0a0a0a] shadow-lg">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-2 bg-[#1d1d1f] rounded-b-md"></div>
                            </div>
                        </div>

                        {/* === IPHONE === */}
                        <div className="relative w-full max-w-[280px] md:w-[280px] z-20 md:-ml-20">
                            {/* Frame */}
                            <div className="relative bg-[#1d1d1f] rounded-[45px] p-[12px] border-[4px] border-[#3d3d3f] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
                                {/* Dynamic Island */}
                                <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-30 flex items-center justify-end px-3 gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#1d1d1f]"></div>
                                </div>

                                {/* TELA MOBILE */}
                                <div className="aspect-[9/19.5] bg-[#050505] rounded-[35px] overflow-hidden relative">
                                     {/* Navbar Mobile */}
                                    <div className="h-16 pt-8 bg-black/50 border-b border-white/10 flex items-center px-6 justify-between">
                                        <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                                        <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                                    </div>

                                    {/* CONTEÚDO MOBILE */}
                                    <div className="p-4 space-y-4 overflow-hidden">
                                        {/* HEADER MOBILE */}
                                        <div className={`h-40 w-full rounded-2xl border transition-all duration-500 ${isHighlighted('header') ? highlightClass : normalClass}`}>
                                              {isHighlighted('header') && "BANNER MOBILE"}
                                        </div>
                                        
                                        <div className="w-3/4 h-5 bg-white/10 rounded-lg"></div>
                                        <div className="w-1/2 h-5 bg-white/10 rounded-lg mb-6"></div>

                                         {/* SIDEBAR vira topo */}
                                         {isHighlighted('sidebar') && (
                                            <div className={`h-24 w-full rounded-2xl border mb-4 transition-all duration-500 ${highlightClass}`}>
                                                DESTAQUE BUSCA
                                            </div>
                                         )}

                                         {/* FEED NATIVE */}
                                        <div className={`h-64 w-full rounded-2xl border transition-all duration-500 ${isHighlighted('feed') ? highlightClass : normalClass}`}>
                                              {isHighlighted('feed') && "NATIVE POST"}
                                        </div>
                                         <div className="h-64 w-full bg-white/5 rounded-2xl border border-white/10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <div className="container mx-auto px-6 py-16 md:py-24 text-center border-t border-white/5">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 md:mb-8 tracking-tight">Pronto para conectar sua marca?</h2>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <a
                    href="mailto:comercial@portalmagnafest.com.br"
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-white text-black hover:bg-gray-200 font-semibold transition-colors shadow-lg"
                 >
                    <Mail className="w-4 h-4" strokeWidth={1.25} /> Falar com Consultor
                 </a>
                 <a 
                    href="/assets/docs/media-kit-magnafest-2025.pdf" 
                    download
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-white/10 text-white hover:bg-white/5 font-semibold transition-colors"
                 >
                    <Download className="w-4 h-4" strokeWidth={1.25} /> Baixar Mídia Kit (PDF)
                 </a>
            </div>
      </div>
    </div>
  );
}
