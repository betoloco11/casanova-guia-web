
import React, { useState } from 'react';
import { Business, Review } from '../types';
import { ChevronLeftIcon, StarIcon, BadgeIcon } from '../components/Icons';
import { useUserProfile } from '../hooks/useUserProfile';

interface WriteReviewPageProps {
  business: Business;
  goBack: () => void;
  onSaveReview?: (review: Omit<Review, 'id' | 'date' | 'likes' | 'comments'>) => void;
}

const WriteReviewPage: React.FC<WriteReviewPageProps> = ({ business, goBack, onSaveReview }) => {
  const { profile } = useUserProfile();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        alert("Por favor selecciona una calificación.");
        return;
    }
    setIsSubmitting(true);
    
    try {
        if (onSaveReview) {
            await onSaveReview({
                authorName: `Tú (${profile.role === 'merchant' ? 'Comerciante' : 'Cliente'})`,
                authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                rating,
                comment
            });
        }
        setSubmitted(true);
    } catch (error) {
        console.error("Error al guardar reseña:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center transition-colors duration-300">
            <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-[48px] flex items-center justify-center mb-10 border border-green-100 dark:border-green-900/50 shadow-xl shadow-green-100/50">
                <BadgeIcon className="w-14 h-14" />
            </div>
            <h2 className="text-4xl font-black text-gray-800 dark:text-slate-100 tracking-tighter">¡Reseña Publicada!</h2>
            <p className="mt-6 text-gray-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-xs mx-auto">
                Tu opinión ayuda a que otros {profile.role === 'merchant' ? 'comerciantes y clientes' : 'clientes'} de <strong>Casanova</strong> elijan mejor. ¡Sumaste 15 puntos!
            </p>
            <button 
                onClick={goBack}
                className="mt-12 bg-blue-600 dark:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest px-12 py-6 rounded-[32px] shadow-xl shadow-blue-200 dark:shadow-slate-900 active:scale-95 transition-all"
            >
                Volver al comercio
            </button>
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 transition-colors duration-300">
      <header className="sticky top-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md z-20 p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Escribir Reseña</h1>
      </header>

      <div className="p-8">
        <div className="flex items-center space-x-5 mb-12 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-[40px] border border-white dark:border-slate-700 shadow-sm transition-colors duration-300">
            <img src={business.image} className="w-20 h-20 rounded-[28px] object-cover border-4 border-white dark:border-slate-700 shadow-md" alt={business.name} />
            <div className="min-w-0">
                <h2 className="text-xl font-black text-gray-800 dark:text-slate-100 leading-none truncate">{business.name}</h2>
                <p className="text-xs font-black text-blue-400 dark:text-indigo-400 uppercase tracking-widest mt-2.5">{business.type}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center">
                <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-6">¿Qué te pareció el servicio?</p>
                <div className="flex justify-center space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 transition-transform active:scale-125"
                        >
                            <StarIcon 
                                className={`w-12 h-12 ${rating >= star ? 'text-yellow-400' : 'text-gray-200 dark:text-slate-700'} transition-colors shadow-sm`} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-6">Cuéntanos tu experiencia</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Qué recomendás? ¿Cómo fue la atención?"
                    className="w-full h-48 bg-white dark:bg-slate-800 rounded-[40px] p-8 text-base font-medium text-gray-800 dark:text-slate-100 placeholder-gray-300 dark:placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-900 transition-all border border-blue-50 dark:border-slate-700 shadow-inner leading-relaxed"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl transition-all ${
                    isSubmitting 
                        ? 'bg-blue-300 dark:bg-indigo-900 cursor-not-allowed text-white/50' 
                        : 'bg-blue-600 dark:bg-indigo-600 text-white shadow-blue-200 dark:shadow-slate-900 hover:bg-blue-700 dark:hover:bg-indigo-700 active:scale-95'
                }`}
            >
                {isSubmitting ? 'Publicando...' : 'Publicar mi opinión'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewPage;
