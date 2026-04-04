
import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const USER_PROFILE_KEY = 'casanova_user_profile';

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  neighborhood: string;
  role: 'client' | 'merchant';
  business_id?: string;
  points: number;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Cliente de Casanova',
  email: '',
  neighborhood: 'Isidro Casanova',
  role: 'client',
  points: 0
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isSynced, setIsSynced] = useState(false);

  const loadProfile = useCallback(async () => {
    // 1. Cargar desde localStorage primero para rapidez
    const cached = localStorage.getItem(USER_PROFILE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          setProfile(parsed);
        }
      } catch (e) {
        console.error("Error parsing profile cache", e);
      }
    }

    // 2. Intentar cargar desde Supabase si está configurado
    const { data: { session } } = await supabase.auth.getSession();
    if (session && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

        if (data) {
          setProfile(data as UserProfile);
          setIsSynced(true);
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data));
        } else {
          // Si no existe el perfil, crearlo con los datos de la sesión
          const userRole = session.user.user_metadata?.role || 'client';
          const initialProfile: UserProfile = {
            ...DEFAULT_PROFILE,
            name: session.user.user_metadata?.full_name || (userRole === 'merchant' ? 'Comerciante de Casanova' : 'Cliente de Casanova'),
            email: session.user.email || '',
            role: userRole
          };
          
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({ id: session.user.id, ...initialProfile });
            
          if (insertError) throw insertError;
          
          setProfile(initialProfile);
          setIsSynced(true);
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(initialProfile));
        }
      } catch (error) {
        console.error("Error loading profile from Supabase:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadProfile();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const updateProfile = useCallback(async (newData: Partial<UserProfile>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Actualización local
    const updatedProfile = { ...profile, ...newData };
    setProfile(updatedProfile);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));

    // Guardar en Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: session.user.id, ...updatedProfile });
        if (error) throw error;
        setIsSynced(true);
      } catch (error: any) {
        console.error("Error updating profile in Supabase:", error);
        alert("Error al actualizar los puntos/perfil: " + (error.message || "Error desconocido"));
        setIsSynced(false);
      }
    }
  }, [profile]);

  return { profile, updateProfile, isSynced, refreshProfile: loadProfile };
};
