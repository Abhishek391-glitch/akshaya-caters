import { ShieldCheck, Flame, Users, CalendarCheck, Sparkles, HeartHandshake } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: Flame,
      title: 'Freshly Prepared on Site',
      description: 'Hot, aromatic foods prepared in hygienic live stations and insulated mobile kitchens, never served cold.',
    },
    {
      icon: ShieldCheck,
      title: 'Finest Pure Ingredients',
      description: 'We source farm-fresh organic vegetables, premium aged basmati rice, pure desi ghee, and authentic cold-pressed oils.',
    },
    {
      icon: Users,
      title: 'Tailored for Any Event Scale',
      description: 'Effortlessly catering from intimate family gatherings of 30 to grand multi-day royal weddings of 3,000+ guests.',
    },
    {
      icon: Sparkles,
      title: 'Exquisite Presentation',
      description: 'Traditional brassware, elegant chafing platters, floral buffet styling, and immaculate table settings.',
    },
    {
      icon: HeartHandshake,
      title: 'Courteous Uniformed Staff',
      description: 'Extensively trained hospitality captains, waiters, and baristas focused on warm, attentive Indian hospitality.',
    },
    {
      icon: CalendarCheck,
      title: 'Punctual & Stress-Free',
      description: 'Timely setup hours ahead of schedule, seamless coordination with event planners, and complete post-event cleanup.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
            The Akshaya Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A]">
            Why Celebrations Choose Us
          </h2>
          <p className="text-sm text-[#747970] font-sans">
            Our unwavering commitment to authentic recipes, pristine hygiene, and memorable dining experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#FAF9F4] border border-[#E5E1D5] flex items-center justify-center text-[#244C3A] mb-5">
                  <Icon className="w-6 h-6 text-[#244C3A]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#244C3A] mb-2">
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
