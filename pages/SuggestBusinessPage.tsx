
import React, { useState } from 'react';
import { ChevronLeftIcon, MapIcon, ArrowRightIcon } from '../components/Icons';
import { supabase } from '../services/supabaseClient';

const SuggestBusinessPage: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        address: ''
    });

    const handleSubmit = async () => {
        if (!formData.name || !formData.category) {
            alert("Por favor completa al menos el nombre y rubro.");
            return;
        }

        setLoading(true);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            const { error } = await supabase
                .from('business_suggestions')
                .insert([{
                    ...formData,
                    user_id: session?.user?.id || 'anonymous',
                    user_email: session?.user?.email || 'anonymous',
                    status: 'pending'
                }]);

            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error("Error al enviar sugerencia:", error);
            alert("Error al enviar la sugerencia. Por favor intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-[32px] flex items-center justify-center mb-8 border border-green-100 dark:border-green-800 shadow-xl shadow-green-100/50">
                    <ArrowRightIcon className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter">¡Gracias por sumar!</h2>
                <p className="mt-4 text-gray-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
                    Hemos recibido tu sugerencia. Un administrador la revisará pronto para que la guía siga creciendo.
                </p>
                <button 
                    onClick={goBack}
                    className="mt-10 bg-blue-600 dark:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest px-10 py-5 rounded-[24px] shadow-xl shadow-blue-200 dark:shadow-slate-900 active:scale-95 transition-all"
                >
                    Volver al perfil
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 transition-colors duration-300">
            <header className="p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Sugerir Comercio</h1>
            </header>

            <div className="p-8">
                <div className="mb-12 text-center">
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[40px] flex items-center justify-center mx-auto mb-6 border border-blue-100 dark:border-slate-700 shadow-lg transition-colors">
                        <MapIcon className="w-12 h-12 text-blue-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight leading-none">Ayuda a crecer la comunidad</h2>
                    <p className="text-base text-gray-500 dark:text-slate-400 font-medium mt-4 px-4 leading-relaxed italic">Si conoces un comercio en Casanova que no está en la lista, ¡compártelo con nosotros!</p>
                </div>

                <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nombre del Comercio</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ej: Fiambrería El Cruce" 
                            className="w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-900 transition-all shadow-sm" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Rubro / Categoría</label>
                        <input 
                            type="text" 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            placeholder="Ej: Gastronomía, Salud..." 
                            className="w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-900 transition-all shadow-sm" 
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Dirección Aproximada</label>
                        <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Calle y número" 
                            className="w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-900 transition-all shadow-sm" 
                        />
                    </div>
                    
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full font-black py-6 rounded-[32px] shadow-xl uppercase tracking-widest text-sm mt-4 transition-all ${
                            loading ? 'bg-blue-300 dark:bg-indigo-900 text-white/50 cursor-not-allowed' : 'bg-blue-600 dark:bg-indigo-600 text-white shadow-blue-200 dark:shadow-slate-900 active:scale-95'
                        }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Sugerencia'}
                    </button>
                </div>

                <div className="mt-20 flex justify-center pt-6">
                    <button 
                        onClick={goBack}
                        className="flex items-center space-x-3 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm px-10 py-5 rounded-[24px] shadow-sm border border-white dark:border-slate-700 active:scale-95 transition-all group transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-indigo-400" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-100">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestBusinessPage;
