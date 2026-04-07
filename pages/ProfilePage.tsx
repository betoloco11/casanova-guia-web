
import React, { useState } from 'react';
import { Page } from '../types';
import { 
    ArrowRightIcon, 
    ShieldIcon, 
    LogoutIcon, 
    UserCircleIcon, 
    StarIcon, 
    MapIcon, 
    ChatAltIcon, 
    BadgeIcon,
    ChevronLeftIcon,
    TrashIcon
} from '../components/Icons';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabaseClient';
import Modal from '../components/Modal';

interface ProfilePageProps {
    navigateTo: (page: Page) => void;
    goBack: () => void;
    isDarkMode?: boolean;
    toggleDarkMode?: () => void;
}

const MenuOption: React.FC<{
    icon: React.ReactNode; 
    label: string; 
    value?: string; 
    destructive?: boolean;
    action?: React.ReactNode;
    onClick?: () => void;
}> = ({ icon, label, value, destructive, action, onClick }) => (
    <div 
        onClick={onClick}
        className="flex justify-between items-center py-6 border-b border-blue-50 dark:border-slate-700 last:border-0 group cursor-pointer active:bg-blue-50 dark:active:bg-slate-700/50 transition-colors px-6"
    >
        <div className="flex items-center space-x-5">
            <div className={`p-4 rounded-[20px] transition-colors ${destructive ? 'bg-red-50 dark:bg-red-900/30 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/50' : 'bg-blue-50/50 dark:bg-slate-700/50 text-gray-400 dark:text-slate-500 group-hover:bg-blue-600 dark:group-hover:bg-yellow-400 dark:group-hover:text-slate-950 group-hover:text-white'}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-6 h-6' })}
            </div>
            <div className="flex flex-col">
                <span className={`font-black text-base tracking-tight ${destructive ? 'text-red-500' : 'text-gray-800 dark:text-slate-100'}`}>{label}</span>
                {value && <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">{value}</span>}
            </div>
        </div>
        <div className="flex items-center space-x-3">
            {action || <ArrowRightIcon className={`w-5 h-5 ${destructive ? 'text-red-200 dark:text-red-800' : 'text-blue-100 dark:text-slate-700'} group-hover:translate-x-1 transition-transform`} />}
        </div>
    </div>
);

const SectionHeader: React.FC<{title: string, subtitle: string}> = ({title, subtitle}) => (
    <div className="px-6 mb-3 mt-12">
        <h3 className="text-xl font-black text-gray-900 dark:text-slate-100 uppercase tracking-tighter leading-none">{title}</h3>
        <p className="text-xs font-black text-blue-400 dark:text-yellow-400 uppercase tracking-[0.15em] mt-1.5">{subtitle}</p>
    </div>
);

const ProfilePage: React.FC<ProfilePageProps> = ({ navigateTo, goBack, isDarkMode, toggleDarkMode }) => {
  const { profile, favoriteIds, allReviews, refreshData } = useAppContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string | null>(null);

  // Calcular total de reseñas del usuario
  const userReviewsCount = React.useMemo(() => {
    let count = 0;
    if (!allReviews || !profile?.id) return 0;
    
    Object.values(allReviews).forEach(businessReviews => {
      if (Array.isArray(businessReviews)) {
        businessReviews.forEach(review => {
          const isOwner = review.userId === profile.id;
          if (isOwner) {
            count++;
          }
        });
      }
    });
    return count;
  }, [allReviews, profile?.id]);

  const handleLogout = async () => {
    try {
        // Preservamos el tema antes de limpiar
        const currentTheme = localStorage.getItem('theme');
        
        // Limpiamos todo el cache local
        localStorage.clear();
        
        // Restauramos el tema
        if (currentTheme) {
            localStorage.setItem('theme', currentTheme);
        }
        
        // Intentamos cerrar sesión en Supabase
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    } finally {
        // Siempre navegamos al home, incluso si hay error (sesión ya expirada o borrada)
        navigateTo('home');
        // Forzamos un refresh para limpiar cualquier estado residual en memoria
        window.location.reload();
    }
  };

  const handleDeleteAccount = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            // Borrar el perfil de la tabla 'profiles'
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', session.user.id);
            
            if (error) throw error;
        }
        
        // Después de borrar el perfil, cerramos sesión
        await handleLogout();
    } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        setShowErrorModal("Hubo un error al intentar eliminar tu perfil. Por favor, intenta cerrar sesión primero.");
    }
  };

  return (
    <div className="min-h-screen pb-32 transition-colors duration-300">
        <div className="bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md p-5 flex items-center border-b border-yellow-100 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors duration-300">
            <button onClick={goBack} className="p-3 -ml-3 mr-2 text-gray-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                <ChevronLeftIcon className="w-7 h-7" />
            </button>
            <div className="flex-1">
                <h1 className="text-2xl font-black text-gray-800 dark:text-slate-100 tracking-tight leading-none">Mi Perfil</h1>
            </div>
            <span className="text-[10px] font-black text-blue-600 dark:text-yellow-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-blue-100 dark:border-slate-700 shadow-sm uppercase tracking-widest">v2.4.1</span>
        </div>

        <div className="px-6 pt-10 pb-12 rounded-b-[60px] relative overflow-hidden bg-white/40 dark:bg-slate-800/20 border-b border-white dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center space-x-8 relative z-10">
                <div className="relative">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" alt="User" className="w-24 h-24 rounded-[40px] object-cover border-4 border-white dark:border-slate-700 shadow-2xl shadow-blue-200 dark:shadow-slate-900" />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white dark:text-slate-950 p-2 rounded-2xl border-4 border-white dark:border-slate-700 shadow-md">
                        <BadgeIcon className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter leading-none">
                        {profile?.name === 'Cliente de Casanova' && profile?.role === 'merchant' ? 'Comerciante de Casanova' : (profile?.name || 'Cargando...')}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mt-1 lowercase">{profile?.email}</p>
                    <p className="text-blue-600 dark:text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mt-3 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full w-fit border border-white dark:border-slate-700 shadow-sm transition-colors duration-300">
                        {profile?.role === 'merchant' ? 'Comerciante Destacado' : 'Cliente Destacado'}
                    </p>
                </div>
            </div>

            <div className="flex justify-between mt-12 px-4">
                <div className="text-center cursor-pointer group" onClick={() => navigateTo('favorites')}>
                    <p className="text-2xl font-black text-gray-800 dark:text-slate-100 leading-none group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">{favoriteIds?.size || 0}</p>
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase mt-2 tracking-widest">Favoritos</p>
                </div>
                <div className="text-center cursor-pointer group" onClick={() => navigateTo('userReviews')}>
                    <p className="text-2xl font-black text-gray-800 dark:text-slate-100 leading-none group-hover:text-blue-600 dark:group-hover:text-yellow-400 transition-colors">{userReviewsCount}</p>
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase mt-2 tracking-widest">Reseñas</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-black text-gray-800 dark:text-slate-100 leading-none">{profile?.points || 0}</p>
                    <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase mt-2 tracking-widest">Puntos</p>
                </div>
            </div>
        </div>

        <div className="px-6 pb-12">
            <SectionHeader title="Mi Actividad" subtitle="Tu participación en la comunidad" />
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[48px] overflow-hidden shadow-sm border border-white dark:border-slate-700 transition-colors duration-300">
                <MenuOption 
                    icon={<UserCircleIcon />} 
                    label="Mi Perfil" 
                    value="Editar datos y foto" 
                    onClick={() => navigateTo('editProfile')} 
                />
                <MenuOption 
                    icon={<StarIcon />} 
                    label="Mis Opiniones" 
                    value="Ver tus comentarios" 
                    onClick={() => navigateTo('userReviews')} 
                />
                <MenuOption 
                    icon={<MapIcon className="text-blue-500 dark:text-yellow-400" />} 
                    label="Sugerir Comercio" 
                    value="Suma un nuevo lugar a la guía" 
                    onClick={() => navigateTo('suggestBusiness')} 
                />
            </div>

            {profile?.role === 'merchant' && (
                <>
                    <SectionHeader title="Espacio Comerciantes" subtitle="Gestión de comercios" />
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[48px] overflow-hidden shadow-sm border border-white dark:border-slate-700 transition-colors duration-300">
                        <MenuOption 
                            icon={<MapIcon className="text-blue-500 dark:text-yellow-400"/>} 
                            label="Panel de Dueño" 
                            value="Gestionar mi comercio y datos" 
                            onClick={() => navigateTo('ownerDashboard')} 
                        />
                    </div>
                </>
            )}

            <SectionHeader title="Soporte" subtitle="Ayuda y estado de la app" />
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[48px] overflow-hidden shadow-sm border border-white dark:border-slate-700 transition-colors duration-300">
                <MenuOption 
                    icon={<ChatAltIcon />} 
                    label="Centro de Ayuda" 
                    value="Estado de conexión y soporte" 
                    onClick={() => navigateTo('helpCenter')} 
                />
                <MenuOption 
                    icon={<ShieldIcon />} 
                    label="Acerca de" 
                    value="Información legal y de la guía" 
                    onClick={() => navigateTo('about')} 
                />
                <MenuOption 
                    icon={<LogoutIcon />} 
                    label="Cerrar Sesión" 
                    destructive 
                    onClick={handleLogout}
                />
                <MenuOption 
                    icon={<TrashIcon className="text-red-500" />} 
                    label="Eliminar Perfil" 
                    value="Borrar tus datos de la app" 
                    destructive 
                    onClick={() => setShowDeleteModal(true)}
                />
            </div>

            <SectionHeader title="Herramientas" subtitle="Utilidades del sistema" />
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-[48px] overflow-hidden shadow-sm border border-white dark:border-slate-700 transition-colors duration-300">
                <MenuOption 
                    icon={isDarkMode ? <SunIcon className="text-yellow-400" /> : <MoonIcon className="text-blue-500" />} 
                    label={isDarkMode ? "Modo Claro" : "Modo Oscuro"} 
                    value={isDarkMode ? "Cambiar a fondo claro" : "Cambiar a fondo oscuro"} 
                    onClick={toggleDarkMode} 
                />
                <MenuOption 
                    icon={<BadgeIcon className="text-blue-500 dark:text-yellow-400" />} 
                    label="Refrescar App" 
                    value="Recargar la aplicación" 
                    onClick={async () => {
                        try {
                            await refreshData();
                        } catch {
                            window.location.reload();
                        }
                    }} 
                />
                <MenuOption 
                    icon={<StarIcon className="text-blue-500 dark:text-yellow-400" />} 
                    label="Pantalla Completa" 
                    value="Expandir visualización" 
                    onClick={() => {
                        if (!document.fullscreenElement) {
                            document.documentElement.requestFullscreen();
                        } else {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                        }
                    }} 
                />
            </div>

            <div className="mt-12 text-center pb-12">
                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = window.location.href.split('?')[0] + '?v=' + new Date().getTime();
                    }}
                    className="text-[10px] font-black text-gray-400 dark:text-slate-600 uppercase tracking-[0.3em] hover:text-blue-500 transition-colors"
                >
                    Casanova Guía Web v2.4.1 - Forzar Recarga Total
                </button>
            </div>
        </div>

        {/* Modales */}
        <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="¿Eliminar Perfil?"
            type="danger"
            footer={
                <>
                    <button 
                        onClick={handleDeleteAccount}
                        className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                        Sí, Eliminar Perfil
                    </button>
                    <button 
                        onClick={() => setShowDeleteModal(false)}
                        className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Cancelar
                    </button>
                </>
            }
        >
            <p>Esta acción borrará tus datos de usuario en la aplicación.</p>
            <p className="mt-4 text-xs font-bold opacity-70 italic">
                IMPORTANTE: Para eliminar completamente tu cuenta de acceso, también debes borrarla desde el panel de Supabase si eres el administrador.
            </p>
        </Modal>

        <Modal
            isOpen={!!showErrorModal}
            onClose={() => setShowErrorModal(null)}
            title="Error"
            type="danger"
            footer={
                <button 
                    onClick={() => setShowErrorModal(null)}
                    className="w-full py-4 bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                    Entendido
                </button>
            }
        >
            <p>{showErrorModal}</p>
        </Modal>
    </div>
  );
};

export default ProfilePage;
