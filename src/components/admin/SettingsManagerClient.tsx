'use client';

import { useState } from 'react';
import { SiteSettings } from '@/lib/db/types';
import { Save, Check, AlertCircle, Sparkles, Building, Phone, Mail, MapPin, Globe } from 'lucide-react';

interface SettingsManagerClientProps {
  initialSettings: SiteSettings;
}

export default function SettingsManagerClient({
  initialSettings,
}: SettingsManagerClientProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        setStatusMessage({
          type: 'error',
          text: 'Admin session expired or unauthenticated. Redirecting to login...',
        });
        setTimeout(() => {
          window.location.href = '/admin/login?from=/admin/settings';
        }, 1200);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');

      setFormData(data);
      setStatusMessage({
        type: 'success',
        text: 'Website settings updated successfully! Public website updated.',
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#244C3A]">
            Website Settings & Branding
          </h2>
          <p className="text-xs text-[#747970] mt-0.5">
            Modify brand name, hero banners, about story, contact numbers, and social URLs.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand & Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E1D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F1EFE5] pb-3">
            <Building className="w-4 h-4 text-[#244C3A]" />
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              Brand Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Business Name
              </label>
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={formData.opening_hours}
                onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Config */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E1D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F1EFE5] pb-3">
            <Sparkles className="w-4 h-4 text-[#244C3A]" />
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              Homepage Hero Section
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Hero Headline
              </label>
              <input
                type="text"
                required
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Hero Supporting Description
              </label>
              <textarea
                rows={2}
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Hero Photograph URL
              </label>
              <input
                type="text"
                value={formData.hero_image_url}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* About Section Config */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E1D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F1EFE5] pb-3">
            <Building className="w-4 h-4 text-[#244C3A]" />
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              About Us Section
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                About Title
              </label>
              <input
                type="text"
                value={formData.about_title}
                onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                About Story & Philosophy
              </label>
              <textarea
                rows={4}
                value={formData.about_description}
                onChange={(e) => setFormData({ ...formData, about_description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E1D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F1EFE5] pb-3">
            <Phone className="w-4 h-4 text-[#244C3A]" />
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              Contact & Lead Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Phone Number (Click to Call)
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                WhatsApp Number (with Country Code)
              </label>
              <input
                type="text"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                placeholder="+919876543210"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Google Maps URL
              </label>
              <input
                type="text"
                value={formData.maps_url}
                onChange={(e) => setFormData({ ...formData, maps_url: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Physical Office / Kitchen Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>
          </div>
        </div>

        {/* Footer & Socials */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E1D5] shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#F1EFE5] pb-3">
            <Globe className="w-4 h-4 text-[#244C3A]" />
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              Footer & Social Links
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#252923] mb-1">
                Footer Short Description
              </label>
              <textarea
                rows={2}
                value={formData.footer_description}
                onChange={(e) => setFormData({ ...formData, footer_description: e.target.value })}
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="text"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252923] mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="text"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <Save className="w-4 h-4 text-[#C6A66B]" />
            <span>{isSubmitting ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
