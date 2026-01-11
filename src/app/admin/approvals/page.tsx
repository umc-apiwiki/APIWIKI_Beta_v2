'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/Header';
import { isAdmin } from '@/lib/permissions';
import type { API } from '@/types';

export default function AdminApprovalsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [pendingApis, setPendingApis] = useState<API[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && (!user || !isAdmin(user))) {
            router.push('/');
            return;
        }
    }, [loading, user, router]);

    useEffect(() => {
        fetchPendingApis();
    }, []);

    const fetchPendingApis = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/apis?status=pending');
            const data = await response.json();
            if (response.ok) {
                setPendingApis(Array.isArray(data) ? data : data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch pending APIs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (apiId: string) => {
        if (!confirm('이 API를 승인하시겠습니까? 승인 시 작성자에게 5포인트가 지급됩니다.')) return;

        setProcessingId(apiId);
        try {
            const response = await fetch(`/api/apis/${apiId}/approve`, {
                method: 'POST',
            });
            
            const result = await response.json();

            if (response.ok) {
                alert(result.message || '승인되었습니다.');
                // Remove from list
                setPendingApis(prev => prev.filter(api => api.id !== apiId));
            } else {
                alert(result.error || '승인 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error approving API:', error);
            alert('오류가 발생했습니다.');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null; // Redirecting in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">API 등록 승인 대기</h1>
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                        대기 중: {pendingApis.length}건
                    </span>
                </div>

                {pendingApis.length === 0 ? (
                    <div className="bg-white rounded-[20px] p-20 text-center shadow-sm">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">대기 중인 API가 없습니다</h3>
                        <p className="text-gray-500">모든 요청이 처리되었습니다.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence>
                            {pendingApis.map((api) => (
                                <motion.div
                                    key={api.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {api.logo ? (
                                                api.logo.startsWith('http') ? (
                                                    <img src={api.logo} alt={api.name} className="w-10 h-10 rounded-lg object-cover" />
                                                ) : (
                                                    <span className="text-2xl">{api.logo}</span>
                                                )
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    ?
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{api.name}</h3>
                                                <p className="text-sm text-gray-500">{api.company}</p>
                                            </div>
                                            <div className="ml-auto md:hidden">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    api.price === 'free' ? 'bg-green-100 text-green-700' : 
                                                    api.price === 'paid' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {api.price === 'free' ? '무료' : api.price === 'paid' ? '유료' : '부분유료'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-2">{api.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {api.categories.map((cat, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-100">
                                        <div className="text-right mr-4 hidden md:block">
                                            <div className="text-sm text-gray-500">신청일</div>
                                            <div className="font-medium">
                                                {api.createdAt ? new Date(api.createdAt).toLocaleDateString() : '-'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleApprove(api.id)}
                                            disabled={processingId === api.id}
                                            className="flex-1 md:flex-none px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 min-w-[100px]"
                                        >
                                            {processingId === api.id ? '처리 중...' : '승인'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
