
import React, { useState } from 'react';
import { Business } from '../types';
import { StarIcon, HeartIcon, MapIcon } from './Icons';

interface BusinessCardProps {
  business: Business;
  onSelect: (id: string) => void;
  isFavorite: boolean;
  toggleFavorite: (id:string) => void;
  onReview?: (id: string) => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onSelect, isFavorite, toggleFavorite, onReview }) => {
    const [imgError, setImgError] = useState(false);
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(business.id);
    }

    const handleReviewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onReview) onReview(business.id);
    }

    const openMap = (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address + " " + business.name)}`;
        window.open(url, '_blank');
    }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center space-x-4 cursor-pointer hover:bg-blue-50/30 dark:hover:bg-slate-700/50 transition-all duration-300 group py-4 px-2" onClick={() => onSelect(business.id)}>
      <div className="relative flex-shrink-0">
        {!imgError ? (
          <img 
            src={business.image} 
            alt={business.name} 
            onError={() => setImgError(true)}
            className="w-24 h-24 object-cover rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:scale-105 transition-transform" 
          />
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-yellow-900/50 dark:to-yellow-700/50 rounded-2xl flex items-center justify-center border border-blue-200 dark:border-yellow-600/30">
            <span className="text-blue-600 dark:text-yellow-400 font-black text-2xl">{business.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-extrabold text-lg text-gray-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors leading-tight truncate">{business.name}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-tight truncate">{business.type}</p>
        <div className="flex items-center text-sm text-gray-600 dark:text-slate-300 mt-3">
          <div className="flex items-center bg-yellow-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
            <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="font-bold text-yellow-700 dark:text-yellow-500">{business.rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-gray-300 dark:text-slate-700">•</span>
          <button 
            onClick={openMap}
            className="flex items-center space-x-1.5 hover:text-blue-500 dark:hover:text-yellow-400 transition-colors bg-gray-50 dark:bg-slate-700/30 px-2 py-1 rounded-md border border-gray-100 dark:border-slate-700"
          >
            <MapIcon className="w-4 h-4" />
            <span className="font-bold">{business.distance} km</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-3 pr-2">
          <button 
            onClick={handleFavoriteClick} 
            className="p-2 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-125"
          >
            <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'stroke-current'}`} />
          </button>
          <button 
            onClick={handleReviewClick}
            className="p-2 text-gray-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-yellow-400 transition-all active:scale-125"
          >
            <div className="relative">
                <StarIcon className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 dark:bg-yellow-500 text-white dark:text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">+</span>
            </div>
          </button>
      </div>
    </div>
  );
};

export default BusinessCard;
