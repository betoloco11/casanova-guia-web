
import React from 'react';
import { ChevronLeftIcon, BellIcon, StarIcon } from '../components/Icons';

interface NotificationsPageProps {
  goBack: () => void;
}

interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
    type: 'promo' | 'alert' | 'info';
    unread?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ title, message, time, type, unread }) => {
    const getIcon = () => {
        switch(type) {
            case 'promo': return <StarIcon className="w-6 h-6 text-yellow-500" />;
            case 'alert': return <BellIcon className="w-6 h-6 text-red-500" />;
            default: return <BellIcon className="w-6 h-6 text-blue-500" />;
        }
    };

    return (
        <div className={`p-6 border-b border-blue-50 flex items-start space-x-5 cursor-pointer hover:bg-white/50 transition-colors ${unread ? 'bg-white/80 backdrop-blur-sm' : ''}`}>
            <div className={`p-4 rounded-2xl ${unread ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white shadow-sm text-blue-400 border border-gray-100'}`}>
                {getIcon()}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className={`text-base font-black tracking-tight ${unread ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h3>
                    <span className="text-[11px] text-blue-300 font-black uppercase tracking-widest">{time}</span>
                </div>
                <p className={`text-sm mt-2 line-clamp-3 leading-relaxed font-medium ${unread ? 'text-gray-700' : 'text-gray-400'}`}>{message}</p>
            </div>
            {unread && <div className="w-3 h-3 bg-blue-600 rounded-full mt-3 shadow-lg shadow-blue-200"></div>}
        </div>
    );
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ goBack }) => {
  const notifications: NotificationItemProps[] = [
    {
      title: "¡Nueva Pizzería cerca!",
      message: "Un nuevo comercio acaba de unirse a la guía. ¡Mira su promo de apertura y disfruta de lo mejor del barrio!",
      time: "HACE 2H",
      type: 'info',
      unread: true
    },
    {
      title: "Corte de Luz programado",
      message: "Edenor informa mantenimiento en la zona de Av. Libertador mañana de 8 a 12hs. Tome las precauciones necesarias.",
      time: "AYER",
      type: 'alert',
      unread: true
    },
    {
      title: "Tu cupón está por vencer",
      message: "Recuerda que el 20% OFF en Panadería El Sol vence en 48 horas. ¡No te pierdas esas facturas!",
      time: "2 DÍAS",
      type: 'promo'
    },
    {
        title: "Farmacia de Turno hoy",
        message: "Farmacia Nueva se encuentra de turno durante toda la noche de hoy para cualquier emergencia.",
        time: "3 DÍAS",
        type: 'info'
    }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 bg-[#FEF9C3]/90 backdrop-blur-md z-10 p-5 flex items-center border-b border-yellow-100 shadow-sm">
        <button onClick={goBack} className="p-3 -ml-2 mr-3 text-gray-700 hover:bg-white/50 rounded-full transition-colors">
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Notificaciones</h1>
      </header>

      <div className="flex flex-col py-4">
        {notifications.map((n, idx) => (
          <NotificationItem key={idx} {...n} />
        ))}
      </div>
      
      {/* Botón de volver al final */}
      <div className="mt-16 flex flex-col items-center pb-32">
          <button 
              onClick={goBack}
              className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-10 py-5 rounded-[24px] shadow-md border border-white active:scale-95 transition-all group"
          >
              <ChevronLeftIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              <span className="font-black text-sm uppercase tracking-[0.3em] text-gray-800">Volver</span>
          </button>
          <p className="text-blue-300 font-black uppercase text-[10px] tracking-[0.4em] mt-10 italic opacity-50">Es todo por ahora</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
