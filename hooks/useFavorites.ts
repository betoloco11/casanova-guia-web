
import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const FAVORITES_KEY = 'business_favorites';
const INITIAL_FAVORITES = ['b1', 'b3', 'b9'];

export const useFavorites = () => {
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    const loadFavorites = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isSupabaseConfigured()) {
            try {
                const { data, error } = await supabase
                    .from('favorites')
                    .select('business_id')
                    .eq('user_id', session.user.id);
                
                if (error) {
                    alert("Error al cargar favoritos de Supabase: " + error.message);
                    throw error;
                }
                
                const ids = new Set<string>(data.map(f => f.business_id));
                setFavoriteIds(ids);
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(ids)));
            } catch (error) {
                console.error("Error loading favorites from Supabase:", error);
            }
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
    }, []);

    useEffect(() => {
        loadFavorites();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            loadFavorites();
        });

        return () => subscription.unsubscribe();
    }, [loadFavorites]);

    const toggleFavorite = useCallback(async (businessId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isSupabaseConfigured()) {
            try {
                if (favoriteIds.has(businessId)) {
                    const { error } = await supabase
                        .from('favorites')
                        .delete()
                        .eq('user_id', session.user.id)
                        .eq('business_id', businessId);
                    if (error) {
                        alert("Error al eliminar favorito: " + error.message);
                        throw error;
                    }
                } else {
                    const { error } = await supabase
                        .from('favorites')
                        .insert([{
                            user_id: session.user.id,
                            business_id: businessId
                        }]);
                    if (error) {
                        alert("Error al guardar favorito: " + error.message);
                        throw error;
                    }
                }
                // El listener onAuthStateChange o el estado local se encargarán de actualizar
                setFavoriteIds(prev => {
                    const next = new Set(prev);
                    if (next.has(businessId)) next.delete(businessId);
                    else next.add(businessId);
                    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)));
                    return next;
                });
            } catch (error) {
                console.error("Error toggling favorite in Supabase:", error);
            }
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
    }, [favoriteIds]);

    return { favoriteIds, toggleFavorite };
};
