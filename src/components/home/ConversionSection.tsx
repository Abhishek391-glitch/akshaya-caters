'use client';

import { useState } from 'react';
import { Phone, MessageSquare, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';

interface ConversionSectionProps {
  settings?: SiteSettings;
  defaultService?: string;
}

export default function ConversionSection({ settings, defaultService }: ConversionSectionProps) {
  const [activeTab, setActiveTab] = useState<'quotation' | 'general'>('quotation');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    event_type: defaultService || 'Wedding',
    event_date: '',
    event_location: '',
    guest_count: '',
    food_preference: 'Both',
    budget: '',
    subject: '',
    message: '',
    hp_company: '', // Honeypot field
  });

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Akshaya Caterers, I would like to discuss catering for an upcoming celebration.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          enquiry_type: activeTab,
          guest_count: formData.guest_count ? Number(formData.guest_count) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSuccessMessage(
        'Thank you! Your quotation request has been received. Our master catering manager will contact you within a few hours.'
      );
      setFormData({
        customer_name: '',
        phone: '',
        email: '',
        event_type: 'Wedding',
        event_date: '',
        event_location: '',
        guest_count: '',
        food_preference: 'Both',
        budget: '',
        subject: '',
        message: '',
        hp_company: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="quote" className="py-12 sm:py-20 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#244C3A] to-[#193629] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl text-white border border-[#C6A66B]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-5 sm:p-10 lg:p-16">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8 flex flex-col justify-between">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#C6A66B] text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get In Touch</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Planning Your Next Celebration?
                </h2>

                <p className="text-xs sm:text-base text-white/80 leading-relaxed font-sans">
                  Let us make your special occasion memorable with delicious food and exceptional catering. Speak directly with our master culinary consultant.
                </p>
              </div>

              {/* Direct Buttons on Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#C6A66B] active:bg-[#a9884e] text-[#244C3A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>

                <a
                  href={`tel:${settings?.contact_phone || '+919876543210'}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white/10 active:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
                >
                  <Phone className="w-4 h-4 text-[#C6A66B]" />
                  <span>Call: {settings?.contact_phone || '+91 98765 43210'}</span>
                </a>
              </div>

              {/* Assurance notes */}
              <div className="border-t border-white/15 pt-4 text-[11px] sm:text-xs text-white/70 space-y-1.5">
                <p>✓ 100% Free custom quotation with sample tasting option</p>
                <p>✓ Transparent per-plate & package pricing with zero hidden charges</p>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-7 bg-white rounded-xl sm:rounded-2xl p-5 sm:p-8 text-[#252923] shadow-lg">
              {/* Tabs */}
              <div className="flex border-b border-[#E5E1D5] mb-5 sm:mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('quotation')}
                  className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                    activeTab === 'quotation'
                      ? 'border-[#244C3A] text-[#244C3A]'
                      : 'border-transparent text-[#747970] hover:text-[#252923]'
                  }`}
                >
                  Catering Quotation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('general')}
                  className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                    activeTab === 'general'
                      ? 'border-[#244C3A] text-[#244C3A]'
                      : 'border-transparent text-[#747970] hover:text-[#252923]'
                  }`}
                >
                  Quick Message
                </button>
              </div>

              {/* Status alerts */}
              {successMessage && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{successMessage}</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 font-bold text-emerald-700 underline text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Speed up your request via WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Honeypot field (hidden from genuine users) */}
                <input
                  type="text"
                  name="hp_company"
                  value={formData.hp_company}
                  onChange={(e) => setFormData({ ...formData, hp_company: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#252923] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="e.g. Anand Sharma"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252923] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#252923] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                  />
                </div>

                {/* Additional Fields for Quotation */}
                {activeTab === 'quotation' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#252923] mb-1">
                          Event Type *
                        </label>
                        <select
                          value={formData.event_type}
                          onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Corporate Event">Corporate Event</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Family Function">Family Function</option>
                          <option value="Other">Other Occasion</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#252923] mb-1">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={formData.event_date}
                          onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#252923] mb-1">
                          Guest Count
                        </label>
                        <input
                          type="number"
                          min="10"
                          placeholder="e.g. 250"
                          value={formData.guest_count}
                          onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#252923] mb-1">
                          Food Preference
                        </label>
                        <select
                          value={formData.food_preference}
                          onChange={(e) => setFormData({ ...formData, food_preference: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                        >
                          <option value="Veg">Pure Vegetarian</option>
                          <option value="Non-Veg">Non-Vegetarian</option>
                          <option value="Both">Both Veg & Non-Veg</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#252923] mb-1">
                          Budget (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹1.5 - 2 Lakhs"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#252923] mb-1">
                        Event Venue / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kalyana Mandapam, City Central"
                        value={formData.event_location}
                        onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#252923] mb-1">
                        Special Requests / Menu Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about your menu preferences, live counter requirements, or service timings..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#252923] mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="What would you like to enquire about?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#252923] mb-1">
                        Your Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-[#244C3A] active:bg-[#193629] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  <Send className="w-4 h-4 text-[#C6A66B]" />
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Quotation Request'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
