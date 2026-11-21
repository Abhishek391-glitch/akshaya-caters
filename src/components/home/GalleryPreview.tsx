'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '@/lib/db/types';
import Lightbox from '@/components/ui/Lightbox';

interface GalleryPreviewProps {
  items: GalleryItem[];
}

export default function GalleryPreview({ items }: GalleryPreviewProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const displayItems = items.slice(0, 8);

  const handleNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % displayItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + displayItems.length) % displayItems.length);
    }
  };

  return (
    <section id="gallery-preview" className="py-20 bg-[#F1EFE5] border-y border-[#E5E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#8FA58A] block">
              Visual Hospitality Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#244C3A]">
              Celebration Gallery
            </h2>
            <p className="text-sm text-[#747970] font-sans">
              Glimpses of royal wedding feasts, live cooking stations, and gourmet buffet setups we have orchestrated.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#244C3A] bg-white border border-[#244C3A]/20 hover:bg-[#FAF9F4] rounded-lg transition-colors shadow-xs self-start md:self-auto"
          >
            <span>View All Photographs</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C6A66B]" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E5E1D5] shadow-xs cursor-pointer"
            >
              <img
                src={item.image_url}
                alt={item.caption || 'Catering setup photograph'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#244C3A]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
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

      {/* Lightbox Component */}
      {selectedIdx !== null && (
        <Lightbox
          isOpen={selectedIdx !== null}
          onClose={() => setSelectedIdx(null)}
          imageUrl={displayItems[selectedIdx].image_url}
          caption={displayItems[selectedIdx].caption}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </section>
  );
}
