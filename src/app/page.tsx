import {
  getSiteSettings,
  getServices,
  getMenuItems,
  getGallery,
  getTestimonials,
} from '@/lib/db/adapter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import Hero from '@/components/home/Hero';
import Highlights from '@/components/home/Highlights';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturedMenu from '@/components/home/FeaturedMenu';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import GalleryPreview from '@/components/home/GalleryPreview';
import Testimonials from '@/components/home/Testimonials';
import ConversionSection from '@/components/home/ConversionSection';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, services, featuredItems, galleryItems, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getServices(true),
      getMenuItems({ featuredOnly: true, onlyActive: true }),
      getGallery(undefined, true),
      getTestimonials(true),
    ]);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar settings={settings} />
      <main className="flex-1">
        <Hero settings={settings} />
        <Highlights />
        <AboutSection settings={settings} />
        <ServicesSection services={services} settings={settings} />
        <FeaturedMenu items={featuredItems} settings={settings} />
        <WhyChooseUs />
        <GalleryPreview items={galleryItems} />
        <Testimonials testimonials={testimonials} />
        <ConversionSection settings={settings} />
      </main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </div>
  );
}
