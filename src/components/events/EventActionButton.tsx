/**
 * =====================================================================
 * EventActionButton - Botão Inteligente de Ação
 * =====================================================================
 * Decide automaticamente qual ação renderizar baseado nos dados do evento:
 * - Link externo (Sympla, Eventbrite)
 * - RSVP interno (eventos gratuitos)
 * - Indisponível (eventos pagos sem link)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { registerForEvent, isUserRegistered } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Event } from '../../types/events';

// =====================================================================
// PROPS
// =====================================================================

interface EventActionButtonProps {
  event: Event;
  onSuccess?: () => void;
}

// =====================================================================
// COMPONENT
// =====================================================================

export default function EventActionButton({ event, onSuccess }: EventActionButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Verificar se está registrado ao montar
  useState(() => {
    if (user && !event.external_ticket_url) {
      checkRegistration();
    }
  });

  const checkRegistration = async () => {
    try {
      const isReg = await isUserRegistered(event.id);
      setRegistered(isReg);
    } catch (err) {
      console.error('Erro ao verificar registro:', err);
    }
  };

  // ================================================================
  // CASO 1: LINK EXTERNO (Sympla, Eventbrite, etc)
  // ================================================================
  if (event.external_ticket_url) {
    return (
      <a
        href={event.external_ticket_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 text-lg font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-5 h-5" />
        Comprar Ingresso
      </a>
    );
  }

  // ================================================================
  // CASO 2: RSVP INTERNO (Eventos gratuitos/meetups)
  // ================================================================
  const isFreeEvent = !event.min_price || event.min_price === 0;

  if (isFreeEvent) {
    const handleRSVP = async () => {
      // Verificar autenticação
      if (!user) {
        navigate('/login', { state: { from: `/eventos/${event.slug}` } });
        return;
      }

      setLoading(true);

      try {
        await registerForEvent(event.id);
        setRegistered(true);
        alert('✅ Presença confirmada com sucesso!');
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        console.error('Erro ao confirmar presença:', error);
        
        if (error.message.includes('já está inscrito')) {
          alert('⚠️ Você já confirmou presença neste evento!');
          setRegistered(true);
        } else if (error.message.includes('logado')) {
          navigate('/login', { state: { from: `/eventos/${event.slug}` } });
        } else {
          alert(`❌ Erro: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    // Estados do botão RSVP
    const getButtonClass = () => {
      const base = 'w-full py-4 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';
      
      if (registered) {
        return `${base} bg-green-100 text-green-700 cursor-not-allowed`;
      }
      
      if (loading) {
        return `${base} bg-green-400 text-white cursor-wait`;
      }
      
      return `${base} bg-green-600 text-white hover:bg-green-700 active:scale-95`;
    };

    const getButtonText = () => {
      if (loading) return 'Confirmando...';
      if (registered) return '✓ Presença Confirmada';
      return 'Confirmar Presença';
    };

    return (
      <button
        onClick={handleRSVP}
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
            <CheckCircle className="w-5 h-5" />
            {getButtonText()}
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            {getButtonText()}
          </>
        )}
      </button>
    );
  }

  // ================================================================
  // CASO 3: INDISPONÍVEL (Evento pago sem link externo)
  // ================================================================
  return (
    <button
      disabled
      className="w-full py-4 text-lg font-semibold rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed flex items-center justify-center gap-2"
    >
      <Calendar className="w-5 h-5" />
      Ingressos Indisponíveis
    </button>
  );
}
