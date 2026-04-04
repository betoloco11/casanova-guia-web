
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useFavorites } from '../hooks/useFavorites';
import { useReviews } from '../hooks/useReviews';
import { UserProfile, Review } from '../types';

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  favoriteIds: Set<string>;
  toggleFavorite: (businessId: string) => Promise<void>;
  allReviews: Record<string, Review[]>;
  addReview: (businessId: string, review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, updateProfile, refreshProfile } = useUserProfile();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { allReviews, addReview, refreshReviews } = useReviews();

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
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};
