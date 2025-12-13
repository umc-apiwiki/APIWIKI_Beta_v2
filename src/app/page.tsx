// src/app/page.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import SearchBar from '@/components/SearchBar';
import CategoryCarousel from '@/components/CategoryCarousel';
import APICarousel from '@/components/APICarousel';
import NewsCarousel from '@/components/NewsCarousel';
import NewsCard from '@/components/NewsCard';
import { mockAPIs, newsItems } from '@/data/mockData';

export default function HomePage() {
  const popularAPIs = mockAPIs.slice(0, 10);
  const suggestedAPIs = mockAPIs.slice(5, 15);

  // const triggerGlitchTipTestError = () => {
  //   const error = new Error('GlitchTip UI test error');
  //   Sentry.captureException(error);
  //   // Also throw to surface in dev; GlitchTip should capture via Sentry SDK
  //   throw error;
  // };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="border-b border-gray-200 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xl font-bold"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(90deg, #81FFEF, #F067B4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              API WIKI
            </a>
            <a href="/about" className="text-sm text-gray-700 hover:text-gray-900">About Us</a>
          </div>

          <nav className="flex items-center gap-6">
            
            <a href="/explore" className="text-sm text-gray-700 hover:text-gray-900">탐색</a>
            <a href="/explore" className="text-sm text-gray-700 hover:text-gray-900">커뮤니티</a>
            <button className="px-5 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm">
              로그인
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center py-24 px-5">
        <div className="mb-8">
          <h1 
            className="text-[5rem] font-bold animated-gradient" 
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            API WIKI
          </h1>
          <p className="text-gray-600 text-lg mt-4">개발자들이 함께 만드는 API 선택 가이드</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {/* <div className="mb-10 flex justify-center">
          <button
            onClick={triggerGlitchTipTestError}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            GlitchTip 테스트 에러 보내기
          </button>
        </div> */}

        <CategoryCarousel />
      </main>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        <section className="mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]">
          <h2 className="text-3xl font-medium mb-6 pl-4">Recent Popular</h2>
          <APICarousel apis={popularAPIs} visible={4} />
        </section>

        <section className="mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.1s_forwards]">
          <h2 className="text-3xl font-medium mb-6 pl-4">Suggest API</h2>
          <APICarousel apis={suggestedAPIs} visible={4} />
        </section>

        <section className="mb-16 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
          <h2 className="text-3xl font-medium mb-6 pl-4">Latest News</h2>
          <NewsCarousel items={newsItems} visible={3} />
        </section>
      </div>
    </div>
  );
}
