import { getServices, getSiteSettings } from '@/lib/db/adapter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Check, Sparkles, ChefHat, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Catering Services — Akshaya Caterers | Weddings, Corporate & Social Galas',
  description:
    'Explore our comprehensive catering packages for weddings, corporate banquets, traditional poojas, birthday parties, and custom events.',
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(true),
    getSiteSettings(),
  ]);

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar settings={settings} />
      <main className="flex-1 bg-[#FAF9F4] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8FA58A]/20 text-[#244C3A] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Dedicated Hospitality</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#244C3A]">
              Our Catering Services
            </h1>
            <p className="text-sm sm:text-base text-[#747970] font-sans">
              From grand royal banquets with 2,000 guests to intimate traditional home poojas, every celebration is executed with immaculate taste, strict hygiene, and warm hospitality.
            </p>
          </div>

          {/* Services Stacked / Detailed Cards */}
          <div className="space-y-12">
            {services.map((srv, idx) => {
              const isEven = idx % 2 === 0;
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello Akshaya Caterers, I am interested in your ${srv.name}. I would like to know more about your catering packages.`
              )}`;

              return (
                <div
                  key={srv.id}
                  id={srv.slug}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D5] shadow-xs hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0"
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-5 relative aspect-[4/3] lg:aspect-auto ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <img
                      src={srv.image_url}
                      alt={srv.name}
                      className="w-full h-full object-cover min-h-[260px] lg:min-h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8FA58A]">
                        Package 0{idx + 1}
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#244C3A]">
                        {srv.name}
                      </h2>
                      <p className="text-sm text-[#747970] leading-relaxed">
                        {srv.description}
                      </p>

                      {srv.features && srv.features.length > 0 && (
                        <div className="pt-2 space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#244C3A]">
                            What's Included:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {srv.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-start gap-2 text-xs text-[#252923]">
                                <Check className="w-4 h-4 text-[#244C3A] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTAs */}
                    <div className="pt-6 border-t border-[#F1EFE5] flex flex-wrap items-center gap-4">
                      <Link
                        href={`/contact?service=${encodeURIComponent(srv.name)}`}
                        className="px-6 py-3 bg-[#244C3A] hover:bg-[#193629] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2"
                      >
                        <span>Request Custom Quotation</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
                      </Link>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 bg-[#8FA58A]/20 hover:bg-[#8FA58A]/35 text-[#244C3A] font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-[#244C3A]" />
                        <span>Discuss on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Consultation Banner */}
          <div className="bg-[#244C3A] rounded-2xl p-8 sm:p-12 text-white text-center space-y-6">
            <h3 className="font-serif text-3xl font-bold">
              Planning a Special Occasion Not Listed Here?
            </h3>
            <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
              We specialize in custom culinary architecture. Contact us with your dates and guest numbers, and our master chefs will design a bespoke menu.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C6A66B] hover:bg-[#a9884e] text-[#244C3A] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
            >
              <span>Get in Touch with Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </div>
  );
}
