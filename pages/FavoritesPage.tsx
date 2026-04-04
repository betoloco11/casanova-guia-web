
import React, { useMemo, useState } from 'react';
import { mockBusinesses } from '../services/mockApiService';
import BusinessCard from '../components/BusinessCard';
import { HeartIcon, ArrowRightIcon, ChevronLeftIcon } from '../components/Icons';
import { CATEGORIES } from '../constants';

interface FavoritesPageProps {
  favoriteIds: Set<string>;
  viewBusinessDetails: (id: string) => void;
  toggleFavorite: (id: string) => void;
  viewWriteReview: (id: string) => void;
  goBack: () => void;
}

const FilterChip: React.FC<{label: string, active: boolean, onClick: () => void}> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            active ? 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 shadow-md' : 'bg-white/80 dark:bg-slate-800 text-gray-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-700 border border-blue-50 dark:border-slate-700'
        }`}
    >
        {label}
    </button>
);

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
    favoriteIds, 
    viewBusinessDetails, 
    toggleFavorite,
    viewWriteReview,
    goBack
}) => {
    const [activeFilter, setActiveFilter] = useState<string>('all');
    
    const favoriteBusinesses = useMemo(() => 
        mockBusinesses.filter(b => favoriteIds.has(b.id)),
    [favoriteIds]);

    const filteredFavorites = useMemo(() => {
        if (activeFilter === 'all') return favoriteBusinesses;
        return favoriteBusinesses.filter(b => b.categoryId === activeFilter);
    }, [favoriteBusinesses, activeFilter]);

    const suggestedBusinesses = useMemo(() => 
        mockBusinesses.filter(b => !favoriteIds.has(b.id)).slice(0, 3),
    [favoriteIds]);

    const categoriesWithFavorites = useMemo(() => {
        const ids = new Set(favoriteBusinesses.map(b => b.categoryId));
        return CATEGORIES.filter(c => ids.has(c.id));
    }, [favoriteBusinesses]);

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="px-6 pt-10 pb-6 rounded-b-[40px] bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-lg sticky top-0 z-20 border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="flex items-center mb-4">
                    <button onClick={goBack} className="p-3 -ml-3 mr-2 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <ChevronLeftIcon className="w-7 h-7" />
                    </button>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter">Mis Favoritos</h1>
                </div>

                {favoriteBusinesses.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                        <FilterChip label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                        {categoriesWithFavorites.map(cat => (
                            <FilterChip 
                                key={cat.id} 
                                label={cat.name} 
                                active={activeFilter === cat.id} 
                                onClick={() => setActiveFilter(cat.id)} 
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="px-4 py-6 pb-32">
                {favoriteBusinesses.length > 0 ? (
                    <div className="space-y-4">
                        {filteredFavorites.length > 0 ? (
                            filteredFavorites.map(business => (
                                <div key={business.id} className="bg-white dark:bg-slate-800 rounded-[32px] p-1 shadow-sm border border-blue-50 dark:border-slate-700 hover:border-blue-200 dark:hover:border-yellow-400 transition-all hover:shadow-md">
                                    <BusinessCard 
                                        business={business} 
                                        onSelect={viewBusinessDetails} 
                                        isFavorite={true}
                                        toggleFavorite={toggleFavorite}
                                        onReview={viewWriteReview}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-[32px] border border-white dark:border-slate-700 px-6 shadow-inner">
                                <p className="text-gray-400 dark:text-slate-500 font-bold text-sm tracking-tight leading-relaxed italic">No tienes favoritos en esta categoría.</p>
                                <button onClick={() => setActiveFilter('all')} className="mt-4 text-blue-600 dark:text-yellow-400 font-black text-[10px] uppercase tracking-widest">Ver todos</button>
                            </div>
                        )}
                        
                        <div className="pt-12 pb-6">
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sugerencias</h3>
                                <ArrowRightIcon className="w-4 h-4 text-gray-300 dark:text-slate-600" />
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {suggestedBusinesses.map(business => (
                                    <div key={business.id} className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-[32px] p-1 border border-white/50 dark:border-slate-700 grayscale-[0.2] transition-colors duration-300">
                                        <BusinessCard 
                                            business={business} 
                                            onSelect={viewBusinessDetails} 
                                            isFavorite={false}
                                            toggleFavorite={toggleFavorite}
                                            onReview={viewWriteReview}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-10 text-center">
                        <div className="relative mb-10">
                            <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[48px] shadow-2xl shadow-blue-100 dark:shadow-slate-900 flex items-center justify-center relative z-10 transition-colors duration-300">
                                <HeartIcon className="w-16 h-16 text-red-100 dark:text-slate-600 stroke-[1.5]" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 dark:bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900 z-20">
                                <span className="text-xl">✨</span>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight leading-none">Tu lista espera ser llenada</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-sm mt-4 leading-relaxed font-medium px-4">
                            Guarda tus pizzerías, farmacias y comercios favoritos para tenerlos siempre a mano.
                        </p>
                    </div>
                )}

                <div className="mt-20 flex justify-center pb-20">
                    <button 
                        onClick={goBack}
                        className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-lg border border-blue-50 dark:border-slate-700 active:scale-95 transition-all group transition-colors duration-300"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-200">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
