const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialContent = [
  // Global
  { key: 'site_title', value: 'Otaku Merch — Premium Israeli Anime Store' },
  { key: 'announcement_bar', value: '🚀 Fast Shipping Across Israel! Free delivery for orders over 300 ₪' },
  { key: 'contact_email', value: 'support@otakumerch.co.il' },
  { key: 'contact_phone', value: '+972-50-000-0000' },
  
  // Home - Hero
  { key: 'home_hero_title', value: 'Your Ultimate Anime Store' },
  { key: 'home_hero_subtitle', value: 'Discover hand-picked figures, apparel, accessories, and collectibles from your favorite anime series.' },
  { key: 'home_hero_tagline', value: '✦ Premium Anime Merchandise ✦' },
  { key: 'home_hero_cta_primary', value: '🛍️ Shop Now' },
  { key: 'home_hero_cta_secondary', value: '✨ New Arrivals' },
  { key: 'home_hero_image', value: 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000' },
  
  // Home - Sections
  { key: 'home_categories_title', value: 'Shop by Category' },
  { key: 'home_featured_title', value: 'Featured Products' },
  { key: 'home_newsletter_title', value: 'Stay in the Loop' },
  { key: 'home_newsletter_subtitle', value: 'Get notified about new drops, exclusive deals, and anime news.' },
  
  // Shop
  { key: 'shop_hero_title', value: 'Shop All Products' },
  { key: 'shop_hero_subtitle', value: 'Exclusive Japanese Collectibles' },
  { key: 'shop_hero_image', value: 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000' },
  
  // New Arrivals
  { key: 'arrivals_hero_title', value: '✨ New Arrivals' },
  { key: 'arrivals_hero_subtitle', value: 'The Fresh Drops direct from Tokyo' },
  
  // Navigation
  { key: 'nav_shop', value: 'Shop' },
  { key: 'nav_arrivals', value: 'New Arrivals' },
  { key: 'nav_faq', value: 'FAQ' },
  { key: 'nav_contact', value: 'Contact' }
];

async function main() {
  console.log('Initializing Site Content...');
  for (const item of initialContent) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }
  console.log('Done!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
