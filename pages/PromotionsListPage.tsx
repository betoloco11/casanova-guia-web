
import React, { useState, useEffect } from 'react';
import { Promotion } from '../types';
import { getPromotions } from '../services/mockApiService';
import { ChevronLeftIcon } from '../components/Icons';

interface PromotionsListPageProps {
  goBack: () => void;
  viewPromotionDetails: (id: string) => void;
}

const PromotionsListPage: React.FC<PromotionsListPageProps> = ({ goBack, viewPromotionDetails }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getPromotions();
      setPromotions(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-32 transition-colors duration-300 bg-white dark:bg-slate-950">
      <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md z-20 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Todas las Ofertas</h1>
      </header>

      <div className="p-5 grid grid-cols-1 gap-8">
        {loading ? (
            [...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 animate-pulse rounded-[32px] w-full h-56"></div>
            ))
        ) : (
            promotions.map(promo => (
                <div 
                  key={promo.id} 
                  onClick={() => viewPromotionDetails(promo.id)}
                  className="relative overflow-hidden rounded-[40px] h-64 cursor-pointer shadow-xl group border border-white dark:border-slate-800 transition-transform active:scale-95"
                >
                    <img 
                      src={promo.image} 
                      alt={promo.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Nuevo hoy
                            </span>
                            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
                                <img src={promo.businessLogo} alt={promo.businessName} className="w-6 h-6 rounded-lg object-cover" />
                                <span className="text-white text-[10px] font-black uppercase tracking-tight">{promo.businessName}</span>
                            </div>
                        </div>
                        <h3 className="text-white text-2xl font-black leading-tight group-hover:text-yellow-400 transition-colors tracking-tighter">
                            {promo.title}
                        </h3>
                        <p className="text-white/70 mt-3 text-sm font-bold uppercase tracking-[0.2em] italic">
                            Ver condiciones
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>

      <div className="mt-12 flex justify-center pt-6">
          <button 
              onClick={goBack}
              className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-all group transition-colors duration-300"
          >
              <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
              <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Volver al Inicio</span>
          </button>
      </div>
    </div>
  );
};

export default PromotionsListPage;
