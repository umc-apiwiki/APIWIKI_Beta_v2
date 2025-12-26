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

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('인기순');
  const [filteredAPIs, setFilteredAPIs] = useState<API[]>([]);
  const [displayedAPIs, setDisplayedAPIs] = useState<API[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // 필터 상태
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
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

  // 필터 및 정렬 적용
  useEffect(() => {
    let result = [...apis];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(api =>
        api.name.toLowerCase().includes(query) ||
        api.description.toLowerCase().includes(query) ||
        api.company.toLowerCase().includes(query) ||
        api.categories.some(cat => cat.toLowerCase().includes(query)) ||
        (api.tags && api.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (api.features && api.features.some(f => f.toLowerCase().includes(query)))
      );
    }

    // Price filter
    if (priceFilter.length > 0) {
      result = result.filter(api => priceFilter.includes(api.price));
    }

    // Rating filter
    if (ratingFilter > 0) {
      result = result.filter(api => api.rating >= ratingFilter);
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
      result = result.filter(api => companyFilter.includes(api.company));
    }

    // Sort
    switch (sortBy) {
      case '인기순':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case '최신순':
        break;
      case '후기 많은 순':
        result.sort((a, b) => parseFloat(b.users) - parseFloat(a.users));
        break;
      case '비용 낮은 순':
        result.sort((a, b) => {
          const order = { free: 0, mixed: 1, paid: 2 };
          return order[a.price] - order[b.price];
        });
        break;
    }

    setFilteredAPIs(result);
    setDisplayedAPIs(result.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(result.length > ITEMS_PER_PAGE);
  }, [apis, searchQuery, sortBy, priceFilter, ratingFilter, countryFilter, authMethodFilter, docLanguageFilter, companyFilter]);

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

      <div className="grid-container py-6" style={{ paddingTop: '100px' }}>
        {/* 검색바 */}
        <div className="mb-12 col-12 flex justify-center">
          <div style={{ width: '732px', maxWidth: '90vw' }}>
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

          {/* 오른쪽 콘텐츠 영역 */}
          <main className="col-9">
            {/* 정렬 옵션 및 결과 수 */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                {searchQuery && `"${searchQuery}" 에 대한`}검색결과 약 {filteredAPIs.length.toLocaleString()}개
              </p>
              <div className="flex items-center gap-4">
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
                <div
                  key={api.id}
                  className="col-3 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow relative flex flex-col h-full"
                >
                  {/* 즐겨찾기 버튼 */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(api.id);
                    }}
                    className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform"
                  >
                    {favorites.includes(api.id) ? '⭐' : '☆'}
                  </button>

                  {/* API 카드 내용 */}
                  <Link href={`/api/${api.id}`} className="block flex-1">
                    <div className="text-4xl mb-3">{api.logo}</div>
                    <h3 className="font-bold text-lg mb-2 pr-8">{api.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {api.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3 text-sm">
                      <span className="flex items-center gap-1">
                        <span>⭐</span>
                        <span className="font-semibold">{api.rating}</span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{api.users}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{api.company}</p>
                    <div className="flex items-center justify-between">
                      {api.price === 'free' && (
                        <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full font-medium text-xs">무료</span>
                      )}
                      {api.price === 'paid' && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium text-xs">유료</span>
                      )}
                      {api.price === 'mixed' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium text-xs">혼합</span>
                      )}
                    </div>
                  </Link>

                  {/* 비교하기 체크박스 */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compareList.includes(api.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleCompare(api.id);
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                        disabled={!compareList.includes(api.id) && compareList.length >= 4}
                      />
                      <span className="text-sm text-gray-700">비교하기</span>
                    </label>
                  </div>
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
