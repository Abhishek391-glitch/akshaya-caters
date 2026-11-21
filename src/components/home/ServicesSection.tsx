import Link from 'next/link';
import { MessageSquare, ArrowRight, Check } from 'lucide-react';
import { Service, SiteSettings } from '@/lib/db/types';

interface ServicesSectionProps {
  services: Service[];
  settings?: SiteSettings;
}

export default function ServicesSection({ services, settings }: ServicesSectionProps) {
  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '919876543210';

  const getWhatsAppUrl = (serviceName: string) => {
    const text = `Hello Akshaya Caterers, I am interested in your ${serviceName}. I would like to know more about your catering packages.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="services" className="py-20 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
            Our Hospitality Offerings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A]">
            Premium Catering Services
          </h2>
          <p className="text-sm sm:text-base text-[#747970] leading-relaxed font-sans">
            Whether an auspicious royal wedding, an executive corporate summit, or a cozy intimate celebration, we curate bespoke culinary journeys tailored to perfection.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl overflow-hidden border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={srv.image_url}
                  alt={srv.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 right-4 font-serif text-xl font-bold text-white drop-shadow-sm">
                  {srv.name}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <p className="text-xs text-[#747970] leading-relaxed">
                  {srv.description}
                </p>

                {/* Features List */}
                {srv.features && srv.features.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#F1EFE5]">
                    {srv.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#252923]">
                        <Check className="w-3.5 h-3.5 text-[#244C3A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Card CTAs */}
                <div className="pt-4 border-t border-[#E5E1D5] flex items-center justify-between gap-3">
                  <a
                    href={getWhatsAppUrl(srv.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#244C3A] hover:text-[#193629] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#C6A66B]" />
                    <span>Enquire WhatsApp</span>
                  </a>

                  <Link
                    href={`/contact?service=${encodeURIComponent(srv.name)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#244C3A] hover:text-[#C6A66B] transition-colors"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Services Page CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#244C3A] bg-[#F1EFE5] hover:bg-[#E5E1D5] border border-[#8FA58A]/30 rounded-lg transition-colors"
          >
            <span>Explore All Catering Packages</span>
            <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
