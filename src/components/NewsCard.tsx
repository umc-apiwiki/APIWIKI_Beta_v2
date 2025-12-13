// src/components/NewsCard.tsx

import { NewsItem } from '@/types';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <a 
      href="#" 
      className="block flex-shrink-0 w-full h-full bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <h4 className="font-semibold text-lg text-gray-900 mb-2">{news.title}</h4>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.content}</p>
      <span className="text-sm text-gray-500 mt-auto">by {news.author}</span>
    </a>
  );
}
