
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mockBusinesses, mockPromotions } from './mockApiService';

export const seedDatabase = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase no está configurado' };
  }

  try {
    // Seed Businesses
    console.log('Seeding businesses...');
    for (const business of mockBusinesses) {
      const { categoryId, reviewCount, ...rest } = business;
      const { error } = await supabase
        .from('businesses')
        .upsert({
          ...rest,
          category_id: categoryId,
          review_count: reviewCount
        });
      if (error) throw error;
    }
    console.log('Businesses seeded successfully');

    // Seed Promotions
    console.log('Seeding promotions...');
    for (const promo of mockPromotions) {
      const { businessId, businessName, businessType, businessLogo, ...rest } = promo;
      const { error } = await supabase
        .from('promotions')
        .upsert({
          ...rest,
          business_id: businessId,
          business_name: businessName,
          business_type: businessType,
          business_logo: businessLogo
        });
      if (error) throw error;
    }
    console.log('Promotions seeded successfully');

    return { success: true, message: 'Base de datos inicializada correctamente en Supabase' };
  } catch (error: any) {
    console.error("Error seeding database in Supabase:", error);
    const errorMessage = error.message || 'Error al inicializar la base de datos';
    return { success: false, message: `Error: ${errorMessage}` };
  }
};
