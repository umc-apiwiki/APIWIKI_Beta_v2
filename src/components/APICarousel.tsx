// src/components/APICarousel.tsx
'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API } from '@/types';
import APICard from './APICard';

interface APICarouselProps {
  apis: API[];
  // how many items to advance per button click (unused when using page scroll)
  step?: number;
  visible?: number;
}

export default function APICarousel({ apis, step = 4, visible = 4 }: APICarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Scroll by one 'page' (container width) so exactly `visible` items move into view
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative px-12">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
        aria-label="이전 API"
      >
        <ChevronLeft size={20} />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {apis.map((api) => (
          <div
            key={api.id}
            className="flex-shrink-0"
            style={{ flex: `0 0 calc((100% - ${(visible - 1) * 16}px) / ${visible})` }}
          >
            <APICard api={api} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
        aria-label="다음 API"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
