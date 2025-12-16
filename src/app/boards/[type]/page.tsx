// src/app/boards/[type]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BoardForm from '@/components/BoardForm';
import type { Board, BoardType } from '@/types';

const BOARD_TITLES: Record<BoardType, string> = {
    inquiry: '문의 게시판',
    qna: 'Q&A 게시판',
    free: '자유 게시판',
};

export default function BoardTypePage({ params }: { params: { type: BoardType } }) {
    const router = useRouter();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBoards();
    }, [params.type, page]);

    const fetchBoards = async () => {
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
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link href="/boards" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
                            ← 게시판 목록
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{BOARD_TITLES[params.type]}</h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        {showForm ? '목록으로' : '글쓰기'}
                    </button>
                </div>

                {showForm ? (
                    <div className="bg-white rounded-lg shadow p-6">
                        <BoardForm type={params.type} onCancel={() => setShowForm(false)} />
                    </div>
                ) : (
                    <>
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">로딩 중...</div>
                        ) : boards.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                                첫 게시글을 작성해보세요
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-lg shadow divide-y">
                                    {boards.map((board) => (
                                        <Link
                                            key={board.id}
                                            href={`/boards/${params.type}/${board.id}`}
                                            className="block p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{board.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{board.author?.name || board.author_name}</span>
                                                <span>{new Date(board.created_at).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* 페이지네이션 */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-6">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`px-4 py-2 rounded ${p === page
                                                        ? 'bg-teal-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
