
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeftIcon, StarIcon, ChatAltIcon, ArrowRightIcon, DatabaseIcon } from '../components/Icons';
import { useUserProfile } from '../hooks/useUserProfile';
import { useReviews } from '../hooks/useReviews';
import { seedDatabase } from '../services/seedService';
import { supabase } from '../services/supabaseClient';

const MetricCard: React.FC<{label: string; value: string | number; trend: string; color: string}> = ({ label, value, trend, color }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-[32px] border border-gray-50 dark:border-slate-700 shadow-sm">
        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-end justify-between">
            <h4 className="text-2xl font-black text-gray-800 dark:text-slate-100">{value}</h4>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${color === 'green' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-blue-50 dark:bg-indigo-900/30 text-blue-600 dark:text-indigo-400'}`}>
                {trend}
            </span>
        </div>
    </div>
);

const OwnerDashboardPage: React.FC<{ goBack: () => void }> = ({ goBack }) => {
    const { profile } = useUserProfile();
    const { allReviews } = useReviews();
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedMessage, setSeedMessage] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [merchantBusinessId, setMerchantBusinessId] = useState<string | null>(null);
    const [favoritesCount, setFavoritesCount] = useState(0);

    useEffect(() => {
        const checkAdminAndBusiness = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const userEmail = session?.user?.email;
            setIsAdmin(userEmail === 'robertovizgarra@gmail.com');

            if (userEmail) {
                // Buscar si este usuario es dueño de algún comercio
                const { data: businessData } = await supabase
                    .from('businesses')
                    .select('id')
                    .eq('owner_email', userEmail)
                    .single();
                
                if (businessData) {
                    setMerchantBusinessId(businessData.id);

                    // Cargar favoritos para este comercio
                    const { count } = await supabase
                        .from('favorites')
                        .select('*', { count: 'exact', head: true })
                        .eq('business_id', businessData.id);
                    
                    setFavoritesCount(count || 0);
                }
            }
        };
        checkAdminAndBusiness();
    }, []);

    // Calcular reseñas reales para el comercio del mercante
    const businessReviewsCount = useMemo(() => {
        if (!merchantBusinessId) return 0;
        return allReviews[merchantBusinessId]?.length || 0;
    }, [allReviews, merchantBusinessId]);

    const handleSeed = async () => {
        setIsSeeding(true);
        setSeedMessage('Inicializando base de datos...');
        try {
            const result = await seedDatabase();
            setSeedMessage(result.message);
        } catch {
            setSeedMessage('Error al inicializar la base de datos');
        } finally {
            setIsSeeding(false);
            setTimeout(() => setSeedMessage(null), 5000);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
            <header className="bg-white dark:bg-slate-900 p-6 flex items-center justify-between border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30 transition-colors">
                <div className="flex items-center">
                    <button onClick={goBack} className="p-2 -ml-2 mr-3 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Mi Comercio</h1>
                        <p className="text-[10px] font-bold text-blue-600 dark:text-indigo-400 uppercase tracking-widest">
                            {profile.role === 'merchant' ? `Gestionado por ${profile.name}` : 'Modo Demostración'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-[8px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-widest">v2.4.1</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                        {profile.name.charAt(0)}
                    </div>
                </div>
            </header>

            <div className="p-6 space-y-6">
                {isAdmin && (
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-white dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
                                    <DatabaseIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-800 dark:text-slate-100">Panel de Administrador</p>
                                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                                        {seedMessage || 'Inicializa la base de datos con datos de prueba'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleSeed}
                                disabled={isSeeding}
                                className={`text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border dark:border-slate-700 transition-all ${isSeeding ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:scale-95'}`}
                            >
                                {isSeeding ? 'Procesando...' : 'Seed Data'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-white dark:border-slate-700 shadow-sm flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                            <p className="text-sm font-black text-gray-800 dark:text-slate-100">Tu perfil está activo</p>
                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                                {profile.role === 'merchant' ? 'Comercio Registrado' : 'Comercio de Ejemplo'}
                            </p>
                        </div>
                    </div>
                    <button className="text-blue-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-slate-900 px-4 py-2 rounded-xl border dark:border-slate-700">Editar</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Visitas Perfil" value="0" trend="0%" color="green" />
                    <MetricCard label="Favoritos" value={favoritesCount} trend="+0%" color="green" />
                    <MetricCard label="Clics Tel." value="0" trend="0%" color="blue" />
                    <MetricCard label="Reseñas" value={businessReviewsCount} trend="0.0 ★" color="blue" />
                </div>

                <section>
                    <h3 className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-1">Atajos del dueño</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-[32px] p-2 border border-white dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl cursor-pointer group transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-2xl"><StarIcon className="w-5 h-5"/></div>
                                <span className="font-bold text-sm text-gray-700 dark:text-slate-200">Crear Promoción</span>
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-gray-200 dark:text-slate-700 group-hover:translate-x-1 transition-transform"/>
                        </div>
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl cursor-pointer group transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 dark:bg-indigo-900/30 text-blue-600 dark:text-indigo-400 rounded-2xl"><ChatAltIcon className="w-5 h-5"/></div>
                                <span className="font-bold text-sm text-gray-700 dark:text-slate-200">Responder Reseñas</span>
                            </div>
                            <div className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">3</div>
                        </div>
                    </div>
                </section>
                
                <div className="bg-blue-600 dark:bg-indigo-600 rounded-[32px] p-8 text-white text-center shadow-xl shadow-blue-200 dark:shadow-slate-900">
                    <h4 className="font-black text-lg tracking-tight">¿Necesitas vender más?</h4>
                    <p className="text-blue-100 dark:text-indigo-100 text-xs font-bold mt-2 opacity-80 uppercase tracking-widest leading-relaxed">Habla con nuestro asesor de comercios de Casanova</p>
                    <button className="mt-6 bg-white dark:bg-slate-900 text-blue-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl shadow-lg active:scale-95 transition-all">Contactar Soporte</button>
                </div>

                <div className="mt-12 flex justify-center pt-6 pb-12">
                    <button 
                        onClick={goBack}
                        className="flex items-center space-x-3 bg-white dark:bg-slate-800 px-10 py-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-all group"
                    >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-indigo-400" />
                        <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800 dark:text-slate-200">Volver</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboardPage;
