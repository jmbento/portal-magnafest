/**
 * =====================================================================
 * RegistrationButton - Botão de Inscrição em Evento
 * =====================================================================
 * Componente client-side para registrar usuário em eventos
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, Loader2 } from 'lucide-react';
import { registerForEvent } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// =====================================================================
// PROPS
// =====================================================================

interface RegistrationButtonProps {
  eventId: string;
  eventSlug: string;
  price?: number;
  isRegistered?: boolean;
  onSuccess?: () => void;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function RegistrationButton({
  eventId,
  eventSlug,
  price,
  isRegistered = false,
  onSuccess,
}: RegistrationButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);

  // ================================================================
  // HANDLERS
  // ================================================================
  const handleRegister = async () => {
    // Verificar autenticação
    if (!user) {
      // Redirecionar para login preservando a URL atual
      navigate('/login', { state: { from: `/eventos/${eventSlug}` } });
      return;
    }

    setLoading(true);

    try {
      await registerForEvent(eventId);
      
      // Sucesso
      setRegistered(true);
      alert('✅ Inscrição confirmada com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      
      // Tratamento de erros específicos
      if (error.message.includes('já está inscrito')) {
        alert('⚠️ Você já está inscrito neste evento!');
        setRegistered(true);
      } else if (error.message.includes('logado')) {
        alert('❌ Você precisa estar logado para se inscrever');
        navigate('/login', { state: { from: `/eventos/${eventSlug}` } });
      } else {
        alert(`❌ Erro ao se inscrever: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // TEXT & STYLES
  // ================================================================
  const getButtonText = () => {
    if (loading) return 'Processando...';
    if (registered) return '✓ Inscrito';
    if (price === 0) return 'Inscrever-se Gratuitamente';
    return 'Garantir Ingresso';
  };

  const getButtonClass = () => {
    const baseClass = 'w-full py-4 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
    
    if (registered) {
      return `${baseClass} bg-green-100 text-green-700 cursor-not-allowed`;
    }
    
    if (loading) {
      return `${baseClass} bg-primary-400 text-white cursor-wait`;
    }
    
    return `${baseClass} bg-primary-600 text-white hover:bg-primary-700 active:scale-95`;
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <button
      onClick={handleRegister}
      disabled={loading || registered}
      className={getButtonClass()}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {getButtonText()}
        </>
      ) : registered ? (
        <>
          <span className="text-xl">✓</span>
          {getButtonText()}
        </>
      ) : (
        <>
          <Ticket className="w-5 h-5" />
          {getButtonText()}
        </>
      )}
    </button>
  );
}
