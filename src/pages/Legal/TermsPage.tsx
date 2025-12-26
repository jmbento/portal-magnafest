/**
 * =====================================================================
 * Protocolos da Comunidade MagnaFest - Corporate Dark
 * =====================================================================
 * Documentação legal sóbria e profissional
 */

import { Shield, AlertTriangle, MessageSquare, Ban } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-magna-black text-gray-300">
      {/* Header Simples */}
      <div className="border-b border-white/10 bg-magna-dark">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-black text-white mb-3">
            Protocolos da Comunidade MagnaFest
          </h1>
          <p className="text-gray-400 text-sm">
            Última atualização: Dezembro 2025
          </p>
        </div>
      </div>

      {/* Corpo do Texto */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        
        {/* 1. O Código de Honra */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-magna-violet" />
            <h2 className="text-2xl font-bold text-magna-violet">
              1. O Código de Honra
            </h2>
          </div>
          <p className="text-lg leading-relaxed">
            Ao usar o MagnaFest, você concorda em agir com{' '}
            <strong className="text-white">profissionalismo</strong>. Somos uma rede de especialistas, 
            não uma feira livre.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Este é um espaço técnico onde a reputação importa. 
            Trate todos com respeito e mantenha o padrão de excelência que o setor de eventos merece.
          </p>
        </section>

        {/* 2. Política de Anúncios */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-magna-violet" />
            <h2 className="text-2xl font-bold text-magna-violet">
              2. Política de Anúncios (Classificados)
            </h2>
          </div>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-magna-violet mt-2.5 flex-shrink-0" />
              <span>
                É <strong className="text-white">proibido</strong> vender equipamentos roubados, 
                piratas ou com defeitos ocultos.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-magna-violet mt-2.5 flex-shrink-0" />
              <span>
                Anúncios suspeitos serão <strong className="text-white">removidos automaticamente</strong> pela 
                nossa IA de segurança (MagnaGuardian).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-magna-violet mt-2.5 flex-shrink-0" />
              <span>
                Preços devem refletir o valor real de mercado. 
                Golpes e fraudes resultam em <strong className="text-red-400">expulsão permanente</strong>.
              </span>
            </li>
          </ul>
        </section>

        {/* 3. Conduta em Entrevistas */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-8 h-8 text-magna-violet" />
            <h2 className="text-2xl font-bold text-magna-violet">
              3. Conduta em Entrevistas
            </h2>
          </div>
          <p className="text-lg leading-relaxed">
            O espaço do Blog é para{' '}
            <strong className="text-white">compartilhar conhecimento técnico</strong>. 
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Discursos de ódio, assédio ou difamação resultam em{' '}
            <strong className="text-red-400">banimento imediato</strong> e 
            podem ser reportados às autoridades competentes.
          </p>
        </section>

        {/* 4. O Poder do Admin (Cláusula do Ban) */}
        <section className="border-t border-white/10 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <Ban className="w-8 h-8 text-magna-violet" />
            <h2 className="text-2xl font-bold text-magna-violet">
              4. O Poder do Admin (A Cláusula do Ban)
            </h2>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <p className="text-lg leading-relaxed text-gray-200">
              A administração do MagnaFest <strong className="text-white">reserva-se o direito</strong> de 
              suspender ou banir permanentemente contas que violem estes termos,{' '}
              <strong className="text-red-400">sem aviso prévio</strong>.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Banimentos são irreversíveis e incluem bloqueio de IP, email e CPF/CNPJ.
            </p>
          </div>
        </section>

        {/* Rodapé Legal */}
        <section className="border-t border-white/10 pt-12">
          <div className="bg-magna-dark rounded-lg p-8 text-center">
            <p className="text-lg text-gray-200 mb-4">
              <strong className="text-white">Ao criar sua conta, você aceita estes termos automaticamente.</strong>
            </p>
            <p className="text-sm text-gray-400">
              Estes termos estão sujeitos à legislação brasileira. 
              Foro: Comarca de São Paulo/SP.
            </p>
            <p className="text-xs text-gray-500 mt-6">
              Portal MagnaFest - Conectando Profissionais de Eventos desde 2024
            </p>
          </div>
        </section>

        {/* Informações de Contato */}
        <section className="pb-12">
          <h3 className="text-xl font-bold text-white mb-4">Dúvidas ou Denúncias?</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong className="text-white">Suporte:</strong>{' '}
              <a href="mailto:suporte@magnafest.com.br" className="text-magna-cyan hover:underline">
                suporte@magnafest.com.br
              </a>
            </p>
            <p>
              <strong className="text-white">Denúncias:</strong>{' '}
              <a href="mailto:denuncia@magnafest.com.br" className="text-magna-cyan hover:underline">
                denuncia@magnafest.com.br
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Tempo médio de resposta: 24 horas úteis
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
