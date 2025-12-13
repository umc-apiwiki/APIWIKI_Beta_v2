'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { NewsItem } from '@/types';

interface NewsCarouselProps {
  items: NewsItem[];
  step?: number; // how many news cards to move per click
}

export default function NewsCarousel({ items, step = 3, visible = 3 }: NewsCarouselProps & { visible?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative px-12">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
        aria-label="이전 뉴스"
      >
        <ChevronLeft size={20} />
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {items.map((n) => (
          <div key={n.id} className="flex-shrink-0" style={{ flex: `0 0 calc((100% - ${(visible - 1) * 16}px) / ${visible})` }}>
            <NewsCard news={n} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
        aria-label="다음 뉴스"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
