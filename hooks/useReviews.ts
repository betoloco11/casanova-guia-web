
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

            console.log("DEBUG - Loaded review from Supabase:", r.id, "for user:", r.user_id);

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
        console.error("Error loading reviews from Supabase:", error);
      }
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const addReview = useCallback(async (businessId: string, review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const tempId = Date.now().toString();
    const formattedDate = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }).toUpperCase();
    
    const newReview: Review = {
      ...review,
      id: tempId,
      userId: session.user.id,
      date: formattedDate,
      likes: 0,
      comments: 0
    };

    // Actualización optimista en UI
    setAllReviews(prev => {
      const businessReviews = Array.isArray(prev[businessId]) ? prev[businessId] : [];
      const updated = { ...prev, [businessId]: [newReview, ...businessReviews] };
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Intentar guardar en Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('reviews').insert([{
          business_id: businessId,
          user_id: session.user.id,
          user_name: review.authorName,
          user_photo: review.authorImage,
          rating: review.rating,
          comment: review.comment,
          likes: 0,
          comments_count: 0
        }]);
        if (error) throw error;
      } catch (error: any) {
        console.error("Error saving review to Supabase:", error);
      }
    }
  }, []);

  const getBusinessReviews = useCallback((businessId: string) => {
    return Array.isArray(allReviews[businessId]) ? allReviews[businessId] : [];
  }, [allReviews]);

  return { addReview, getBusinessReviews, allReviews, refreshReviews: loadReviews };
};
