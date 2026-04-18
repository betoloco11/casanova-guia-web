
import React, { useState, useCallback, useEffect } from 'react';
import HomePage from './pages/HomePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PromotionDetailPage from './pages/PromotionDetailPage';
import CategoryResultsPage from './pages/CategoryResultsPage';
import EditProfilePage from './pages/EditProfilePage';
import SecurityPage from './pages/SecurityPage';
import UserReviewsPage from './pages/UserReviewsPage';
import SuggestBusinessPage from './pages/SuggestBusinessPage';
import HelpCenterPage from './pages/HelpCenterPage';
import AboutPage from './pages/AboutPage';
import MapPage from './pages/MapPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import WriteReviewPage from './pages/WriteReviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PromotionsListPage from './pages/PromotionsListPage';

import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Page, Business, Promotion, Category } from './types';
import { mockBusinesses, mockPromotions } from './services/mockApiService';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

import { AppProvider, useAppContext } from './context/AppContext';

const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [mapResults, setMapResults] = useState<Business[]>(mockBusinesses);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const { favoriteIds, toggleFavorite, allReviews, addReview, profile, updateProfile, refreshData } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (authLoading) {
        setAuthError(true);
      }
    }, 10000); // 10 seconds timeout

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      clearTimeout(timeout);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setAuthLoading(false);
      clearTimeout(timeout);
      
      // Si el usuario cambia, refrescamos todos los datos para evitar "fantasmas"
      if (session) {
        await refreshData();
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    console.log('Theme updated:', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const navigateTo = useCallback((page: Page) => {
    const privatePages: Page[] = [
      'search', 'favorites', 'profile', 'notifications', 
      'editProfile', 'security', 'userReviews', 
      'suggestBusiness', 'ownerDashboard', 'writeReview'
    ];

    if (!session && privatePages.includes(page)) {
      setActivePage('login');
    } else {
      setActivePage(page);
    }
    window.scrollTo(0, 0);
  }, [session]);

  const viewBusinessDetails = useCallback((businessId: string) => {
    const business = mockBusinesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setActivePage('businessDetail');
      window.scrollTo(0, 0);
    }
  }, []);

  const viewWriteReview = useCallback((businessId: string) => {
    if (!session) {
        setActivePage('login');
        return;
    }
    const business = mockBusinesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setActivePage('writeReview');
      window.scrollTo(0, 0);
    }
  }, [session]);

  const viewPromotionDetails = useCallback((promoId: string) => {
    const promotion = mockPromotions.find(p => p.id === promoId);
    if (promotion) {
      setSelectedPromotion(promotion);
      setActivePage('promotionDetail');
      window.scrollTo(0, 0);
    }
  }, []);

  const viewCategory = useCallback((category: Category) => {
    setSelectedCategory(category);
    setActivePage('categoryResults');
    window.scrollTo(0, 0);
  }, []);

  const openMapWithResults = useCallback((filteredBusinesses: Business[]) => {
    setMapResults(filteredBusinesses);
    setActivePage('map');
  }, []);

  const goBack = useCallback(() => {
    const profileSubpages = ['editProfile', 'security', 'userReviews', 'suggestBusiness', 'helpCenter', 'about', 'ownerDashboard'];
    
    if (profileSubpages.includes(activePage)) {
      navigateTo('profile');
    } else if (activePage === 'map') {
      navigateTo('search');
    } else if (activePage === 'writeReview' && selectedBusiness) {
      setActivePage('businessDetail');
    } else if (['login', 'register', 'promotionsList'].includes(activePage)) {
        setActivePage('home');
    } else {
      navigateTo('home');
    }
  }, [activePage, navigateTo, selectedBusiness]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FEF9C3] dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        {!authError ? (
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-yellow-400 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="max-w-xs">
            <div className="text-4xl mb-4">📡</div>
            <h2 className="text-xl font-black text-gray-800 dark:text-slate-100 mb-2 uppercase tracking-tighter">Error de Conexión</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm font-bold mb-6">Parece que hay problemas para conectar con el servidor. ¿Tienes internet?</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-blue-600 dark:bg-yellow-400 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'login':
        return <LoginPage navigateTo={navigateTo} />;
      case 'register':
        return <RegisterPage navigateTo={navigateTo} />;
      case 'home':
        return <HomePage 
                  viewBusinessDetails={viewBusinessDetails} 
                  viewPromotionDetails={viewPromotionDetails} 
                  viewCategory={viewCategory}
                  favoriteIds={favoriteIds}
                  toggleFavorite={session ? toggleFavorite : () => setActivePage('login')}
                  viewWriteReview={viewWriteReview}
                  onSearchFocus={() => navigateTo('search')}
                  onViewAllPromotions={() => setActivePage('promotionsList')}
                  session={session}
                  navigateTo={navigateTo}
                />;
      case 'promotionsList':
        return <PromotionsListPage 
                  goBack={goBack} 
                  viewPromotionDetails={viewPromotionDetails} 
                />;
      case 'businessDetail':
        return selectedBusiness ? (
          <BusinessDetailPage 
            business={selectedBusiness} 
            goBack={goBack} 
            navigateToReview={() => session ? setActivePage('writeReview') : setActivePage('login')}
            customReviews={allReviews[selectedBusiness.id] || []}
          />
        ) : <HomePage session={session} navigateTo={navigateTo} viewBusinessDetails={viewBusinessDetails} viewPromotionDetails={viewPromotionDetails} viewCategory={viewCategory} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} viewWriteReview={viewWriteReview} onSearchFocus={() => navigateTo('search')} />;
      case 'writeReview':
        return selectedBusiness ? (
          <WriteReviewPage 
            business={selectedBusiness} 
            goBack={goBack} 
            onSaveReview={async (review) => {
              await addReview(selectedBusiness.id, review);
              await updateProfile({ points: profile.points + 15 });
            }}
          />
        ) : <HomePage session={session} navigateTo={navigateTo} viewBusinessDetails={viewBusinessDetails} viewPromotionDetails={viewPromotionDetails} viewCategory={viewCategory} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} viewWriteReview={viewWriteReview} onSearchFocus={() => navigateTo('search')} />;
      case 'search':
        return <SearchPage 
                  goBack={goBack} 
                  viewBusinessDetails={viewBusinessDetails} 
                  navigateTo={navigateTo}
                  onViewMap={openMapWithResults}
                  viewWriteReview={viewWriteReview}
                />;
      case 'favorites':
        return <FavoritesPage 
                  favoriteIds={favoriteIds} 
                  viewBusinessDetails={viewBusinessDetails} 
                  toggleFavorite={toggleFavorite}
                  viewWriteReview={viewWriteReview}
                  goBack={goBack}
                />;
      case 'profile':
        return <ProfilePage navigateTo={navigateTo} goBack={goBack} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
      case 'notifications':
        return <NotificationsPage goBack={goBack} />;
      case 'categoryResults':
        return selectedCategory ? (
          <CategoryResultsPage 
            category={selectedCategory} 
            goBack={goBack} 
            viewBusinessDetails={viewBusinessDetails} 
            favoriteIds={favoriteIds}
            toggleFavorite={session ? toggleFavorite : () => setActivePage('login')}
            viewWriteReview={viewWriteReview}
          />
        ) : <HomePage session={session} navigateTo={navigateTo} viewBusinessDetails={viewBusinessDetails} viewPromotionDetails={viewPromotionDetails} viewCategory={viewCategory} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} viewWriteReview={viewWriteReview} onSearchFocus={() => navigateTo('search')} />;
      case 'promotionDetail':
        return selectedPromotion ? <PromotionDetailPage promotion={selectedPromotion} goBack={goBack} viewBusinessDetails={viewBusinessDetails}/> : <HomePage session={session} navigateTo={navigateTo} viewBusinessDetails={viewBusinessDetails} viewPromotionDetails={viewPromotionDetails} viewCategory={category => viewCategory(category)} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} viewWriteReview={viewWriteReview} onSearchFocus={() => navigateTo('search')} />;
      
      case 'editProfile': return <EditProfilePage goBack={goBack} />;
      case 'security': return <SecurityPage goBack={goBack} />;
      case 'userReviews': return <UserReviewsPage goBack={goBack} />;
      case 'suggestBusiness': return <SuggestBusinessPage goBack={goBack} />;
      case 'helpCenter': return <HelpCenterPage goBack={goBack} />;
      case 'about': return <AboutPage goBack={goBack} />;
      
      case 'map': return <MapPage goBack={goBack} businesses={mapResults} viewBusinessDetails={viewBusinessDetails} />;
      case 'ownerDashboard': return <OwnerDashboardPage goBack={goBack} />;

      default:
        return <HomePage session={session} navigateTo={navigateTo} viewBusinessDetails={viewBusinessDetails} viewPromotionDetails={viewPromotionDetails} viewCategory={viewCategory} favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} viewWriteReview={viewWriteReview} onSearchFocus={() => navigateTo('search')}/>;
    }
  };
  
  const showHeader = activePage === 'home';
  const showBottomNav = !['businessDetail', 'promotionDetail', 'notifications', 'editProfile', 'security', 'userReviews', 'suggestBusiness', 'helpCenter', 'about', 'map', 'ownerDashboard', 'writeReview', 'login', 'register', 'promotionsList'].includes(activePage);

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen font-sans transition-colors duration-300">
      <div className="max-w-lg mx-auto bg-[#D1E9FF] dark:bg-slate-950 shadow-2xl min-h-screen relative overflow-hidden transition-colors duration-300">
        <Layout 
          activePage={activePage} 
          navigateTo={navigateTo} 
          showHeader={showHeader} 
          showBottomNav={showBottomNav}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        >
          <ErrorBoundary>
            {renderPage()}
          </ErrorBoundary>
        </Layout>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
