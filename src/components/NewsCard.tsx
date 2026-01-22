// src/components/NewsCard.tsx

import { NewsItem } from '@/types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <a
      href="#"
      className="block bg-white rounded-[15px] overflow-hidden transition-all duration-300 cursor-pointer card-shadow hover:-translate-y-[5px]"
      style={{
        boxShadow: 'var(--shadow-blue)',
        border: '1px solid #2196F3', // Match API Card border
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '2px 2px 20px 4px rgba(33, 150, 243, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-blue)';
      }}
    >
      {/* 이미지 영역 */}
      <div className="w-full h-[180px] bg-[#e0e0e0]" style={{ objectFit: 'cover' }} />

      {/* 컨텐츠 영역 */}
      <div className="p-5">
        <h4
          className="text-[16px] font-semibold mb-2 leading-[1.4] line-clamp-2"
          style={{ color: 'var(--text-dark)' }}
        >
          {news.title}
        </h4>

        <p className="text-[14px] mb-3 line-clamp-2" style={{ color: 'var(--text-gray)' }}>
          {news.content}
        </p>

        <div className="text-[12px]" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
          {news.author}
        </div>
      </div>
    </a>
  );
}
