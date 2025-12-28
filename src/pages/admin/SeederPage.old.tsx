/**
 * =====================================================================
 * SeederPage - Página de Povoamento de Dados (Admin)
 * =====================================================================
 * Gera dados falsos realistas para teste e demonstração
 */

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { Loader, Database, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Faker já vem configurado, não precisa setar locale

// =====================================================================
// DADOS BRASILEIROS
// =====================================================================

const CATEGORIAS = [
  'Sonorização',
  'Iluminação',
  'Segurança',
  'Buffet',
  'Fotografia',
  'Decoração',
  'Cenografia',
  'Limpeza',
  'Transporte',
  'Recepção',
];

const CIDADES_BRASILEIRAS = [
  { cidade: 'São Paulo', estado: 'SP' },
  { cidade: 'Rio de Janeiro', estado: 'RJ' },
  { cidade: 'Belo Horizonte', estado: 'MG' },
  { cidade: 'Salvador', estado: 'BA' },
  { cidade: 'Curitiba', estado: 'PR' },
  { cidade: 'Brasília', estado: 'DF' },
  { cidade: 'Porto Alegre', estado: 'RS' },
  { cidade: 'Fortaleza', estado: 'CE' },
  { cidade: 'Recife', estado: 'PE' },
  { cidade: 'Florianópolis', estado: 'SC' },
];

const SUFIXOS_EMPRESA = [
  'Eventos',
  'Produções',
  'Show',
  'Pro',
  'Master',
  'Premium',
  'Soluções',
  'Serviços',
  'Tech',
  'Brasil',
];

const TIPOS_EVENTOS = [
  'Festival de Verão',
  'Workshop de Inovação',
  'Conferência de Tecnologia',
  'Casamento Premium',
  'Festa Corporativa',
  'Show Musical',
  'Feira de Negócios',
  'Congresso Nacional',
  'Exposição de Arte',
  'Lançamento de Produto',
  'Encontro de Networking',
  'Semana de Moda',
  'Festival Gastronômico',
  'Torneio Esportivo',
  'Cerimônia de Premiação',
];

// =====================================================================
// COMPONENT
// =====================================================================

export default function SeederPage() {
  const [logs, setLogs] = useState<{ message: string; type: 'info' | 'success' | 'error' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ================================================================
  // HELPER: Adicionar Log
  // ================================================================
  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { message, type }]);
  };

  // ================================================================
  // HELPER: Gerar Nome de Empresa Brasileiro
  // ================================================================
  const gerarNomeEmpresa = (categoria: string): string => {
    const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Martins'];
    const prefixos = ['Top', 'Prime', 'Master', 'Best', 'Super', 'Mega', 'Pro', 'Elite', 'Gold', 'Premium'];
    
    const tipo = Math.floor(Math.random() * 3);
    
    if (tipo === 0) {
      // Ex: "Silva Eventos"
      return `${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]} ${SUFIXOS_EMPRESA[Math.floor(Math.random() * SUFIXOS_EMPRESA.length)]}`;
    } else if (tipo === 1) {
      // Ex: "Top Som"
      return `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${categoria.split(' ')[0]}`;
    } else {
      // Ex: "Mega Iluminação Brasil"
      return `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${categoria.split(' ')[0]} ${SUFIXOS_EMPRESA[Math.floor(Math.random() * SUFIXOS_EMPRESA.length)]}`;
    }
  };

  // ================================================================
  // GERAR PROFISSIONAIS
  // ================================================================
  const gerarProfissionais = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog('🚀 Iniciando geração de 50 profissionais...', 'info');

    try {
      const profissionais = [];

      for (let i = 0; i < 50; i++) {
        const categoria = CATEGORIAS[Math.floor(Math.random() * CATEGORIAS.length)];
        const localizacao = CIDADES_BRASILEIRAS[Math.floor(Math.random() * CIDADES_BRASILEIRAS.length)];
        const nome = gerarNomeEmpresa(categoria);
        
        // Avatares profissionais - Retratos reais
        const professionalAvatars = [
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        ];

        // Portfólio - Fotos de eventos reais
        const portfolioImages = [
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=800&q=80',
        ];
        
        const profissional = {
          name: nome,
          category: categoria,
          city: localizacao.cidade,
          state: localizacao.estado,
          description: `Empresa especializada em ${categoria.toLowerCase()} para eventos corporativos e sociais. Atendemos em todo o Brasil com qualidade e profissionalismo.`,
          whatsapp: `55${Math.floor(10000000000 + Math.random() * 90000000000)}`,
          instagram_url: `https://instagram.com/${nome.toLowerCase().replace(/\s/g, '')}`,
          email: `contato@${nome.toLowerCase().replace(/\s/g, '')}.com.br`,
          website: Math.random() > 0.5 ? `https://www.${nome.toLowerCase().replace(/\s/g, '')}.com.br` : null,
          is_verified: Math.random() > 0.8,
          avatar_url: professionalAvatars[Math.floor(Math.random() * professionalAvatars.length)],
          portfolio_images: [
            portfolioImages[Math.floor(Math.random() * portfolioImages.length)],
            portfolioImages[Math.floor(Math.random() * portfolioImages.length)],
            portfolioImages[Math.floor(Math.random() * portfolioImages.length)],
          ],
        };

        profissionais.push(profissional);
        addLog(`${i + 1}/50 - Criando: ${nome}`, 'info');
      }

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('providers')
        .insert(profissionais)
        .select();

      if (error) throw error;

      addLog(`✅ Sucesso! ${data?.length || 50} profissionais criados!`, 'success');
    } catch (error) {
      console.error('Erro ao gerar profissionais:', error);
      addLog(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================
  // GERAR EVENTOS
  // ================================================================
  const gerarEventos = async () => {
    setIsLoading(true);
    setLogs([]);
    addLog('🚀 Iniciando geração de 20 eventos...', 'info');

    try {
      const eventos = [];

      for (let i = 0; i < 20; i++) {
        const localizacao = CIDADES_BRASILEIRAS[Math.floor(Math.random() * CIDADES_BRASILEIRAS.length)];
        const tipoEvento = TIPOS_EVENTOS[Math.floor(Math.random() * TIPOS_EVENTOS.length)];
        
        // Data futura (próximos 90 dias)
        const dataEvento = new Date();
        dataEvento.setDate(dataEvento.getDate() + Math.floor(Math.random() * 90) + 1);
        
        const evento = {
          title: tipoEvento,
          description: `Participe do ${tipoEvento} em ${localizacao.cidade}! Um evento imperdível com palestrantes renomados, networking de qualidade e experiências únicas.`,
          event_date: dataEvento.toISOString(),
          city: localizacao.cidade,
          state: localizacao.estado,
          address: `Av. ${faker.location.street()}, ${Math.floor(Math.random() * 9999) + 100}`,
          capacity: Math.floor(Math.random() * 900) + 100, // 100-1000 pessoas
          category: ['Corporativo', 'Social', 'Cultural', 'Esportivo', 'Educacional'][Math.floor(Math.random() * 5)],
          is_free: Math.random() > 0.7, // 30% gratuito
          ticket_price: Math.random() > 0.7 ? null : (Math.floor(Math.random() * 200) + 50) * 10, // R$ 50-2000
          image_url: `https://source.unsplash.com/random/1200x600/?event,conference,${Math.random()}`,
          external_ticket_url: `https://www.sympla.com.br/evento-${i}`,
          published: true,
        };

        eventos.push(evento);
        addLog(`${i + 1}/20 - Criando: ${tipoEvento}`, 'info');
      }

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('events')
        .insert(eventos)
        .select();

      if (error) throw error;

      addLog(`✅ Sucesso! ${data?.length || 20} eventos criados!`, 'success');
    } catch (error) {
      console.error('Erro ao gerar eventos:', error);
      addLog(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================
  // LIMPAR TUDO
  // ================================================================
  const limparTudo = async () => {
    if (!confirm('⚠️ ATENÇÃO! Isso vai DELETAR TODOS os profissionais e eventos. Confirma?')) {
      return;
    }

    setIsLoading(true);
    setLogs([]);
    addLog('🗑️ Limpando banco de dados...', 'info');

    try {
      // Deletar profissionais
      const { error: errorProviders } = await supabase
        .from('providers')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

      if (errorProviders) throw errorProviders;
      addLog('✅ Profissionais deletados', 'success');

      // Deletar eventos
      const { error: errorEvents } = await supabase
        .from('events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

      if (errorEvents) throw errorEvents;
      addLog('✅ Eventos deletados', 'success');

      addLog('✅ Banco de dados limpo!', 'success');
    } catch (error) {
      console.error('Erro ao limpar:', error);
      addLog(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <>
      <Helmet>
        <title>Seeder - Admin | MagnaFest</title>
      </Helmet>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8 text-primary-500" />
              <h1 className="text-4xl font-bold text-gray-900">
                Data Seeder
              </h1>
            </div>
            <p className="text-gray-600">
              Popule o banco de dados com dados falsos para teste e demonstração
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Gerar Profissionais */}
            <button
              onClick={gerarProfissionais}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Users className="w-12 h-12" />
              <span className="font-bold text-lg">Gerar 50 Profissionais</span>
            </button>

            {/* Gerar Eventos */}
            <button
              onClick={gerarEventos}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Calendar className="w-12 h-12" />
              <span className="font-bold text-lg">Gerar 20 Eventos</span>
            </button>

            {/* Limpar Tudo */}
            <button
              onClick={limparTudo}
              disabled={isLoading}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Database className="w-12 h-12" />
              <span className="font-bold text-lg">Limpar Tudo</span>
            </button>
          </div>

          {/* Log de Atividades */}
          <div className="bg-gray-900 text-gray-100 rounded-xl p-6 min-h-[400px] max-h-[600px] overflow-y-auto font-mono text-sm">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
              <Database className="w-5 h-5 text-green-400" />
              <h2 className="font-bold text-green-400">Console Log</h2>
            </div>

            {logs.length === 0 && !isLoading && (
              <p className="text-gray-500 italic">
                Aguardando ação... Clique em um dos botões acima para começar.
              </p>
            )}

            {isLoading && (
              <div className="flex items-center gap-3 mb-4">
                <Loader className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-blue-400">Processando...</span>
              </div>
            )}

            {logs.map((log, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 mb-2 ${
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'error' ? 'text-red-400' : 
                  'text-gray-300'
                }`}
              >
                {log.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                {log.type === 'error' && <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <span className="break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
