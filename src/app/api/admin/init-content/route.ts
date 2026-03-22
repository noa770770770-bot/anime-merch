import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const initialContent = [
    { key: 'site_title', value: 'Otaku Merch — Premium Israeli Anime Store' },
    { key: 'announcement_bar', value: '🚀 Fast Shipping Across Israel! Free delivery for orders over 300 ₪' },
    { key: 'contact_email', value: 'support@otakumerch.co.il' },
    { key: 'contact_phone', value: '+972-50-000-0000' },
    { key: 'home_hero_title', value: 'Your Ultimate Anime Store' },
    { key: 'home_hero_subtitle', value: 'Discover hand-picked figures, apparel, accessories, and collectibles from your favorite anime series.' },
    { key: 'home_hero_tagline', value: '✦ Premium Anime Merchandise ✦' },
    { key: 'home_hero_cta_primary', value: '🛍️ Shop Now' },
    { key: 'home_hero_cta_secondary', value: '✨ New Arrivals' },
    { key: 'home_hero_image', value: 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000' },
    { key: 'home_categories_title', value: 'Shop by Category' },
    { key: 'home_featured_title', value: 'Featured Products' },
    { key: 'home_newsletter_title', value: 'Stay in the Loop' },
    { key: 'home_newsletter_subtitle', value: 'Get notified about new drops, exclusive deals, and anime news.' },
    { key: 'shop_hero_title', value: 'Shop All Products' },
    { key: 'shop_hero_subtitle', value: 'Exclusive Japanese Collectibles' },
    { key: 'shop_hero_image', value: 'https://images.unsplash.com/photo-1578632738980-4334635c890a?q=80&w=2000&auto=format&fit=crop' },
    { key: 'arrivals_hero_title', value: '✨ New Arrivals' },
    { key: 'arrivals_hero_subtitle', value: 'The Fresh Drops direct from Tokyo' },
    { key: 'nav_shop', value: 'Shop' },
    { key: 'nav_arrivals', value: 'New Arrivals' },
    { key: 'nav_faq', value: 'FAQ' },
    { key: 'nav_contact', value: 'Contact' }
  ];

  try {
    for (const item of initialContent) {
      await prisma.siteContent.upsert({
        where: { key: item.key },
        update: {},
        create: item
      });
    }
    return NextResponse.json({ ok: true, message: 'Content initialized successfully' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
