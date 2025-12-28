import { AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export function EnvCheckWarning() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 backdrop-blur-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-500 mb-1">
              Variáveis de Ambiente Não Configuradas
            </h3>
            <p className="text-sm text-gray-300">
              Configure <code className="px-1.5 py-0.5 bg-black/30 rounded">VITE_SUPABASE_URL</code> e{' '}
              <code className="px-1.5 py-0.5 bg-black/30 rounded">VITE_SUPABASE_ANON_KEY</code> no Vercel Dashboard → Settings → Environment Variables
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
