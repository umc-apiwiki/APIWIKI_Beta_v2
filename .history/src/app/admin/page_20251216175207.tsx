// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import type { API } from '@/types';

export default function AdminPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [pendingAPIs, setPendingAPIs] = useState<API[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    // 권한 확인
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
        }
        if (!isLoading && isAuthenticated && !isAdmin(user)) {
            setError('관리자 권한이 필요합니다');
            setLoading(false);
        }
    }, [isAuthenticated, isLoading, user, router]);

    // 대기 중인 API 목록 조회
    useEffect(() => {
        if (isAuthenticated && isAdmin(user)) {
            fetchPendingAPIs();
        }
    }, [isAuthenticated, user]);

    const fetchPendingAPIs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/pending-apis');
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '목록 조회에 실패했습니다');
            }

            setPendingAPIs(result.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (apiId: string, action: 'approve' | 'reject') => {
        try {
            setProcessingId(apiId);
            const response = await fetch('/api/apis/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apiId, action }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || '처리에 실패했습니다');
            }

            // 목록 새로고침
            await fetchPendingAPIs();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
                    <p className="text-gray-600 mt-2">대기 중인 API 등록 요청을 관리합니다</p>
                </div>

                {pendingAPIs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        대기 중인 API가 없습니다
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingAPIs.map((api) => (
                            <div key={api.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-3xl">{api.logo}</span>
                                            <div>
                                                <h3 className="text-xl font-semibold">{api.name}</h3>
                                                <p className="text-sm text-gray-600">{api.company}</p>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-3">{api.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {api.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>가격: {api.price === 'free' ? '무료' : api.price === 'paid' ? '유료' : '혼합'}</span>
                                            {api.features && api.features.length > 0 && (
                                                <span>기능: {api.features.length}개</span>
                                            )}
                                        </div>

                                        {api.createdAt && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                등록일: {new Date(api.createdAt).toLocaleString('ko-KR')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleApprove(api.id, 'approve')}
                                            disabled={processingId === api.id}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingId === api.id ? '처리 중...' : '승인'}
                                        </button>
                                        <button
                                            onClick={() => handleApprove(api.id, 'reject')}
                                            disabled={processingId === api.id}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingId === api.id ? '처리 중...' : '거부'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
