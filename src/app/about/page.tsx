'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    Object.keys(sectionRefs.current).forEach((key) => {
      const element = sectionRefs.current[key];
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setIsVisible((prev) => ({ ...prev, [key]: true }));
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 animate-gradient"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000 animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-scaleIn">
            <h1 className="text-7xl md:text-9xl font-bold mb-8 font-['Orbitron'] opacity-0 animate-fadeInUp drop-shadow-2xl">
              <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] [text-shadow:_0_0_40px_rgb(129_255_239_/_50%),_0_0_80px_rgb(74_144_226_/_30%)]" style={{ WebkitTextStroke: '2px rgba(129, 255, 239, 0.3)' }}>
                API WIKI
              </span>
            </h1>
            <p className="text-2xl md:text-4xl text-white mb-10 font-light opacity-0 animate-fadeInUp delay-200 drop-shadow-lg">
              개발자들이 함께 만드는 API 선택 가이드
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fadeInUp delay-400 drop-shadow-md">
              최고의 API를 찾고, 비교하고, 공유하세요.<br />
              우리는 개발자들의 더 나은 선택을 위해 존재합니다.
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        ref={(el) => { if (el) sectionRefs.current['mission'] = el; }}
        className="relative py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['mission'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              우리의 미션
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto animate-shimmer"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 perspective-1000">
            {/* Card 1 - Discovery */}
            <div className={`card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 relative group overflow-hidden ${isVisible['mission'] ? 'opacity-100 animate-cardFlip' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">발견</h3>
                <p className="text-gray-400 leading-relaxed">
                  수천 개의 API 중에서 프로젝트에 완벽하게 맞는 API를 쉽게 찾아보세요. 카테고리별 검색과 필터링으로 빠른 탐색이 가능합니다.
                </p>
              </div>
            </div>

            {/* Card 2 - Compare */}
            <div className={`card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/50 relative group overflow-hidden ${isVisible['mission'] ? 'opacity-100 animate-cardFlip delay-200' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">비교</h3>
                <p className="text-gray-400 leading-relaxed">
                  가격, 기능, 성능을 한눈에 비교하세요. 최대 4개의 API를 동시에 비교하여 최선의 선택을 할 수 있습니다.
                </p>
              </div>
            </div>

            {/* Card 3 - Share */}
            <div className={`card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 relative group overflow-hidden ${isVisible['mission'] ? 'opacity-100 animate-cardFlip delay-400' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300 group-hover:scale-110">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300">공유</h3>
                <p className="text-gray-400 leading-relaxed">
                  실제 사용 경험을 공유하고 커뮤니티와 함께 성장하세요. 리뷰와 평가로 더 나은 API 생태계를 만들어갑니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        ref={(el) => { if (el) sectionRefs.current['values'] = el; }}
        className="relative py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['values'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              핵심 가치
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto animate-shimmer"></div>
          </div>

          <div className="space-y-16">
            {/* Transparency */}
            <div className={`flex flex-col md:flex-row items-center gap-12 ${isVisible['values'] ? 'opacity-100 animate-slideInLeft' : 'opacity-0'}`}>
              <div className="flex-1 card-hover bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-cyan-500/20 hover:border-cyan-500/50 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all duration-300">
                      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-cyan-400">투명성</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    모든 정보는 투명하게 공개됩니다. 실제 사용자들의 리뷰와 평가를 기반으로 객관적인 정보를 제공합니다. 숨김없는 가격 정보와 실제 경험담을 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className={`flex flex-col md:flex-row-reverse items-center gap-12 ${isVisible['values'] ? 'opacity-100 animate-slideInRight delay-200' : 'opacity-0'}`}>
              <div className="flex-1 card-hover bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-blue-500/20 hover:border-blue-500/50 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-blue-400">커뮤니티</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    개발자들의, 개발자들에 의한, 개발자들을 위한 플랫폼입니다. 함께 만들고 함께 성장하는 커뮤니티 중심의 생태계를 지향합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* Innovation */}
            <div className={`flex flex-col md:flex-row items-center gap-12 ${isVisible['values'] ? 'opacity-100 animate-slideInLeft delay-400' : 'opacity-0'}`}>
              <div className="flex-1 card-hover bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-purple-500/20 hover:border-purple-500/50 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
                      <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-purple-400">혁신</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    끊임없이 개선하고 발전합니다. 최신 기술과 트렌드를 빠르게 반영하여 개발자들이 항상 최고의 선택을 할 수 있도록 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={(el) => { if (el) sectionRefs.current['stats'] = el; }}
        className="relative py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/30 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible['stats'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              함께 만드는 성과
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto animate-shimmer"></div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className={`text-center p-8 card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 relative group overflow-hidden animate-glow ${isVisible['stats'] ? 'opacity-100 animate-scaleIn' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-cyan-400 mb-2 transform group-hover:scale-110 transition-transform duration-300">30+</div>
                <div className="text-gray-400 text-lg">등록된 API</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className={`text-center p-8 card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 hover:border-blue-500/50 relative group overflow-hidden ${isVisible['stats'] ? 'opacity-100 animate-scaleIn delay-150' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-2 transform group-hover:scale-110 transition-transform duration-300">9</div>
                <div className="text-gray-400 text-lg">카테고리</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className={`text-center p-8 card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/50 relative group overflow-hidden ${isVisible['stats'] ? 'opacity-100 animate-scaleIn delay-300' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-purple-400 mb-2 transform group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-gray-400 text-lg">무료 사용</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className={`text-center p-8 card-hover bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-pink-500/20 hover:border-pink-500/50 relative group overflow-hidden ${isVisible['stats'] ? 'opacity-100 animate-scaleIn delay-450' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-bold text-pink-400 mb-2 transform group-hover:scale-110 transition-transform duration-300">∞</div>
                <div className="text-gray-400 text-lg">가능성</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={(el) => { if (el) sectionRefs.current['cta'] = el; }}
        className="relative py-32 px-4 sm:px-6 lg:px-8"
      >
        <div className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible['cta'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="card-hover bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-16 border border-blue-500/30 hover:border-blue-500/50 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                완벽한 API를 찾고 프로젝트를 성공으로 이끌어보세요.<br />
                API WIKI와 함께라면 더 빠르고 정확한 선택이 가능합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/explore"
                  className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">API 탐색하기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  href="/"
                  className="px-10 py-4 bg-slate-800/50 text-white rounded-full font-semibold text-lg border-2 border-blue-500/50 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
