import { getSiteSettings } from '@/lib/db/adapter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileStickyBar from '@/components/layout/MobileStickyBar';
import ConversionSection from '@/components/home/ConversionSection';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Us & Request a Quote — Akshaya Caterers',
  description:
    'Get in touch with Akshaya Caterers for your wedding, corporate event, or family celebration. Request a free custom catering quotation.',
};

export const dynamic = 'force-dynamic';

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const [settings, resolvedParams] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);

  const defaultService = resolvedParams?.service;
  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Akshaya Caterers, I would like to enquire about your catering services.'
  )}`;

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar settings={settings} />
      <main className="flex-1 bg-[#FAF9F4] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
              We Would Love To Connect
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#244C3A]">
              Contact Akshaya Caterers
            </h1>
            <p className="text-sm sm:text-base text-[#747970] font-sans">
              Have questions about an upcoming event? Request a detailed quotation below, or reach out directly to our master catering team.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href={`tel:${settings?.contact_phone || '+919876543210'}`}
              className="bg-white p-6 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF9F4] border border-[#E5E1D5] group-hover:bg-[#244C3A] flex items-center justify-center text-[#244C3A] group-hover:text-white transition-colors mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#244C3A]">Call Us Directly</h3>
              <p className="text-xs text-[#747970] mt-1">{settings?.contact_phone || '+91 98765 43210'}</p>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF9F4] border border-[#E5E1D5] group-hover:bg-[#244C3A] flex items-center justify-center text-[#244C3A] group-hover:text-[#C6A66B] transition-colors mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#244C3A]">Chat on WhatsApp</h3>
              <p className="text-xs text-[#747970] mt-1">Instant messaging & quotes</p>
            </a>

            <a
              href={`mailto:${settings?.email || 'info@akshayacaterers.com'}`}
              className="bg-white p-6 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF9F4] border border-[#E5E1D5] group-hover:bg-[#244C3A] flex items-center justify-center text-[#244C3A] group-hover:text-white transition-colors mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#244C3A]">Email Enquiries</h3>
              <p className="text-xs text-[#747970] mt-1">{settings?.email || 'info@akshayacaterers.com'}</p>
            </a>

            <div className="bg-white p-6 rounded-xl border border-[#E5E1D5] shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F4] border border-[#E5E1D5] flex items-center justify-center text-[#244C3A] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#244C3A]">Operational Hours</h3>
              <p className="text-xs text-[#747970] mt-1">{settings?.opening_hours || 'Mon-Sun: 8:00 AM – 10:00 PM'}</p>
            </div>
          </div>

          {/* Quotation & General Enquiry Form */}
          <ConversionSection settings={settings} defaultService={defaultService} />
        </div>
      </main>
      <Footer settings={settings} />
      <MobileStickyBar settings={settings} />
    </div>
  );
}
