'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Header from '@/components/Header';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <motion.div
      className={styles.aboutPage}
      style={{ backgroundColor: 'var(--bg-light)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="bg-glow" />

        <motion.div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-[80px] font-bold mb-8"
            style={{ color: 'var(--primary-blue)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
            }}
          >
            API WIKI
          </motion.h1>

          <motion.p
            className="text-[32px] mb-10"
            style={{ color: 'var(--text-dark)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            개발자들이 함께 만드는 API 선택 가이드
          </motion.p>

          <motion.p
            className="text-[18px] max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-gray)' }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            최고의 API를 찾고, 비교하고, 공유하세요.
            <br />
            우리는 개발자들의 더 나은 선택을 위해 존재합니다.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="relative py-32">
        <div className="grid-container">
          <motion.div
            className="text-center mb-20 col-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-[45px] font-bold mb-6"
              style={{ color: 'var(--primary-blue)' }}
              initial={{ opacity: 0.8, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              우리의 미션
            </motion.h2>
            <motion.div
              className="w-24 h-1 mx-auto"
              style={{ backgroundColor: 'var(--primary-blue)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          <div className="grid grid-cols-12 grid-gap-24 col-12">
            {/* Card 1 - Discovery */}
            <motion.div
              className="col-4"
              initial={{ opacity: 0, rotateY: -90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <motion.div
                className="bg-white p-8 card-shadow h-full"
                style={{
                  borderRadius: '15px',
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  boxShadow: '0 20px 60px rgba(33, 150, 243, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="w-16 h-16 mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[24px] font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
                  발견
                </h3>
                <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                  수천 개의 API 중에서 프로젝트에 완벽하게 맞는 API를 쉽게 찾아보세요. 카테고리별
                  검색과 필터링으로 빠른 탐색이 가능합니다.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 2 - Compare */}
            <motion.div
              className="col-4"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="bg-white p-8 card-shadow h-full"
                style={{
                  borderRadius: '15px',
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  rotateX: 5,
                  boxShadow: '0 20px 60px rgba(33, 150, 243, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="w-16 h-16 mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[24px] font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
                  비교
                </h3>
                <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                  가격, 기능, 성능을 한눈에 비교하세요. 최대 4개의 API를 동시에 비교하여 최선의
                  선택을 할 수 있습니다.
                </p>
              </motion.div>
            </motion.div>

            {/* Card 3 - Share */}
            <motion.div
              className="col-4"
              initial={{ opacity: 0, rotateY: 90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                className="bg-white p-8 card-shadow h-full"
                style={{
                  borderRadius: '15px',
                  transformStyle: 'preserve-3d',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -5,
                  boxShadow: '0 20px 60px rgba(33, 150, 243, 0.3)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  className="w-16 h-16 mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[24px] font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
                  공유
                </h3>
                <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                  실제 사용 경험을 공유하고 커뮤니티와 함께 성장하세요. 리뷰와 평가로 더 나은 API
                  생태계를 만들어갑니다.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-32">
        <div className="grid-container">
          <motion.div
            className="text-center mb-20 col-12"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[45px] font-bold mb-6" style={{ color: 'var(--primary-blue)' }}>
              핵심 가치
            </h2>
            <motion.div
              className="w-24 h-1 mx-auto"
              style={{ backgroundColor: 'var(--primary-blue)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          <div className="col-12 space-y-8">
            {/* Transparency */}
            <motion.div
              className="bg-white p-12 card-shadow col-12"
              style={{ borderRadius: '15px' }}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: 'spring' }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(33, 150, 243, 0.2)',
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[28px] font-bold" style={{ color: 'var(--primary-blue)' }}>
                  투명성
                </h3>
              </div>
              <p className="text-[18px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                모든 정보는 투명하게 공개됩니다. 실제 사용자들의 리뷰와 평가를 기반으로 객관적인
                정보를 제공합니다. 숨김없는 가격 정보와 실제 경험담을 확인하세요.
              </p>
            </motion.div>

            {/* Community */}
            <motion.div
              className="bg-white p-12 card-shadow"
              style={{ borderRadius: '15px' }}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(33, 150, 243, 0.2)',
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[28px] font-bold" style={{ color: 'var(--primary-blue)' }}>
                  커뮤니티
                </h3>
              </div>
              <p className="text-[18px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                개발자들의, 개발자들에 의한, 개발자들을 위한 플랫폼입니다. 함께 만들고 함께 성장하는
                커뮤니티 중심의 생태계를 지향합니다.
              </p>
            </motion.div>

            {/* Innovation */}
            <motion.div
              className="bg-white p-12 card-shadow"
              style={{ borderRadius: '15px' }}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 20px 60px rgba(33, 150, 243, 0.2)',
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', borderRadius: '12px' }}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    default: { duration: 0.6 },
                  }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: 'var(--primary-blue)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[28px] font-bold" style={{ color: 'var(--primary-blue)' }}>
                  혁신
                </h3>
              </div>
              <p className="text-[18px] leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                끊임없이 개선하고 발전합니다. 최신 기술과 트렌드를 빠르게 반영하여 개발자들이 항상
                최고의 선택을 할 수 있도록 돕습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32">
        <div className="grid-container relative z-10">
          <motion.div
            className="text-center mb-20 col-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[45px] font-bold mb-6" style={{ color: 'var(--primary-blue)' }}>
              함께 만드는 성과
            </h2>
            <motion.div
              className="w-24 h-1 mx-auto"
              style={{ backgroundColor: 'var(--primary-blue)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>

          <div className="grid grid-cols-12 grid-gap-24 col-12">
            {[
              { value: '30+', label: '등록된 API', delay: 0.1 },
              { value: '9', label: '카테고리', delay: 0.2 },
              { value: '100%', label: '무료 사용', delay: 0.3 },
              { value: '∞', label: '가능성', delay: 0.4 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="col-3"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: stat.delay,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <motion.div
                  className="text-center p-8 bg-white card-shadow"
                  style={{ borderRadius: '15px' }}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 25px 50px rgba(33, 150, 243, 0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="text-[56px] font-bold mb-2"
                    style={{ color: 'var(--primary-blue)' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      opacity: { duration: 0.6, delay: stat.delay + 0.2 },
                      y: { duration: 0.6, delay: stat.delay + 0.2 },
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      },
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-[18px]" style={{ color: 'var(--text-gray)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="grid-container">
          <motion.div
            className="col-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="bg-white p-16 card-shadow max-w-4xl mx-auto relative overflow-hidden"
              style={{ borderRadius: '15px' }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-5"
                style={{
                  background:
                    'linear-gradient(45deg, var(--primary-blue), transparent, var(--primary-blue))',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <motion.h2
                className="text-[40px] font-bold mb-6 relative z-10"
                style={{ color: 'var(--text-dark)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                지금 바로 시작하세요
              </motion.h2>

              <motion.p
                className="text-[20px] mb-12 leading-relaxed relative z-10"
                style={{ color: 'var(--text-gray)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                완벽한 API를 찾고 프로젝트를 성공으로 이끌어보세요.
                <br />
                API WIKI와 함께라면 더 빠르고 정확한 선택이 가능합니다.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/explore"
                    className="px-10 py-4 text-white font-semibold text-[18px] inline-block"
                    style={{ backgroundColor: 'var(--primary-blue)', borderRadius: '50px' }}
                  >
                    <motion.span
                      animate={{
                        textShadow: [
                          '0 0 0px rgba(255,255,255,0)',
                          '0 0 10px rgba(255,255,255,0.5)',
                          '0 0 0px rgba(255,255,255,0)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      API 탐색하기
                    </motion.span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/"
                    className="px-10 py-4 font-semibold text-[18px] border-2 inline-block"
                    style={{
                      color: 'var(--primary-blue)',
                      borderColor: 'var(--primary-blue)',
                      borderRadius: '50px',
                    }}
                  >
                    홈으로 돌아가기
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
