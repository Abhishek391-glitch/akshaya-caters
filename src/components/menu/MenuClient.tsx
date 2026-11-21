'use client';

import { useState, useMemo } from 'react';
import { Search, MessageSquare, Utensils, Sparkles, X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { MenuItem, Category, SiteSettings } from '@/lib/db/types';
import { useCart } from '@/lib/cart/CartContext';

interface MenuClientProps {
  categories: Category[];
  initialItems: MenuItem[];
  settings?: SiteSettings;
}

export default function MenuClient({
  categories,
  initialItems,
  settings,
}: MenuClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  const { items: cartItems, addItem, updateQuantity, openCart } = useCart();

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || '917075968859';

  const getWhatsAppItemUrl = (itemName: string) => {
    const text = `Hello Akshaya Caterers, I am interested in ${itemName}. Please share more details.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const getCartQuantity = (itemId: string) => {
    const found = cartItems.find((i) => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category_id !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter !== 'all' && item.dietary_type !== dietaryFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCat = item.category_name?.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [initialItems, selectedCategory, dietaryFilter, searchQuery]);

  return (
    <div className="py-8 sm:py-14 bg-[#FAF9F4] pb-24 md:pb-14">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8FA58A]/20 text-[#244C3A] text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Grand Catering Spread</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#244C3A]">
            Explore Our Delicious Menu
          </h1>
          <p className="text-xs sm:text-base text-[#747970] font-sans">
            Add items directly to your catering cart and send a combined order list to WhatsApp with one tap.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E5E1D5] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#747970] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food items (Biryani, Dosa, Paneer)..."
                className="w-full pl-10 pr-9 py-2.5 text-base sm:text-sm rounded-xl border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#747970] hover:text-[#252923]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary Toggle Pills on Mobile */}
            <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
              <button
                type="button"
                onClick={() => setDietaryFilter('all')}
                className={`py-2 px-2.5 text-xs font-bold rounded-xl transition-colors text-center ${
                  dietaryFilter === 'all'
                    ? 'bg-[#244C3A] text-white shadow-xs'
                    : 'bg-[#F1EFE5] text-[#252923] active:bg-[#E5E1D5]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('veg')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-xl transition-colors text-center ${
                  dietaryFilter === 'veg'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#F1EFE5] text-[#252923] active:bg-[#E5E1D5]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Pure Veg</span>
              </button>
              <button
                type="button"
                onClick={() => setDietaryFilter('non-veg')}
                className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-xl transition-colors text-center ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-[#F1EFE5] text-[#252923] active:bg-[#E5E1D5]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Scrolling Pills */}
          <div className="pt-2 border-t border-[#F1EFE5] flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#244C3A] text-white'
                  : 'bg-[#FAF9F4] text-[#252923] border border-[#E5E1D5] active:bg-[#F1EFE5]'
              }`}
            >
              All Categories ({initialItems.length})
            </button>
            {categories.map((cat) => {
              const count = initialItems.filter((i) => i.category_id === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-[#244C3A] text-white'
                      : 'bg-[#FAF9F4] text-[#252923] border border-[#E5E1D5] active:bg-[#F1EFE5]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Cart Banner */}
        <div className="flex items-center justify-between text-xs text-[#747970] px-1">
          <p>
            Showing <strong className="text-[#244C3A]">{filteredItems.length}</strong> items
          </p>
          <span className="italic text-[11px]">* Indicative catering menu prices</span>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E1D5] p-6 space-y-3">
            <Utensils className="w-10 h-10 text-[#8FA58A] mx-auto opacity-60" />
            <h3 className="font-serif text-lg font-bold text-[#244C3A]">No dishes found</h3>
            <p className="text-xs text-[#747970] max-w-xs mx-auto">
              We couldn't find any dishes matching your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDietaryFilter('all');
              }}
              className="px-4 py-2 bg-[#244C3A] text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => {
            const isVeg = item.dietary_type === 'veg';
            const qtyInCart = getCartQuantity(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E1D5] shadow-xs active:shadow-md sm:hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Food Image */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#F1EFE5]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-105"
                  />

                  {/* Veg / Non-Veg badge */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5">
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
                    <div className="absolute top-2.5 right-2.5 bg-[#244C3A]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                      {item.category_name}
                    </div>
                  )}

                  {/* Popular tag */}
                  {item.is_popular && (
                    <div className="absolute bottom-2 left-2 bg-[#C6A66B] text-[#244C3A] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Popular</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#244C3A] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#747970] mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price and Cart Controls */}
                  <div className="pt-3 border-t border-[#F1EFE5] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[#244C3A]">
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
                        className="p-2 text-[#747970] hover:text-[#244C3A] hover:bg-[#F1EFE5] rounded-lg transition-colors"
                        title="Enquire individually on WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-[#244C3A]" />
                      </a>
                    </div>

                    {/* Add to Cart Button or Quantity Counter */}
                    <div className="w-full">
                      {qtyInCart > 0 ? (
                        <div className="flex items-center justify-between bg-[#F1EFE5] border border-[#8FA58A]/40 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, qtyInCart - 1)}
                            className="w-8 h-8 rounded-lg bg-white text-[#244C3A] flex items-center justify-center font-bold shadow-2xs hover:bg-[#FAF9F4] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-extrabold text-[#244C3A]">
                              {qtyInCart} in cart
                            </span>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </div>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, qtyInCart + 1)}
                            className="w-8 h-8 rounded-lg bg-[#244C3A] text-white flex items-center justify-center font-bold shadow-2xs hover:bg-[#193629] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#C6A66B]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addItem(item, 1)}
                          className="w-full py-2.5 px-3 bg-[#244C3A] active:bg-[#193629] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#193629] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-[#C6A66B]" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Catering Consultation Callout */}
        <div className="bg-[#F1EFE5] rounded-2xl p-6 sm:p-8 border border-[#E5E1D5] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#244C3A]">
              Want a customized multi-course menu for your celebration?
            </h3>
            <p className="text-xs sm:text-sm text-[#747970]">
              Our executive chefs can design personalized tasting menus matching your exact guest count and budget.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello Akshaya Caterers, I would like to design a custom food menu for my event.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-[#244C3A] active:bg-[#193629] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all text-center"
          >
            Design Custom Menu
          </a>
        </div>
      </div>
    </div>
  );
}
