
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Page } from '../types';

interface BottomNavProps {
  activePage: Page;
  navigateTo: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, navigateTo }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FEF9C3]/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-yellow-100 dark:border-slate-800 flex justify-around max-w-lg mx-auto z-20 pb-safe transition-colors duration-300">
      {NAV_ITEMS.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id as Page)}
            className={`flex flex-col items-center justify-center w-full py-3 px-1 text-center transition-all duration-200 ${
              isActive ? 'text-blue-600 dark:text-yellow-400' : 'text-gray-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-yellow-300'
            }`}
          >
            <item.icon className={`w-7 h-7 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className={`text-xs font-black uppercase tracking-wide ${isActive ? 'text-blue-600 dark:text-yellow-400' : 'text-gray-500 dark:text-slate-400'}`}>
                {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
