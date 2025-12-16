// src/app/page.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CategoryCarousel from '@/components/CategoryCarousel';
import APICarousel from '@/components/APICarousel';
import NewsCarousel from '@/components/NewsCarousel';
import NewsCard from '@/components/NewsCard';
import Header from '@/components/Header';
import { mockAPIs, newsItems } from '@/data/mockData';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const popularAPIs = mockAPIs.slice(0, 10);
  const suggestedAPIs = mockAPIs.slice(5, 15);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

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

        {/* <div className="mb-6 flex flex-col items-center gap-2 text-sm text-gray-700">
          <button
            onClick={checkSupabase}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            Supabase 연결 확인
          </button>
          {supabaseStatus && <span className="text-gray-600">{supabaseStatus}</span>}
        </div> */}

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
