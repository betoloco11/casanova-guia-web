
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useFavorites } from '../hooks/useFavorites';
import { useReviews } from '../hooks/useReviews';
import { UserProfile, Review } from '../types';
import { PointsToastData, PointsToast } from '../components/PointsToast';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  favoriteIds: Set<string>;
  toggleFavorite: (businessId: string) => Promise<void>;
  allReviews: Record<string, Review[]>;
  addReview: (businessId: string, review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => Promise<void>;
  refreshData: () => Promise<void>;
  pointsToast: PointsToastData | null;
  showPointsToast: (points: number, message: string) => void;
  clearPointsToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, updateProfile, refreshProfile } = useUserProfile();
  const { favoriteIds, toggleFavorite: rawToggleFavorite } = useFavorites();
  const { allReviews, addReview: rawAddReview, refreshReviews } = useReviews();

  const [pointsToast, setPointsToast] = useState<PointsToastData | null>(null);

  const showPointsToast = useCallback((points: number, message: string) => {
    setPointsToast({
      id: Date.now(),
      points,
      message
    });
  }, []);

  const clearPointsToast = useCallback(() => {
    setPointsToast(null);
  }, []);

  const toggleFavorite = useCallback(async (businessId: string) => {
    const isAdding = !favoriteIds.has(businessId);
    await rawToggleFavorite(businessId);
    if (isAdding) {
      updateProfile({ points: (profile.points || 0) + 5 });
      showPointsToast(5, 'Guardaste un comercio en favoritos');
    }
  }, [favoriteIds, rawToggleFavorite, updateProfile, profile.points, showPointsToast]);

  const addReview = useCallback(async (businessId: string, review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => {
    const reviewWithUser = {
      ...review,
      userId: review.userId || profile?.id || 'local_user',
      authorName: review.authorName || profile?.name || 'Vecino de Casanova'
    };
    await rawAddReview(businessId, reviewWithUser);
    updateProfile({ points: (profile?.points || 0) + 15 });
    showPointsToast(15, 'Escribiste una nueva reseña');
  }, [rawAddReview, updateProfile, profile, showPointsToast]);

  const refreshData = async () => {
    await Promise.all([refreshProfile(), refreshReviews()]);
  };

  const value = {
    profile,
    updateProfile,
    favoriteIds,
    toggleFavorite,
    allReviews,
    addReview,
    refreshData,
    pointsToast,
    showPointsToast,
    clearPointsToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <PointsToast toast={pointsToast} onClose={clearPointsToast} />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};

