
import React from 'react';
import { ChevronLeftIcon, ShieldIcon, ArrowRightIcon } from '../components/Icons';

const SecurityPage: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    return (
        <div className="min-h-screen pb-32 transition-colors duration-300 bg-white dark:bg-slate-950">
            <header className="bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Seguridad</h1>
            </header>

            <div className="p-8 space-y-10">
                <section>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Acceso</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-4 space-y-1 shadow-sm border border-white dark:border-slate-800 overflow-hidden">
                        <div className="flex justify-between items-center py-6 border-b border-gray-50 dark:border-slate-800 last:border-0 px-4 group cursor-pointer active:bg-gray-50 dark:active:bg-slate-800 transition-colors">
                            <span className="font-bold text-base text-gray-700 dark:text-slate-200">Cambiar Contraseña</span>
                            <ArrowRightIcon className="w-5 h-5 text-gray-200 dark:text-slate-700 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="flex justify-between items-center py-6 border-b border-gray-50 dark:border-slate-800 last:border-0 px-4 group cursor-pointer active:bg-gray-50 dark:active:bg-slate-800 transition-colors">
                            <span className="font-bold text-base text-gray-700 dark:text-slate-200">Verificación en dos pasos</span>
                            <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border dark:border-green-900/30">Activado</span>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Dispositivos</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-6 shadow-sm border border-white dark:border-slate-800">
                        <div className="flex items-start space-x-5">
                            <div className="bg-blue-50 dark:bg-yellow-400/20 p-4 rounded-2xl text-blue-600 dark:text-yellow-400 shadow-sm transition-colors">
                                <ShieldIcon className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-black text-lg text-gray-800 dark:text-slate-100 tracking-tight leading-none">iPhone 13 Pro</h4>
                                <p className="text-xs text-gray-400 dark:text-slate-500 font-bold mt-2 uppercase tracking-tight">Isidro Casanova • Sesión actual</p>
                            </div>
                        </div>
                    </div>
                </section>

                <button className="w-full text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-[0.3em] py-6 bg-white dark:bg-slate-900 rounded-[32px] border border-red-100 dark:border-red-900/30 mt-10 shadow-md active:scale-95 transition-all">
                    Cerrar todas las sesiones
                </button>

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

export default SecurityPage;
