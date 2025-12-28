import React from 'react';
import { 
  Mic2, 
  Zap, 
  ShieldAlert, 
  Clapperboard, 
  Search, 
  Users, 
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import SearchHero from '../components/search/SearchHero';

export default function Home() {
  return (
    <main className="min-h-screen bg-magna-black text-white selection:bg-magna-cyan selection:text-black">
      
      {/* 1. HERO SECTION (O Impacto) */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Image com Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-bg.jpg"
            alt="Festival Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-magna-black/80 via-magna-black/60 to-magna-black"></div>
        </div>
        
        {/* Efeitos de Luz de Fundo (Spotlights) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-magna-violet/20 blur-[120px] rounded-full pointer-events-none z-[1]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-magna-cyan/10 blur-[100px] rounded-full pointer-events-none z-[1]" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-magna-cyan animate-pulse"></span>
            <span className="text-sm font-medium tracking-widest text-gray-300 uppercase">O Ecossistema de Eventos</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Conecte-se.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-magna-violet via-magna-magenta to-magna-violet bg-[length:200%_auto] animate-gradient">
              Vibre.
            </span> Realize.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
            De técnicos de som a produtores executivos. O portal definitivo para quem faz o show acontecer. Se você não está aqui, você não existe para o mercado.
          </p>

          {/* Barra de Busca Funcional */}
          <SearchHero />
        </div>
      </section>

      {/* 2. CATEGORIAS (Grid Tecnológico) */}
      <section className="py-24 bg-magna-dark border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">Quem você procura?</h2>
              <p className="text-gray-400">Encontre os melhores talentos para cada etapa da produção.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-magna-cyan hover:text-white transition-colors">
              Ver todas as categorias <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card Component */}
            {[
              { title: "Técnicos de Som", icon: <Mic2 />, count: "120+" },
              { title: "Iluminação", icon: <Zap />, count: "85+" },
              { title: "Segurança", icon: <ShieldAlert />, count: "300+" },
              { title: "Produtores", icon: <Clapperboard />, count: "50+" },
              { title: "Staff & Recepção", icon: <Users />, count: "200+" },
              { title: "Cenografia", icon: <Sparkles />, count: "40+" },
              { title: "Bombeiros", icon: <ShieldAlert />, count: "90+" },
              { title: "Agendas", icon: <CalendarDays />, count: "15+" },
            ].map((cat, idx) => (
              <div key={idx} className="group p-6 bg-magna-black border border-white/5 hover:border-magna-cyan/50 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-magna-violet group-hover:text-magna-cyan group-hover:scale-110 transition-all mb-4">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold uppercase mb-1">{cat.title}</h3>
                <span className="text-sm text-gray-500 group-hover:text-gray-300">{cat.count} Profissionais</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MANIFESTO (Por que usar) */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-16">
            A Arte de <span className="text-magna-cyan">Fazer Acontecer</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-magna-violet/10 transition-colors">
              <Search className="w-10 h-10 text-magna-magenta mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4 uppercase">Visibilidade Total</h3>
              <p className="text-gray-400">Um buscador inteligente que conecta quem precisa contratar com quem sabe executar.</p>
            </div>
            <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-magna-violet/10 transition-colors">
              <CheckCircle2 className="w-10 h-10 text-magna-cyan mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4 uppercase">Validação Real</h3>
              <p className="text-gray-400">Sistema de reivindicação de perfil. Garantia de que o profissional é quem diz ser.</p>
            </div>
            <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-magna-violet/10 transition-colors">
              <Zap className="w-10 h-10 text-magna-violet mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-4 uppercase">Zero Fricção</h3>
              <p className="text-gray-400">Sem barreiras. Cadastre-se, apareça nas buscas e receba propostas diretamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-magna-dark text-center">
        <p className="text-gray-500 text-sm">
          PORTAL MagnaFest © 2024. ELECTRIC HUMAN TECHNOLOGY.
        </p>
      </footer>
    </main>
  );
}
