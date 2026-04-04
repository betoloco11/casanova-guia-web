
import React from 'react';
import { Promotion } from '../types';
import { ChevronLeftIcon } from '../components/Icons';

interface PromotionDetailPageProps {
  promotion: Promotion;
  goBack: () => void;
  viewBusinessDetails: (id: string) => void;
}

const DetailHeader: React.FC<{title: string, onBack: () => void}> = ({ title, onBack }) => (
    <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-lg z-20 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <button onClick={onBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">{title}</h1>
    </header>
);

const PromotionDetailPage: React.FC<PromotionDetailPageProps> = ({ promotion, goBack, viewBusinessDetails }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <DetailHeader title="Oferta Especial" onBack={goBack} />
        <div>
            <div className="relative h-72 overflow-hidden">
                <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent"></div>
            </div>
            
            <div className="px-8 -mt-8 relative z-10 space-y-8">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-6 rounded-[32px] border border-white dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight leading-none">{promotion.title}</h2>
                    <p className="mt-6 text-gray-600 dark:text-slate-400 text-lg font-medium italic border-l-4 border-blue-500 dark:border-yellow-400 pl-5 leading-relaxed">
                        {promotion.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-blue-400 dark:text-yellow-400 uppercase tracking-widest mb-2">Validez</h3>
                        <p className="font-bold text-gray-800 dark:text-slate-200">{promotion.validity}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-blue-400 dark:text-yellow-400 uppercase tracking-widest mb-2">Condiciones</h3>
                        <p className="text-gray-600 dark:text-slate-400 font-medium leading-relaxed">{promotion.conditions}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">Comercio Adherido</h3>
                    <div 
                        onClick={() => viewBusinessDetails(promotion.businessId)} 
                        className="flex items-center space-x-4 bg-blue-50/50 dark:bg-slate-900/50 p-5 rounded-[32px] cursor-pointer border border-blue-100 dark:border-yellow-900/50 hover:bg-blue-100 dark:hover:bg-yellow-900/20 transition-all active:scale-95"
                    >
                        <img src={promotion.businessLogo} alt={promotion.businessName} className="w-16 h-16 bg-gray-300 dark:bg-slate-800 rounded-[24px] object-cover shadow-sm" />
                        <div className="overflow-hidden">
                            <p className="text-lg font-black text-gray-800 dark:text-slate-100 leading-none truncate">{promotion.businessName}</p>
                            <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mt-2 uppercase tracking-tighter truncate">{promotion.businessType}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 pt-4">
                    <button className="w-full bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 font-black py-6 rounded-[32px] shadow-xl shadow-blue-200 dark:shadow-slate-900 uppercase tracking-widest text-sm active:scale-95 transition-all">
                        Canjear Beneficio
                    </button>
                    <button className="w-full bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 font-black py-6 rounded-[32px] shadow-sm border border-gray-200 dark:border-slate-800 uppercase tracking-widest text-sm active:scale-95 transition-all">
                        Guardar Cupón
                    </button>
                </div>
            </div>

            <div className="mt-16 flex justify-center pb-20">
                <button 
                    onClick={goBack}
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-slate-900/50 px-10 py-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800 active:scale-95 transition-all group"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                    <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-200">Volver</span>
                </button>
            </div>
        </div>
    </div>
  );
};

export default PromotionDetailPage;
