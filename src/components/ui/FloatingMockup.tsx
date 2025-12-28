import { useEffect, useState } from 'react';

interface FloatingMockupProps {
  activeFormat: string;
}

export const FloatingMockup = ({ activeFormat }: FloatingMockupProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[600px] perspective-[2000px]">
      {/* Laptop Base (Fundo) */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(${mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Laptop Screen */}
        <div className="relative w-[500px] h-[350px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl border-8 border-gray-800 overflow-hidden">
          {/* Moldura Superior */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full" />
          
          {/* Tela Escura de Fundo */}
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
            <div className="text-gray-600 text-6xl opacity-10">MagnaFest</div>
          </div>
        </div>

        {/* Floating Cards/Screens (Holográficas) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Card 1 - Billboard (Esquerda) */}
          {activeFormat === 'billboard' && (
            <div
              className="absolute top-12 -left-32 w-64 h-40 bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 animate-float"
              style={{
                transform: `translateZ(100px) rotateY(-15deg)`,
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              <div className="text-white font-bold text-sm mb-2">BANNER HOMEPAGE</div>
              <div className="bg-white/20 h-20 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">SEU ANÚNCIO AQUI</span>
              </div>
            </div>
          )}

          {/* Card 2 - Native Ads (Centro-Direita) */}
          {activeFormat === 'native' && (
            <div
              className="absolute top-20 right-8 w-56 h-64 bg-gradient-to-br from-cyan-500/80 to-blue-600/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 animate-float-delayed"
              style={{
                transform: `translateZ(80px) rotateY(10deg)`,
                animation: 'float 3s ease-in-out 0.5s infinite'
              }}
            >
              <div className="text-white font-bold text-xs mb-3">NATIVE ADS</div>
              <div className="space-y-2">
                <div className="bg-white/30 h-12 rounded-lg" />
                <div className="bg-purple-500/40 h-12 rounded-lg border-2 border-purple-400" />
                <div className="bg-white/30 h-12 rounded-lg" />
              </div>
            </div>
          )}

          {/* Card 3 - Newsletter (Baixo-Esquerda) */}
          {activeFormat === 'newsletter' && (
            <div
              className="absolute bottom-8 -left-24 w-72 h-48 bg-gradient-to-br from-orange-500/85 to-red-600/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 animate-float"
              style={{
                transform: `translateZ(120px) rotateY(-10deg) rotateX(5deg)`,
                animation: 'float 3s ease-in-out 1s infinite'
              }}
            >
              <div className="text-white font-bold text-sm mb-2">📧 NEWSLETTER</div>
              <div className="bg-white/20 rounded-lg p-3 text-white text-xs">
                <div className="font-bold mb-1">Enviado para 5.000+</div>
                <div className="text-white/80">Sua mensagem exclusiva aqui</div>
              </div>
            </div>
          )}

          {/* Card 4 - Featured (Direita) */}
          {activeFormat === 'featured' && (
            <div
              className="absolute top-32 right-16 w-48 h-56 bg-gradient-to-br from-yellow-500/80 to-amber-600/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-3 animate-float-delayed"
              style={{
                transform: `translateZ(90px) rotateY(15deg)`,
                animation: 'float 3s ease-in-out 0.3s infinite'
              }}
            >
              <div className="text-white font-bold text-xs mb-2">⭐ DESTAQUE</div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 h-32 rounded-lg border-2 border-yellow-300 flex items-center justify-center">
                <span className="text-white font-bold text-xs">1º LUGAR</span>
              </div>
            </div>
          )}

          {/* Icons/Badges flutuando */}
          <div
            className="absolute top-8 right-32 w-16 h-16 bg-purple-500/70 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center animate-pulse"
            style={{
              transform: `translateZ(150px)`,
            }}
          >
            <span className="text-white text-2xl">📊</span>
          </div>

          <div
            className="absolute bottom-16 left-48 w-12 h-12 bg-pink-500/70 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center animate-bounce"
            style={{
              transform: `translateZ(140px)`,
            }}
          >
            <span className="text-white text-xl">💼</span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateZ(100px); }
          50% { transform: translateY(-10px) translateZ(100px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};
