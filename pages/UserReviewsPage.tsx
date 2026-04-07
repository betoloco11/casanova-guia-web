
import React, { useMemo } from 'react';
import { ChevronLeftIcon, StarIcon } from '../components/Icons';
import { mockBusinesses } from '../services/mockApiService';

import { useAppContext } from '../context/AppContext';

interface UserReviewsPageProps {
  goBack: () => void;
}

const UserReviewsPage: React.FC<UserReviewsPageProps> = ({ goBack }) => {
    const { allReviews, profile } = useAppContext();
    
    const userReviewsList = useMemo(() => {
        const list: any[] = [];
        if (!allReviews || typeof allReviews !== 'object') return list;

        Object.entries(allReviews).forEach(([businessId, reviews]) => {
            if (Array.isArray(reviews)) {
                const business = mockBusinesses.find(b => b.id === businessId);
                reviews.forEach(r => {
                    // Solo incluimos las reseñas que pertenecen al usuario actual
                    const isOwner = profile?.id && r.userId === profile.id;
                    
                    if (isOwner) {
                        list.push({ 
                            ...r, 
                            businessId, 
                            businessName: business ? business.name : 'Comercio Registrado' 
                        });
                    }
                });
            }
        });
        
        // Ordenar por ID (que es el timestamp) de mayor a menor
        return list.sort((a, b) => {
            const idA = parseInt(a.id) || 0;
            const idB = parseInt(b.id) || 0;
            return idB - idA;
        });
    }, [allReviews, profile]);

    return (
        <div className="min-h-screen pb-32 transition-colors duration-300">
            <header className="bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Mis Reseñas</h1>
            </header>

            <div className="p-8 space-y-6">
                {userReviewsList.length > 0 ? (
                    userReviewsList.map(review => (
                        <div key={review.id} className="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-sm border border-white dark:border-slate-700">
                            <div className="flex justify-between items-start mb-6">
                                <div className="min-w-0 pr-4">
                                    <h3 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tighter leading-none truncate">{review.businessName}</h3>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-2">{review.date}</p>
                                </div>
                                <div className="bg-yellow-50 dark:bg-slate-700 px-3 py-1.5 rounded-xl flex items-center shadow-sm flex-shrink-0 border dark:border-slate-600">
                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">{review.rating}</span>
                                </div>
                            </div>
                            <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed font-medium italic border-l-4 border-blue-500 dark:border-indigo-500 pl-6">
                                "{review.comment || 'Sin comentario'}"
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-24 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-blue-200 dark:border-slate-700 px-10">
                        <p className="text-gray-600 dark:text-slate-400 font-bold text-lg leading-snug italic">Aún no has escrito ninguna reseña.</p>
                        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Tus comentarios aparecerán aquí.</p>
                    </div>
                )}

                <div className="mt-20 flex justify-center pt-6">
                    <button 
                        onClick={goBack}
                        className="flex items-center space-x-3 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm px-10 py-5 rounded-[24px] shadow-sm border border-white dark:border-slate-700 active:scale-95 transition-all group"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-indigo-400" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReviewsPage;
