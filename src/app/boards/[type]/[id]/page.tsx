// src/app/boards/[type]/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import CommentSection from '@/components/CommentSection';
import type { Board, BoardType } from '@/types';
import styles from './page.module.css';

export default function BoardDetailPage({ params }: { params: { type: BoardType; id: string } }) {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBoard = useCallback(async () => {
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
    }, [params.id, params.type, router]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

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
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다';
            alert(errorMessage);
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
            className={`min-h-screen relative overflow-hidden ${styles.boardDetailPage}`}
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

            <div className="grid-container pt-32 pb-60 relative z-10">
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
