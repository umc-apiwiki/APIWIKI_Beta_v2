// src/app/boards/page.tsx
'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';

const BOARD_TYPES = [
    {
        type: 'inquiry',
        title: '문의 게시판',
        description: '서비스 이용 중 궁금한 점을 문의하세요',
        icon: '❓',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        stats: { posts: 128, members: 234 }
    },
    {
        type: 'qna',
        title: 'Q&A 게시판',
        description: 'API 사용법과 기술적인 질문을 나누세요',
        icon: '💬',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        stats: { posts: 342, members: 567 }
    },
    {
        type: 'free',
        title: '자유 게시판',
        description: '자유롭게 의견을 나누는 공간입니다',
        icon: '✨',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        stats: { posts: 891, members: 1234 }
    },
];

export default function BoardsPage() {
    return (
        <motion.div 
            className="min-h-screen relative overflow-hidden" 
            style={{ backgroundColor: 'var(--bg-light)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {/* Background Gradient Effect */}
            <motion.div
                className="bg-glow"
                style={{
                    x: '-50%',
                    y: '-50%'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <Header />
            
            <div className="grid-container pt-32 pb-20 relative z-10">
                {/* Hero Section */}
                <motion.div 
                    className="text-center mb-16 col-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.h1 
                        className="text-[64px] font-bold mb-4"
                        style={{ color: 'var(--text-dark)' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        커뮤니티
                    </motion.h1>
                    <motion.p 
                        className="text-[20px]"
                        style={{ color: 'var(--text-gray)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        개발자들과 함께 지식을 나누고 성장하세요
                    </motion.p>
                </motion.div>

                {/* Board Cards */}
                <div className="grid grid-cols-12 grid-gap-24 mb-16">
                    {BOARD_TYPES.map((board, index) => (
                        <motion.div
                            key={board.type}
                            className="col-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            whileHover={{ y: -8 }}
                        >
                            <Link
                                href={`/boards/${board.type}`}
                                className="block bg-white transition-all duration-300 card-shadow overflow-hidden group"
                                style={{ borderRadius: '20px', height: '100%' }}
                            >
                                {/* Gradient Header */}
                                <motion.div 
                                    className="h-[120px] relative overflow-hidden"
                                    style={{ background: board.gradient }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div 
                                            className="text-[48px]"
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {board.icon}
                                        </motion.div>
                                    </div>
                                    {/* Decorative circles */}
                                    <div className="absolute top-[-20px] right-[-20px] w-[100px] h-[100px] rounded-full bg-white opacity-10"></div>
                                    <div className="absolute bottom-[-30px] left-[-30px] w-[120px] h-[120px] rounded-full bg-white opacity-10"></div>
                                </motion.div>

                                {/* Content */}
                                <div className="p-8">
                                    <h2 className="text-[28px] font-bold mb-3 group-hover:text-[var(--primary-blue)] transition-colors" style={{ color: 'var(--text-dark)' }}>
                                        {board.title}
                                    </h2>
                                    <p className="text-[16px] mb-6 leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                                        {board.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6 pt-4 border-t" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-semibold" style={{ color: 'var(--primary-blue)' }}>
                                                {board.stats.posts}
                                            </span>
                                            <span className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                                                게시글
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[14px] font-semibold" style={{ color: 'var(--primary-blue)' }}>
                                                {board.stats.members}
                                            </span>
                                            <span className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                                                참여자
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Arrow */}
                                <motion.div 
                                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    initial={{ x: -10 }}
                                    whileHover={{ x: 0 }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Community Guidelines Section */}
                <motion.section
                    className="col-12 bg-white p-12 card-shadow"
                    style={{ borderRadius: '20px' }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="text-center mb-8">
                        <h3 className="text-[32px] font-bold mb-3" style={{ color: 'var(--text-dark)' }}>
                            커뮤니티 가이드라인
                        </h3>
                        <p className="text-[16px]" style={{ color: 'var(--text-gray)' }}>
                            모두가 즐겁게 소통할 수 있는 공간을 만들어가요
                        </p>
                    </div>

                    <div className="grid grid-cols-12 grid-gap-24">
                        {[
                            { icon: '🤝', title: '상호 존중', desc: '모든 구성원을 존중하고 배려해주세요' },
                            { icon: '💡', title: '건설적인 피드백', desc: '비판보다는 도움이 되는 조언을 제공해주세요' },
                            { icon: '🔍', title: '정확한 정보', desc: '검증된 정보를 공유하고 출처를 밝혀주세요' },
                            { icon: '🚫', title: '스팸 금지', desc: '불필요한 광고나 반복 게시물은 지양해주세요' }
                        ].map((guideline, index) => (
                            <motion.div
                                key={index}
                                className="col-3 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div 
                                    className="text-[40px] mb-3"
                                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {guideline.icon}
                                </motion.div>
                                <h4 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                                    {guideline.title}
                                </h4>
                                <p className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                                    {guideline.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}
