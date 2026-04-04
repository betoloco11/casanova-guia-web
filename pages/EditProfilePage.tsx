
import React, { useState } from 'react';
import { ChevronLeftIcon } from '../components/Icons';

import { useAppContext } from '../context/AppContext';

interface EditProfilePageProps {
  goBack: () => void;
}

const EditProfilePage: React.FC<EditProfilePageProps> = ({ goBack }) => {
    const { profile, updateProfile } = useAppContext();
    const [name, setName] = useState(profile?.name || '');
    const [email, setEmail] = useState(profile?.email || '');
    const [role, setRole] = useState(profile?.role || 'client');

    const handleSave = async () => {
        await updateProfile({ name, email, role });
        goBack();
    };

    return (
        <div className="min-h-screen pb-32 transition-colors duration-300 bg-white dark:bg-slate-950">
            <header className="p-4 flex items-center border-b border-yellow-100 bg-[#FEF9C3]/90 backdrop-blur-md dark:bg-slate-900/90 sticky top-0 z-20 shadow-sm transition-colors">
                <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight">Editar Perfil</h1>
            </header>

            <div className="p-8 space-y-8">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" 
                            className="w-24 h-24 rounded-[32px] object-cover shadow-lg border-2 border-blue-100 dark:border-slate-700" 
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-yellow-400/20 transition-all shadow-sm" 
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Tipo de Usuario</label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            <button 
                                onClick={() => setRole('client')}
                                className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${role === 'client' ? 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 border-blue-600 dark:border-yellow-400 shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-700'}`}
                            >
                                Cliente
                            </button>
                            <button 
                                onClick={() => setRole('merchant')}
                                className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${role === 'merchant' ? 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 border-blue-600 dark:border-yellow-400 shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-700'}`}
                            >
                                Comerciante
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-5 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-yellow-400/20 transition-all shadow-sm" 
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 font-black py-6 rounded-[32px] shadow-xl shadow-blue-200 dark:shadow-slate-900 uppercase tracking-widest text-sm mt-10 active:scale-95 transition-all"
                >
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default EditProfilePage;
