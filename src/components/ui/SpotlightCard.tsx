import { useRef, useState, MouseEvent, ReactNode } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

export const SpotlightCard = ({ children, className = '' }: SpotlightCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Borda Iluminada (Glow) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.4), transparent 40%)`,
        }}
      />
      
      {/* Fundo Iluminado (Subtle Fill) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition duration-500"
        style={{
          opacity: opacity * 0.5, // Mais sutil
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.08), transparent 40%)`,
        }}
      />
      
      {/* Conteúdo Real do Card */}
      <div className="relative h-full">{children}</div>
    </div>
  );
};
