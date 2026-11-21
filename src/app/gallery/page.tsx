import { getGallery, getSiteSettings } from '@/lib/db/adapter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import GalleryClient from '@/components/gallery/GalleryClient';

export const metadata = {
  title: 'Gallery — Akshaya Caterers | Wedding Spreads & Event Photographs',
  description:
    'Browse photographs of our catering setups, wedding banquets, buffet arrangements, and authentic Indian culinary presentations.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const [galleryItems, settings] = await Promise.all([
    getGallery(undefined, true),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar settings={settings} />
      <main className="flex-1">
        <GalleryClient initialItems={galleryItems} />
      </main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </div>
  );
}
