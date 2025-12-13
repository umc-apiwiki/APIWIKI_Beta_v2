// src/components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  initialQuery = '',
  placeholder = "모든 API를 검색해 보세요",
  onSearch
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query);
    } else {
      if (query.trim()) {
        router.push(`/explore?q=${encodeURIComponent(query)}`);
      } else {
        router.push('/explore');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-2 shadow-lg hover:shadow-xl transition-shadow">
      <Search className="ml-4 text-gray-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 bg-transparent outline-none text-gray-800"
      />
      <button 
        onClick={handleSearch}
        className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 hover:scale-105 transition-all font-medium"
      >
        검색
      </button>
    </div>
  );
}
