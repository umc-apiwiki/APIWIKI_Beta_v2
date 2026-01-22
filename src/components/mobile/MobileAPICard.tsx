// src/components/mobile/MobileAPICard.tsx
'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { API } from '@/types';
import { Star, Users, DollarSign } from 'lucide-react';

interface MobileAPICardProps {
  api: API;
  index?: number;
}

export default function MobileAPICard({ api, index = 0 }: MobileAPICardProps) {
  const priceLabels: Record<string, string> = {
    free: 'Free',
    paid: 'Paid',
    mixed: 'Mixed'
  };

  const getPricingLabel = (pricing: string | object | undefined): string => {
    if (typeof pricing === 'string') {
      return priceLabels[pricing] || 'Free';
    }
    return 'Mixed';
  };

  const formatUsers = (users?: string) => {
    if (!users) return 'N/A';
    const num = parseFloat(users.replace(/[^\d.]/g, ''));
    if (users.includes('B')) return `${num}B`;
    if (users.includes('M')) return `${num}M`;
    if (users.includes('K')) return `${num}K`;
    return users;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/api/${api.id}`}
        className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="p-4">
          {/* 상단: 로고와 기본 정보 */}
          <div className="flex gap-3 mb-3">
            {/* 로고 */}
            <div className="w-16 h-16 min-w-[4rem] rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              {api.logo ? (
                api.logo.length > 4 || api.logo.startsWith('http') || api.logo.startsWith('/') || api.logo.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={api.logo} alt={api.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="text-3xl">{api.logo}</span>
                )
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-gray-900 truncate mb-1">
                {api.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {api.description || 'API 설명이 없습니다.'}
              </p>
            </div>
          </div>

          {/* 하단: 통계 정보 */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              <span>{api.rating || '0.0'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users size={14} className="text-blue-500" />
              <span>{formatUsers(api.users)}</span>
            </div>

            <div className={`flex items-center gap-1 ${
              api.pricing === 'free' ? 'text-green-600' : 
              api.pricing === 'paid' ? 'text-orange-600' : 
              'text-blue-600'
            }`}>
              <DollarSign size={14} />
              <span>{getPricingLabel(api.pricing)}</span>
            </div>
          </div>

          {/* 카테고리 태그 */}
          {api.categories && api.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {api.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                >
                  {category}
                </span>
              ))}
              {api.categories.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{api.categories.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
