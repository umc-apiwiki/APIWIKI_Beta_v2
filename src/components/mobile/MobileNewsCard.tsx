// src/components/mobile/MobileNewsCard.tsx
'use client';

import Link from 'next/link';
import { NewsItem } from '@/types';

interface MobileNewsCardProps {
  news: NewsItem;
}

export default function MobileNewsCard({ news }: MobileNewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <Link
      href={`/news/${news.id}`}
      className="block w-full h-full bg-white rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
      style={{ border: '1px solid #2196F3' }}
    >
      <div className="relative p-3 h-full flex flex-col">
        {/* 제목 */}
        <h3 className="text-gray-900 text-sm font-bold font-sans line-clamp-2 leading-snug mb-1.5">
          {news.title}
        </h3>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.6875rem] text-slate-500 mt-auto">
          <span>{news.author || '익명'}</span>
          <span className="flex-shrink-0">•</span>
          <span className="flex-shrink-0">{formatDate(news.date)}</span>
        </div>
      </div>
    </Link>
  );
}
