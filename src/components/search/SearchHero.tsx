/**
 * =====================================================================
 * MAGNAFEST - SearchHero Component
 * =====================================================================
 * Barra de busca principal da Home com tema Neon Night/Cyberpunk
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchHero() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      // Se vazio, vai para explorar sem filtro
      navigate('/explorar');
    }
  };

  const handleButtonClick = () => {
    if (searchTerm.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explorar');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Input de Busca */}
        <div className="relative">
          {/* Ícone de Busca */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-6 h-6 text-gray-400" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busque por DJs, fotógrafos, técnicos de som..."
            className="w-full pl-16 pr-44 py-6 text-lg
              bg-white/10 backdrop-blur-md
              border border-white/20
              text-white placeholder-gray-400
              rounded-xl
              focus:outline-none focus:ring-2 focus:ring-magna-cyan focus:border-magna-cyan
              transition-all duration-300"
          />

          {/* Botão de Busca */}
          <button
            type="button"
            onClick={handleButtonClick}
            className="absolute right-2 top-1/2 -translate-y-1/2
              px-8 py-3
              bg-gradient-to-r from-magna-violet to-magna-magenta
              text-white font-bold uppercase tracking-wider
              rounded-lg
              hover:scale-105 hover:shadow-[0_0_30px_rgba(138,43,226,0.6)]
              transition-all duration-300
              flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Buscar
          </button>
        </div>

        {/* Dica de Atalho */}
        <p className="text-center mt-4 text-sm text-gray-400">
          Pressione <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Enter</kbd> para buscar
        </p>
      </form>

      {/* Categorias Rápidas (Opcional) */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {quickCategories.map((category) => (
          <button
            key={category.slug}
            onClick={() => navigate(`/explorar?categoria=${category.slug}`)}
            className="px-4 py-2 
              bg-white/5 hover:bg-white/10
              border border-white/10 hover:border-magna-cyan
              text-gray-300 hover:text-magna-cyan
              rounded-full text-sm font-medium
              transition-all duration-200"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Categorias para acesso rápido
const quickCategories = [
  { name: 'DJs', slug: 'tecnico-de-som' },
  { name: 'Iluminação', slug: 'tecnico-de-iluminacao' },
  { name: 'Segurança', slug: 'seguranca-vigilancia' },
  { name: 'Produtores', slug: 'produtor-de-eventos' },
  { name: 'Buffet', slug: 'catering-buffet' },
];
