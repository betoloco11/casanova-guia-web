
import { useState, useCallback, useEffect } from 'react';
import { Review } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const REVIEWS_KEY = 'casanova_reviews_v1';

export const useReviews = () => {
  const [allReviews, setAllReviews] = useState<Record<string, Review[]>>({});

  const loadReviews = useCallback(async () => {
    // 1. Cargar desde localStorage primero para rapidez
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (stored) {
      try {
        setAllReviews(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored reviews:", e);
      }
    }

    // 2. Intentar cargar desde Supabase si está configurado
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatted: Record<string, Review[]> = {};
          data.forEach((r: any) => {
            if (!formatted[r.business_id]) formatted[r.business_id] = [];
            
            const dateObj = new Date(r.created_at);
            const dateStr = dateObj.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }).toUpperCase();

            formatted[r.business_id].push({
              id: r.id,
              userId: r.user_id,
              authorName: r.user_name,
              authorImage: r.user_photo,
              rating: r.rating,
              comment: r.comment,
              date: dateStr,
              likes: r.likes || 0,
              comments: r.comments_count || 0
            });
          });
          setAllReviews(formatted);
          localStorage.setItem(REVIEWS_KEY, JSON.stringify(formatted));
        }
      } catch (error) {
        console.warn("Notice: Could not load reviews from Supabase, using local fallback:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const addReview = useCallback(async (businessId: string, review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => {
    const tempId = Date.now().toString();
    const formattedDate = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }).toUpperCase();

    const newReview: Review = {
      ...review,
      id: tempId,
      userId: review.userId || 'local_user',
      date: formattedDate,
      likes: 0,
      comments: 0
    };

    // 1. Actualización local INSTANTÁNEA en UI y localStorage (0ms delay)
    setAllReviews(prev => {
      const businessReviews = Array.isArray(prev[businessId]) ? prev[businessId] : [];
      const updated = { ...prev, [businessId]: [newReview, ...businessReviews] };
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
      return updated;
    });

    // 2. Intentar guardar en Supabase en segundo plano sin bloquear la UI
    (async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout guardando reseña')), 3000)
        );

        const sessionPromise = supabase.auth.getSession();
        const sessionRes = await Promise.race([sessionPromise, timeoutPromise]) as any;
        const session = sessionRes?.data?.session;

        if (!session) return;

        const insertPromise = supabase.from('reviews').insert([{
          business_id: businessId,
          user_id: session.user.id,
          user_name: review.authorName,
          user_photo: review.authorImage,
          rating: review.rating,
          comment: review.comment,
          likes: 0,
          comments_count: 0
        }]);

        await Promise.race([insertPromise, timeoutPromise]);
        console.log("Reseña sincronizada en Supabase con éxito");
      } catch (error: any) {
        console.warn("Sincronización en la nube diferida (guardado localmente):", error);
      }
    })();
  }, []);

  const getBusinessReviews = useCallback((businessId: string) => {
    return Array.isArray(allReviews[businessId]) ? allReviews[businessId] : [];
  }, [allReviews]);

  return { addReview, getBusinessReviews, allReviews, refreshReviews: loadReviews };
};
