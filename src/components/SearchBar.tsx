// src/components/SearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  showDropdown?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

export default function SearchBar({ 
  initialQuery = '',
  placeholder = "궁금한 API를 검색해보세요",
  onSearch,
  showDropdown = true,
  onFocusChange
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingAPIs, setTrendingAPIs] = useState<string[]>([]);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed);
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Fetch trending APIs
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/apis?sort=popular&limit=6');
        const result = await response.json();
        if (result.success && result.data) {
          const apiNames = result.data.map((api: any) => api.name);
          setTrendingAPIs(apiNames);
        }
      } catch (error) {
        console.error('Failed to fetch trending APIs:', error);
        // Fallback to default trending
        setTrendingAPIs(['AWS API', 'OpenAI', 'Stripe', 'Twilio', 'SendGrid', 'Firebase']);
      }
    };

    if (showDropdown) {
      fetchTrending();
    }
  }, [showDropdown]);

  // Save search to recent searches
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)]
      .slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

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
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }

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
    saveRecentSearch(searchTerm);
    
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
        className={`relative bg-white rounded-[1.5625rem] transition-all duration-500 ${
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
          className="w-full h-[3.125rem] px-6 pr-[3.125rem] border-0 bg-transparent text-base outline-none relative z-[140]"
          style={{ color: 'var(--text-dark)' }}
        />
        
        <div className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 z-[150] pointer-events-none">
          <Image 
            src="/mingcute_search-line.svg" 
            alt="Search" 
            width={24} 
            height={24}
          />
        </div>
      </div>

      {showResults && showDropdown && (
        <AnimatePresence>
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2.5 bg-white rounded-[1.25rem] overflow-hidden z-[120]"
            style={{
              boxShadow: 'var(--shadow-blue)'
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {recentSearches && recentSearches.length > 0 && (
              <div className="px-[30px] py-[20px] border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                <div className="flex items-center justify-between mb-[0.9375rem]">
                  <div 
                    className="text-base font-semibold flex items-center gap-2" 
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    <Image src="/mdi_recent.svg" alt="Recent" width={20} height={20} />
                    Recent
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecentSearches();
                    }}
                    className="text-[13px] px-3 py-1 rounded-lg transition-colors"
                    style={{ color: 'var(--text-gray)' }}
                    whileHover={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      color: 'var(--text-dark)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    모두 지우기
                  </motion.button>
                </div>
                {recentSearches.map((item, idx) => (
                  <motion.div
                    key={`recent-${idx}`}
                    className="flex items-center py-[0.625rem] text-base cursor-pointer transition-colors gap-[0.625rem] rounded-lg px-3 -mx-3"
                    style={{ color: 'var(--text-dark)' }}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ 
                      backgroundColor: 'rgba(var(--primary-blue-rgb), 0.05)',
                      color: 'var(--primary-blue)',
                      x: 5
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Image src="/mingcute_search-line.svg" alt="Search" width={18} height={18} />
                    {item}
                  </motion.div>
                ))}
              </div>
            )}

            {trendingAPIs && trendingAPIs.length > 0 && (
              <div className="px-[30px] py-[20px]">
                <div 
                  className="text-[16px] font-semibold mb-[15px] flex items-center gap-2" 
                  style={{ color: 'var(--primary-blue)' }}
                >
                  <Image src="/ph_trend-up-bold.svg" alt="Trending" width={20} height={20} />
                  Trending
                </div>
                {trendingAPIs.map((item, idx) => (
                  <motion.div
                    key={`trending-${idx}`}
                    className="flex items-center py-[10px] text-[16px] cursor-pointer transition-colors gap-[10px] rounded-lg px-3 -mx-3"
                    style={{ color: 'var(--text-dark)' }}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ 
                      backgroundColor: 'rgba(var(--primary-blue-rgb), 0.05)',
                      color: 'var(--primary-blue)',
                      x: 5
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Image src="/ph_trend-up-bold.svg" alt="Trending" width={18} height={18} />
                    {item}
                  </motion.div>
                ))}
              </div>
            )}

            {(!recentSearches || recentSearches.length === 0) && (!trendingAPIs || trendingAPIs.length === 0) && (
              <div className="px-[1.875rem] py-10 text-center">
                <div className="text-[3rem] mb-3 opacity-20">🔍</div>
                <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                  검색 기록이 없습니다
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
