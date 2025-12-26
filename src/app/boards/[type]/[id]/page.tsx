// src/app/boards/[type]/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import CommentSection from '@/components/CommentSection';
import type { Board, BoardType } from '@/types';

const BOARD_TITLES: Record<BoardType, string> = {
    inquiry: '문의 게시판',
    qna: 'Q&A 게시판',
    free: '자유 게시판',
    community: '커뮤니티',
};

export default function BoardDetailPage({ params }: { params: { type: BoardType; id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoard();
    }, [params.id]);

    const fetchBoard = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/boards/${params.id}`);
            const result = await response.json();

            if (response.ok) {
                setBoard(result.data);
            } else {
                alert('게시글을 찾을 수 없습니다');
                router.push(`/boards/${params.type}`);
            }
        } catch (err) {
            console.error('게시글 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('게시글을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/boards/${params.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || '삭제에 실패했습니다');
            }

            alert('게시글이 삭제되었습니다');
            router.push(`/boards/${params.type}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const canDelete = () => {
        if (!isAuthenticated || !board) return false;
        return board.author_id === user?.id || isAdmin(user);
    };

    if (loading) {
        return (
            <motion.div 
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-light)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary-blue)', borderTopColor: 'transparent' }}></div>
                    <p className="mt-4 text-[16px]" style={{ color: 'var(--text-gray)' }}>로딩 중...</p>
                </div>
            </motion.div>
        );
    }

    if (!board) {
        return null;
    }

    return (
        <motion.div 
            className="min-h-screen relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-light)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                {/* Back Button */}
                <div className="col-12 mb-8">
                    <Link 
                        href={`/boards/${params.type}`} 
                        className="text-[14px] inline-flex items-center gap-2 px-4 py-2 transition-all hover:gap-3"
                        style={{ color: 'var(--text-gray)' }}
                    >
                        <motion.svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                        >
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </motion.svg>
                        {BOARD_TITLES[params.type]}로 돌아가기
                    </Link>
                </div>

                {/* Board Content */}
                <motion.div 
                    className="bg-white card-shadow col-12 p-8 mb-6" 
                    style={{ borderRadius: '20px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <div className="mb-6 pb-6 border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                        <h1 className="text-[32px] font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
                            {board.title}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-[14px]" style={{ color: 'var(--text-gray)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-blue)' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
                                            <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="white" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>
                                        {board.author?.name || board.author_name}
                                    </span>
                                    {board.author?.grade && (
                                        <span className="px-2 py-0.5 text-[12px] rounded-full" style={{ backgroundColor: 'rgba(var(--primary-blue-rgb), 0.15)', color: 'var(--primary-blue)' }}>
                                            {board.author.grade}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M3 10H21M7 3V6M17 3V6" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    <span>{new Date(board.created_at).toLocaleString('ko-KR')}</span>
                                </div>
                            </div>
                            {canDelete() && (
                                <motion.button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-[14px] font-semibold rounded-full transition-colors"
                                    style={{ 
                                        color: '#ef4444',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                    }}
                                    whileHover={{ 
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        scale: 1.05 
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    삭제
                                </motion.button>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-[16px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-dark)' }}>
                            {board.content}
                        </p>
                    </div>
                </motion.div>

                {/* Comments Section */}
                <motion.div 
                    className="col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <CommentSection boardId={params.id} />
                </motion.div>
            </div>
        </motion.div>
    );
}
