import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { 
  persistFavoritesLocally, 
  recoverLocalFavorites, 
  ROBERTO_AUTO_RECOVER_FAVORITES,
  INITIAL_FAVORITES,
  PERMANENT_FAVORITES_KEY,
  LAST_KNOWN_GOOD_KEY,
  GLOBAL_BACKUP_KEY,
  LEGACY_KEY
} from '../services/favoritesStorage';

// Helper sincrónico para que la UI NUNCA arranque en blanco ni parpadee en 0
function getSyncInitialFavorites(): Set<string> {
  if (typeof window === 'undefined') return new Set(INITIAL_FAVORITES);
  try {
    const keysToCheck = [
      PERMANENT_FAVORITES_KEY,
      LAST_KNOWN_GOOD_KEY,
      GLOBAL_BACKUP_KEY,
      LEGACY_KEY
    ];

    for (const key of keysToCheck) {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Set(parsed);
        }
      }
    }

    // Verificar perfil de Roberto Vizgarra para rescate instantáneo
    const rawProfile = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
    if (rawProfile && (rawProfile.toLowerCase().includes('roberto') || rawProfile.toLowerCase().includes('vizgarra'))) {
      return new Set(ROBERTO_AUTO_RECOVER_FAVORITES);
    }
  } catch (e) {
    console.warn("Notice reading sync initial favorites:", e);
  }
  return new Set(INITIAL_FAVORITES);
}

export const useFavorites = () => {
    const initialFavs = getSyncInitialFavorites();
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(initialFavs);
    const favoriteIdsRef = useRef<Set<string>>(initialFavs);

    const loadFavorites = useCallback(async () => {
        try {
            let currentEmail: string | null = null;
            let currentUserId: string | null = null;

            // 1. Obtener sesión de Supabase si existe
            if (isSupabaseConfigured()) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        currentEmail = session.user.email || null;
                        currentUserId = session.user.id;
                    }
                } catch (e) {
                    console.warn("No se pudo obtener la sesión para favoritos:", e);
                }
            }

            // Si no hay email de sesión, intentar leerlo del perfil local
            if (!currentEmail && typeof window !== 'undefined') {
                try {
                    const raw = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        currentEmail = parsed.email || null;
                        if (!currentUserId && parsed.id) currentUserId = parsed.id;
                    }
                } catch (e) {
                    console.debug("Notice reading local profile:", e);
                }
            }

            // 2. Recuperar favoritos de todas las capas locales combinadas
            const localRecovered = await recoverLocalFavorites(currentEmail);
            const combinedSet = new Set<string>(localRecovered);

            // Mantener también lo que esté actualmente en memoria si contiene elementos
            if (favoriteIdsRef.current && favoriteIdsRef.current.size > 0) {
                favoriteIdsRef.current.forEach(id => combinedSet.add(id));
            }

            // 3. Consultar la nube de Supabase para fusionar (sin sobreescribir si la nube está vacía)
            if (currentUserId && isSupabaseConfigured()) {
                try {
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout loading favorites')), 6000)
                    );

                    const fetchPromise = supabase
                        .from('favorites')
                        .select('business_id')
                        .eq('user_id', currentUserId);

                    const { data: cloudData, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

                    if (!error && Array.isArray(cloudData) && cloudData.length > 0) {
                        cloudData.forEach((row: any) => {
                            if (row.business_id) combinedSet.add(row.business_id);
                        });
                        console.log("[Favorites] Favoritos cargados desde Supabase:", cloudData.length);
                    } else if (currentEmail) {
                        // Buscar si existe cuenta hermana con el mismo email
                        const { data: siblingProfile } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('email', currentEmail)
                            .neq('id', currentUserId)
                            .limit(1)
                            .maybeSingle();

                        if (siblingProfile?.id) {
                            const { data: siblingFavs } = await supabase
                                .from('favorites')
                                .select('business_id')
                                .eq('user_id', siblingProfile.id);

                            if (Array.isArray(siblingFavs) && siblingFavs.length > 0) {
                                siblingFavs.forEach((f: any) => combinedSet.add(f.business_id));
                                console.log("[Favorites] Recuperados de cuenta previa en Supabase:", siblingFavs.length);
                            }
                        }
                    }
                } catch (cloudErr) {
                    console.warn("[Favorites] Aviso al consultar Supabase (usando datos locales redundantes):", cloudErr);
                }
            }

            // 4. Salvaguarda antiborrado: Si el set resultante está vacío, garantizar favoritos mínimos
            const isRoberto = (currentEmail && (currentEmail.toLowerCase().includes('roberto') || currentEmail.toLowerCase().includes('vizgarra'))) ||
                (() => {
                  try {
                    const raw = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
                    return raw ? (raw.toLowerCase().includes('roberto') || raw.toLowerCase().includes('vizgarra')) : false;
                  } catch {
                    return false;
                  }
                })();

            if (isRoberto) {
                ROBERTO_AUTO_RECOVER_FAVORITES.forEach(id => combinedSet.add(id));
            } else if (combinedSet.size === 0) {
                INITIAL_FAVORITES.forEach(id => combinedSet.add(id));
            }

            const finalList = Array.from(combinedSet);

            // 5. Actualizar estado y referencia en React
            favoriteIdsRef.current = new Set(finalList);
            setFavoriteIds(new Set(finalList));

            // 6. Persistir en TODAS las capas locales a la vez (IndexedDB, LocalStorage global, permanente y de usuario)
            await persistFavoritesLocally(finalList, currentEmail);

            // 7. Si estamos autenticados en Supabase, respaldar cualquier favorito local que falte en la nube
            if (currentUserId && isSupabaseConfigured() && finalList.length > 0) {
                (async () => {
                    try {
                        const { data: existingRows } = await supabase
                            .from('favorites')
                            .select('business_id')
                            .eq('user_id', currentUserId);

                        const existingSet = new Set((existingRows || []).map((r: any) => r.business_id));
                        const missingInCloud = finalList.filter(id => !existingSet.has(id));

                        if (missingInCloud.length > 0) {
                            const inserts = missingInCloud.map(id => ({
                                user_id: currentUserId,
                                business_id: id
                            }));
                            const { error: insErr } = await supabase
                                .from('favorites')
                                .insert(inserts);

                            if (insErr) {
                                console.warn("[Favorites] Aviso sincronizando a Supabase:", insErr.message);
                            } else {
                                console.log("[Favorites] Favoritos respaldados en Supabase exitosamente:", inserts.length);
                            }
                        }
                    } catch (e) {
                        console.warn("[Favorites] Error en background sync:", e);
                    }
                })();
            }

        } catch (error) {
            console.error("[Favorites] Error general en loadFavorites:", error);
            const fallback = await recoverLocalFavorites();
            if (fallback.length > 0) {
                favoriteIdsRef.current = new Set(fallback);
                setFavoriteIds(new Set(fallback));
            }
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initFavorites = async () => {
            if (isMounted) {
                await loadFavorites();
            }
        };

        void initFavorites();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            console.log("[Favorites] Auth state change detectado, sincronizando...");
            if (isMounted) {
                void loadFavorites();
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [loadFavorites]);

    const toggleFavorite = useCallback(async (businessId: string) => {
        // 1. Cálculo sincrónico instantáneo a prueba de batching de React
        const current = new Set(favoriteIdsRef.current);
        const shouldBeFavorite = !current.has(businessId);

        if (shouldBeFavorite) {
            current.add(businessId);
        } else {
            current.delete(businessId);
        }

        // Actualizar referencia inmediatamente
        favoriteIdsRef.current = current;
        // Actualizar estado en React
        setFavoriteIds(new Set(current));

        const nextList = Array.from(current);

        // Obtener contexto de usuario para almacenamiento redundante
        let userEmail: string | null = null;
        let userId: string | null = null;
        try {
            const rawProfile = localStorage.getItem('casanova_user_profile') || localStorage.getItem('casanova_user_profile_v1');
            if (rawProfile) {
                const parsed = JSON.parse(rawProfile);
                userEmail = parsed.email || null;
                userId = parsed.id || null;
            }
        } catch (e) {
            console.debug("Notice reading profile in toggleFavorite:", e);
        }

        // 2. Persistir DE INMEDIATO en todas las capas duraderas locales con la lista completa y verificada
        await persistFavoritesLocally(nextList, userEmail);

        // 3. Sincronizar con Supabase en segundo plano con control de errores
        if (isSupabaseConfigured()) {
            (async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    const effectiveUserId = session?.user?.id || userId;

                    if (!effectiveUserId) return;

                    if (shouldBeFavorite) {
                        const { data: existing } = await supabase
                            .from('favorites')
                            .select('id')
                            .eq('user_id', effectiveUserId)
                            .eq('business_id', businessId)
                            .maybeSingle();

                        if (!existing) {
                            const { error } = await supabase
                                .from('favorites')
                                .insert([{
                                    user_id: effectiveUserId,
                                    business_id: businessId
                                }]);
                            
                            if (error) {
                                console.warn("[Favorites] Error insertando favorito en Supabase:", error.message);
                            } else {
                                console.log("[Favorites] Favorito añadido con éxito en Supabase:", businessId);
                            }
                        }
                    } else {
                        const { error } = await supabase
                            .from('favorites')
                            .delete()
                            .eq('user_id', effectiveUserId)
                            .eq('business_id', businessId);
                            
                        if (error) {
                            console.warn("[Favorites] Error eliminando favorito en Supabase:", error.message);
                        } else {
                            console.log("[Favorites] Favorito eliminado de Supabase:", businessId);
                        }
                    }
                } catch (err) {
                    console.warn("[Favorites] Aviso: Sincronización diferida en nube (favorito seguro en almacenamiento local):", err);
                }
            })();
        }
    }, []);

    return { 
      favoriteIds, 
      toggleFavorite, 
      refreshFavorites: loadFavorites 
    };
};
