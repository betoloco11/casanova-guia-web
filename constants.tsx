
import { Category } from './types';
import { HomeIcon, SearchIcon, HeartIcon, UserIcon } from './components/Icons';

export const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', icon: HomeIcon },
  { id: 'search', label: 'Explorar', icon: SearchIcon },
  { id: 'favorites', label: 'Favoritos', icon: HeartIcon },
  { id: 'profile', label: 'Perfil', icon: UserIcon },
];

/**
 * ¡SOLUCIONADO! 
 * Para Imgur, el link debe ser el "Direct Link".
 * He añadido "i." al principio y ".png" al final de tus códigos.
 */

export const CATEGORIES: Category[] = [
    { 
      id: 'stores', 
      name: 'Tiendas', 
      icon: 'https://i.imgur.com/hAaqYPw.png' 
    },
    { 
      id: 'gastronomy', 
      name: 'Gastronomía', 
      icon: 'https://i.imgur.com/wB2jCit.png' 
    },
    { 
      id: 'beauty', 
      name: 'Belleza', 
      icon: 'https://i.imgur.com/c17QsFU.png' 
    },
    { 
      id: 'services', 
      name: 'Servicios', 
      icon: 'https://i.imgur.com/ZbpkT7r.png' 
    },
    { 
      id: 'health', 
      name: 'Salud', 
      icon: 'https://i.imgur.com/SZKFdnL.png' 
    },
    { 
      id: 'pets', 
      name: 'Mascotas', 
      icon: 'https://i.imgur.com/s1yRy4r.png' 
    },
    { 
      id: 'sports', 
      name: 'Deportes', 
      icon: 'https://i.imgur.com/tUjCPDv.png' 
    },
    { 
      id: 'home_services', 
      name: 'Hogar', 
      icon: 'https://i.imgur.com/8eSe1zw.png' 
    },
];
