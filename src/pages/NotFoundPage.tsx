import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [faderLevels, setFaderLevels] = useState([65, 45, 80, 30, 55, 70, 40, 60]);

  const handleFaderMove = (index: number, value: number) => {
    const newLevels = [...faderLevels];
    newLevels[index] = value;
    setFaderLevels(newLevels);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-black text-white flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[150px] rounded-full animate-pulse" />

      <div className="relative z-10 text-center max-w-4xl w-full">
        
        {/* Error code */}
        <h1 className="text-9xl md:text-[200px] font-black tracking-tighter mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent leading-none animate-pulse">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-4">
          Ops! Frequência não encontrada
        </h2>
        <p className="text-base md:text-lg text-gray-400 mb-16 max-w-2xl mx-auto">
          Parece que essa página foi para o backstage. Ajuste os faders abaixo e volte para a mix principal.
        </p>

        {/* 3D Mixer Console */}
        <div className="relative perspective-[2000px] mb-12">
          <div className="transform-gpu rotate-x-[15deg] rotate-y-[-5deg] transition-transform duration-700 hover:rotate-x-[10deg] hover:rotate-y-0" style={{ transformStyle: 'preserve-3d' }}>
            
            {/* Console body */}
            <div className="relative mx-auto max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-3xl p-8 md:p-12 border-2 border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
              
              {/* Top panel indicators */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-mono tracking-wider">MAGNAFEST MX-404</div>
              </div>

              {/* Faders */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 mb-8">
                {faderLevels.map((level, index) => (
                  <div key={index} className="flex flex-col items-center gap-3">
                    {/* Channel label */}
                    <div className="text-[10px] text-gray-500 font-mono">CH {index + 1}</div>
                    
                    {/* Fader track */}
                    <div className="relative h-32 md:h-40 w-8 bg-black/50 rounded-full border border-white/20 overflow-hidden group">
                      {/* LED indicator */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-200"
                        style={{ 
                          height: `${level}%`,
                          bottom: 0,
                          opacity: 0.6
                        }}
                      />
                      
                      {/* Fader knob */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={level}
                        onChange={(e) => handleFaderMove(index, parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
                      />
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-7 h-6 bg-gradient-to-b from-gray-200 to-gray-400 rounded-md shadow-lg border border-white/30 transition-all duration-200 group-hover:shadow-purple-500/50 group-hover:scale-110 pointer-events-none"
                        style={{ 
                          bottom: `calc(${level}% - 12px)`,
                        }}
                      >
                        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[2px] bg-gray-600 rounded-full" />
                      </div>
                    </div>

                    {/* VU meter */}
                    <div className="flex gap-[2px]">
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                            level > dot * 30 
                              ? dot === 3 ? 'bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]'
                              : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Master section */}
              <div className="flex justify-center gap-8 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[10px] text-gray-500 font-mono mb-1">MASTER</div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all"
          >
            <Home className="w-4 h-4" strokeWidth={1.25} />
            Voltar para Home
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.25} />
            Recarregar
          </button>
        </div>

        {/* Easter egg text */}
        <p className="text-xs text-gray-600 mt-12 font-mono">
          Dica: Tente ajustar os faders para encontrar a frequência certa 👀
        </p>
      </div>
    </div>
  );
}
