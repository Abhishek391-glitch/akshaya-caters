'use client';

import { useState, useMemo } from 'react';
import { GalleryItem } from '@/lib/db/types';
import Lightbox from '@/components/ui/Lightbox';
import { Maximize2, Sparkles, Camera } from 'lucide-react';

interface GalleryClientProps {
  initialItems: GalleryItem[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Extract unique categories from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ['All', ...Array.from(set)];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return initialItems;
    return initialItems.filter((i) => i.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [initialItems, selectedCategory]);

  const handleNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="py-12 lg:py-16 bg-[#FAF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8FA58A]/20 text-[#244C3A] text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span>Celebration Showcase</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#244C3A]">
            Our Catering Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#747970] font-sans">
            Explore glimpses of our grand wedding spreads, artisanal live counters, authentic traditional feasts, and gourmet dessert tables.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                  isSelected
                    ? 'bg-[#244C3A] text-white shadow-xs'
                    : 'bg-white text-[#252923] border border-[#E5E1D5] hover:bg-[#F1EFE5]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E5E1D5] shadow-xs cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.caption || 'Catering gallery photo'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-[#244C3A]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                <span className="self-end p-1.5 rounded-full bg-white/20">
                  <Maximize2 className="w-4 h-4 text-[#FAF9F4]" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A66B]">
                    {item.category}
                  </span>
                  <p className="text-xs font-medium text-white line-clamp-2 mt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIdx !== null && filteredItems[selectedIdx] && (
        <Lightbox
          isOpen={selectedIdx !== null}
          onClose={() => setSelectedIdx(null)}
          imageUrl={filteredItems[selectedIdx].image_url}
          caption={filteredItems[selectedIdx].caption}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
