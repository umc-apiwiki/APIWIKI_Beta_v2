// src/components/mobile/MobileHomePage.tsx
'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MobileBottomNavigation from './MobileBottomNavigation';
import SearchBar from '@/components/SearchBar';
import { categories } from '@/data/mockData';
import styles from './MobileHomePage.module.css';

export default function MobileHomePage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <div className={styles.logoImage}>
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              fill
              className="object-contain"
              priority 
            />
          </div>
          <span className={styles.logoText}>
            API Wiki
          </span>
        </div>
        <button 
          onClick={() => router.push('/profile')}
          className={styles.notificationBtn}
          aria-label="알림"
        >
          <Bell size={20} className="text-sky-900" />
        </button>
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
          <Image 
            src="/logo.svg" 
            alt="API Wiki Logo" 
            fill
            className="object-contain"
            priority 
          />
        </motion.div>

        {/* 설명 텍스트 */}
        <motion.p 
          className={styles.description}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          개발자가 함께 만드는 API 지식,<br/>실시간으로 업데이트됩니다
        </motion.p>

        {/* 검색바 - 데스크탑 컴포넌트 사용 */}
        <motion.div 
          className={styles.searchWrapper}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SearchBar 
            placeholder="궁금한 API를 검색해보세요"
            showDropdown={true}
          />
        </motion.div>

        {/* 카테고리 캐러셀 */}
        <motion.div 
          className={styles.carouselWrapper}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className={styles.carouselScroll}
          >
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

        {/* 스크롤 인디케이터 */}
        <motion.div 
          className={styles.scrollIndicator}
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown size={20} className="text-neutral-300" />
        </motion.div>
      </main>

      {/* 하단 네비게이션 */}
      <MobileBottomNavigation />
    </div>
  );
}
