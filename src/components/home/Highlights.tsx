import { Crown, Building2, Utensils, Sparkles } from 'lucide-react';

export default function Highlights() {
  const highlights = [
    {
      icon: Crown,
      title: 'Weddings & Celebrations',
      description: 'Royal multi-course feasts and auspicious muhurtham breakfasts prepared with sacred authenticity.',
    },
    {
      icon: Building2,
      title: 'Corporate Catering',
      description: 'Punctual, hygienic executive luncheons, conference high-teas, and annual banquets with professional presentation.',
    },
    {
      icon: Utensils,
      title: 'Custom Food Menus',
      description: 'Hand-tailored cuisines spanning authentic South Indian, North Indian, live tandoor, and street chaats.',
    },
    {
      icon: Sparkles,
      title: 'Quality & Fresh Ingredients',
      description: 'Uncompromising dedication to cold-pressed oils, farm-fresh produce, and authentic heritage spice blends.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FAF9F4] border border-[#E5E1D5] group-hover:bg-[#244C3A] group-hover:border-[#244C3A] flex items-center justify-center text-[#244C3A] group-hover:text-[#C6A66B] transition-colors mb-5">
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#244C3A] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-[#747970] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
