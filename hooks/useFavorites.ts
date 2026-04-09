
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
                // Timeout de 5 segundos
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout loading favorites')), 5000)
                );

                const fetchPromise = supabase
                    .from('favorites')
                    .select('business_id')
                    .eq('user_id', session.user.id);

                const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
                
                if (error) throw error;
                
                const ids = new Set<string>(data.map((f: any) => f.business_id));
                setFavoriteIds(ids);
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(ids)));
            } else {
                // Fallback to local storage for guest users
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
            console.error("Error loading favorites:", error);
            // En caso de error, intentamos cargar de local storage como último recurso
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
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session && isSupabaseConfigured()) {
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout toggling favorite')), 5000)
                );

                if (favoriteIds.has(businessId)) {
                    const deletePromise = supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', session.user.id)
                        .eq('business_id', businessId);
                    
                    const { error } = await Promise.race([deletePromise, timeoutPromise]) as any;
                    if (error) throw error;
                } else {
                    const insertPromise = supabase
                        .from('favorites')
                        .insert([{
                            user_id: session.user.id,
                            business_id: businessId
                        }]);
                    
                    const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;
                    if (error) throw error;
                }
                
                // Actualizamos estado local inmediatamente para mejor UX
                setFavoriteIds(prev => {
                    const next = new Set(prev);
                    if (next.has(businessId)) next.delete(businessId);
                    else next.add(businessId);
                    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
                    return next;
                });
            } else {
                // Local only for guest
                setFavoriteIds(prevIds => {
                    const newIds = new Set(prevIds);
                    if (newIds.has(businessId)) {
                        newIds.delete(businessId);
                    } else {
                        newIds.add(businessId);
                    }
                    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newIds)));
                    return newIds;
                });
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Fallback local incluso si falla Supabase para que el usuario vea el cambio
            setFavoriteIds(prev => {
                const next = new Set(prev);
                if (next.has(businessId)) next.delete(businessId);
                else next.add(businessId);
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
                return next;
            });
        }
    }, [favoriteIds]);

    return { favoriteIds, toggleFavorite };
};
