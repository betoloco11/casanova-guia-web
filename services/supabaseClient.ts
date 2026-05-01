
import { createClient } from '@supabase/supabase-js';

// REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE SUPABASE
// Las encuentras en: Settings -> API en tu panel de Supabase
const supabaseUrl: string = 'https://jbihfaupzrgtzujntopl.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaWhmYXVwenJndHp1am50b3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjA2NTgsImV4cCI6MjA4NTQ5NjY1OH0.UabU6WXGZjEPMXoBoKSSIqQlEtBz49RXVahA0vkqkIg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://TU_PROYECTO.supabase.co' && 
         supabaseAnonKey !== 'TU_ANON_KEY_AQUI';
};

/**
 * Helper para iniciar sesión con Google usando una ventana emergente (popup).
 * Esto es necesario en entornos de iframe como AI Studio.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    // Abrir en una nueva ventana
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      data.url,
      'google-login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      throw new Error("El navegador bloqueó la ventana emergente. Por favor, permite popups para este sitio.");
    }
  }

  return { data, error };
};
