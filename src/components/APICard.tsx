// src/components/APICard.tsx
'use client';

import Link from 'next/link';
import { API } from '@/types';

interface APICardProps {
  api: API;
}

export default function APICard({ api }: APICardProps) {
  const priceLabels = {
    free: 'Free',
    paid: 'Paid',
    mixed: 'Mixed'
  };

  // 사용자 수 포맷팅
  const formatUsers = (users: string) => {
    const num = parseFloat(users.replace(/[^\d.]/g, ''));
    if (users.includes('B')) return `${num}B`;
    if (users.includes('M')) return `${num}M`;
    if (users.includes('K')) return `${num}K`;
    return users;
  };

  return (
    <Link 
      href={`/api/${api.id}`}
      className="flex items-center gap-4 p-5 bg-white rounded-[15px] cursor-pointer transition-all duration-300 card-shadow hover:translate-x-[5px]"
      style={{
        border: '0.5px solid var(--primary-blue)',
        boxShadow: 'var(--shadow-blue)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '2px 2px 20px 4px rgba(33, 150, 243, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-blue)';
      }}
    >
      {/* API 아이콘 */}
      <div 
        className="w-[60px] h-[60px] rounded-[12px] flex items-center justify-center text-[24px] flex-shrink-0"
        style={{ background: '#f0f0f0' }}
      >
        {api.logo}
      </div>

      {/* API 정보 */}
      <div className="flex-1 min-w-0">
        <h3 
          className="text-[18px] font-semibold mb-1 truncate"
          style={{ color: 'var(--text-dark)' }}
        >
          {api.name}
        </h3>
        <p 
          className="text-[14px]"
          style={{ color: 'var(--text-gray)' }}
        >
          Star {api.rating} • Used by {formatUsers(api.users)} people • {priceLabels[api.price]}
        </p>
      </div>
    </Link>
  );
}
