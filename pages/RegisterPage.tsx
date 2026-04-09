
import React, { useState } from 'react';
import { Page } from '../types';
import { supabase } from '../services/supabaseClient';
import { ChevronLeftIcon } from '../components/Icons';

interface RegisterPageProps {
    navigateTo: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigateTo }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'client' | 'merchant'>('client');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: loginError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (loginError) throw loginError;
        } catch (err: any) {
            console.error("Error en Google Login:", err);
            setError("Error al conectar con Google. Asegúrate de permitir ventanas emergentes.");
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role
                    },
                    emailRedirectTo: window.location.origin
                }
            });

            if (signUpError) throw signUpError;

            if (data.user) {
                // El perfil se creará automáticamente por el hook useUserProfile al detectar la sesión
                // o podemos crearlo explícitamente aquí si queremos asegurar consistencia inmediata
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        email: email,
                        name: name,
                        role: role,
                        points: 100,
                        neighborhood: 'Isidro Casanova'
                    });
                
                if (profileError) console.error("Error al crear perfil:", profileError);
            }

            setLoading(false);
            
            if (data.user && !data.session) {
                setSuccessMessage("¡Cuenta creada! Por favor, revisa tu email para confirmar tu cuenta antes de iniciar sesión.");
            } else {
                navigateTo('home');
            }
        } catch (err: any) {
            console.error("Error en registro:", err);
            
            let userMessage = "Error al crear la cuenta";
            if (err.message === "Failed to fetch" || err.status === 0) {
                userMessage = "Error de conexión: Verifica tu internet o desactiva bloqueadores de anuncios.";
            } else if (err.code === "user_already_exists") {
                userMessage = "Este email ya está registrado.";
            } else {
                userMessage = err.message || userMessage;
            }
            
            setError(userMessage);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FEF9C3] dark:bg-slate-950 p-8 transition-colors duration-300 flex flex-col items-center">
            <div className="w-full max-w-sm">
                <button 
                    onClick={() => navigateTo('login')}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-md text-gray-600 dark:text-slate-400 mb-8 active:scale-90 transition-transform border dark:border-slate-800"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-gray-800 dark:text-slate-100 tracking-tighter leading-none">Únete al <span className="text-blue-600 dark:text-yellow-400">Barrio</span></h1>
                    <p className="text-gray-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 italic">Registro oficial Casanova Guía</p>
                </div>

                <div className="mb-8">
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-4 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md active:scale-95 transition-all group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-black text-gray-700 dark:text-slate-200 uppercase tracking-widest">Continuar con Google</span>
                    </button>
                    
                    <div className="relative flex items-center justify-center my-8">
                        <div className="flex-grow border-t border-gray-100 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em]">o usa tu email</span>
                        <div className="flex-grow border-t border-gray-100 dark:border-slate-800"></div>
                    </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-8 rounded-[40px] text-green-700 dark:text-green-400 text-sm font-bold text-center space-y-6 shadow-xl">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <p className="leading-relaxed">{successMessage}</p>
                            <button 
                                onClick={() => navigateTo('login')}
                                className="w-full py-5 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-200 dark:shadow-none active:scale-95 transition-all"
                            >
                                Ir al Inicio de Sesión
                            </button>
                        </div>
                    )}

                    {!successMessage && (
                        <>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-yellow-400/20 transition-all shadow-sm"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Soy un...</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setRole('client')}
                                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${role === 'client' ? 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 border-blue-600 dark:border-yellow-400 shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800'}`}
                                    >
                                        Cliente
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setRole('merchant')}
                                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${role === 'merchant' ? 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 border-blue-600 dark:border-yellow-400 shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800'}`}
                                    >
                                        Comerciante
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Email</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-yellow-400/20 transition-all shadow-sm"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Crea una Contraseña</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[32px] p-6 text-sm font-bold text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-yellow-400/20 transition-all shadow-sm"
                                    placeholder="Mínimo 6 caracteres"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl transition-all ${
                                    loading 
                                        ? 'bg-blue-300 dark:bg-yellow-900/50 cursor-not-allowed text-white/50' 
                                        : 'bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 shadow-blue-200 dark:shadow-slate-900 active:scale-95'
                                }`}
                            >
                                {loading ? 'Registrando...' : 'Comenzar Ahora'}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
