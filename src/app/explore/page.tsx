// src/app/explore/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { motion } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import APICard from '@/components/APICard';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CompareModal from '@/components/CompareModal';
import FilterModal from '@/components/FilterModal';
import { searchAPIs, getAllCategories, type SearchFilters } from '@/lib/apiService';
import type { API } from '@/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apis, setApis] = useState<API[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('정확도순');
  const [filteredAPIs, setFilteredAPIs] = useState<API[]>([]);
  const [displayedAPIs, setDisplayedAPIs] = useState<API[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // 필터 상태들
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [authMethodFilter, setAuthMethodFilter] = useState<string[]>([]);
  const [docLanguageFilter, setDocLanguageFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const observerTarget = useRef(null);
  const sortCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ITEMS_PER_PAGE = 9;

  // API 데이터 로드
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await fetch(`/api/apis?status=approved&_t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          const unique = Array.isArray(data)
            ? data.filter((item, idx, arr) => arr.findIndex((v) => v.id === item.id) === idx)
            : [];
          setApis(unique);
        }
      } catch (error) {
        console.error('Error fetching APIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPIs();
  }, []);

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/apis/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // URL 파라미터가 변경되면 상태 업데이트
  useEffect(() => {
    const categoryParam = searchParams.get('category') || '';
    const queryParam = searchParams.get('q') || '';
    setSelectedCategory(categoryParam);
    setSearchQuery(queryParam);
    
    // 검색어가 있으면 기본 정렬을 '정확도순'으로 변경
    if (queryParam) {
      setSortBy('정확도순');
    } else if (sortBy === '정확도순') {
      // 검색어가 사라지면 다시 '인기순'으로 복귀 (선택사항)
      setSortBy('인기순');
    }
  }, [searchParams]);

  // 필터 및 정렬 적용
  useEffect(() => {
    let result = [...apis];

    // Category filter (URL 파라미터에서)
    if (selectedCategory) {
      result = result.filter(api =>
        api.categories && api.categories.some(cat => cat === selectedCategory)
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(api =>
        api.name.toLowerCase().includes(query) ||
        api.description.toLowerCase().includes(query) ||
        (api.company && api.company.toLowerCase().includes(query)) ||
        api.categories.some(cat => cat.toLowerCase().includes(query)) ||
        (api.tags && api.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (api.features && api.features.some(f => f.toLowerCase().includes(query)))
      );
    }

    // Price filter
    if (priceFilter.length > 0) {
      result = result.filter(api => api.price && priceFilter.includes(api.price));
    }

    // Rating filter
    if (ratingFilter > 0) {
      result = result.filter(api => api.rating !== undefined && api.rating >= ratingFilter);
    }

    // Country filter (if mock data has country list)
    if (countryFilter.length > 0) {
      result = result.filter(api => {
        // api may not have countries field; fall back to checking company-country heuristic if available
        // Prefer `api.countries` if present
        // @ts-ignore
        const countries: string[] = api.countries || [];
        if (countries.length > 0) {
          return countryFilter.some(c => countries.includes(c));
        }
        return true; // if no country data, don't filter out
      });
    }

    // Auth method filter
    if (authMethodFilter.length > 0) {
      result = result.filter(api => {
        // @ts-ignore
        const methods: string[] = api.authMethods || [];
        if (methods.length > 0) {
          return authMethodFilter.some(m => methods.includes(m));
        }
        return true;
      });
    }

    // Documentation language filter
    if (docLanguageFilter.length > 0) {
      result = result.filter(api => {
        // @ts-ignore
        const langs: string[] = api.docsLanguages || [];
        if (langs.length > 0) {
          return docLanguageFilter.some(l => langs.includes(l));
        }
        return true;
      });
    }

    // Company filter
    if (companyFilter.length > 0) {
      // Ignore entries without company to satisfy type expectations and avoid false matches
      result = result.filter(api => api.company && companyFilter.includes(api.company));
    }

    // Sort
    switch (sortBy) {
      case '정확도순':
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result.sort((a, b) => {
                const getScore = (api: API) => {
                    let score = 0;
                    const name = api.name.toLowerCase();
                    const desc = api.description.toLowerCase();
                    const company = api.company ? api.company.toLowerCase() : '';
                    
                    if (name === query) score += 100;
                    else if (name.startsWith(query)) score += 80;
                    else if (name.includes(query)) score += 60;
                    
                    if (company.includes(query)) score += 50;
                    if (desc.includes(query)) score += 40;
                    
                    if (api.categories.some(c => c.toLowerCase().includes(query))) score += 20;
                    if (api.tags && api.tags.some(t => t.toLowerCase().includes(query))) score += 20;
                    
                    // Add rating as a tie-breaker
                    score += (api.rating || 0);

                    return score;
                };
                return getScore(b) - getScore(a);
            });
        } else {
            // Fallback if no query
             result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }
        break;
      case '인기순':
        // Treat missing ratings as 0 to keep comparator safe
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case '최신순':
        // Assuming createdat exists, if not fallback to nothing (or id)
        // @ts-ignore
        result.sort((a, b) => new Date(b.createdat || 0).getTime() - new Date(a.createdat || 0).getTime());
        break;
      case '후기 많은 순':
        // Fallback to 0 when users count is missing to keep comparator safe
        result.sort((a, b) => parseFloat(b.users || '0') - parseFloat(a.users || '0'));
        break;
      case '비용 낮은 순':
        result.sort((a, b) => {
          const order: Record<string, number> = { free: 0, mixed: 1, paid: 2 };
          const aPrice = a.price ?? 'paid';
          const bPrice = b.price ?? 'paid';
          return (order[aPrice] ?? 2) - (order[bPrice] ?? 2);
        });
        break;
    }

    setFilteredAPIs(result);
    setDisplayedAPIs(result.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(result.length > ITEMS_PER_PAGE);
  }, [apis, searchQuery, selectedCategory, sortBy, priceFilter, ratingFilter, countryFilter, authMethodFilter, docLanguageFilter, companyFilter]);

  // 무한 스크롤 로드
  const loadMore = useCallback(() => {
    if (!hasMore) return;

    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredAPIs.slice(startIndex, endIndex);

    if (newItems.length > 0) {
      setDisplayedAPIs(prev => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(endIndex < filteredAPIs.length);
    } else {
      setHasMore(false);
    }
  }, [page, filteredAPIs, hasMore]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px 0px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore]);

  // 보조: 윈도우 스크롤 이벤트로도 로드 트리거 (호환성 보완)
  useEffect(() => {
    let ticking = false;
    const throttleMs = 200;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      setTimeout(() => {
        ticking = false;
        if (!hasMore) return;
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 800; // 800px from bottom
        if (scrollPosition >= threshold) {
          loadMore();
        }
      }, throttleMs);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMore, hasMore]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleCompare = (apiId: string) => {
    setCompareList(prev =>
      prev.includes(apiId)
        ? prev.filter(id => id !== apiId)
        : prev.length < 4 ? [...prev, apiId] : prev
    );
  };

  const toggleFavorite = (apiId: string) => {
    setFavorites(prev =>
      prev.includes(apiId)
        ? prev.filter(id => id !== apiId)
        : [...prev, apiId]
    );
  };

  // 필터 적용 핸들러
  const handleApplyFilters = (filters: {
    priceFilter: string[];
    ratingFilter: number;
    countryFilter: string[];
    authMethodFilter: string[];
    docLanguageFilter: string[];
    companyFilter: string[];
  }) => {
    setPriceFilter(filters.priceFilter);
    setRatingFilter(filters.ratingFilter);
    setCountryFilter(filters.countryFilter);
    setAuthMethodFilter(filters.authMethodFilter);
    setDocLanguageFilter(filters.docLanguageFilter);
    setCompanyFilter(filters.companyFilter);
  };

  useEffect(() => {
    return () => {
      if (sortCloseTimer.current) {
        clearTimeout(sortCloseTimer.current);
      }
    };
  }, []);

  const toggleSortDropdown = () => {
    if (sortCloseTimer.current) {
      clearTimeout(sortCloseTimer.current);
    }
    setIsSortOpen(true);
    sortCloseTimer.current = setTimeout(() => setIsSortOpen(false), 2000);
  };

  const handleSortSelect = (option: string) => {
    setSortBy(option);
    setIsSortOpen(false);
    if (sortCloseTimer.current) {
      clearTimeout(sortCloseTimer.current);
    }
  };

  return (
    <motion.div 
      className="min-h-screen" 
      style={{ backgroundColor: 'var(--bg-light)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header */}
      <Header />

      {/* 배경 그라데이션 효과 */}
      <div className="bg-glow" />

      {/* 검색바 - 페이지 최상단 */}
      <div className="w-full flex justify-center" style={{ marginTop: '120px', marginBottom: '2rem' }}>
        <div className="w-[800px] max-w-[90vw]">
          {loading ? (
            <div className="h-[3.25rem] w-full rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
              <SearchBar
                initialQuery={searchQuery}
                onSearch={(query) => {
                  setSearchQuery(query);
                  if (query.trim()) {
                    router.push(`/explore?q=${encodeURIComponent(query)}`);
                  }
                }}
                showDropdown={true}
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid-container py-6">
        {/* 메인 콘텐츠 영역 (Full width now) */}
        <main className="col-12">
          {/* 정렬 옵션 및 결과 수 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
              {searchQuery && `"${searchQuery}" 에 대한`}검색결과 약 {filteredAPIs.length.toLocaleString()}개
            </p>
            <div className="flex items-center gap-4 relative">
              {/* Filter Button */}
              <button 
                onClick={() => setIsFiltersVisible(true)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Hide Filters</span>
                {/* Keeping the text 'Hide Filters' as per screenshot reference if intended, 
                    but logic suggests 'Filters' is better for a modal trigger. 
                    However, user sent screenshot showing 'Hide Filters X'. 
                    Wait, if it's a MODAL, 'Hide Filters' on the page makes no sense. 
                    I will change it to 'Filters' or keep it if user implies the screenshot is the desired look.
                    The screenshot 'uploaded_image_1...' shows 'Hide Filters 3 X' next to 'Sort By'.
                    Actually that looks like 'active filters' or separate functionality.
                    But user said "Change filter to modal". 
                    So on the page, there should be a button to OPEN the modal.
                    I'll name it "Filters" for clarity, or "All Filters". 
                */}
                <span>Filters</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 3v18"/></svg>
              </button>

              {/* Sort By Dropdown (Custom) */}
              <div className="relative">
                <button
                  onClick={toggleSortDropdown}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                >
                  Sort By
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {/* Dropdown Menu */}
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                     <div className="py-2">
                       {['정확도순', '인기순', '최신순', '후기 많은 순', '비용 낮은 순'].map(option => (
                         <button
                           key={option}
                           onClick={() => handleSortSelect(option)}
                           className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === option ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                         >
                           {option}
                         </button>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 비교하기 컨트롤 */}
          {compareList.length > 0 && (
            <div className="rounded-[15px] p-4 mb-6 flex items-center justify-between card-shadow" style={{ 
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              border: '0.5px solid var(--primary-blue)'
            }}>
              <span className="text-sm" style={{ color: 'var(--primary-blue)' }}>
                {compareList.length}개 선택됨 (최대 4개)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCompareList([])}
                  className="px-4 py-2 text-sm bg-white rounded-[20px] transition-all card-shadow"
                  style={{ border: '0.5px solid var(--primary-blue)', color: 'var(--text-dark)' }}
                >
                  초기화
                </button>
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="px-4 py-2 text-sm text-white rounded-[20px] transition-all"
                  style={{ backgroundColor: 'var(--primary-blue)' }}
                  disabled={compareList.length < 2}
                >
                  선택 비교하기
                </button>
              </div>
            </div>
          )}

          {/* API 카드 그리드 */}
          <div className="grid grid-cols-12 gap-4">
            {displayedAPIs.map((api, idx) => (
              <div key={`${api.id}-${idx}`} className="col-3">
                <APICard 
                  api={api} 
                  onToggleCompare={() => toggleCompare(api.id)}
                  isCompareSelected={compareList.includes(api.id)}
                />
                 <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(api.id);
                  }}
                  className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform z-10"
                >
                  {favorites.includes(api.id) ? '⭐' : '☆'}
                </button>
              </div>
            ))}
          </div>

          {/* 로딩 및 결과 없음 UI ... (Existing) */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {displayedAPIs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 검색어를 시도해보세요.</p>
            </div>
          )}

          {!hasMore && displayedAPIs.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">모든 결과를 불러왔습니다.</p>
            </div>
          )}
        </main>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFiltersVisible}
        onClose={() => setIsFiltersVisible(false)}
        priceFilter={priceFilter}
        ratingFilter={ratingFilter}
        countryFilter={countryFilter}
        authMethodFilter={authMethodFilter}
        docLanguageFilter={docLanguageFilter}
        companyFilter={companyFilter}
        onApplyFilters={handleApplyFilters}
        resultCount={filteredAPIs.length}
      />

      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        apis={compareList.map(id => displayedAPIs.find(api => api.id === id)).filter(Boolean) as API[]}
      />
    </motion.div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
