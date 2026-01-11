// src/components/APICard.tsx
'use client';

import Link from 'next/link';
import { API } from '@/types';

interface APICardProps {
  api: API;
  onToggleCompare?: () => void;
  isCompareSelected?: boolean;
  hideCompare?: boolean;
}

export default function APICard({ api, onToggleCompare, isCompareSelected, hideCompare = false }: APICardProps) {
  const priceLabels = {
    free: 'Free',
    paid: 'Paid',
    mixed: 'Mixed'
  };

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
      className="block w-full h-full min-h-[13rem] relative bg-white rounded-2xl transition-all duration-300 hover:translate-y-[-0.25rem] shadow-card"
    >
      <div className="relative p-5 h-full flex flex-col">
        {/* Top Section: Image and Info */}
        <div className="flex gap-4 mb-3">
          {/* Logo Image */}
          <div 
            className="w-24 h-24 min-w-[6rem] rounded-[10px] flex-shrink-0 bg-white flex items-center justify-center overflow-hidden shadow-image p-8"
          >
            {api.logo ? (
                 api.logo.length > 4 || api.logo.startsWith('http') || api.logo.startsWith('/') || api.logo.startsWith('data:') ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={api.logo} alt={api.name} className="w-full h-full object-contain" />
                 ) : (
                     <span className="text-4xl">{api.logo}</span>
                 )
            ) : (
              <span className="text-xl">📦</span>
            )}
          </div>

          {/* Right Info Column */}
          <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
            {/* Title */}
            <div className="text-gray-900 text-base font-bold font-sans truncate leading-tight">
              {api.name}
            </div>
            
            {/* Metadata Group */}
            <div className="flex flex-col gap-0.5">
              {/* Rating */}
              <div className="text-slate-600 text-xs font-medium font-sans flex items-center gap-1">
                {api.rating ? <span className="text-amber-400">★</span> : null}
                {api.rating ? `${api.rating}` : 'No ratings'}
              </div>
              
              {/* Used By / New Badge */}
              <div className="text-slate-500 text-xs font-medium font-sans">
                {api.users ? `${formatUsers(api.users)}+ uses` : 'New'}
              </div>
              
              {/* Paid/Free Badge */}
              <div className="text-slate-400 text-xs font-medium font-sans uppercase tracking-wide">
                {api.price === 'free' ? 'Free' : api.price === 'paid' ? 'Paid' : 'Mixed'}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`text-slate-600 text-xs font-normal font-sans line-clamp-2 leading-relaxed h-[2.25rem] ${hideCompare ? 'mb-4' : 'mb-8'}`}>
          {api.description}
        </div>

        {/* Compare Button (Absolute bottom positioning to match design intent) */}
        {!hideCompare && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2" onClick={(e) => {
            if (onToggleCompare) {
              e.preventDefault();
              onToggleCompare();
            }
          }}>
            <div className="w-24 h-7 relative group cursor-pointer">
              <div className={`w-24 h-7 absolute rounded-full transition-all shadow-button border-sky-500 border ${isCompareSelected ? 'bg-sky-500' : 'bg-white group-hover:bg-sky-50'}`}
              />
              <div className={`w-full h-full absolute flex items-center justify-center text-xs font-semibold font-sans leading-none ${isCompareSelected ? 'text-white' : 'text-sky-500'}`}>
                {isCompareSelected ? 'Selected' : 'Compare'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
