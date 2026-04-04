
import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import { Page } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  navigateTo: (page: Page) => void;
  showHeader: boolean;
  showBottomNav: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activePage, 
  navigateTo, 
  showHeader, 
  showBottomNav,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <div className="relative flex flex-col min-h-screen">
      {showHeader && (
        <Header 
          onNotificationsClick={() => navigateTo('notifications')} 
          onProfileClick={() => navigateTo('profile')} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      <main className={`flex-grow ${showBottomNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav activePage={activePage} navigateTo={navigateTo} />}
    </div>
  );
};

export default Layout;
