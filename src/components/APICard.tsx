// src/components/APICard.tsx
'use client';

import Link from 'next/link';
import { API } from '@/types';

interface APICardProps {
  api: API;
  onToggleCompare?: () => void;
  isCompareSelected?: boolean;
}

export default function APICard({ api, onToggleCompare, isCompareSelected }: APICardProps) {
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
      className="block w-full h-full min-h-[256px] relative bg-white rounded-2xl transition-all duration-300 hover:translate-y-[-5px]"
      style={{
        boxShadow: '1px 5px 10px 0px rgba(33,150,243,0.25)',
        border: '0.25px solid #0ea5e9' // sky-500
      }}
    >
      <div className="relative p-8 h-full flex flex-col">
        {/* Top Section: Image and Info */}
        <div className="flex gap-6 mb-4">
          {/* Logo Image */}
          <div 
            className="w-20 h-20 rounded-[10px] flex-shrink-0 bg-white flex items-center justify-center overflow-hidden"
            style={{
              boxShadow: '1px 4px 6px 0px rgba(33,150,243,0.25)',
              border: '0.25px solid #0ea5e9'
            }}
          >
            {api.logo ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={api.logo} alt={api.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">📦</span>
            )}
          </div>

          {/* Right Info Column */}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1 justify-center">
            {/* Title */}
            <div className="text-gray-900 text-lg font-bold font-sans truncate leading-tight">
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
        <div className="text-slate-600 text-xs font-normal font-sans line-clamp-2 mb-10 leading-relaxed h-8">
          {api.description}
        </div>

        {/* Compare Button (Absolute bottom positioning to match design intent) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2" onClick={(e) => {
          if (onToggleCompare) {
            e.preventDefault();
            onToggleCompare();
          }
        }}>
          <div className="w-28 h-8 relative group cursor-pointer">
            <div className={`w-28 h-8 absolute rounded-full transition-all ${isCompareSelected ? 'bg-sky-500' : 'bg-white group-hover:bg-sky-50'}`}
                 style={{
                   boxShadow: '0px 2px 4px 0px rgba(33,150,243,0.15)',
                   border: '1px solid #0ea5e9'
                 }} 
            />
            <div className={`w-full h-full absolute flex items-center justify-center text-sm font-semibold font-sans leading-none ${isCompareSelected ? 'text-white' : 'text-sky-500'}`}>
              {isCompareSelected ? 'Selected' : 'Compare'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
