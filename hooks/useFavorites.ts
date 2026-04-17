
import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const FAVORITES_KEY = 'business_favorites';
const INITIAL_FAVORITES = ['b1', 'b3', 'b9'];

export const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    const loadFavorites = useCallback(async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && isSupabaseConfigured()) {
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout loading favorites')), 5000)
                );

                const fetchPromise = supabase
                    .from('favorites')
                    .select('business_id')
                    .eq('user_id', session.user.id);

                const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    // Caso ideal: Tenemos datos en la nube, los usamos
                    const ids = new Set<string>(data.map((f: any) => f.business_id));
                    setFavoriteIds(ids);
                    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(ids)));
                    console.log("Favoritos cargados desde Supabase:", ids.size);
                } else {
                    // Caso crítico: Nube vacía. ¿Hay algo local previo que debamos migrar?
                    const stored = localStorage.getItem(FAVORITES_KEY);
                    if (stored) {
                        try {
                            const localIds = JSON.parse(stored) as string[];
                            if (localIds.length > 0) {
                                console.log("Detectados favoritos locales para migrar a nueva cuenta...");
                                // Intentamos migrar a Supabase
                                const inserts = localIds.map(id => ({
                                    user_id: session.user.id,
                                    business_id: id
                                }));
                                await supabase.from('favorites').insert(inserts);
                                console.log("Migración exitosa a Supabase.");
                                setFavoriteIds(new Set(localIds));
                            } else {
                                setFavoriteIds(new Set());
                            }
                        } catch (e) {
                            console.error("Error migrando favoritos locales:", e);
                            setFavoriteIds(new Set());
                        }
                    } else {
                        // Realmente no tiene nada
                        setFavoriteIds(new Set());
                    }
                }
            } else {
                // Fallback normal para invitados
                const stored = localStorage.getItem(FAVORITES_KEY);
                if (stored) {
                    try {
                        setFavoriteIds(new Set(JSON.parse(stored)));
                    } catch {
                        setFavoriteIds(new Set(INITIAL_FAVORITES));
                    }
                } else {
                    setFavoriteIds(new Set(INITIAL_FAVORITES));
                }
            }
        } catch (error) {
            console.error("Error crítico loading favorites:", error);
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                try {
                    setFavoriteIds(new Set(JSON.parse(stored)));
                } catch {
                    setFavoriteIds(new Set(INITIAL_FAVORITES));
                }
            }
        }
    }, []);

    useEffect(() => {
        loadFavorites();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            loadFavorites();
        });

        return () => subscription.unsubscribe();
    }, [loadFavorites]);

    const toggleFavorite = useCallback(async (businessId: string) => {
        let shouldBeFavorite = false;
        
        // 1. Update LOCAL state immediately (Optimistic)
        setFavoriteIds(prev => {
            shouldBeFavorite = !prev.has(businessId);
            const next = new Set(prev);
            if (shouldBeFavorite) next.add(businessId);
            else next.delete(businessId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
            console.log(`Favorito ${shouldBeFavorite ? 'añadido' : 'eliminado'} localmente:`, businessId);
            return next;
        });

        // 2. Sync with Supabase (in background)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && isSupabaseConfigured()) {
                if (!shouldBeFavorite) {
                    // Si ya no es favorito, eliminar de Supabase
                    const { error } = await supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', session.user.id)
                        .eq('business_id', businessId);
                    
                    if (error) throw error;
                    console.log("Sincronizado: Eliminado de Supabase");
                } else {
                    // Si ahora es favorito, añadir a Supabase
                    const { error } = await supabase
                        .from('favorites')
                        .insert([{
                            user_id: session.user.id,
                            business_id: businessId
                        }]);
                    
                    if (error) throw error;
                    console.log("Sincronizado: Añadido a Supabase");
                }
            } else {
                console.log("No sincronizado: Sesión no disponible o Supabase no configurado");
                if (!session) {
                    console.warn("Usuario no autenticado, guardado solo local.");
                }
            }
        } catch (error) {
            console.error("Error al sincronizar favorito con servidor:", error);
            // El estado local se mantiene para no frustrar la navegación inmediata
        }
    }, []); // Eliminamos dependencias para evitar cierres obsoletos y re-creaciones de función

    return { favoriteIds, toggleFavorite };
};
