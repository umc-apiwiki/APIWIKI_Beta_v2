// src/components/mobile/MobileSearchModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Fetch suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/apis?q=${encodeURIComponent(query)}&limit=5`);
        if (response.ok) {
          const result = await response.json();
          const names = result.map((api: { name: string }) => api.name);
          setSuggestions(names);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // 뒤로가기 감지 및 하단 네비게이션 숨김
  useEffect(() => {
    if (!isOpen) return;

    // 하단 네비게이션 숨김을 위해 body에 클래스 추가
    document.body.classList.add('hide-mobile-nav');

    const handlePopState = () => {
      onClose();
    };

    // 모달이 열릴 때 히스토리에 상태 추가
    window.history.pushState({ modalOpen: true }, '');

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // 하단 네비게이션 다시 표시
      document.body.classList.remove('hide-mobile-nav');
    };
  }, [isOpen, onClose]);

  // 스크롤 감지 (아래로 스크롤 시 닫기 - 제거)
  // 맨 위에서 pull-down 동작 감지
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (!modalRef.current) return;
      const scrollTop = modalRef.current.scrollTop;

      // 맨 위에 있을 때만 감지 시작
      if (scrollTop === 0) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !modalRef.current) return;

      const scrollTop = modalRef.current.scrollTop;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // 맨 위에서 아래로 당기는 동작 (50px 이상)
      if (scrollTop === 0 && deltaY > 50) {
        onClose();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      startY = 0;
    };

    const modalElement = modalRef.current;
    modalElement.addEventListener('touchstart', handleTouchStart);
    modalElement.addEventListener('touchmove', handleTouchMove);
    modalElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchmove', handleTouchMove);
      modalElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, onClose]);

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updated = [searchTerm, ...recentSearches.filter((s) => s !== searchTerm)].slice(
      0,
      MAX_RECENT_SEARCHES
    );

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

  const removeRecentSearch = (searchTerm: string) => {
    const updated = recentSearches.filter((s) => s !== searchTerm);
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
          <div className={styles.modal} ref={modalRef}>
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
                  <Image src="/mingcute_search-line.svg" alt="Search" width={20} height={20} />
                </button>
              </div>
            </div>

            {/* 검색 제안 또는 Recent 섹션 */}
            <div className={styles.content}>
              {query.trim().length >= 1 ? (
                /* 자동완성 제안 */
                <>
                  {suggestions.length > 0 && (
                    <>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>검색 제안</span>
                      </div>
                      <div className={styles.recentList}>
                        {suggestions.map((item, idx) => (
                          <div
                            key={`suggestion-${idx}`}
                            className={styles.recentItem}
                            onClick={() => handleSearch(item)}
                          >
                            <div className={styles.recentIcon}>
                              <Image
                                src="/mingcute_search-line.svg"
                                alt="Search"
                                width={20}
                                height={20}
                              />
                            </div>
                            <span className={styles.recentText}>
                              {item.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
                                part.toLowerCase() === query.toLowerCase() ? (
                                  <span key={i} className={styles.highlight}>
                                    {part}
                                  </span>
                                ) : (
                                  part
                                )
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Recent 섹션 */
                recentSearches.length > 0 && (
                  <>
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
                  </>
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
