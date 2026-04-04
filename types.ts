
export type Page = 'home' | 'search' | 'favorites' | 'profile' | 'notifications' | 'businessDetail' | 'promotionDetail' | 'categoryResults' | 'editProfile' | 'security' | 'userReviews' | 'suggestBusiness' | 'helpCenter' | 'about' | 'map' | 'ownerDashboard' | 'writeReview' | 'login' | 'register' | 'promotionsList';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  userId?: string;
  authorName: string;
  authorImage: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  comments: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface BusinessPromotion {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Business {
  id:string;
  categoryId: string;
  name: string;
  type: string;
  rating: number;
  reviewCount: number;
  distance: number; 
  image: string;
  address: string;
  phone: string;
  whatsapp?: string; // Número de WhatsApp (ej: 5411...)
  hours: string;
  description: string;
  photos: string[];
  products: Product[];
  promotions: BusinessPromotion[];
  reviews: Review[];
  isFavorite?: boolean;
  landmarks?: string;
  coordinates?: { top: string; left: string };
}

export interface Promotion {
    id: string;
    title: string;
    description: string;
    validity: string;
    conditions: string;
    image: string;
    businessId: string;
    businessName: string;
    businessType: string;
    businessLogo: string;
}
