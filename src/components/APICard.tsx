// src/components/APICard.tsx
'use client';

import Link from 'next/link';
import { Star, Users } from 'lucide-react';
import { API } from '@/types';

interface APICardProps {
  api: API;
}

export default function APICard({ api }: APICardProps) {
  // Use subtle pastel backgrounds and muted text for price badges
  const priceColors = {
    free: 'bg-teal-100 text-teal-800',
    paid: 'bg-red-100 text-red-800',
    mixed: 'bg-amber-100 text-amber-800'
  };

  const priceLabels = {
    free: '무료',
    paid: '유료',
    mixed: '혼합'
  };

  return (
    <Link 
      href={`/api/${api.id}`}
      className="block flex-shrink-0 w-full h-full bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">{api.logo}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{api.name}</h3>
          <p className="text-sm text-gray-500 truncate">{api.company}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Used by {api.users} | ★ {api.rating}
      </p>
      
      <div className="mt-auto flex gap-2">
        <span className={`px-3 py-1 ${priceColors[api.price]} text-xs rounded-full font-medium`}>
          {priceLabels[api.price]}
        </span>
      </div>
    </Link>
  );
}
