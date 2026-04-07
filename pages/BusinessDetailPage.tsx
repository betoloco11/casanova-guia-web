
import React, { useState, useMemo } from 'react';
import { Business, Review } from '../types';
import { ChevronLeftIcon, StarIcon, ChatAltIcon, NavigationIcon } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

interface BusinessDetailPageProps {
  business: Business;
  goBack: () => void;
  navigateToReview: () => void;
  customReviews?: Review[];
}

const DetailHeader: React.FC<{title: string, onBack: () => void}> = ({ title, onBack }) => (
    <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md z-20 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <button onClick={onBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">{title}</h1>
    </header>
);

const InfoRow: React.FC<{label: string; value: string; onClick?: () => void}> = ({label, value, onClick}) => (
    <div 
        className={`flex justify-between items-start py-5 border-b border-blue-50 dark:border-slate-700 last:border-0 ${onClick ? 'cursor-pointer active:bg-blue-50/50 dark:active:bg-slate-700/50' : ''}`}
        onClick={onClick}
    >
        <div className="flex flex-col">
            <span className="text-xs font-black text-blue-400 dark:text-yellow-400 uppercase tracking-widest mb-1.5">{label}</span>
            <span className={`font-bold text-base ${onClick ? 'text-blue-600 dark:text-yellow-300 underline' : 'text-gray-800 dark:text-slate-200'}`}>{value}</span>
        </div>
    </div>
);

const ReviewCard: React.FC<{review: Review, currentUserId?: string}> = ({review, currentUserId}) => {
    const isYou = currentUserId && review.userId === currentUserId;
    
    return (
        <div className="py-8 border-b border-blue-50 dark:border-slate-700 last:border-0">
            <div className="flex items-start space-x-5">
                <img src={review.authorImage} alt={review.authorName} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-black text-gray-800 dark:text-slate-100 text-base tracking-tight">
                                {isYou ? 'Tú' : review.authorName}
                            </h4>
                            <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{review.date}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-slate-800 px-3 py-1 rounded-lg flex items-center border dark:border-slate-700">
                            <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">{review.rating}</span>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-700 dark:text-slate-300 text-base leading-relaxed font-medium">{review.comment}</p>
                </div>
            </div>
        </div>
    );
}

const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({ business, goBack, navigateToReview, customReviews = [] }) => {
  const { profile } = useAppContext();
  const [imgError, setImgError] = useState(false);

  const mergedReviews = useMemo(() => {
    return [...customReviews, ...business.reviews];
  }, [customReviews, business.reviews]);

  const handleOpenDirections = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.address + " " + business.name)}`;
    window.open(url, '_blank');
  };

  const handleWhatsApp = () => {
    if (business.whatsapp) {
        const url = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent('Hola! Vi tu comercio en Casanova Guía Web y quería hacerte una consulta.')}`;
        window.open(url, '_blank');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${business.phone}`;
  };

  return (
    <div className="min-h-screen relative pb-10 transition-colors duration-300">
      <DetailHeader title="Detalle" onBack={goBack} />
      
      <div className="relative h-72">
        {!imgError ? (
          <img 
            src={business.image} 
            alt={business.name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-yellow-900 dark:to-yellow-800 flex items-center justify-center">
             <span className="text-white text-7xl font-black opacity-20">{business.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#D1E9FF] dark:from-slate-950 via-transparent to-black/20"></div>
      </div>

      <div className="px-5 -mt-16 relative z-10 pb-32">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[40px] p-8 shadow-xl shadow-blue-900/10 dark:shadow-slate-900/50 border border-white dark:border-slate-800 transition-colors duration-300">
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <span className="bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-3 inline-block">
                        {business.type}
                    </span>
                    <h2 className="text-4xl font-black text-gray-800 dark:text-slate-100 tracking-tighter leading-none mt-1">{business.name}</h2>
                </div>
                <div className="bg-yellow-400 p-3 rounded-[24px] flex flex-col items-center min-w-[65px] shadow-lg shadow-yellow-200 dark:shadow-slate-900">
                    <span className="text-white dark:text-slate-950 font-black text-2xl leading-none">{business.rating.toFixed(1)}</span>
                    <StarIcon className="w-5 h-5 text-white dark:text-slate-950 mt-1" />
                </div>
            </div>
            <p className="mt-6 text-gray-600 dark:text-slate-400 text-lg font-medium italic border-l-4 border-blue-500 dark:border-yellow-400 pl-5 leading-relaxed">
                {business.description}
            </p>
        </div>
        
        <div className="mt-8 space-y-8">
            <section>
                <div className="px-3 mb-2">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Ubicación</h3>
                </div>
                
                <div onClick={() => handleOpenDirections()} className="relative rounded-[40px] overflow-hidden cursor-pointer shadow-inner border border-white dark:border-slate-800 bg-blue-100/40 dark:bg-slate-900/40 p-3 group">
                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-[32px] border border-white dark:border-slate-700 shadow-xl group-hover:scale-[1.02] transition-all duration-300 flex items-center justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-xs font-black text-blue-400 dark:text-yellow-400 uppercase mb-1 tracking-widest">Dirección</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-slate-200 leading-tight">{business.address}</p>
                            <p className="text-xs text-blue-500 dark:text-yellow-400 font-bold mt-2 uppercase italic tracking-wide truncate">{business.landmarks}</p>
                        </div>
                        <button 
                            onClick={(e) => handleOpenDirections(e)}
                            className="flex flex-col items-center justify-center bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 px-5 py-4 rounded-3xl shadow-lg shadow-blue-200 dark:shadow-slate-900 active:scale-95 transition-all"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest mb-1">Ruta</span>
                            <NavigationIcon className="w-7 h-7" />
                        </button>
                    </div>
                </div>
            </section>

            <section>
                <div className="px-3 mb-2">
                  <h3 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Contacto y Horarios</h3>
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[40px] p-8 border border-white dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <InfoRow label="Llamar al comercio" value={business.phone} onClick={handleCall} />
                    {business.whatsapp && <InfoRow label="Enviar WhatsApp" value="Chatea con nosotros" onClick={handleWhatsApp} />}
                    <InfoRow label="Horario de atención" value={business.hours} />
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-3 px-3">
                    <h3 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Opiniones ({mergedReviews.length})</h3>
                    <button 
                        onClick={navigateToReview}
                        className="bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                        Dejar Reseña
                    </button>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-[40px] px-8 border border-white dark:border-slate-700 transition-colors duration-300">
                    {mergedReviews.length > 0 ? (
                        mergedReviews.map(review => <ReviewCard key={review.id} review={review} currentUserId={profile?.id} />)
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-blue-300 dark:text-yellow-600/30 font-black text-lg italic tracking-wide">Sin opiniones aún</p>
                            <p className="text-gray-400 dark:text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest">¡Sé el primero en comentar!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>

        <div className="mt-16 flex justify-center pb-20">
            <button 
                onClick={goBack}
                className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-lg border border-blue-50 dark:border-slate-700 active:scale-95 transition-all group transition-colors duration-300"
            >
                <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-200">Volver</span>
            </button>
        </div>
      </div>

      {business.whatsapp && (
        <button 
            onClick={handleWhatsApp}
            className="fixed bottom-28 right-6 bg-[#25D366] text-white p-6 rounded-[32px] shadow-2xl shadow-green-200 dark:shadow-slate-900 active:scale-95 transition-all z-50 flex items-center space-x-3"
        >
            <ChatAltIcon className="w-8 h-8" />
            <span className="font-black text-sm uppercase tracking-widest">Consultar</span>
        </button>
      )}
    </div>
  );
};

export default BusinessDetailPage;
