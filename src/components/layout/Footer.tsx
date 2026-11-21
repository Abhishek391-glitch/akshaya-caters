import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageSquare, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Akshaya Caterers, I would like to know more about your catering services.'
  )}`;

  return (
    <footer className="bg-[#244C3A] text-[#FAF9F4] pt-16 pb-12 border-t border-[#8FA58A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF9F4] flex items-center justify-center text-[#244C3A]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF9F4]">
                {settings?.business_name || 'Akshaya Caterers'}
              </span>
            </div>
            <p className="text-sm text-[#FAF9F4]/80 leading-relaxed">
              {settings?.footer_description ||
                'Premier catering services for weddings, corporate celebrations, traditional ceremonies, and social gatherings. Delivering pure taste and unforgettable hospitality.'}
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A66B] hover:bg-[#a9884e] text-[#244C3A] font-semibold text-xs rounded-lg transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C6A66B] tracking-wide">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF9F4]/80">
              <li>
                <Link href="/" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  Catering Services
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  Explore Food Menu
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  Photographs & Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#C6A66B] transition-colors flex items-center gap-1.5">
                  About Our Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Catering Services */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C6A66B] tracking-wide">
              Catering Offerings
            </h3>
            <ul className="space-y-2.5 text-sm text-[#FAF9F4]/80">
              <li>
                <Link href="/services#wedding-catering" className="hover:text-[#C6A66B] transition-colors">
                  Grand Wedding Banquets
                </Link>
              </li>
              <li>
                <Link href="/services#corporate-catering" className="hover:text-[#C6A66B] transition-colors">
                  Corporate Luncheons & Dinners
                </Link>
              </li>
              <li>
                <Link href="/services#traditional-celebrations" className="hover:text-[#C6A66B] transition-colors">
                  Traditional Sattvic & Pooja Feasts
                </Link>
              </li>
              <li>
                <Link href="/services#live-food-counters" className="hover:text-[#C6A66B] transition-colors">
                  Live Tandoor & Dosa Stations
                </Link>
              </li>
              <li>
                <Link href="/services#birthday-private-parties" className="hover:text-[#C6A66B] transition-colors">
                  Birthday & Private Gatherings
                </Link>
              </li>
              <li>
                <Link href="/services#custom-catering-packages" className="hover:text-[#C6A66B] transition-colors">
                  Custom Menu Curations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C6A66B] tracking-wide">
              Contact & Hospitality
            </h3>
            <div className="space-y-3 text-sm text-[#FAF9F4]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                <span>{settings?.address || '42, Heritage Avenue, Metro Circle, City - 560001'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <a href={`tel:${settings?.contact_phone || '+919876543210'}`} className="hover:text-[#C6A66B] transition-colors">
                  {settings?.contact_phone || '+91 98765 43210'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <a href={`mailto:${settings?.email || 'info@akshayacaterers.com'}`} className="hover:text-[#C6A66B] transition-colors">
                  {settings?.email || 'info@akshayacaterers.com'}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C6A66B] shrink-0 mt-1" />
                <span>{settings?.opening_hours || 'Monday to Sunday: 8:00 AM – 10:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#FAF9F4]/60 gap-4">
          <p>© {new Date().getFullYear()} {settings?.business_name || 'Akshaya Caterers'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#8FA58A]">Pure Ingredients • Strict Hygiene • Timely Hospitality</span>
            <Link href="/admin/login" className="text-[#C6A66B] hover:underline flex items-center gap-1">
              <span>Admin Management</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
