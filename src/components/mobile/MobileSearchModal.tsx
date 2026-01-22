// src/components/mobile/MobileSearchModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import styles from './MobileSearchModal.module.css';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;

export default function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)]
      .slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = (searchTerm?: string) => {
    const term = searchTerm || query;
    if (term.trim()) {
      saveRecentSearch(term.trim());
      router.push(`/explore?q=${encodeURIComponent(term)}`);
    } else {
      router.push('/explore');
    }
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const removeRecentSearch = (searchTerm: string) => {
    const updated = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.modal}>
            {/* 검색바 */}
            <div className={styles.searchBar}>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="궁금한 API를 검색해보세요"
                  className={styles.searchInput}
                  autoFocus
                />
                <button 
                  type="button" 
                  onClick={() => handleSearch()}
                  className={styles.searchIcon}
                  aria-label="검색"
                >
                  <Image 
                    src="/mingcute_search-line.svg" 
                    alt="Search" 
                    width={20} 
                    height={20}
                  />
                </button>
              </div>
            </div>

            {/* Recent 섹션 */}
            {recentSearches.length > 0 && (
              <div className={styles.content}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionTitle}>Recent</span>
                </div>

                <div className={styles.recentList}>
                  {recentSearches.map((item, idx) => (
                    <div
                      key={`recent-${idx}`}
                      className={styles.recentItem}
                      onClick={() => handleSearch(item)}
                    >
                      <div className={styles.recentIcon}>
                        <Image src="/mdi_recent.svg" alt="Recent" width={20} height={20} />
                      </div>
                      <span className={styles.recentText}>{item}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(item);
                        }}
                        className={styles.removeButton}
                        aria-label="삭제"
                      >
                        <Image 
                          src="/search_save_remove.svg" 
                          alt="Remove" 
                          width={16} 
                          height={16} 
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
