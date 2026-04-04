
import React from 'react';
import { ChevronLeftIcon, LogoIcon } from '../components/Icons';

const AboutPage: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    return (
        <div className="min-h-screen pb-32 transition-colors duration-300 bg-white dark:bg-slate-950">
            <header className="p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 shadow-sm transition-colors">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Acerca de</h1>
            </header>

            <div className="p-10 text-center">
                <LogoIcon className="w-24 h-24 mx-auto mb-8 shadow-xl rounded-[32px]" />
                <h2 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter leading-none">Casanova Guía Web</h2>
                <p className="text-blue-600 dark:text-yellow-400 font-black uppercase text-xs tracking-[0.4em] mt-4 opacity-50 transition-colors">Versión 1.0.5</p>
                
                <div className="mt-12 text-lg text-gray-600 dark:text-slate-400 leading-relaxed font-medium space-y-6 italic">
                    <p>Casanova Guía Web nació con la misión de conectar a los clientes de Isidro Casanova con los comercios de su zona.</p>
                    <p>Creemos en el poder del comercio barrial y en facilitar la vida de nuestra comunidad a través de la tecnología.</p>
                </div>

                <div className="mt-16 space-y-4">
                    <button className="w-full py-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-widest hover:bg-yellow-50 dark:hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]">Términos y Condiciones</button>
                    <button className="w-full py-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-widest hover:bg-yellow-50 dark:hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]">Política de Privacidad</button>
                    <button className="w-full py-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] text-xs font-black text-gray-800 dark:text-slate-200 uppercase tracking-widest hover:bg-yellow-50 dark:hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]">Síguenos en Instagram</button>
                </div>

                <div className="mt-20">
                    <p className="text-[10px] font-black text-blue-300 dark:text-yellow-600 uppercase tracking-[0.4em] mb-2">Desarrollado para La Matanza</p>
                    <p className="text-[20px]">🇦🇷 ❤️</p>
                </div>

                <div className="mt-16 flex justify-center pt-6">
                    <button 
                        onClick={goBack}
                        className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-all group"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-yellow-400" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
