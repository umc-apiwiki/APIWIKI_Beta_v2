// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  showDropdown?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
  onFocusChange?: (isFocused: boolean) => void;
}

export default function SearchBar({ 
  initialQuery = '',
  placeholder = "궁금한 API를 검색해보세요",
  onSearch,
  showDropdown = true,
  recentSearches = ['AWS API', 'Google Maps'],
  trendingSearches = ['AWS API', 'OpenAI', 'Stripe', 'Twilio', 'SendGrid', 'Firebase'],
  onFocusChange
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
        onFocusChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onFocusChange]);

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
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setIsFocused(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showDropdown) {
      setShowResults(true);
    }
    onFocusChange?.(true);
  };

  const handleItemClick = (searchTerm: string) => {
    setQuery(searchTerm);
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      router.push(`/explore?q=${encodeURIComponent(searchTerm)}`);
    }
    setShowResults(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div 
        className={`relative bg-white rounded-[30px] transition-all duration-500 ${
          isFocused ? 'card-shadow' : 'border border-[var(--primary-blue)] shadow-[var(--shadow-blue)]'
        }`}
        style={{
          overflow: 'hidden',
          zIndex: 40
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full h-[60px] px-[30px] pr-[60px] border-0 bg-transparent text-[18px] outline-none relative z-[140]"
          style={{ color: 'var(--text-dark)' }}
        />
        
        <div className="absolute right-[25px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] z-[150] pointer-events-none">
          <Image 
            src="/mingcute_search-line.svg" 
            alt="Search" 
            width={28} 
            height={28}
          />
        </div>
      </div>

      {showResults && showDropdown && (
        <div 
          className="mt-[10px] relative z-[120]"
          style={{
            background: 'transparent',
            borderRadius: 0,
            padding: '20px 0 0 0',
            textAlign: 'left'
          }}
        >
          {recentSearches && recentSearches.length > 0 && (
            <div className="px-[40px] py-[10px]">
              <div 
                className="text-[16px] font-semibold mb-[15px]" 
                style={{ color: '#1769AA' }}
              >
                Recent
              </div>
              {recentSearches.map((item, idx) => (
                <div
                  key={`recent-${idx}`}
                  className="flex items-center py-[10px] text-[18px] cursor-pointer transition-colors gap-[8px]"
                  style={{ color: '#071E31' }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#071E31'}
                >
                  <Image src="/mdi_recent.svg" alt="Recent" width={20} height={20} />
                  {item}
                </div>
              ))}
            </div>
          )}

          {trendingSearches && trendingSearches.length > 0 && (
            <div className="px-[40px] py-[10px]">
              <div 
                className="text-[16px] font-semibold mb-[15px]" 
                style={{ color: '#1769AA' }}
              >
                Trending
              </div>
              {trendingSearches.map((item, idx) => (
                <div
                  key={`trending-${idx}`}
                  className="flex items-center py-[10px] text-[18px] cursor-pointer transition-colors gap-[8px]"
                  style={{ color: '#071E31' }}
                  onClick={() => handleItemClick(item)}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#071E31'}
                >
                  <Image src="/ph_trend-up-bold.svg" alt="Trending" width={20} height={20} />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
