import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, ChefHat, Award } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';

interface HeroProps {
  settings?: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  const heroTitle = settings?.hero_title || 'Every Celebration Deserves Exceptional Food.';
  const heroDescription =
    settings?.hero_description ||
    'Bringing people together through delicious food, exceptional hospitality, and unforgettable catering experiences.';
  const heroImage =
    settings?.hero_image_url ||
    'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F4] to-[#F1EFE5] pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[#E5E1D5]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8FA58A]/15 border border-[#8FA58A]/30 text-[#244C3A] text-[11px] sm:text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>Premium Catering & Banqueting</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#244C3A] leading-[1.2]">
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-lg text-[#747970] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans px-1">
              {heroDescription}
            </p>

            {/* Mobile-first CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#244C3A] active:bg-[#193629] rounded-xl shadow-sm transition-all"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
              </Link>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#244C3A] bg-white border border-[#244C3A]/20 active:bg-[#F1EFE5] rounded-xl transition-colors shadow-xs"
              >
                <span>Get a Free Quote</span>
              </Link>
            </div>

            {/* Trust Badges on Mobile */}
            <div className="pt-6 sm:pt-8 border-t border-[#E5E1D5] grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-8 h-8 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#244C3A] shrink-0">
                  <ChefHat className="w-4 h-4 text-[#244C3A]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#244C3A]">Master Chefs</h4>
                  <p className="text-[10px] text-[#747970] hidden sm:block">Authentic recipes</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-8 h-8 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#244C3A] shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#244C3A]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#244C3A]">100% Hygiene</h4>
                  <p className="text-[10px] text-[#747970] hidden sm:block">Strict food safety</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 sm:p-0 rounded-lg bg-white/60 sm:bg-transparent">
                <div className="w-8 h-8 rounded-full bg-[#8FA58A]/20 flex items-center justify-center text-[#244C3A] shrink-0">
                  <HeartHandshake className="w-4 h-4 text-[#244C3A]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-[#244C3A]">Royal Hospitality</h4>
                  <p className="text-[10px] text-[#747970] hidden sm:block">Attentive service</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Col */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative rounded-2xl p-2 bg-white shadow-xl border border-[#E5E1D5]">
                <div className="overflow-hidden rounded-xl aspect-[4/3] relative">
                  <img
                    src={heroImage}
                    alt="Akshaya Caterers Grand Food Banquet"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 border border-[#E5E1D5] shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-serif font-bold text-[#244C3A]">100+ Authentic Dishes</p>
                      <p className="text-[10px] text-[#747970]">Weddings • Corporate • Poojas</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#244C3A] text-[#C6A66B] flex items-center justify-center font-bold text-xs">
                      ★
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
