/**
 * =====================================================================
 * FavoriteButton - Botão de Favoritar com Optimistic UI
 * =====================================================================
 * Component client-side que usa Supabase para toggle de favoritos
 */

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// =====================================================================
// PROPS
// =====================================================================

interface FavoriteButtonProps {
  providerId: string;
  initialIsFavorited?: boolean;
  initialCount?: number;
  onToggle?: (isFavorited: boolean, newCount: number) => void;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function FavoriteButton({
  providerId,
  initialIsFavorited = false,
  initialCount = 0,
  onToggle,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // Atualizar estado quando props mudarem
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
    setCount(initialCount);
  }, [initialIsFavorited, initialCount]);

  // Toggle favorite
  const handleToggle = async () => {
    if (!user) {
      alert('Você precisa estar logado para favoritar!');
      return;
    }

    // Optimistic UI - atualiza imediatamente
    const newIsFavorited = !isFavorited;
    const newCount = newIsFavorited ? count + 1 : count - 1;
    
    setIsFavorited(newIsFavorited);
    setCount(newCount);
    setIsLoading(true);

    try {
      if (newIsFavorited) {
        // Adicionar favorito
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            provider_id: providerId,
          });

        if (error) throw error;
      } else {
        // Remover favorito
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('provider_id', providerId);

        if (error) throw error;
      }

      // Callback para atualizar parent component
      onToggle?.(newIsFavorited, newCount);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      
      // Reverter optimistic update em caso de erro
      setIsFavorited(!newIsFavorited);
      setCount(count);
      
      alert('Erro ao favoritar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm 
        transition-all duration-200 transform active:scale-95
        ${isFavorited 
          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        disabled:cursor-not-allowed
      `}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`w-4 h-4 transition-all ${
          isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
        }`}
      />
      <span className="font-semibold">{count}</span>
    </button>
  );
}

// =====================================================================
// COMPACT VERSION (Para cards pequenos)
// =====================================================================

export function FavoriteButtonCompact({
  providerId,
  initialIsFavorited = false,
  initialCount = 0,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
    setCount(initialCount);
  }, [initialIsFavorited, initialCount]);

  const handleToggle = async () => {
    if (!user) {
      alert('Você precisa estar logado para favoritar!');
      return;
    }

    const newIsFavorited = !isFavorited;
    const newCount = newIsFavorited ? count + 1 : count - 1;
    
    setIsFavorited(newIsFavorited);
    setCount(newCount);
    setIsLoading(true);

    try {
      if (newIsFavorited) {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, provider_id: providerId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('provider_id', providerId);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      setIsFavorited(!newIsFavorited);
      setCount(count);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 hover:scale-105
        ${isFavorited 
          ? 'bg-red-500 text-white' 
          : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
        }
        ${isLoading ? 'opacity-50' : ''}
      `}
    >
      <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
      <span>{count}</span>
    </button>
  );
}
