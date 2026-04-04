
import { Business, Promotion } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const mockPromotions: Promotion[] = [
    {
        id: 'promo1',
        title: '20% OFF en Panadería "El Sol"',
        description: 'Válido en todos los productos de pastelería artesanal.',
        validity: 'Válido hasta el 31 de diciembre de 2024',
        conditions: 'Oferta válida solo para nuevos clientes. No acumulable.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b1',
        businessName: 'Panadería "El Sol"',
        businessType: 'Panadería y Confitería',
        businessLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80'
    },
    {
        id: 'promo2',
        title: 'Corte + Barba por $1500',
        description: 'Oferta especial de Lunes a Miércoles para clientes.',
        validity: 'Válido hasta el 30 de noviembre de 2024',
        conditions: 'Solo pago en efectivo o transferencia.',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b6',
        businessName: 'Barbería El Bigote',
        businessType: 'Belleza',
        businessLogo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&q=80'
    },
    {
        id: 'promo3',
        title: 'Mes Bonificado en Gym Center',
        description: 'Anotándote con un amigo, el primer mes es 100% gratis.',
        validity: 'Válido hasta el 15 de enero de 2025',
        conditions: 'Aplica a pase libre de musculación y funcional.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b18',
        businessName: 'Gym Center Casanova',
        businessType: 'Deportes',
        businessLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&q=80'
    },
    {
        id: 'promo4',
        title: 'Baño y Corte 30% OFF',
        description: 'Los días jueves trae a tu mascota con descuento especial.',
        validity: 'Válido por todo el 2024',
        conditions: 'Requiere turno previo por WhatsApp.',
        image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b12',
        businessName: 'Mascotas Felices',
        businessType: 'Mascotas',
        businessLogo: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=100&q=80'
    },
    {
        id: 'promo5',
        title: '2x1 en Pizzas de Muzza',
        description: 'Todos los Martes disfruta de nuestra clásica muzzarella al 2x1.',
        validity: 'Válido Martes de 19hs a 23hs',
        conditions: 'Solo para consumo en el comercio o Take Away.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b3',
        businessName: 'Pizzería del Barrio',
        businessType: 'Gastronomía',
        businessLogo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'
    },
    {
        id: 'promo6',
        title: '15% OFF en Herramientas',
        description: 'Renueva tu caja de herramientas con este descuento exclusivo.',
        validity: 'Válido hasta agotar stock',
        conditions: 'Aplica a herramientas manuales seleccionadas.',
        image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1200&auto=format&fit=crop',
        businessId: 'b21',
        businessName: 'Ferretería El Martillo',
        businessType: 'Hogar',
        businessLogo: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=100&q=80'
    }
];

export const mockBusinesses: Business[] = [
  // STORES (Tiendas) - 4
  {
    id: 'b1',
    categoryId: 'stores',
    name: 'Panadería "El Sol" v2.4.1',
    type: 'Panadería y Confitería',
    rating: 4.8,
    reviewCount: 777,
    distance: 0.77,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
    address: 'Calle Principal 123',
    landmarks: 'A la vuelta de la Escuela 4',
    coordinates: { top: '25%', left: '20%' },
    phone: '4444-1234',
    whatsapp: '541112345678',
    hours: '7 AM - 8 PM',
    description: 'Pan artesanal horneado a leña todos los días.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b2',
    categoryId: 'stores',
    name: 'Kiosco "El Paso"',
    type: 'Kiosco y Almacén',
    rating: 4.5,
    reviewCount: 999,
    distance: 0.99,
    image: 'https://images.unsplash.com/photo-1534939561122-3d290a019d24?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 100',
    landmarks: 'Frente a la parada del 620',
    coordinates: { top: '30%', left: '45%' },
    phone: '4444-5555',
    whatsapp: '541155554444',
    hours: '24 Horas',
    description: 'Todo lo que necesitas a cualquier hora del día.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b22',
    categoryId: 'stores',
    name: 'Verdulería "Don Pepe"',
    type: 'Frutas y Verduras',
    rating: 4.7,
    reviewCount: 88,
    distance: 0.6,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 1500',
    landmarks: 'Cerca de la plaza principal',
    coordinates: { top: '40%', left: '25%' },
    phone: '4444-2222',
    whatsapp: '541122223333',
    hours: '8 AM - 8 PM',
    description: 'Las mejores frutas y verduras frescas del mercado.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b23',
    categoryId: 'stores',
    name: 'Carnicería "La Nueva"',
    type: 'Carnicería y Granja',
    rating: 4.6,
    reviewCount: 72,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1607623273573-599d00883e36?q=80&w=1200&auto=format&fit=crop',
    address: 'Roma 200',
    landmarks: 'A dos cuadras de la vía',
    coordinates: { top: '35%', left: '60%' },
    phone: '4444-3333',
    whatsapp: '541133334444',
    hours: '8 AM - 1 PM / 5 PM - 8 PM',
    description: 'Cortes de primera calidad y atención personalizada.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // GASTRONOMY (Gastronomía) - 4
  {
    id: 'b3',
    categoryId: 'gastronomy',
    name: 'Pizzería del Barrio',
    type: 'Restaurante Italiano',
    rating: 4.9,
    reviewCount: 310,
    distance: 1.1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    address: 'San Martín 890',
    landmarks: 'Cerca de la Estación Casanova',
    coordinates: { top: '55%', left: '30%' },
    phone: '4444-9900',
    whatsapp: '541199887766',
    hours: '7 PM - 12 AM',
    description: 'La mejor pizza a la piedra de la zona.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b4',
    categoryId: 'gastronomy',
    name: 'Heladería "Vía Venetto"',
    type: 'Heladería Artesanal',
    rating: 4.8,
    reviewCount: 150,
    distance: 0.7,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 800',
    landmarks: 'Frente al Banco Nación',
    coordinates: { top: '50%', left: '50%' },
    phone: '4444-4444',
    whatsapp: '541144445555',
    hours: '12 PM - 1 AM',
    description: 'Helados artesanales con recetas italianas.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b24',
    categoryId: 'gastronomy',
    name: 'Hamburguesería "The Burger"',
    type: 'Comida Rápida',
    rating: 4.7,
    reviewCount: 210,
    distance: 1.3,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 1200',
    landmarks: 'Cerca del cine',
    coordinates: { top: '60%', left: '40%' },
    phone: '4444-6666',
    whatsapp: '541166667777',
    hours: '11 AM - 12 AM',
    description: 'Las mejores hamburguesas gourmet de Casanova.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b25',
    categoryId: 'gastronomy',
    name: 'Rotisería "La Casera"',
    type: 'Comida para Llevar',
    rating: 4.5,
    reviewCount: 95,
    distance: 0.4,
    image: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=1200&auto=format&fit=crop',
    address: 'Juan Manuel de Rosas 11000',
    landmarks: 'Frente a la plaza',
    coordinates: { top: '45%', left: '70%' },
    phone: '4444-7777',
    whatsapp: '541177778888',
    hours: '11 AM - 3 PM / 7 PM - 11 PM',
    description: 'Comida casera como la de la abuela.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // BEAUTY (Belleza) - 4
  {
    id: 'b6',
    categoryId: 'beauty',
    name: 'Barbería El Bigote',
    type: 'Peluquería y Barbería',
    rating: 4.7,
    reviewCount: 85,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. Cristianía 1500',
    landmarks: 'Cerca de la Rotonda de Casanova',
    coordinates: { top: '35%', left: '75%' },
    phone: '4444-5566',
    whatsapp: '541166778899',
    hours: '10 AM - 8 PM',
    description: 'Cortes clásicos y modernos con la mejor atención del barrio.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b7',
    categoryId: 'beauty',
    name: 'Estética "Renacer"',
    type: 'Centro de Estética',
    rating: 4.9,
    reviewCount: 65,
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 1800',
    landmarks: 'A una cuadra de la clínica',
    coordinates: { top: '25%', left: '85%' },
    phone: '4444-8888',
    whatsapp: '541188889999',
    hours: '9 AM - 7 PM',
    description: 'Tratamientos faciales y corporales de última generación.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b26',
    categoryId: 'beauty',
    name: 'Uñas "Glamour"',
    type: 'Manicuría y Pedicuría',
    rating: 4.8,
    reviewCount: 110,
    distance: 0.2,
    image: 'https://images.unsplash.com/photo-1604654894610-df490c9a55af?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 600',
    landmarks: 'Frente a la galería',
    coordinates: { top: '40%', left: '10%' },
    phone: '4444-1122',
    whatsapp: '541111223344',
    hours: '10 AM - 8 PM',
    description: 'Especialistas en uñas esculpidas y nail art.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b27',
    categoryId: 'beauty',
    name: 'Peluquería "Estilo"',
    type: 'Peluquería Unisex',
    rating: 4.6,
    reviewCount: 92,
    distance: 0.9,
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 1200',
    landmarks: 'Cerca del correo',
    coordinates: { top: '15%', left: '30%' },
    phone: '4444-3344',
    whatsapp: '541133445566',
    hours: '9 AM - 8 PM',
    description: 'Cambiamos tu look con las últimas tendencias.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // SERVICES (Servicios) - 4
  {
    id: 'b15',
    categoryId: 'services',
    name: 'Multiservicios Casanova',
    type: 'Cerrajería y Electricidad',
    rating: 4.7,
    reviewCount: 45,
    distance: 0.4,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 500',
    landmarks: 'A media cuadra de la Comisaría',
    coordinates: { top: '20%', left: '40%' },
    phone: '4444-8822',
    whatsapp: '541133221100',
    hours: '8 AM - 8 PM (Urgencias 24hs)',
    description: 'Soluciones rápidas para tu hogar. Cerrajería, electricidad y plomería.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b16',
    categoryId: 'services',
    name: 'Lavadero "Burbujas"',
    type: 'Lavadero de Ropa',
    rating: 4.5,
    reviewCount: 30,
    distance: 0.6,
    image: 'https://images.unsplash.com/photo-1545173153-5c055fc65c15?q=80&w=1200&auto=format&fit=crop',
    address: 'Roma 450',
    landmarks: 'Cerca de la escuela 10',
    coordinates: { top: '10%', left: '55%' },
    phone: '4444-1111',
    whatsapp: '541111112222',
    hours: '8 AM - 7 PM',
    description: 'Lavado, secado y planchado impecable.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b28',
    categoryId: 'services',
    name: 'Inmobiliaria "Casanova"',
    type: 'Inmobiliaria',
    rating: 4.8,
    reviewCount: 55,
    distance: 0.2,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 200',
    landmarks: 'Frente al banco',
    coordinates: { top: '45%', left: '35%' },
    phone: '4444-5555',
    whatsapp: '541155556666',
    hours: '9 AM - 6 PM',
    description: 'Venta, alquiler y tasaciones con confianza.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b29',
    categoryId: 'services',
    name: 'Estudio Jurídico "Pérez"',
    type: 'Abogados',
    rating: 4.9,
    reviewCount: 25,
    distance: 0.1,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 1200',
    landmarks: 'Cerca del juzgado',
    coordinates: { top: '50%', left: '20%' },
    phone: '4444-7777',
    whatsapp: '541177779999',
    hours: '9 AM - 5 PM',
    description: 'Asesoramiento legal integral.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // HEALTH (Salud) - 4
  {
    id: 'b9',
    categoryId: 'health',
    name: 'Farmacia La Nueva',
    type: 'Farmacia y Perfumería',
    rating: 4.6,
    reviewCount: 140,
    distance: 0.2,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 400',
    landmarks: 'Frente a la clínica de la mujer',
    coordinates: { top: '45%', left: '15%' },
    phone: '4444-7733',
    whatsapp: '541155443322',
    hours: '8 AM - 10 PM',
    description: 'Atención farmacéutica y amplia variedad en perfumería.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b10',
    categoryId: 'health',
    name: 'Consultorio Dental "Sonrisas"',
    type: 'Odontología',
    rating: 4.9,
    reviewCount: 78,
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 900',
    landmarks: 'Cerca de la plaza',
    coordinates: { top: '55%', left: '10%' },
    phone: '4444-1122',
    whatsapp: '541111224455',
    hours: '9 AM - 8 PM',
    description: 'Especialistas en implantes y ortodoncia.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b30',
    categoryId: 'health',
    name: 'Óptica "Visión"',
    type: 'Óptica y Contactología',
    rating: 4.7,
    reviewCount: 52,
    distance: 0.3,
    image: 'https://images.unsplash.com/photo-1511732351157-1875f3232266?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 1400',
    landmarks: 'Frente al banco',
    coordinates: { top: '40%', left: '5%' },
    phone: '4444-3333',
    whatsapp: '541133335555',
    hours: '9 AM - 7 PM',
    description: 'Los mejores marcos y cristales para tu vista.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b31',
    categoryId: 'health',
    name: 'Laboratorio "Casanova"',
    type: 'Análisis Clínicos',
    rating: 4.8,
    reviewCount: 45,
    distance: 0.4,
    image: 'https://images.unsplash.com/photo-1579152276506-5d5ec7ac6372?q=80&w=1200&auto=format&fit=crop',
    address: 'Roma 100',
    landmarks: 'Cerca de la clínica',
    coordinates: { top: '20%', left: '15%' },
    phone: '4444-5555',
    whatsapp: '541155557777',
    hours: '7 AM - 12 PM',
    description: 'Resultados rápidos y confiables.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // PETS (Mascotas) - 4
  {
    id: 'b12',
    categoryId: 'pets',
    name: 'Mascotas Felices',
    type: 'Pet Shop y Veterinaria',
    rating: 4.5,
    reviewCount: 60,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop',
    address: 'Juan Manuel de Rosas 12500',
    landmarks: 'Cerca del Hospital Paroissien',
    coordinates: { top: '75%', left: '50%' },
    phone: '4444-0011',
    whatsapp: '541122334455',
    hours: '9 AM - 7 PM',
    description: 'Todo lo que tu mascota necesita: alimento, salud y mimos.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b13',
    categoryId: 'pets',
    name: 'Veterinaria "El Amigo"',
    type: 'Veterinaria 24hs',
    rating: 4.9,
    reviewCount: 120,
    distance: 1.8,
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. Cristianía 2000',
    landmarks: 'Cerca de la rotonda',
    coordinates: { top: '80%', left: '60%' },
    phone: '4444-2222',
    whatsapp: '541122224444',
    hours: '24 Horas',
    description: 'Atención de emergencias y cirugías.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b32',
    categoryId: 'pets',
    name: 'Peluquería Canina "Pichichos"',
    type: 'Peluquería Canina',
    rating: 4.7,
    reviewCount: 45,
    distance: 0.9,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 2500',
    landmarks: 'Cerca del club',
    coordinates: { top: '70%', left: '40%' },
    phone: '4444-4444',
    whatsapp: '541144446666',
    hours: '9 AM - 6 PM',
    description: 'Baño, corte y belleza para tu perro.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b33',
    categoryId: 'pets',
    name: 'Acuario "El Pez"',
    type: 'Acuario y Peces',
    rating: 4.6,
    reviewCount: 32,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 800',
    landmarks: 'Cerca del cine',
    coordinates: { top: '65%', left: '55%' },
    phone: '4444-6666',
    whatsapp: '541166668888',
    hours: '10 AM - 7 PM',
    description: 'Todo para tus peces y acuarios.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // SPORTS (Deportes) - 4
  {
    id: 'b18',
    categoryId: 'sports',
    name: 'Gym Center Casanova',
    type: 'Gimnasio y Fitness',
    rating: 4.9,
    reviewCount: 210,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 2200',
    landmarks: 'Frente al Club Almirante Brown',
    coordinates: { top: '65%', left: '60%' },
    phone: '4444-3344',
    whatsapp: '541188990011',
    hours: '6 AM - 10 PM',
    description: 'El mejor equipamiento y clases personalizadas para tu entrenamiento.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b19',
    categoryId: 'sports',
    name: 'Canchas "El Gol"',
    type: 'Fútbol 5 y 7',
    rating: 4.6,
    reviewCount: 85,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 2500',
    landmarks: 'Cerca de la vía',
    coordinates: { top: '85%', left: '30%' },
    phone: '4444-5555',
    whatsapp: '541155557777',
    hours: '8 AM - 12 AM',
    description: 'Canchas de césped sintético de última generación.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b34',
    categoryId: 'sports',
    name: 'Natatorio "Aqua"',
    type: 'Natación',
    rating: 4.8,
    reviewCount: 110,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 1500',
    landmarks: 'Cerca del parque',
    coordinates: { top: '70%', left: '20%' },
    phone: '4444-7777',
    whatsapp: '541177779999',
    hours: '7 AM - 9 PM',
    description: 'Pileta climatizada y clases para todas las edades.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b35',
    categoryId: 'sports',
    name: 'Pádel "Casanova"',
    type: 'Canchas de Pádel',
    rating: 4.7,
    reviewCount: 62,
    distance: 1.1,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop',
    address: 'Roma 800',
    landmarks: 'Cerca de la fábrica',
    coordinates: { top: '75%', left: '15%' },
    phone: '4444-9999',
    whatsapp: '541199991111',
    hours: '8 AM - 11 PM',
    description: 'Canchas de vidrio y blindex.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },

  // HOME SERVICES (Hogar) - 4
  {
    id: 'b21',
    categoryId: 'home_services',
    name: 'Ferretería El Martillo',
    type: 'Ferretería y Pinturería',
    rating: 4.4,
    reviewCount: 95,
    distance: 0.9,
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1200&auto=format&fit=crop',
    address: 'Roma 350',
    landmarks: 'Cerca del paso a nivel',
    coordinates: { top: '15%', left: '80%' },
    phone: '4444-1111',
    whatsapp: '541155664433',
    hours: '8 AM - 7 PM',
    description: 'Todo para la construcción y refacción de tu casa. Atención personalizada.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b22_home',
    categoryId: 'home_services',
    name: 'Pinturería "Color"',
    type: 'Pinturería',
    rating: 4.7,
    reviewCount: 42,
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?q=80&w=1200&auto=format&fit=crop',
    address: 'Av. de Mayo 1500',
    landmarks: 'Cerca del centro comercial',
    coordinates: { top: '25%', left: '70%' },
    phone: '4444-2222',
    whatsapp: '541122224444',
    hours: '8 AM - 7 PM',
    description: 'Las mejores marcas de pintura y asesoramiento.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b36',
    categoryId: 'home_services',
    name: 'Mueblería "Hogar"',
    type: 'Mueblería',
    rating: 4.8,
    reviewCount: 35,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
    address: 'Indart 3000',
    landmarks: 'Cerca de la rotonda',
    coordinates: { top: '30%', left: '90%' },
    phone: '4444-4444',
    whatsapp: '541144447777',
    hours: '9 AM - 8 PM',
    description: 'Muebles de diseño y calidad para tu casa.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  },
  {
    id: 'b37',
    categoryId: 'home_services',
    name: 'Bazar "El Regalo"',
    type: 'Bazar y Regalería',
    rating: 4.6,
    reviewCount: 28,
    distance: 0.3,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop',
    address: 'Sarmiento 100',
    landmarks: 'Frente a la plaza',
    coordinates: { top: '35%', left: '85%' },
    phone: '4444-6666',
    whatsapp: '541166669999',
    hours: '9 AM - 7 PM',
    description: 'Todo para tu cocina y hogar.',
    photos: [],
    products: [],
    promotions: [],
    reviews: []
  }
];

export const getBusinesses = async (): Promise<Business[]> => {
  if (!isSupabaseConfigured()) return mockBusinesses;
  
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*');
    
    if (error) throw error;
    if (!data || data.length === 0) return mockBusinesses;
    
    return data.map(b => ({
      ...b,
      categoryId: b.category_id,
      reviewCount: b.review_count
    })) as Business[];
  } catch (error) {
    console.error("Error fetching businesses from Supabase:", error);
    return mockBusinesses;
  }
};

export const getBusinessesByCategory = async (categoryId: string): Promise<Business[]> => {
  if (!isSupabaseConfigured()) return mockBusinesses.filter(b => b.categoryId === categoryId);

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('category_id', categoryId);
    
    if (error) throw error;
    if (!data || data.length === 0) return mockBusinesses.filter(b => b.categoryId === categoryId);
    
    return data.map(b => ({
      ...b,
      categoryId: b.category_id,
      reviewCount: b.review_count
    })) as Business[];
  } catch (error) {
    console.error("Error fetching businesses by category from Supabase:", error);
    return mockBusinesses.filter(b => b.categoryId === categoryId);
  }
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  if (!isSupabaseConfigured()) return mockBusinesses.find(b => b.id === id) || null;

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      categoryId: data.category_id,
      reviewCount: data.review_count
    } as Business;
  } catch (error) {
    console.error("Error fetching business by ID from Supabase:", error);
    return mockBusinesses.find(b => b.id === id) || null;
  }
};

export const getPromotions = async (): Promise<Promotion[]> => {
  if (!isSupabaseConfigured()) return mockPromotions;

  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*');
    
    if (error) throw error;
    if (!data || data.length === 0) return mockPromotions;
    
    return data.map(p => ({
      ...p,
      businessId: p.business_id,
      businessName: p.business_name,
      businessType: p.business_type,
      businessLogo: p.business_logo
    })) as Promotion[];
  } catch (error) {
    console.error("Error fetching promotions from Supabase:", error);
    return mockPromotions;
  }
};
