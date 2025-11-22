import { createClient } from '@supabase/supabase-js';

// Estes valores devem vir das variáveis de ambiente (create .env file)
// Ex: VITE_SUPABASE_URL=https://seu-projeto.supabase.co
// Ex: VITE_SUPABASE_ANON_KEY=sua-chave-publica
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Evita crash se as chaves não existirem (modo demonstração)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const isSupabaseConfigured = () => {
  return !!supabase;
};