
import React, { useState } from 'react';
import { Business } from '../types';
import { ChevronLeftIcon, NavigationIcon } from '../components/Icons';

interface MapPageProps {
    goBack: () => void;
    businesses: Business[];
    viewBusinessDetails: (id: string) => void;
}

const MapPage: React.FC<MapPageProps> = ({ goBack, businesses, viewBusinessDetails }) => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [prevBusinesses, setPrevBusinesses] = useState(businesses);

    if (businesses !== prevBusinesses) {
        setPrevBusinesses(businesses);
        setSelectedIdx(0);
    }

    const selectedBiz = businesses.length > 0 ? businesses[selectedIdx] : null;

    const handleGetDirections = (e: React.MouseEvent, biz: Business) => {
        e.stopPropagation();
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(biz.address + " " + biz.name)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-[#f8f9fa] h-screen w-full relative overflow-hidden flex flex-col">
            {/* --- FONDO DE MAPA SIMULADO --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.05]" 
                    style={{ 
                        backgroundImage: `linear-gradient(#4a90e2 2px, transparent 2px), linear-gradient(90deg, #4a90e2 2px, transparent 2px)`,
                        backgroundSize: '100px 100px' 
                    }}>
                </div>
                
                {/* Referencias Geográficas Fijas del Barrio */}
                <div className="absolute top-[5%] left-[60%] text-[9px] font-black text-blue-200 uppercase tracking-widest">Estación Casanova</div>
                <div className="absolute top-[50%] left-[45%] text-[9px] font-black text-green-200 uppercase tracking-widest">Plaza Principal</div>
                
                {/* Avenidas Principales */}
                <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-200/50"></div>
                <div className="absolute left-1/3 top-0 w-1 h-full bg-gray-200/50"></div>
                
                {/* Zonas Verdes (Plazas) */}
                <div className="absolute top-[48%] left-[42%] w-24 h-24 bg-green-100/30 rounded-full border border-green-200/20"></div>
            </div>

            {/* Header Flotante con botón volver */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
                <button 
                    onClick={goBack} 
                    className="bg-white p-4 rounded-[24px] shadow-2xl border border-gray-100 text-gray-800 active:scale-90 transition-transform pointer-events-auto"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white flex items-center space-x-2 pointer-events-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                        {businesses.length} Comercios encontrados
                    </span>
                </div>
            </div>

            {/* Pines Dinámicos */}
            <div className="flex-grow relative z-10">
                {businesses.map((biz, idx) => {
                    const isSelected = selectedIdx === idx;
                    const pos = biz.coordinates || { top: '50%', left: '50%' };
                    
                    return (
                        <button 
                            key={biz.id}
                            onClick={() => setSelectedIdx(idx)}
                            className={`absolute transition-all duration-500 transform -translate-x-1/2 -translate-y-full ${isSelected ? 'scale-110 z-30' : 'scale-100 z-10'}`}
                            style={{ top: pos.top, left: pos.left }}
                        >
                            <div className="flex flex-col items-center">
                                <div className={`relative ${isSelected ? 'bg-blue-600' : 'bg-white'} p-1 rounded-2xl shadow-2xl border-2 ${isSelected ? 'border-white ring-4 ring-blue-500/20' : 'border-blue-100'}`}>
                                    <img src={biz.image} className="w-10 h-10 rounded-xl object-cover" />
                                </div>
                                <div className={`w-3 h-3 ${isSelected ? 'bg-blue-600' : 'bg-white'} rotate-45 -mt-1.5 border-r border-b ${isSelected ? 'border-white' : 'border-blue-100'} shadow-lg`}></div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Carrusel Inferior de Comercios */}
            {selectedBiz && (
                <div className="absolute bottom-10 left-0 right-0 z-40 px-6">
                    <div 
                        className="bg-white rounded-[40px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white transition-all overflow-hidden"
                    >
                        <div className="flex items-center space-x-5 cursor-pointer" onClick={() => viewBusinessDetails(selectedBiz.id)}>
                            <img src={selectedBiz.image} className="w-20 h-20 rounded-[28px] object-cover shadow-lg border-2 border-white flex-shrink-0" />
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.1em] truncate">
                                        {selectedBiz.type}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-gray-800 tracking-tight mt-1 truncate">{selectedBiz.name}</h3>
                                <p className="text-xs text-gray-400 font-bold mt-1 truncate">
                                    {selectedBiz.address}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                            <button 
                                onClick={goBack}
                                className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Mapa</span>
                            </button>
                            <button 
                                onClick={(e) => handleGetDirections(e, selectedBiz)}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                            >
                                <NavigationIcon className="w-3.5 h-3.5" />
                                <span>Cómo llegar</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;
