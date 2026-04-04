
import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, MapIcon } from '../components/Icons';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import { mockBusinesses } from '../services/mockApiService';
import { useFavorites } from '../hooks/useFavorites';
import { Page, Business } from '../types';
import { CATEGORIES } from '../constants';

interface SearchPageProps {
  goBack: () => void;
  viewBusinessDetails: (id: string) => void;
  navigateTo: (page: Page) => void;
  onViewMap: (filteredResults: Business[]) => void;
  viewWriteReview: (id: string) => void;
}

const DetailHeader: React.FC<{title: string, onBack: () => void}> = ({ title, onBack }) => (
    <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md z-20 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <button onClick={onBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">{title}</h1>
    </header>
);

const SearchTag: React.FC<{text: string; active: boolean; onClick: () => void}> = ({ text, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-sm font-black whitespace-nowrap transition-all border shadow-sm ${
        active 
          ? 'bg-blue-600 dark:bg-yellow-400 border-blue-600 dark:border-yellow-400 text-white dark:text-slate-950 shadow-lg shadow-blue-100 dark:shadow-slate-900 scale-105' 
          : 'bg-white dark:bg-slate-800 border-blue-50 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-yellow-500 hover:text-blue-600 dark:hover:text-yellow-400'
      }`}
    >
        {text}
    </button>
);

const SearchPage: React.FC<SearchPageProps> = ({ goBack, viewBusinessDetails, onViewMap, viewWriteReview }) => {
  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const filteredResults = useMemo(() => {
    let results = mockBusinesses;
    
    if (activeCategoryId) {
      results = results.filter(b => b.categoryId === activeCategoryId);
    }
    
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.type.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    
    return results;
  }, [query, activeCategoryId]);

  const handleTagClick = (categoryId: string) => {
    if (activeCategoryId === categoryId) {
        setActiveCategoryId(null);
    } else {
        setActiveCategoryId(categoryId);
        setQuery('');
    }
  };

  return (
    <div className="min-h-screen relative pb-40 transition-colors duration-300">
        <DetailHeader title="Explorar Barrio" onBack={goBack} />
        
        <div className="sticky top-[77px] z-10 pb-4 bg-[#D1E9FF]/80 dark:bg-slate-950/80 backdrop-blur-sm transition-colors duration-300">
            <div className="p-5">
                <SearchBar 
                  value={query} 
                  onChange={(val) => { 
                    setQuery(val); 
                    if (val) setActiveCategoryId(null);
                  }} 
                  placeholder="Ej: Cerrajero, Sushi, Clínica..." 
                />
            </div>

            <div className="px-5 overflow-x-auto flex space-x-3 pb-2 no-scrollbar">
                {CATEGORIES.map(category => (
                  <SearchTag 
                    key={category.id} 
                    text={category.name} 
                    active={activeCategoryId === category.id} 
                    onClick={() => handleTagClick(category.id)}
                  />
                ))}
            </div>
        </div>

        <div className="p-5 pt-4 space-y-8">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tight">
                  {query || activeCategoryId ? 'Resultados' : 'Sugeridos para ti'}
                </h2>
                <span className="text-xs font-black text-blue-500 dark:text-yellow-400 uppercase tracking-widest bg-blue-50 dark:bg-slate-800/50 px-3 py-1 rounded-lg">
                    {filteredResults.length} COMERCIOS
                </span>
            </div>
            
            <div className="space-y-6">
                {filteredResults.length > 0 ? (
                    <>
                        {filteredResults.map(business => (
                          <div key={business.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-1 shadow-sm border border-blue-50 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <BusinessCard 
                              business={business} 
                              onSelect={viewBusinessDetails}
                              isFavorite={favoriteIds.has(business.id)}
                              toggleFavorite={toggleFavorite}
                              onReview={viewWriteReview}
                            />
                          </div>
                        ))}
                        
                        <div className="mt-12 flex justify-center pt-6">
                            <button 
                                onClick={goBack}
                                className="flex items-center space-x-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm px-10 py-5 rounded-[24px] shadow-sm border border-white dark:border-slate-700 active:scale-95 transition-all group transition-colors duration-300"
                            >
                                <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                                <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-200">Volver</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-blue-200 dark:border-slate-700 px-10">
                        <p className="text-gray-600 dark:text-slate-400 font-bold text-lg leading-snug">No encontramos nada con esos términos.</p>
                        <button 
                            onClick={() => { setQuery(''); setActiveCategoryId(null); }}
                            className="mt-8 text-blue-600 dark:text-yellow-400 font-black text-xs uppercase tracking-[0.2em] bg-white dark:bg-slate-800 px-8 py-4 rounded-2xl shadow-md border border-blue-100 dark:border-slate-700"
                        >
                            Ver todo el listado
                        </button>
                    </div>
                )}
            </div>
        </div>

        <button 
            onClick={() => onViewMap(filteredResults)}
            className="fixed bottom-28 right-6 bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 p-6 rounded-full shadow-2xl shadow-blue-300 dark:shadow-slate-900 flex items-center space-x-3 active:scale-95 transition-all z-30"
        >
            <MapIcon className="w-7 h-7" />
            <span className="font-black text-sm uppercase tracking-widest pr-3">Ver Mapa ({filteredResults.length})</span>
        </button>
    </div>
  );
};

export default SearchPage;
