// src/app/boards/page.tsx
'use client';

import Link from 'next/link';

const BOARD_TYPES = [
    {
        type: 'inquiry',
        title: '문의 게시판',
        description: '서비스 이용 중 궁금한 점을 문의하세요',
        icon: '❓',
        color: 'bg-blue-500',
    },
    {
        type: 'qna',
        title: 'Q&A 게시판',
        description: 'API 사용법과 기술적인 질문을 나누세요',
        icon: '💬',
        color: 'bg-green-500',
    },
    {
        type: 'free',
        title: '자유 게시판',
        description: '자유롭게 의견을 나누는 공간입니다',
        icon: '✨',
        color: 'bg-purple-500',
    },
];

export default function BoardsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">커뮤니티</h1>
                    <p className="text-gray-600">API WIKI 커뮤니티에 오신 것을 환영합니다</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BOARD_TYPES.map((board) => (
                        <Link
                            key={board.type}
                            href={`/boards/${board.type}`}
                            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8"
                        >
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${board.color} text-white text-3xl mb-4`}>
                                    {board.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{board.title}</h2>
                                <p className="text-gray-600">{board.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
