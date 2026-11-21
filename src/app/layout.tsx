import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#244C3A',
};

export const metadata: Metadata = {
  title: 'Akshaya Caterers — Premium Catering for Weddings & Grand Celebrations',
  description:
    'Bringing people together through exceptional food, authentic Indian flavors, and unforgettable hospitality. Wedding, corporate, and private event catering.',
  keywords: [
    'Akshaya Caterers',
    'premium catering',
    'wedding caterers',
    'traditional Indian catering',
    'veg catering',
    'non veg catering',
    'corporate catering',
  ],
  authors: [{ name: 'Akshaya Caterers' }],
  openGraph: {
    title: 'Akshaya Caterers — Premium Catering & Hospitality',
    description: 'Every Celebration Deserves Exceptional Food. Discover our menus and request a quote.',
    type: 'website',
    locale: 'en_IN',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Akshaya Caterers',
  image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80',
  description:
    'Premier catering services for weddings, corporate celebrations, traditional ceremonies, and social gatherings.',
  servesCuisine: ['South Indian', 'North Indian', 'Traditional Feasts', 'Biryani', 'Chaat'],
  priceRange: '₹₹',
  telephone: '+917075968859',
  openingHours: 'Mo-Su 08:00-22:00',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '42, Heritage Avenue, Near Central Park',
    addressLocality: 'City',
    postalCode: '560001',
    addressCountry: 'IN',
  },
};

import CartWrapper from '@/components/providers/CartWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF9F4] text-[#252923] antialiased selection:bg-[#C6A66B]/30 selection:text-[#244C3A]">
        <CartWrapper>{children}</CartWrapper>
      </body>
    </html>
  );
}
