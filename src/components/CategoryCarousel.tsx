// src/components/CategoryCarousel.tsx
 'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '@/data/mockData';

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  useEffect(() => {
    const onMouseUp = () => setIsDown(false);
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const onMouseDown: React.MouseEventHandler = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDown(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const onMouseMove: React.MouseEventHandler = (e) => {
    const el = scrollRef.current;
    if (!el || !isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX;
    el.scrollLeft = scrollLeftStart - walk;
  };

  const onTouchStart: React.TouchEventHandler = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDown(true);
    setStartX(e.touches[0].pageX - el.offsetLeft);
    setScrollLeftStart(el.scrollLeft);
  };

  const onTouchMove: React.TouchEventHandler = (e) => {
    const el = scrollRef.current;
    if (!el || !isDown) return;
    const x = e.touches[0].pageX - el.offsetLeft;
    const walk = x - startX;
    el.scrollLeft = scrollLeftStart - walk;
  };

  return (
    <div className="relative max-w-3xl mx-auto mt-0 px-12 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center select-none"
        style={{
          border: '0.5px solid var(--primary-blue)',
          boxShadow: 'var(--shadow-blue)',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        aria-label="이전 카테고리"
      >
        <ChevronLeft size={20} style={{ color: 'var(--primary-blue)' }} />
      </button>
      
      <div 
        ref={scrollRef}
        className={`flex gap-3 overflow-x-auto scrollbar-hide py-2 select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          touchAction: 'pan-y',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setIsDown(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setIsDown(false)}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => router.push(`/explore?category=${encodeURIComponent(category)}`)}
            className="px-5 py-2 bg-white rounded-full transition-all whitespace-nowrap text-base font-medium select-none"
            style={{
              border: '0.5px solid var(--primary-blue)',
              boxShadow: 'var(--shadow-blue)',
              color: 'var(--primary-blue)',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary-blue)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'var(--primary-blue)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
        style={{
          border: '0.5px solid var(--primary-blue)',
          boxShadow: 'var(--shadow-blue)'
        }}
        aria-label="다음 카테고리"
      >
        <ChevronRight size={20} style={{ color: 'var(--primary-blue)' }} />
      </button>
    </div>
  );
}
