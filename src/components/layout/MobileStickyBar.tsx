'use client';

import Link from 'next/link';
import { Phone, MessageSquare, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';
import { useCart } from '@/lib/cart/CartContext';

interface MobileStickyBarProps {
  settings?: SiteSettings;
}

export default function MobileStickyBar({ settings }: MobileStickyBarProps) {
  const { totalCount, totalPrice, openCart } = useCart();
  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Akshaya Caterers, I am looking for catering services for an upcoming celebration.'
  )}`;
  const phone = settings?.contact_phone || '+91 70759 68859';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex flex-col pointer-events-none">
      {/* Floating Active Cart Pill Banner (When items are in cart) */}
      {totalCount > 0 && (
        <div className="px-3 pb-2 pointer-events-auto max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={openCart}
            className="w-full bg-[#244C3A] text-white py-2.5 px-4 rounded-xl shadow-lg border border-[#C6A66B]/40 flex items-center justify-between transition-transform active:scale-98"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#C6A66B] text-[#244C3A] font-extrabold text-[10px] flex items-center justify-center">
                {totalCount}
              </span>
              <span className="text-xs font-bold text-[#FAF9F4]">
                Cart: ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="bg-[#FAF9F4]/98 border-t border-[#E5E1D5] px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md pointer-events-auto">
        <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
          {/* Cart Icon */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex flex-col items-center justify-center py-2 px-1 bg-[#F1EFE5] active:bg-[#E5E1D5] text-[#244C3A] border border-[#8FA58A]/30 rounded-xl text-center shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#244C3A] mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Cart</span>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#244C3A] text-white text-[9px] font-extrabold flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 bg-[#244C3A] active:bg-[#193629] text-white rounded-xl text-center shadow-xs transition-transform active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-[#C6A66B] mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
          </a>

          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center justify-center py-2 px-1 bg-white active:bg-[#F1EFE5] text-[#244C3A] border border-[#8FA58A]/30 rounded-xl text-center shadow-xs transition-transform active:scale-95"
          >
            <Phone className="w-4 h-4 text-[#244C3A] mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Call Now</span>
          </a>

          <Link
            href="/contact"
            className="flex flex-col items-center justify-center py-2 px-1 bg-[#C6A66B] active:bg-[#a9884e] text-[#244C3A] rounded-xl text-center font-bold shadow-xs transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#244C3A] mb-0.5" />
            <span className="text-[10px] font-extrabold tracking-tight">Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
