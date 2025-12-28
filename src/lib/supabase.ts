import { createClient } from '@supabase/supabase-js';

// Verificar se as env vars existem
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log para debug (apenas em dev)
if (import.meta.env.DEV) {
  console.log('🔍 Supabase URL:', supabaseUrl ? '✅ OK' : '❌ MISSING');
  console.log('🔍 Supabase Key:', supabaseAnonKey ? '✅ OK' : '❌ MISSING');
}

// Criar client com fallback para evitar erro fatal
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Exportar função de verificação
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
};
