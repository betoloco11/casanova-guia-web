
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
                
                let favoritesData = data;
                
                // Si la consulta inicial no devolvió nada, intentamos buscar si hay favoritos en una cuenta hermana con el mismo email
                if ((!favoritesData || favoritesData.length === 0) && session.user.email) {
                    console.log("[AutoSync Favorites] Buscando favoritos de cuenta hermana para el email:", session.user.email);
                    try {
                        const { data: siblingProfile } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('email', session.user.email)
                            .limit(1)
                            .maybeSingle();

                        if (siblingProfile && siblingProfile.id !== session.user.id) {
                            const { data: fallbackFavorites } = await supabase
                                .from('favorites')
                                .select('business_id')
                                .eq('user_id', siblingProfile.id);

                            if (fallbackFavorites && fallbackFavorites.length > 0) {
                                favoritesData = fallbackFavorites;
                                console.log("[AutoSync Favorites] ¡Favoritos recuperados de cuenta hermana!", fallbackFavorites.length);
                            }
                        }
                    } catch (siblingErr) {
                        console.error("[AutoSync Favorites] Error al buscar favoritos de cuenta hermana:", siblingErr);
                    }
                }
                
                if (favoritesData && favoritesData.length > 0) {
                    // Caso ideal: Tenemos datos en la nube, los usamos
                    const ids = new Set<string>(favoritesData.map((f: any) => f.business_id));
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

        // 2. Sync with Supabase (in background, non-blocking with timeout)
        (async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session && isSupabaseConfigured()) {
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout syncing favorite')), 3000)
                    );

                    let syncPromise;
                    if (!shouldBeFavorite) {
                        syncPromise = supabase
                            .from('favorites')
                            .delete()
                            .eq('user_id', session.user.id)
                            .eq('business_id', businessId);
                    } else {
                        syncPromise = supabase
                            .from('favorites')
                            .insert([{
                                user_id: session.user.id,
                                business_id: businessId
                            }]);
                    }

                    await Promise.race([syncPromise, timeoutPromise]);
                    console.log("Favorito sincronizado con Supabase");
                }
            } catch (error) {
                console.warn("Aviso: Sincronización de favorito en la nube diferida (guardado localmente):", error);
            }
        })();
    }, []); // Eliminamos dependencias para evitar cierres obsoletos y re-creaciones de función

    return { favoriteIds, toggleFavorite };
};
