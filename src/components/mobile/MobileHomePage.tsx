// src/components/mobile/MobileHomePage.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MobileBottomNavigation from '@/components/mobile/MobileBottomNavigation';
import MobileSearchModal from '@/components/mobile/MobileSearchModal';
import MobileAPICard from '@/components/mobile/MobileAPICard';
import MobileNewsCard from '@/components/mobile/MobileNewsCard';
import { API, NewsItem } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import styles from './MobileHomePage.module.css';

export default function MobileHomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [popularAPIs, setPopularAPIs] = useState<API[]>([]);
  const [suggestedAPIs, setSuggestedAPIs] = useState<API[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, suggestedRes, categoriesRes] = await Promise.all([
          fetch('/api/apis?sort=popular&limit=4'),
          fetch('/api/apis?status=approved&limit=4'),
          supabase.from('categories').select('name').order('name'),
        ]);

        if (popularRes.ok) {
          const popularData = await popularRes.json();
          setPopularAPIs(popularData.slice(0, 4));
        }

        if (suggestedRes.ok) {
          const suggestedData = await suggestedRes.json();
          setSuggestedAPIs(suggestedData.slice(0, 4));
        }

        // @ts-ignore
        if (categoriesRes.data) {
          // @ts-ignore
          setCategories(categoriesRes.data.map((c) => c.name));
        }

        // Mock news data
        setNewsItems([
          {
            id: '1',
            title: '구글 중국의 비아냐, 2025 경쟁력까지 재발견',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'AI가 코드 짜는 시대, 개발자와 역할과 이름은 다시 묻다',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString(),
          },
          {
            id: '3',
            title: '대기업 공무원 이젠 예약은... 영어학당의 IT개발자들',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'NIA-경기도경제과학진흥원...',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const handleScrollToTop = () => {
    setIsActive(true);
  };

  // 스크롤 컨텐츠에서 상단 스크롤 감지 (맨 위에서 더 위로 올리려고 시도)
  useEffect(() => {
    if (!isActive || !scrollContentRef.current) return;

    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (!scrollContentRef.current) return;
      const scrollTop = scrollContentRef.current.scrollTop;

      // 맨 위에 있을 때만 감지 시작
      if (scrollTop === 0) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !scrollContentRef.current) return;

      const scrollTop = scrollContentRef.current.scrollTop;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // 맨 위에서 아래로 당기는 동작 (50px 이상)
      if (scrollTop === 0 && deltaY > 50) {
        setIsActive(false);
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      startY = 0;
    };

    const scrollElement = scrollContentRef.current;
    scrollElement.addEventListener('touchstart', handleTouchStart);
    scrollElement.addEventListener('touchmove', handleTouchMove);
    scrollElement.addEventListener('touchend', handleTouchEnd);

    return () => {
      scrollElement.removeEventListener('touchstart', handleTouchStart);
      scrollElement.removeEventListener('touchmove', handleTouchMove);
      scrollElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isActive]);

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.logoImage}>
            <Image src="/logo.svg" alt="Logo" fill className="object-contain" priority />
          </div>
          <span className={styles.logoText}>API Wiki</span>
        </div>
        {isAuthenticated && (
          <span className={styles.pointsText}>{(user?.activity_score ?? 0).toLocaleString()}p</span>
        )}
      </header>

      {/* 메인 컨텐츠 */}
      <main className={styles.main}>
        {/* 로고 */}
        <motion.div
          className={styles.logoWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image src="/logo.svg" alt="API Wiki Logo" fill className="object-contain" priority />
        </motion.div>

        {/* 설명 텍스트 */}
        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          개발자가 함께 만드는 API 지식,
          <br />
          실시간으로 업데이트됩니다
        </motion.p>

        {/* 검색바 - 클릭하면 모달 열림 */}
        <motion.div
          className={styles.searchWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={() => setIsSearchModalOpen(true)}
        >
          <div className={styles.searchFakeInput}>
            <span className={styles.searchPlaceholder}>궁금한 API를 검색해보세요</span>
            <div className={styles.searchIcon}>
              <Image src="/mingcute_search-line.svg" alt="Search" width={20} height={20} />
            </div>
          </div>
        </motion.div>

        {/* 카테고리 캐러셀 */}
        <motion.div
          className={styles.carouselWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div ref={scrollRef} onScroll={handleScroll} className={styles.carouselScroll}>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => router.push(`/explore?category=${encodeURIComponent(category)}`)}
                className={styles.categoryButton}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* 프로그레스 인디케이터 */}
          <div className={styles.progressBarWrapper}>
            <div
              className={styles.progressIndicator}
              style={{ left: `calc((100% - 0.6rem) * ${scrollProgress / 100})` }}
            />
          </div>
        </motion.div>
      </main>

      {/* 스크롤 인디케이터 - 하단 고정 (메인 화면에서만 표시) */}
      <motion.button
        className={styles.scrollIndicator}
        onClick={handleScrollToTop}
        animate={{
          opacity: isActive ? 0 : 1,
          y: [0, -6, 0],
        }}
        transition={{
          opacity: { duration: 0.3 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          pointerEvents: isActive ? 'none' : 'auto',
        }}
        aria-label="위로 스크롤"
      >
        <Image src="/nav-arrow-up-solid.svg" alt="Scroll to top" width={24} height={24} />
      </motion.button>

      {/* 스크롤 컨텐츠 섹션 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={styles.scrollContent}
            ref={scrollContentRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* 내릴 때: 역삼각형 (아래쪽 화살표) */}
            <motion.button
              className={styles.downArrow}
              onClick={() => setIsActive(false)}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              aria-label="아래로 스크롤"
            >
              <Image
                src="/nav-arrow-up-solid.svg"
                alt="Scroll down"
                width={24}
                height={24}
                style={{ transform: 'rotate(180deg)' }}
              />
            </motion.button>

            <div className={styles.contentWrapper}>
              {/* Latest News */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Latest News</h2>
                <div
                  className={styles.scrollableSection}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const progress =
                      (target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100;
                    const indicator = target.nextElementSibling?.querySelector(
                      `.${styles.progressIndicator}`
                    ) as HTMLElement;
                    if (indicator) {
                      indicator.style.left = `calc((100% - 0.6rem) * ${progress / 100})`;
                    }
                  }}
                >
                  {newsItems.map((news) => (
                    <div key={news.id} className={styles.cardItem}>
                      <MobileNewsCard news={news} />
                    </div>
                  ))}
                </div>
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressIndicator} />
                </div>
              </section>

              {/* Recent Popular */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Recent Popular</h2>
                <div
                  className={styles.scrollableSection}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const progress =
                      (target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100;
                    const indicator = target.nextElementSibling?.querySelector(
                      `.${styles.progressIndicator}`
                    ) as HTMLElement;
                    if (indicator) {
                      indicator.style.left = `calc((100% - 0.6rem) * ${progress / 100})`;
                    }
                  }}
                >
                  {popularAPIs.map((api) => (
                    <div key={api.id} className={styles.cardItem}>
                      <MobileAPICard api={api} />
                    </div>
                  ))}
                </div>
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressIndicator} />
                </div>
              </section>

              {/* Suggest API */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Suggest API</h2>
                <div
                  className={styles.scrollableSection}
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const progress =
                      (target.scrollLeft / (target.scrollWidth - target.clientWidth)) * 100;
                    const indicator = target.nextElementSibling?.querySelector(
                      `.${styles.progressIndicator}`
                    ) as HTMLElement;
                    if (indicator) {
                      indicator.style.left = `calc((100% - 0.6rem) * ${progress / 100})`;
                    }
                  }}
                >
                  {suggestedAPIs.map((api) => (
                    <div key={api.id} className={styles.cardItem}>
                      <MobileAPICard api={api} />
                    </div>
                  ))}
                </div>
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressIndicator} />
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하단 네비게이션 */}
      <MobileBottomNavigation />

      {/* 검색 모달 */}
      <MobileSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </div>
  );
}
