'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/CartContext';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, ArrowRight, UtensilsCrossed, Calendar, Users, User } from 'lucide-react';
import { SiteSettings } from '@/lib/db/types';

interface CartDrawerProps {
  settings?: SiteSettings;
}

export default function CartDrawer({ settings }: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';

  const handleCheckout = () => {
    if (items.length === 0) return;

    let message = `🍽️ *AKSHAYA CATERERS — MENU ORDER & ENQUIRY*\n`;
    message += `-------------------------------------------\n`;

    if (customerName.trim() || eventDate.trim() || guestCount.trim()) {
      message += `*Customer / Event Details:*\n`;
      if (customerName.trim()) message += `• Name: ${customerName.trim()}\n`;
      if (eventDate.trim()) message += `• Event Date: ${eventDate.trim()}\n`;
      if (guestCount.trim()) message += `• Estimated Guests: ${guestCount.trim()}\n`;
      message += `-------------------------------------------\n`;
    }

    message += `*Selected Dishes & Quantities:*\n`;
    items.forEach((item, index) => {
      const lineTotal = item.price * item.quantity;
      const diet = item.dietary_type === 'veg' ? '[Veg]' : '[Non-Veg]';
      message += `${index + 1}. *${item.name}* ${diet} — Qty: ${item.quantity} (${item.unit || 'portion'}) = ₹${lineTotal.toLocaleString('en-IN')}\n`;
    });

    message += `-------------------------------------------\n`;
    message += `*Total Items:* ${items.length} dishes (${totalCount} total servings)\n`;
    message += `*Estimated Amount:* ₹${totalPrice.toLocaleString('en-IN')}\n\n`;
    message += `Please confirm availability, custom packaging, and booking schedule for our event. Thank you!`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF9F4] h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E1D5] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-[#244C3A] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#C6A66B]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#FAF9F4] leading-tight">
                Your Catering Menu Cart
              </h2>
              <span className="text-[11px] text-[#C6A66B] font-medium">
                {items.length} {items.length === 1 ? 'dish' : 'dishes'} selected ({totalCount} total)
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F1EFE5] flex items-center justify-center text-[#8FA58A]">
                <UtensilsCrossed className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#244C3A]">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#747970] mt-1 max-w-xs">
                  Browse our authentic food menu and click &ldquo;Add to Cart&rdquo; on any dish you want to include in your celebration feast.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 bg-[#244C3A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#193629] transition-colors"
              >
                Browse Delicious Dishes
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isVeg = item.dietary_type === 'veg';
                  const lineTotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-3 border border-[#E5E1D5] shadow-xs flex items-center gap-3"
                    >
                      {/* Image */}
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover border border-[#E5E1D5] shrink-0"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isVeg ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          ></span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-[#244C3A] truncate">
                            {item.name}
                          </h4>
                        </div>

                        <p className="text-[11px] text-[#747970] mt-0.5">
                          ₹{item.price} {item.unit && `/ ${item.unit}`}
                        </p>

                        {/* Quantity Controls */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-[#FAF9F4] border border-[#E5E1D5] rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#244C3A] hover:bg-white transition-colors"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="w-6 text-center text-xs font-bold text-[#244C3A]">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-[#244C3A] hover:bg-white transition-colors"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#244C3A]">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </span>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional Event Details Accordion */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E5E1D5] shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#244C3A]"
                >
                  <span>Add Event / Guest Details (Optional)</span>
                  <span className="text-xs text-[#8FA58A] font-medium">
                    {showDetails ? 'Hide ▲' : 'Add Details ▼'}
                  </span>
                </button>

                {showDetails && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F1EFE5] text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#747970] mb-0.5">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-[#747970] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E5E1D5] bg-[#FAF9F4] text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#747970] mb-0.5">
                          Event Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-3.5 h-3.5 text-[#747970] absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#E5E1D5] bg-[#FAF9F4] text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#747970] mb-0.5">
                          Guest Count
                        </label>
                        <div className="relative">
                          <Users className="w-3.5 h-3.5 text-[#747970] absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            min="10"
                            placeholder="e.g. 200"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-[#E5E1D5] bg-[#FAF9F4] text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E5E1D5] space-y-3">
            {/* Calculation */}
            <div className="space-y-1.5 text-xs text-[#747970]">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-semibold text-[#252923]">{totalCount} servings</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#244C3A] pt-1 border-t border-[#F1EFE5]">
                <span>Estimated Total:</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-[#8FA58A] italic">
                * Final quotation may include volume discounts, serving personnel & live setup.
              </p>
            </div>

            {/* Checkout on WhatsApp */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 bg-[#244C3A] active:bg-[#193629] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#C6A66B]" />
              <span>Checkout & Send via WhatsApp</span>
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                onClick={clearCart}
                className="text-rose-600 hover:underline"
              >
                Clear Cart
              </button>
              <button
                onClick={closeCart}
                className="text-[#747970] hover:text-[#252923]"
              >
                Continue Adding Dishes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
