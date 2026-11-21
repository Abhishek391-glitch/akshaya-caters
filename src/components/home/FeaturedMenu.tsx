'use client';

import Link from 'next/link';
import { MessageSquare, ArrowRight, Sparkles, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, SiteSettings } from '@/lib/db/types';
import { useCart } from '@/lib/cart/CartContext';

interface FeaturedMenuProps {
  items: MenuItem[];
  settings?: SiteSettings;
}

export default function FeaturedMenu({ items, settings }: FeaturedMenuProps) {
  const { items: cartItems, addItem, updateQuantity } = useCart();
  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';

  const getWhatsAppItemUrl = (itemName: string) => {
    const text = `Hello Akshaya Caterers, I am interested in ${itemName}. Please share more details.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const getCartQuantity = (itemId: string) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu-preview" className="py-14 sm:py-20 bg-[#F1EFE5] border-y border-[#E5E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
              Handpicked Culinary Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A]">
              Featured Food Delicacies
            </h2>
            <p className="text-xs sm:text-sm text-[#747970] font-sans">
              A curated preview of our most celebrated dishes. Add items directly to your cart and checkout on WhatsApp.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#244C3A] hover:bg-[#193629] rounded-xl shadow-sm transition-all shrink-0 self-start md:self-auto"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </Link>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.slice(0, 8).map((item) => {
            const isVeg = item.dietary_type === 'veg';
            const qtyInCart = getCartQuantity(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F1EFE5]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1.5 rounded shadow-xs flex items-center gap-1.5">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    ></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#252923]">
                      {isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Category Pill */}
                  {item.category_name && (
                    <div className="absolute top-3 right-3 bg-[#244C3A]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                      {item.category_name}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#244C3A] leading-snug group-hover:text-[#193629]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#747970] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-3 border-t border-[#F1EFE5] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-[#244C3A]">
                          ₹{item.price}
                        </span>
                        {item.unit && (
                          <span className="text-[10px] text-[#747970] ml-1">
                            / {item.unit}
                          </span>
                        )}
                      </div>

                      <a
                        href={getWhatsAppItemUrl(item.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#747970] hover:text-[#244C3A]"
                        title="Enquire on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#244C3A]" />
                      </a>
                    </div>

                    {/* Add to Cart or Quantity */}
                    {qtyInCart > 0 ? (
                      <div className="flex items-center justify-between bg-[#F1EFE5] border border-[#8FA58A]/40 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, qtyInCart - 1)}
                          className="w-7 h-7 rounded-lg bg-white text-[#244C3A] flex items-center justify-center font-bold shadow-2xs hover:bg-[#FAF9F4] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#244C3A]">
                            {qtyInCart} in cart
                          </span>
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, qtyInCart + 1)}
                          className="w-7 h-7 rounded-lg bg-[#244C3A] text-white flex items-center justify-center font-bold shadow-2xs hover:bg-[#193629] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-[#C6A66B]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addItem(item, 1)}
                        className="w-full py-2 px-3 bg-[#244C3A] active:bg-[#193629] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#193629] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
