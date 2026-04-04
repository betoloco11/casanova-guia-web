
import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import BusinessCard from '../components/BusinessCard';
import { CATEGORIES } from '../constants';
import { Business, Promotion, Category, Page } from '../types';
import { getBusinesses, getPromotions } from '../services/mockApiService';
import { ChevronLeftIcon, UserCircleIcon } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

const PromotionCard: React.FC<{promotion: Promotion, onSelect: (id: string) => void}> = ({ promotion, onSelect }) => (
    <div 
      className="relative overflow-hidden rounded-2xl min-w-[300px] h-52 cursor-pointer shadow-lg group flex-shrink-0" 
      onClick={() => onSelect(promotion.id)}
    >
      <img 
        src={promotion.image} 
        alt={promotion.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
        <span className="bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 text-xs font-black px-3 py-1.5 rounded mb-2 w-fit uppercase tracking-wide">Oferta del día</span>
        <h3 className="text-white text-xl font-bold leading-tight group-hover:text-blue-300 dark:group-hover:text-yellow-400 transition-colors">{promotion.title}</h3>
        <p className="text-white/80 mt-2 text-sm font-medium line-clamp-1 italic">Toca para ver más</p>
      </div>
    </div>
);

const CategoryIcon: React.FC<{ category: Category; onClick: () => void }> = ({ category, onClick }) => (
    <div className="flex flex-col items-center space-y-3">
        <button 
          onClick={onClick}
          className="w-20 h-20 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl flex items-center justify-center hover:shadow-md hover:border-blue-200 dark:hover:border-yellow-500 transition-all active:scale-90 overflow-hidden shadow-sm"
        >
            <img 
              src={category.icon} 
              alt={category.name} 
              className="w-12 h-12 object-contain pointer-events-none"
              loading="lazy"
            />
        </button>
        <span className="text-xs font-bold text-gray-600 dark:text-slate-400 text-center uppercase tracking-tight">{category.name}</span>
    </div>
);

interface HomePageProps {
  viewBusinessDetails: (id: string) => void;
  viewPromotionDetails: (id: string) => void;
  viewCategory: (category: Category) => void;
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  viewWriteReview: (id: string) => void;
  onSearchFocus?: () => void;
  onViewAllPromotions?: () => void;
  session?: any;
  navigateTo?: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  viewBusinessDetails, 
  viewPromotionDetails, 
  viewCategory, 
  favoriteIds, 
  toggleFavorite,
  viewWriteReview,
  onSearchFocus,
  onViewAllPromotions,
  session,
  navigateTo
}) => {
  const { profile } = useAppContext();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [bizData, promoData] = await Promise.all([
        getBusinesses(),
        getPromotions()
      ]);
      setBusinesses(bizData);
      setPromotions(promoData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses.slice(0, 4); // Límite de 4 para recomendados
    const q = searchQuery.toLowerCase();
    return businesses.filter(b => 
      b.name.toLowerCase().includes(q) || 
      b.type.toLowerCase().includes(q) || 
      b.description.toLowerCase().includes(q)
    );
  }, [searchQuery, businesses]);

  const isSearching = searchQuery.length > 0;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 transition-colors duration-300">
      <div className="px-4 pt-8">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          {session && (
            <button 
              onClick={() => navigateTo?.('profile')}
              className="w-8 h-8 rounded-full bg-blue-600 dark:bg-yellow-400 flex items-center justify-center text-white dark:text-slate-950 font-black text-[10px]"
            >
              {profile?.name?.charAt(0) || 'U'}
            </button>
          )}
        </div>
        {!session && !isSearching && (
          <div className="mb-6 bg-slate-900 dark:bg-slate-900 rounded-[28px] p-6 shadow-xl overflow-hidden relative group border border-slate-800 text-center">
            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-white text-2xl font-medium tracking-tight leading-none mb-3">¡Hola, vecino! 👋</h3>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-tight leading-tight mb-5 whitespace-nowrap">
                CREA TU CUENTA GRATIS Y COMIENZA A SUMAR PUNTOS!
              </p>
              <div className="flex space-x-3 w-full">
                <button 
                  onClick={() => navigateTo?.('register')}
                  className="flex-1 bg-yellow-400 text-slate-950 font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.15em] shadow-lg active:scale-95 transition-all"
                >
                  Crear Cuenta
                </button>
                <button 
                  onClick={() => navigateTo?.('login')}
                  className="flex-1 bg-white/10 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.15em] hover:bg-white/20 transition-all border border-white/10"
                >
                  Ingresar
                </button>
              </div>
            </div>
            <UserCircleIcon className="absolute -bottom-6 -right-6 w-24 h-24 text-white opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          </div>
        )}
        
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Ej: pizza, farmacia, peluquería..." 
          onClick={onSearchFocus}
        />
      </div>

      {!isSearching && (
        <>
          <section>
            <div className="flex justify-between items-center px-4 mb-5">
               <h2 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Promociones</h2>
               <button 
                onClick={onViewAllPromotions}
                className="text-blue-500 dark:text-yellow-400 text-sm font-black uppercase cursor-pointer hover:underline"
               >
                 Ver todas
               </button>
            </div>
            <div className="px-4 overflow-x-auto flex space-x-5 pb-4 no-scrollbar">
              {loading ? (
                 <div className="bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl min-w-[300px] h-52"></div>
              ) : (
                promotions.map(promo => <PromotionCard key={promo.id} promotion={promo} onSelect={viewPromotionDetails}/>)
              )}
            </div>
          </section>

          <section className="px-4">
            <h2 className="text-2xl font-black mb-8 text-gray-800 dark:text-slate-100 tracking-tight">Categorías</h2>
            <div className="grid grid-cols-4 gap-y-10 gap-x-2">
              {CATEGORIES.map(category => (
                <CategoryIcon 
                  key={category.id} 
                  category={category} 
                  onClick={() => viewCategory(category)}
                />
              ))}
            </div>
          </section>
        </>
      )}
      
      <section className="px-4 pb-16">
        <h2 className="text-2xl font-black mb-8 text-gray-800 dark:text-slate-100 tracking-tight">
          {isSearching ? `Resultados para "${searchQuery}"` : "Comercios Recomendados"}
        </h2>
        <div className="space-y-8">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2">
                <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-3">
                   <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
                   <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : filteredBusinesses.length > 0 ? (
            <>
                {filteredBusinesses.map(business => (
                <BusinessCard 
                    key={business.id} 
                    business={business} 
                    onSelect={viewBusinessDetails} 
                    isFavorite={favoriteIds.has(business.id)}
                    toggleFavorite={toggleFavorite}
                    onReview={viewWriteReview}
                />
                ))}
                
                {/* Botón de Volver al Inicio */}
                <div className="mt-16 flex justify-center pb-20">
                    <button 
                        onClick={scrollToTop}
                        className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-lg border border-gray-100 dark:border-slate-700 active:scale-95 transition-all group"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400 rotate-90" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Subir</span>
                    </button>
                </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-slate-700">
              <p className="text-gray-600 dark:text-slate-400 font-bold text-lg">No encontramos nada similar.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-blue-600 dark:text-yellow-400 font-black bg-white dark:bg-slate-800 px-8 py-3 rounded-full shadow-md text-sm uppercase tracking-widest border border-gray-100 dark:border-slate-700"
              >
                Volver al listado
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
