
import React, { useState } from 'react';
import { ChevronLeftIcon, ArrowRightIcon, ChatAltIcon } from '../components/Icons';
import { isSupabaseConfigured } from '../services/supabaseClient';

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="border-b border-gray-50 dark:border-slate-800 last:border-0 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full py-6 flex justify-between items-center text-left group">
                <span className="font-black text-base text-gray-700 dark:text-slate-200 pr-4 tracking-tight group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">{q}</span>
                <div className={`transform transition-transform ${open ? 'rotate-90 text-blue-600 dark:text-indigo-400' : 'text-gray-300 dark:text-slate-700'}`}>
                    <ArrowRightIcon className="w-5 h-5" />
                </div>
            </button>
            {open && <p className="pb-6 text-base text-gray-500 dark:text-slate-400 leading-relaxed font-medium italic border-l-4 border-blue-100 dark:border-indigo-900 pl-6">{a}</p>}
        </div>
    );
};

const HelpCenterPage: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    const [isConnected, setIsConnected] = useState(isSupabaseConfigured());

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen pb-32 transition-colors duration-300">
            <header className="bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 sticky top-0 z-20 shadow-sm">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Ayuda y Soporte</h1>
            </header>

            <div className="p-8 space-y-10">
                <div className="bg-blue-600 dark:bg-indigo-600 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-300 dark:shadow-slate-950">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black tracking-tight leading-none">Herramientas</h2>
                        <p className="text-blue-100 dark:text-indigo-100 text-sm font-bold mt-4 uppercase tracking-widest opacity-80">Mantenimiento de emergencia</p>
                        <div className="mt-8 grid grid-cols-1 gap-4">
                            <div className="bg-white/10 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/20 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-red-400 animate-pulse'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Supabase: {isConnected ? 'Configurado' : 'Pendiente'}</span>
                                </div>
                                <button 
                                    onClick={() => setIsConnected(isSupabaseConfigured())}
                                    className="text-[8px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    Verificar
                                </button>
                            </div>
                            <button 
                                onClick={handleReload}
                                className="bg-white dark:bg-slate-900 text-blue-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-5 rounded-2xl shadow-lg active:scale-95 transition-all"
                            >
                                Forzar Recarga (Actualizar App)
                            </button>
                        </div>
                    </div>
                    <ChatAltIcon className="absolute -bottom-6 -right-6 w-40 h-40 text-blue-500 dark:text-indigo-500 opacity-20 pointer-events-none" />
                </div>

                <section>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Preguntas Frecuentes</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-[40px] p-8 shadow-sm border border-white dark:border-slate-700 transition-colors">
                        <FAQItem q="¿Cómo guardo un comercio?" a="Solo tienes que tocar el icono del corazón en la tarjeta del comercio o en su página de detalles." />
                        <FAQItem q="¿Es gratis aparecer en la guía?" a="¡Sí! Por ahora el registro básico es totalmente gratuito para todos los comercios del barrio." />
                        <FAQItem q="¿Por qué se ve en blanco?" a="Si ves la pantalla en blanco, usa el botón 'Forzar Recarga' arriba. Esto limpia errores temporales." />
                    </div>
                </section>
                
                <section className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-[40px] p-8 border border-white dark:border-slate-700 shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Soporte Directo</h3>
                    </div>
                    <button className="w-full bg-blue-50/50 dark:bg-indigo-900/30 text-blue-600 dark:text-indigo-400 font-black py-6 rounded-[32px] flex items-center justify-center space-x-4 border border-blue-100 dark:border-indigo-800 active:bg-blue-100 transition-colors uppercase text-sm tracking-widest">
                        <ChatAltIcon className="w-6 h-6" />
                        <span>WhatsApp Soporte</span>
                    </button>
                </section>

                <div className="mt-16 flex justify-center pt-6">
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

export default HelpCenterPage;
