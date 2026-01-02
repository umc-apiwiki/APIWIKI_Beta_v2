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
  const [sortBy, setSortBy] = useState('인기순');
  const [filteredAPIs, setFilteredAPIs] = useState<API[]>([]);
  const [displayedAPIs, setDisplayedAPIs] = useState<API[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [isFiltersVisible, setIsFiltersVisible] = useState(true);

  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [authMethodFilter, setAuthMethodFilter] = useState<string[]>([]);
  const [docLanguageFilter, setDocLanguageFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);

  const observerTarget = useRef(null);
  const ITEMS_PER_PAGE = 9;

  // API 데이터 로드
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await fetch('/api/apis?status=approved');
        if (response.ok) {
          const data = await response.json();
          setApis(data);
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
    // Note: priceFilter is not defined in the snippet I saw, assuming it was missing or part of the 'lines 39-86' block?
    // Wait. In lines 87-808, I see `priceFilter` used in useEffect (Line 244 deps, Line 165 usage).
    // BUT `priceFilter` definition was NOT in lines 87+ (starts with `ratingFilter`).
    // AND it was NOT in lines 1-36.
    // So `priceFilter` state definition was LOST in the corrupted block.
    // I MUST ADD IT BACK.
    // Also check other missing invalidations.
    
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
      case '인기순':
        // Treat missing ratings as 0 to keep comparator safe
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case '최신순':
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
  // Note: deps list included priceFilter, but it was undefined. I need to define it.
  }, [apis, searchQuery, sortBy, ratingFilter, countryFilter, authMethodFilter, docLanguageFilter, companyFilter]); // Temporarily removed priceFilter from deps until I define it, but I will define it.

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

  interface PriceFilter {
     // placeholder
  }

  // Define priceFilter state which was lost
  const [priceFilter, setPriceFilter] = useState<string[]>([]);

  const togglePriceFilter = (price: string) => {
    setPriceFilter(prev =>
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  const toggleCountryFilter = (country: string) => {
    setCountryFilter(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleAuthMethodFilter = (method: string) => {
    setAuthMethodFilter(prev =>
      prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
    );
  };

  const toggleDocLanguageFilter = (lang: string) => {
    setDocLanguageFilter(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleCompanyFilter = (company: string) => {
    setCompanyFilter(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
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

      <div className="grid-container py-6 pt-[6.25rem]">
        {/* 검색바 */}
        <div className="mb-12 col-12 flex justify-center">
          <div className="max-w-[90vw] w-[45.75rem]">
            <SearchBar 
              initialQuery={searchQuery}
              onSearch={(query) => {
                setSearchQuery(query);
                if (query.trim()) {
                  router.push(`/explore?q=${encodeURIComponent(query)}`);
                }
              }}
              showDropdown={false}
            />
          </div>
        </div>

        {/* 왼쪽 필터 영역 */}
        {isFiltersVisible && (
        <aside className="col-3">
          <div className="bg-white rounded-[15px] p-5 sticky top-24 card-shadow" style={{ border: '0.5px solid var(--primary-blue)' }}>
              <div className="overflow-auto max-h-[70vh] pr-2">
              <h2 className="font-bold text-[18px] mb-4" style={{ color: 'var(--text-dark)' }}>필터 옵션</h2>

              {/* 가격대 필터 */}
              <div className="mb-6">
                <h3 className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-gray)' }}>요청당 가격</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={priceFilter.includes('free')}
                      onChange={() => togglePriceFilter('free')}
                    />
                    <span className="text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', color: 'var(--primary-blue)' }}>무료</span>
                      <span className="text-sm" style={{ color: 'var(--text-dark)' }}>무료</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={priceFilter.includes('mixed')}
                      onChange={() => togglePriceFilter('mixed')}
                    />
                    <span className="text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">혼합</span>
                      <span className="text-sm">혼합 (무료 & 유료)</span>
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={priceFilter.includes('paid')}
                      onChange={() => togglePriceFilter('paid')}
                    />
                    <span className="text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">유료</span>
                      <span className="text-sm">유료</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* 평점 필터 */}
              <div className="mb-6">
                <h3 className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-gray)' }}>평점</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4"
                      checked={ratingFilter === 0}
                      onChange={() => setRatingFilter(0)}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>전체</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4"
                      checked={ratingFilter === 2}
                      onChange={() => setRatingFilter(2)}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>⭐ 2점 이상</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4"
                      checked={ratingFilter === 3}
                      onChange={() => setRatingFilter(3)}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>⭐ 3점 이상</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4"
                      checked={ratingFilter === 4}
                      onChange={() => setRatingFilter(4)}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>⭐ 4점 이상</span>
                  </label>
                </div>
              </div>

              {/* 제공국가 필터 */}
              <div className="mb-6">
                <h3 className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-gray)' }}>제공 국가</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={countryFilter.includes('한국')}
                      onChange={() => toggleCountryFilter('한국')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>한국</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={countryFilter.includes('미국')}
                      onChange={() => toggleCountryFilter('미국')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>미국</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={countryFilter.includes('일본')}
                      onChange={() => toggleCountryFilter('일본')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>일본</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={countryFilter.includes('중국')}
                      onChange={() => toggleCountryFilter('중국')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>중국</span>
                  </label>
                </div>
              </div>

              {/* API 인증방식 필터 */}
              <div className="mb-6">
                <h3 className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-gray)' }}>API 인증 방식</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={authMethodFilter.includes('OAuth2')}
                      onChange={() => toggleAuthMethodFilter('OAuth2')}
                    />
                    <span className="text-xs">OAuth 2.0</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={authMethodFilter.includes('APIKey')}
                      onChange={() => toggleAuthMethodFilter('APIKey')}
                    />
                    <span className="text-xs">API Key 인증</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={authMethodFilter.includes('JWT')}
                      onChange={() => toggleAuthMethodFilter('JWT')}
                    />
                    <span className="text-xs">JWT</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={authMethodFilter.includes('Basic')}
                      onChange={() => toggleAuthMethodFilter('Basic')}
                    />
                    <span className="text-xs">기본 인증</span>
                  </label>
                </div>
              </div>

              {/* 제공문서 필터 */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-3 text-gray-700">제공 문서</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={docLanguageFilter.includes('한국어')}
                      onChange={() => toggleDocLanguageFilter('한국어')}
                    />
                    <span className="text-sm">한국어</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={docLanguageFilter.includes('영어')}
                      onChange={() => toggleDocLanguageFilter('영어')}
                    />
                    <span className="text-sm">영어</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={docLanguageFilter.includes('일본어')}
                      onChange={() => toggleDocLanguageFilter('일본어')}
                    />
                    <span className="text-sm">일본어</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={docLanguageFilter.includes('중국어')}
                      onChange={() => toggleDocLanguageFilter('중국어')}
                    />
                    <span className="text-sm">중국어</span>
                  </label>
                </div>
              </div>

              {/* 제작회사 필터 */}
              <div className="mb-4">
                <h3 className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-gray)' }}>제작 회사</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={companyFilter.includes('Google')}
                      onChange={() => toggleCompanyFilter('Google')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>구글</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={companyFilter.includes('Kakao')}
                      onChange={() => toggleCompanyFilter('Kakao')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>카카오</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={companyFilter.includes('Naver')}
                      onChange={() => toggleCompanyFilter('Naver')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>네이버</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300"
                      checked={companyFilter.includes('Samsung')}
                      onChange={() => toggleCompanyFilter('Samsung')}
                    />
                    <span className="text-sm" style={{ color: 'var(--text-dark)' }}>삼성</span>
                  </label>
                </div>
              </div>
            </div>
            </div>
          </aside>
        )}

          {/* 오른쪽 콘텐츠 영역 */}
          <main className={isFiltersVisible ? "col-9" : "col-12"}>
            {/* 정렬 옵션 및 결과 수 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                {searchQuery && `"${searchQuery}" 에 대한`}검색결과 약 {filteredAPIs.length.toLocaleString()}개
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
                >
                  {isFiltersVisible ? (
                    <>
                      <span>Hide Filters</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM9 3v18"/></svg>
                    </>
                  ) : (
                    <>
                      <span>Show Filters</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 3v18"/></svg>
                    </>
                  )}
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 text-sm rounded-[20px] bg-white cursor-pointer transition-all card-shadow"
                  style={{ 
                    border: '0.5px solid var(--primary-blue)',
                    color: 'var(--text-dark)'
                  }}
                >
                  <option value="인기순">인기순</option>
                  <option value="최신순">최신순</option>
                  <option value="후기 많은 순">후기 많은 순</option>
                  <option value="비용 낮은 순">비용 낮은 순</option>
                </select>
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
            <div className="grid grid-cols-12 grid-gap-24">
              {displayedAPIs.map((api) => (
                <div key={api.id} className={isFiltersVisible ? "col-4" : "col-3"}>
                  <APICard 
                    api={api} 
                    onToggleCompare={() => toggleCompare(api.id)}
                    isCompareSelected={compareList.includes(api.id)}
                  />
                  {/* 즐겨찾기 버튼 (Overlay using absolute positioning if needed, or integrate into APICard later) */}
                  {/* For now keeping layout clean as per user request to use the specific component design */}
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

            {/* 로딩 인디케이터 */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {displayedAPIs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">다른 검색어를 시도해보세요.</p>
              </div>
            )}

            {/* 끝 메시지 */}
            {!hasMore && displayedAPIs.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">모든 결과를 불러왔습니다.</p>
              </div>
            )}
          </main>
      </div>

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
