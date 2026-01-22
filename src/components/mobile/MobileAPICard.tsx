// src/components/mobile/MobileAPICard.tsx
'use client';

import Link from 'next/link';
import { API } from '@/types';

interface MobileAPICardProps {
  api: API;
}

export default function MobileAPICard({ api }: MobileAPICardProps) {
  // 사용자 수 포맷팅
  const formatUsers = (users?: string) => {
    if (!users) return 'N/A';
    const num = parseFloat(users.replace(/[^\d.]/g, ''));
    if (users.includes('B')) return `${num}B`;
    if (users.includes('M')) return `${num}M`;
    if (users.includes('K')) return `${num}K`;
    return users;
  };

  return (
    <Link
      href={`/api/${api.id}`}
      className="block w-full h-full bg-white rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
      style={{ border: '1px solid #2196F3' }}
    >
      <div className="relative p-3 h-full flex flex-col">
        {/* Top Section: Image and Info */}
        <div className="flex gap-3 mb-2">
          {/* Logo Image */}
          <div className="w-12 h-12 min-w-[3rem] rounded-lg flex-shrink-0 bg-white flex items-center justify-center overflow-hidden shadow-sm p-2">
            {api.logo ? (
              api.logo.length > 4 ||
              api.logo.startsWith('http') ||
              api.logo.startsWith('/') ||
              api.logo.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={api.logo} alt={api.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-xl">{api.logo}</span>
              )
            ) : (
              <span className="text-sm">📦</span>
            )}
          </div>

          {/* Right Info Column */}
          <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
            {/* Title */}
            <div className="text-gray-900 text-sm font-bold font-sans line-clamp-2 leading-tight">
              {api.name}
            </div>

            {/* Metadata Group */}
            <div className="flex flex-col gap-0">
              {/* Rating */}
              <div className="text-slate-600 text-[0.6875rem] font-medium font-sans flex items-center gap-0.5">
                {api.rating ? <span className="text-amber-400 text-xs">★</span> : null}
                {api.rating ? `${api.rating}` : 'No ratings'}
              </div>

              {/* Used By / New Badge */}
              <div className="text-slate-500 text-[0.6875rem] font-medium font-sans">
                {api.users ? `${formatUsers(api.users)}+ uses` : 'New'}
              </div>

              {/* Paid/Free Badge */}
              <div className="text-slate-400 text-[0.6875rem] font-medium font-sans uppercase tracking-wide">
                {api.price === 'free' ? 'FREE' : api.price === 'paid' ? 'PAID' : 'MIXED'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-slate-600 text-[0.6875rem] font-normal font-sans line-clamp-2 leading-snug mt-1">
          {api.description}
        </div>
      </div>
    </Link>
  );
}
