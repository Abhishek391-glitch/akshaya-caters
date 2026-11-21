import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/db/types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-20 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
            Client Words & Appreciation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A]">
            Celebrations We Cherish
          </h2>
          <p className="text-sm text-[#747970] font-sans">
            Hear from families and event hosts who trusted Akshaya Caterers with their milestone gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl p-8 border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#C6A66B]/30 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < test.rating
                          ? 'text-[#C6A66B] fill-[#C6A66B]'
                          : 'text-[#E5E1D5]'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#252923]/90 italic leading-relaxed">
                  "{test.review}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F1EFE5] flex items-center gap-3">
                {test.image_url ? (
                  <img
                    src={test.image_url}
                    alt={test.customer_name}
                    className="w-10 h-10 rounded-full object-cover border border-[#C6A66B]/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#244C3A] text-white flex items-center justify-center font-serif font-bold text-sm">
                    {test.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#244C3A]">
                    {test.customer_name}
                  </h4>
                  <span className="text-[11px] text-[#8FA58A] font-semibold block">
                    {test.event_type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#747970] italic">
            * Curated sample reviews reflecting customer experiences. Full verified guest register available upon request.
          </p>
        </div>
      </div>
    </section>
  );
}
