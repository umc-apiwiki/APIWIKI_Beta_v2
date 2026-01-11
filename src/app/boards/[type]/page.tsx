// src/app/boards/[type]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import BoardForm from '@/components/BoardForm';
import type { Board, BoardType } from '@/types';

const BOARD_TITLES: Record<BoardType, string> = {
    inquiry: '문의 게시판',
    qna: 'Q&A 게시판',
    free: '자유 게시판',
    community: '커뮤니티',
};

const BOARD_CONFIGS: Record<BoardType, { icon: string; gradient: string; description: string }> = {
    inquiry: {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '서비스 이용 중 궁금한 점을 문의하세요'
    },
    qna: {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        description: 'API 사용법과 기술적인 질문을 나누세요'
    },
    free: {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        description: '자유롭게 의견을 나누는 공간입니다'
    },
    community: {
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        description: '커뮤니티에서 다양한 이야기를 나누세요'
    },
};

export default function BoardTypePage({ params }: { params: { type: BoardType } }) {
    const router = useRouter();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const config = BOARD_CONFIGS[params.type] || BOARD_CONFIGS.free;

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
            
            <div className="grid-container pt-32 pb-60 relative z-10">
                {/* Header */}
                <div className="col-12 mb-8">
                    <Link 
                        href="/boards" 
                        className="text-[14px] mb-4 inline-flex items-center gap-2 transition-colors hover:text-[var(--primary-blue)]"
                        style={{ color: 'var(--text-gray)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        게시판 목록으로
                    </Link>
                </div>

                {/* Action Bar */}
                <motion.div 
                    className="col-12 flex justify-between items-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-[16px] font-semibold" style={{ color: 'var(--text-dark)' }}>
                            총 {boards.length}개의 게시글
                        </span>
                    </div>
                    <motion.button
                        onClick={() => setShowForm(!showForm)}
                        className={`${showForm ? 'border border-gray-200 text-[#0c4a6e] bg-white hover:border-sky-400' : 'bg-[#0c4a6e] text-white hover:bg-[#0a3b56]'} px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors`}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        {showForm ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                목록으로
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                글쓰기
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
                                className="bg-white card-shadow col-12 py-20 text-center"
                                style={{ borderRadius: '20px' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className="text-[24px] font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                                    아직 게시글이 없습니다
                                </h3>
                                <p className="text-[16px] mb-6" style={{ color: 'var(--text-gray)' }}>
                                    첫 게시글을 작성해보세요!
                                </p>
                                <motion.button
                                    onClick={() => setShowForm(true)}
                                    className="px-4 py-2 rounded-md bg-[#0c4a6e] text-white text-sm font-semibold shadow-sm hover:bg-[#0a3b56]"
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    글쓰기
                                </motion.button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="bg-white card-shadow col-12 mb-20" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                    {boards.map((board, index) => (
                                        <motion.div
                                            key={board.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={`/boards/${params.type}/${board.id}`}
                                                className="block p-5 border-b transition-all hover:bg-gray-50 group"
                                                style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-[20px] font-semibold mb-2 group-hover:text-[var(--primary-blue)] transition-colors" style={{ color: 'var(--text-dark)' }}>
                                                            {board.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-[14px]" style={{ color: 'var(--text-gray)' }}>
                                                            <div className="flex items-center gap-2">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                                                                    <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2"/>
                                                                </svg>
                                                                <span>{board.author?.name || board.author_name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                                    <path d="M3 10H21M7 3V6M17 3V6" stroke="currentColor" strokeWidth="2"/>
                                                                </svg>
                                                                <span>{new Date(board.created_at).toLocaleDateString('ko-KR')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <motion.svg 
                                                        width="24" 
                                                        height="24" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        style={{ color: 'var(--primary-blue)' }}
                                                    >
                                                        <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </motion.svg>
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
