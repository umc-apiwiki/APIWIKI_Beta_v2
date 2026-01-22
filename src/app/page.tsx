// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SearchBar from '@/components/SearchBar';
import APICard from '@/components/APICard';
import NewsCard from '@/components/NewsCard';
import Header from '@/components/Header';
import CategoryCarousel from '@/components/CategoryCarousel';
import MobileHomePage from '@/components/mobile/MobileHomePage';
import Image from 'next/image';
import { API, NewsItem } from '@/types';

export default function HomePage() {
  const [isActive, setIsActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [popularAPIs, setPopularAPIs] = useState<API[]>([]);
  const [suggestedAPIs, setSuggestedAPIs] = useState<API[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, suggestedRes] = await Promise.all([
          fetch('/api/apis?sort=popular&limit=4'),
          fetch('/api/apis?status=approved&limit=4')
        ]);

        if (popularRes.ok) {
          const popularData = await popularRes.json();
          setPopularAPIs(popularData.slice(0, 4));
        }

        if (suggestedRes.ok) {
          const suggestedData = await suggestedRes.json();
          setSuggestedAPIs(suggestedData.slice(0, 4));
        }

        // Mock news data
        setNewsItems([
          {
            id: '1',
            title: '구글 중국의 비아냐, 2025 경쟁력까지 재발견',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString()
          },
          {
            id: '2',
            title: 'AI가 코드 짜는 시대, 개발자와 역할과 이름은 다시 묻다',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString()
          },
          {
            id: '3',
            title: '대기업 공무원 이첸 에약은... 영어학당의 IT개발자를',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString()
          },
          {
            id: '4',
            title: 'NIA-경기도경제과학진흥원...',
            content: '서울특별 라디오 나우어 모바일',
            author: '서울특별 라디오 | 나우어 모바일',
            date: new Date().toISOString()
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* 모바일 버전 (768px 미만) */}
      <div className="md:hidden">
        <MobileHomePage />
      </div>

      {/* 데스크톱 버전 (768px 이상) */}
      <div className={`hidden md:block min-h-screen relative ${isActive ? 'active' : ''}`} style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* 배경 그라데이션 효과 */}
      <motion.div 
        className="bg-glow"
        style={{
          x: '-50%',
          y: '-50%'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Header Navigation */}
      <Header transparent={!isActive} />

      {/* Hero Section */}
      <motion.main 
        className="relative flex flex-col items-center justify-center min-h-screen text-center"
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isActive ? -300 : 0,
          opacity: isActive ? 0 : 1
        }}
        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        style={{
          zIndex: isActive ? 1 : 50,
          pointerEvents: isActive ? 'none' : 'auto',
          visibility: isActive ? 'hidden' : 'visible'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: searchFocused ? 0 : 1, 
            scale: 1,
            y: 0
          }}
          transition={{ duration: 0.5 }}
          className="mb-2 relative w-[93px] h-[93px]"
        >
          <Image 
            src="/logo.svg" 
            alt="API Wiki Logo" 
            fill
            className="object-contain"
            priority 
          />
        </motion.div>
        <motion.h1 
          className="text-[50px] font-bold m-0 select-none"
          style={{ 
            color: '#1769AA',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: searchFocused ? 0 : 1, 
            y: 0 
          }}
          transition={{ duration: 0.6, delay: searchFocused ? 0 : 0.1 }}
        >
          API Wiki
        </motion.h1>
        <motion.p 
          className="text-[16px] font-bold mt-[10px] mb-[50px] select-none"
          style={{ 
            color: '#145A92',
            pointerEvents: searchFocused ? 'none' : 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: searchFocused ? 0 : 1,
            y: 0
          }}
          transition={{ duration: 0.2 }}
        >
          개발자가 함께 만드는 API 지식, 실시간으로 업데이트됩니다
        </motion.p>

        <motion.div 
          className="w-[800px] mb-[20px] max-w-[90vw]"
          animate={{
            y: searchFocused ? -300 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar onFocusChange={setSearchFocused} />
        </motion.div>

        {/* Category Carousel */}
        <motion.div
          className="mt-0"
          style={{
            pointerEvents: searchFocused ? 'none' : 'auto'
          }}
          animate={{
            opacity: searchFocused ? 0 : 1,
            y: searchFocused ? -10 : 0
          }}
          transition={{ duration: 0.2 }}
        >
          <CategoryCarousel />
        </motion.div>
      </motion.main>

      {/* 올릴 때: 삼각형 (위쪽 화살표) */}
      <motion.div 
        className="fixed left-1/2 -translate-x-1/2 bottom-[30px] cursor-pointer z-[1000]"
        animate={{
          opacity: isActive ? 0 : 1,
          y: [0, -10, 0]
        }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          pointerEvents: isActive ? 'none' : 'auto'
        }}
        onClick={() => setIsActive(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image 
          src="/nav-arrow-up-solid.svg" 
          alt="Up" 
          width={40} 
          height={40}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </motion.div>

      {/* 스크롤 컨텐츠 섹션 */}
      {isActive && (
        <motion.div 
          className="fixed top-[100px] left-0 right-0 bottom-0 overflow-y-auto"
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: 1,
            y: 0
          }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          style={{
            zIndex: 100
          }}
        >
          <div className="grid-container mt-[50px] pb-[50px]">
          {/* Sticky Title */}
          {/* <motion.div 
            className="col-12 text-[30px] font-bold text-center mb-[50px]"
            style={{ color: 'var(--text-dark)' }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            API Wiki
          </motion.div> */}

          {/* 내릴 때: 역삼각형 (아래쪽 화살표) */}
          <motion.div 
            className="col-12 relative mx-auto text-center block mb-[30px] cursor-pointer"
            animate={{
              opacity: isActive ? 1 : 0,
              y: [0, -10, 0]
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              pointerEvents: isActive ? 'auto' : 'none'
            }}
            onClick={() => setIsActive(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image 
              src="/nav-arrow-up-solid.svg" 
              alt="Down" 
              width={40} 
              height={40}
              className="opacity-70 hover:opacity-100 transition-opacity mx-auto"
              style={{ transform: 'rotate(180deg)' }}
            />
          </motion.div>

          {/* Latest News */}
          <motion.section 
            className="mb-16 col-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[24px] font-semibold mb-[30px]" style={{ color: 'var(--text-dark)' }}>
              Latest News
            </h2>
            <div className="grid grid-cols-12 grid-gap-24">
              {newsItems.map((news, index) => (
                <motion.div 
                  key={news.id} 
                  className="col-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <NewsCard news={news} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Recent Popular */}
          <motion.section 
            className="mb-16 col-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[24px] font-semibold mb-[30px]" style={{ color: 'var(--text-dark)' }}>
              Recent Popular
            </h2>
            <div className="grid grid-cols-12 grid-gap-24">
              {popularAPIs.map((api, index) => (
                <motion.div 
                  key={api.id} 
                  className="col-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <APICard api={api} hideCompare={true} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Suggest API */}
          <motion.section
            className="mb-16 col-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[24px] font-semibold mb-[30px]" style={{ color: 'var(--text-dark)' }}>
              Suggest API
            </h2>
            <div className="grid grid-cols-12 grid-gap-24">
              {suggestedAPIs.map((api, index) => (
                <motion.div
                  key={api.id}
                  className="col-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <APICard api={api} hideCompare={true} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
        </motion.div>
      )}
      </div>
    </>
  );
}