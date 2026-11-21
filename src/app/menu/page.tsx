import { getCategories, getMenuItems, getSiteSettings } from '@/lib/db/adapter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import MenuClient from '@/components/menu/MenuClient';

export const metadata = {
  title: 'Food Menu — Akshaya Caterers | Authentic Delicacies & Live Counters',
  description:
    'Browse our complete catering menu featuring traditional South Indian breakfast, royal dum biryanis, curries, live chaat stations, and sweets.',
};

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [categories, items, settings] = await Promise.all([
    getCategories(true),
    getMenuItems({ onlyActive: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar settings={settings} />
      <main className="flex-1">
        <MenuClient
          categories={categories}
          initialItems={items}
          settings={settings}
        />
      </main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </div>
  );
}
