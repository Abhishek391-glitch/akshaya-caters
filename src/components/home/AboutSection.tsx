import { CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';

interface AboutSectionProps {
  settings?: SiteSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const title = settings?.about_title || 'Crafting Culinary Memories Since Day One';
  const description =
    settings?.about_description ||
    'At Akshaya Caterers, we treat every event as if it were our own family celebration. From hand-selecting fresh farm produce to masterfully balancing age-old spices, our culinary artisans ensure that every dish served carries the hallmark of authentic flavor, pristine hygiene, and warm Indian hospitality.';
  const imageUrl =
    settings?.about_image_url ||
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80';

  const commitments = [
    'Hand-ground heritage spices with zero artificial coloring or additives',
    'Strict HACCP food safety standards and sanitized preparation kitchens',
    'Experienced culinary artisans with multi-generational festive expertise',
    'Punctual on-site setup, attentive table service, and graceful presentation',
  ];

  return (
    <section id="about" className="py-20 bg-[#F1EFE5] border-y border-[#E5E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-[#E5E1D5] bg-white p-2">
                <div className="overflow-hidden rounded-xl aspect-[4/5] relative">
                  <img
                    src={imageUrl}
                    alt="Chefs of Akshaya Caterers"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <p className="font-serif text-xl font-bold">Uncompromising Quality</p>
                    <p className="text-xs text-white/80 mt-1">Prepared with devotion & utmost hygiene</p>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Card */}
              <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#244C3A] text-[#FAF9F4] p-5 rounded-xl shadow-lg border border-[#C6A66B]/30 max-w-xs">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-[#C6A66B] shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#FAF9F4]">Hospitality with Heart</h4>
                    <p className="text-[11px] text-[#FAF9F4]/70 mt-0.5">Every guest treated like family</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#244C3A]/10 text-[#244C3A] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>About Akshaya Caterers</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A] leading-tight">
              {title}
            </h2>

            <p className="text-base text-[#252923]/80 leading-relaxed font-sans">
              {description}
            </p>

            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-base font-bold text-[#244C3A]">
                Our Food Quality & Hospitality Commitment:
              </h3>
              <ul className="space-y-2.5">
                {commitments.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#747970]">
                    <CheckCircle2 className="w-4 h-4 text-[#244C3A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="border-l-2 border-[#C6A66B] pl-4">
                <span className="block font-serif text-2xl font-bold text-[#244C3A]">100%</span>
                <span className="text-xs text-[#747970]">Hygiene & Fresh Ingredients</span>
              </div>
              <div className="border-l-2 border-[#C6A66B] pl-4">
                <span className="block font-serif text-2xl font-bold text-[#244C3A]">Custom</span>
                <span className="text-xs text-[#747970]">Tailored Event Menus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
