
import { createClient } from '@supabase/supabase-js';

// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE SUPABASE
// Las encuentras en: Settings -> API en tu panel de Supabase
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://jbihfaupzrgtzujntopl.supabase.co';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaWhmYXVwenJndHp1am50b3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjA2NTgsImV4cCI6MjA4NTQ5NjY1OH0.UabU6WXGZjEPMXoBoKSSIqQlEtBz49RXVahA0vkqkIg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://TU_PROYECTO.supabase.co' && 
         supabaseAnonKey !== 'TU_ANON_KEY_AQUI';
};
