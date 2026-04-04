
import React, { useState, useEffect } from 'react';
import { Business, Category } from '../types';
import { getBusinessesByCategory } from '../services/mockApiService';
import BusinessCard from '../components/BusinessCard';
import { ChevronLeftIcon } from '../components/Icons';

interface CategoryResultsPageProps {
  category: Category;
  goBack: () => void;
  viewBusinessDetails: (id: string) => void;
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  viewWriteReview: (id: string) => void;
}

const CategoryResultsPage: React.FC<CategoryResultsPageProps> = ({ 
  category, 
  goBack, 
  viewBusinessDetails,
  favoriteIds,
  toggleFavorite,
  viewWriteReview
}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getBusinessesByCategory(category.id);
      setBusinesses(data);
      setLoading(false);
    };
    fetch();
  }, [category.id]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-slate-950">
      <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md z-10 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors">
        <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">{category.name}</h1>
      </header>

      <div className="p-6 space-y-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-2">
              <div className="bg-gray-200 dark:bg-slate-800 h-24 w-24 rounded-2xl"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : businesses.length > 0 ? (
          <>
            <div className="space-y-6">
              {businesses.map(business => (
                <div key={business.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-1 shadow-sm border border-blue-50 dark:border-slate-700">
                  <BusinessCard 
                    business={business} 
                    onSelect={viewBusinessDetails}
                    isFavorite={favoriteIds.has(business.id)}
                    toggleFavorite={toggleFavorite}
                    onReview={viewWriteReview}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center pb-20">
                <button 
                    onClick={goBack}
                    className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-lg border border-gray-100 dark:border-slate-700 active:scale-95 transition-all group"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                    <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Volver</span>
                </button>
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-blue-200 dark:border-slate-700 px-10">
            <p className="text-gray-600 dark:text-slate-400 font-bold text-lg leading-snug italic">No hay comercios registrados en esta categoría aún.</p>
            <button onClick={goBack} className="mt-8 text-blue-600 dark:text-yellow-400 font-black text-xs uppercase tracking-[0.2em] bg-white dark:bg-slate-800 px-8 py-4 rounded-2xl shadow-md border border-blue-100 dark:border-slate-700">Regresar al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryResultsPage;
