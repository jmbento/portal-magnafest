/**
 * =====================================================================
 * PageHero - Hero com Imagem de Fundo
 * =====================================================================
 * Componente reutilizável para adicionar impacto visual no topo das páginas
 */

interface PageHeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;        // URL local (ex: /assets/hero.jpg)
  imageKeyword?: string;    // Unsplash keyword (fallback)
}

export default function PageHero({ title, subtitle, imageUrl, imageKeyword }: PageHeroProps) {
  // Prioridade: imageUrl local > Unsplash keyword
  const backgroundImage = imageUrl || `https://source.unsplash.com/1600x900/?${imageKeyword || 'concert,stage'}`;
  
  return (
    <div className="relative w-full h-[350px] flex items-center justify-center overflow-hidden">
      {/* Imagem de Fundo */}
      <img 
        src={backgroundImage} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
        loading="eager"
        onError={(e) => {
          // Fallback para Unsplash se imagem local falhar
          if (imageUrl && imageKeyword) {
            e.currentTarget.src = `https://source.unsplash.com/1600x900/?${imageKeyword}`;
          }
        }}
      />
      
      {/* Layer de Escurecimento */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Gradiente de Fusão (Fade suave para o fundo preto) */}
      <div className="absolute inset-0 bg-gradient-to-t from-magna-black via-magna-black/60 to-transparent" />

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
