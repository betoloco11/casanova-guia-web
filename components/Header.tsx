
import React from 'react';
import { BellIcon, UserCircleIcon, LogoIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  onNotificationsClick: () => void;
  onProfileClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNotificationsClick, 
  onProfileClick,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <header className="bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-lg px-4 py-5 flex justify-between items-center sticky top-0 z-20 border-b border-yellow-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <LogoIcon className="w-14 h-14 flex-shrink-0" />
        <h1 className="text-xl font-black text-gray-800 dark:text-slate-100 leading-[1.1] tracking-tighter">
          Casanova <br />
          <span className="text-blue-600 dark:text-yellow-400">Guía Web</span>
        </h1>
      </div>
      <div className="flex items-center space-x-1">
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 dark:text-slate-400 hover:bg-yellow-50 dark:hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Cambiar tema"
        >
          {isDarkMode ? <SunIcon className="w-7 h-7" /> : <MoonIcon className="w-7 h-7" />}
        </button>
        <button 
          onClick={onNotificationsClick}
          className="p-2 text-gray-500 dark:text-slate-400 hover:bg-yellow-50 dark:hover:bg-slate-800 rounded-full transition-colors relative"
        >
          <BellIcon className="w-7 h-7" />
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        </button>
        <button 
          onClick={onProfileClick}
          className="p-2 text-gray-500 dark:text-slate-400 hover:bg-yellow-50 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <UserCircleIcon className="w-7 h-7" />
        </button>
      </div>
    </header>
  );
};

export default Header;
