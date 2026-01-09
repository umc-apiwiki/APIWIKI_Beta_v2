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
    <div ref={wrapperRef} className="relative w-full h-[3.125rem] z-50">
      <motion.div 
        className={`absolute top-0 left-0 w-full bg-white overflow-hidden transition-all duration-300 ease-in-out`}
        animate={{
          height: isFocused && showDropdown && recentSearches.length > 0 ? 'auto' : '3.125rem',
          boxShadow: isFocused ? '1px 1px 5px 2px rgba(33, 150, 243, 0.25)' : '1px 1px 10px 2px rgba(33, 150, 243, 0.25)',
          borderRadius: '1.25rem'
        }}
        style={{
          // 1px 이하로 border를 줄이려면 box-shadow를 사용
          // border: isFocused ? '1px solid #2196F3' : '1px solid var(--primary-blue)', 
          zIndex: 51
        }}
      >
        {/* Input Area - Part of the same box */}
        <div className="relative w-full h-[3.125rem]">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="w-full h-full px-6 pr-[3.125rem] border-0 bg-transparent text-base outline-none text-[var(--text-dark)]"
          />
          <div 
            className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 z-[150] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleSearch}
          >
            <Image 
              src="/mingcute_search-line.svg" 
              alt="Search" 
              width={24} 
              height={24}
            />
          </div>
        </div>

        {/* Results Area - Part of the same box */}
        <AnimatePresence>
          {isFocused && showDropdown && recentSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-6 pb-6 pt-2"
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <div 
                  className="text-sm font-semibold flex items-center gap-2" 
                  style={{ color: '#1769AA' }}
                >
                  Recent
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecentSearches();
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  모두 지우기
                </button>
              </div>
              
              <div className="flex flex-col gap-1">
                {recentSearches.map((item, idx) => (
                  <div
                    key={`recent-${idx}`}
                    className="flex items-center justify-between h-14 cursor-pointer hover:bg-sky-500/10 rounded-[5px] group transition-colors relative"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="opacity-50 flex items-center justify-center">
                         <Image src="/mdi_recent.svg" alt="Recent" width={20} height={20} />
                      </div>
                      <span 
                        className="text-base font-medium text-slate-900"
                      >
                        {item}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter(s => s !== item);
                        setRecentSearches(updated);
                        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
                      }}
                      className="hidden group-hover:block p-1 hover:bg-black/5 rounded-full transition-colors"
                      title="검색어 삭제"
                    >
                      <Image 
                        src="/search_save_remove.svg" 
                        alt="Remove" 
                        width={20} 
                        height={20} 
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Trending section removed for "single box" focused request, or can be kept if desired. 
                  User asked for "Top search, bottom recent history". 
                  I'll keep recent history focus as per request. */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
