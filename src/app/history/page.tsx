'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { getUserActivities, getUserAPIs } from '@/lib/supabaseHelpers';
import type { UserActivity, ActivityType, API, ApiStatus } from '@/types';

export default function ActivityHistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [apis, setApis] = useState<any[]>([]); // API list
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'apis' | 'points'>('apis');

    const fetchData = useCallback(async (userId: string) => {
        try {
            console.log('Fetching history for user:', userId);
            setLoading(true);
            
            const [activitiesResult, apisResult] = await Promise.allSettled([
                getUserActivities(userId, { limit: 50 }),
                getUserAPIs(userId)
            ]);

            // Handle Activities Result
            if (activitiesResult.status === 'fulfilled') {
                console.log('Activities fetched:', activitiesResult.value);
                setActivities(activitiesResult.value);
            } else {
                console.error('Failed to fetch activities:', activitiesResult.reason);
            }

            // Handle APIs Result
            if (apisResult.status === 'fulfilled') {
                console.log('APIs fetched:', apisResult.value);
                setApis(apisResult.value);
            } else {
                console.error('Failed to fetch APIs:', apisResult.reason);
            }
        } catch (error) {
            console.error('Unexpected error fetching history:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        if (user?.id) {
            fetchData(user.id);
        }
    }, [user?.id, isAuthenticated, isLoading, router, fetchData]);

    const getStatusLabel = (status: ApiStatus) => {
        switch (status) {
            case 'pending': return '검토중';
            case 'approved': return '통과';
            case 'rejected': return '거절';
            default: return status;
        }
    };

    const getStatusColor = (status: ApiStatus) => {
        switch (status) {
            case 'pending': return 'text-gray-500 font-medium';
            case 'approved': return 'text-blue-600 font-bold';
            case 'rejected': return 'text-red-500 font-medium';
            default: return 'text-gray-500';
        }
    };

    const getActivityLabel = (type: ActivityType) => {
        switch (type) {
            case 'login': return '로그인';
            case 'post': return '게시글 작성';
            case 'comment': return '댓글 작성';
            case 'edit': return '위키 편집';
            case 'feedback': return '피드백 제출';
            case 'api_approval': return 'API 승인 (등록완료)';
            default: return type;
        }
    };

    const getActivityIcon = (type: ActivityType) => {
        switch (type) {
            case 'login': return '👋';
            case 'post': return '📝';
            case 'comment': return '💬';
            case 'edit': return '✍️';
            case 'feedback': return '💡';
            case 'api_approval': return '🎉';
            default: return '✨';
        }
    };

    if (isLoading || (loading && isAuthenticated)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
            <Header />
            
            {/* Background Glow */}
            <div className="bg-glow" />

            <div className="max-w-5xl mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="text-center mb-12">
                     <h1 className="text-3xl font-bold text-[#0F172A] mb-2">History</h1>
                    <p className="text-gray-500">나의 활동 내역을 확인하세요.</p>
                </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-10 select-none">
                        <div className="flex bg-gray-100 p-1 rounded-full">
                            <button
                                onClick={() => setActiveTab('apis')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === 'apis' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                편집/신청 내역
                            </button>
                            <button
                                onClick={() => setActiveTab('points')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                    activeTab === 'points' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                포인트 내역
                            </button>
                        </div>
                    </div>

                    {activeTab === 'apis' ? (
                        <div
                            className="bg-white rounded-[24px] border border-blue-100 shadow-[0_4px_20px_-10px_rgba(37,99,235,0.1)] overflow-hidden"
                        >
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-[#0F172A]">편집/신청 내역</h2>
                            </div>
                            
                            {apis.length === 0 ? (
                                <div className="py-20 text-center text-gray-400 select-none">
                                    아직 신청한 내역이 없습니다.
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {apis.map((api) => (
                                        <div key={api.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors select-none">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                                    api.status === 'approved' ? 'bg-blue-50 text-blue-500' :
                                                    api.status === 'rejected' ? 'bg-red-50 text-red-500' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {api.status === 'approved' ? '🎉' :
                                                     api.status === 'rejected' ? '🚫' : '⏳'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {api.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                        {api.createdAt ? new Date(api.createdAt).toLocaleDateString().replace(/\.$/, '') : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                 <div className={`text-sm font-bold ${getStatusColor(api.status)}`}>
                                                    {getStatusLabel(api.status)}
                                                </div>
                                                {api.status === 'rejected' && (
                                                    <div className="text-xs text-red-400 mt-1">규정 위반</div>
                                                )}
                                                {api.status === 'approved' && api.approved_at && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {new Date(api.approved_at).toLocaleDateString()} 승인
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            className="animate-fadeInUp"
                        >
                             <div className="flex items-center justify-between mb-6 px-4">
                                <h2 className="text-xl font-bold text-gray-900">총 포인트</h2>
                                <span className="text-2xl font-bold text-blue-600">{(user as any)?.activity_score || 0} P</span>
                            </div>
    
                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                                 {activities.length === 0 ? (
                                    <div className="p-20 text-center text-gray-400">
                                        포인트 획득 내역이 없습니다.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors select-none">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
                                                        {getActivityIcon(activity.action_type)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {getActivityLabel(activity.action_type)}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5">
                                                            {new Date(activity.created_at).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-blue-600">+{activity.points} P</div>
                                            </div>
                                        )) || []}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>
        </div>  
    );
}
