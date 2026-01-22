// src/app/boards/[type]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Header from '@/components/Header';
import BoardForm from '@/components/BoardForm';
import type { Board, BoardType } from '@/types';
import styles from './page.module.css';

const BOARD_CONFIGS: Record<BoardType, { gradient: string; description: string }> = {
    community: {
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '커뮤니티에서 다양한 이야기를 나누세요'
    }
};

export default function BoardTypePage({ params }: { params: { type: BoardType } }) {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchBoards = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/boards?type=${params.type}&page=${page}&limit=20`);
            const result = await response.json();

            if (response.ok) {
                setBoards(result.data || []);
                setTotalPages(result.pagination?.totalPages || 1);
            }
        } catch (err) {
            console.error('게시판 목록 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    }, [params.type, page]);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    return (
        <motion.div 
            className={styles.boardPage}
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
            
            <div className={isMobile ? "px-4 pt-4 pb-20 relative z-10" : "grid-container pt-28 md:pt-36 pb-32 md:pb-60 relative z-10"}>
                {/* 헤더 영역 - 제목과 글쓰기 버튼 */}
                <motion.div
                    className={isMobile ? "w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8" : "col-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div>
                        <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Community</p>
                        <h1 className="text-3xl font-semibold text-slate-900 mt-1">커뮤니티 게시판</h1>
                    </div>
                    <motion.button
                        onClick={() => setShowForm(!showForm)}
                        className={`${showForm
                            ? 'border border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                            : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                        } px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all w-full md:w-auto`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {showForm ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                목록으로
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                새 글 작성
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {showForm ? (
                    <motion.div 
                        className="bg-white card-shadow col-12 p-8" 
                        style={{ borderRadius: '20px' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <BoardForm type={params.type} onCancel={() => setShowForm(false)} />
                    </motion.div>
                ) : (
                    <>
                        {loading ? (
                            <motion.div 
                                className="text-center py-20 col-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary-blue)', borderTopColor: 'transparent' }}></div>
                                <p className="mt-4 text-[16px]" style={{ color: 'var(--text-gray)' }}>로딩 중...</p>
                            </motion.div>
                        ) : boards.length === 0 ? (
                            <motion.div
                                className="col-12 bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-100"
                                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-sky-500">
                                        <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M8 7H16M8 12H16M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                                    아직 게시글이 없습니다
                                </h3>
                                <p className="text-sm md:text-base mb-6" style={{ color: 'var(--text-gray)' }}>
                                    첫 번째 게시글을 작성해보세요!
                                </p>
                                <motion.button
                                    onClick={() => setShowForm(true)}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        첫 글 작성하기
                                    </span>
                                </motion.button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="col-12 space-y-3 md:space-y-4 mb-20">
                                    {boards.map((board, index) => (
                                        <motion.div
                                            key={board.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={`/boards/${params.type}/${board.id}`}
                                                className="block bg-white rounded-2xl p-4 md:p-5 transition-all hover:shadow-lg group border border-gray-100 hover:border-sky-200"
                                                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                                            >
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    {/* 작성자 아바타 */}
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sky-600 font-bold text-sm md:text-base">
                                                            {(board.author?.name || board.author_name || '익명').charAt(0)}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-base md:text-lg font-semibold mb-1 group-hover:text-sky-600 transition-colors truncate" style={{ color: 'var(--text-dark)' }}>
                                                            {board.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm" style={{ color: 'var(--text-gray)' }}>
                                                            <span className="font-medium">{board.author?.name || board.author_name}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span>{new Date(board.created_at).toLocaleDateString('ko-KR')}</span>
                                                        </div>
                                                    </div>

                                                    {/* 화살표 아이콘 */}
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="text-gray-300 group-hover:text-sky-500 transition-colors flex-shrink-0"
                                                    >
                                                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* 페이지네이션 */}
                                {totalPages > 1 && (
                                    <motion.div 
                                        className="flex justify-center gap-2 mt-8 col-12"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                    >
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <motion.button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className="w-12 h-12 rounded-full font-semibold transition-all"
                                                style={{
                                                    backgroundColor: p === page ? 'var(--primary-blue)' : 'white',
                                                    color: p === page ? 'white' : 'var(--text-gray)',
                                                    boxShadow: p === page ? 'var(--shadow-blue)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                }}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {p}
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
}
