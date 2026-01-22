'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { getUserActivities, getById } from '@/lib/supabaseHelpers';
import type { UserActivity, ActivityType, User } from '@/types';
import styles from './page.module.css';

export default function ActivityHistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (userId: string) => {
        try {
            console.log('Fetching history for user:', userId);
            setLoading(true);
            
            const [activitiesResult, userResult] = await Promise.allSettled([
                getUserActivities(userId, { limit: 50 }),
                getById<User>('User', userId)
            ]);

            // Handle Activities Result
            if (activitiesResult.status === 'fulfilled') {
                setActivities(activitiesResult.value);
            } else {
                console.error('Failed to fetch activities:', activitiesResult.reason);
            }

            // Handle User Result (for Total Points)
            if (userResult.status === 'fulfilled' && userResult.value) {
                setPoints((userResult.value as User).activity_score || 0);
            } else {
                console.error('Failed to fetch user points');
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





    const getActivityLabel = (type: ActivityType) => {
        switch (type) {
            case 'login': return '로그인';
            case 'post': return '게시글 작성';
            case 'comment': return '댓글 작성';
            case 'edit': return '위키 편집';
            case 'feedback': return '피드백 제출';
            case 'api_approval': return 'API 승인 (등록완료)';
            case 'csv_upload': return '비용정보 업로드';
            case 'csv_update': return '비용정보 수정';
            default: return type;
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
        <div className={`min-h-screen ${styles.historyPage}`} style={{ backgroundColor: 'var(--bg-light)' }}>
            <Header />
            
            {/* Background Glow */}
            <div className="bg-glow" />

            <div className="max-w-5xl mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="text-center mb-12">
                     <h1 className="text-3xl font-bold text-[#0F172A] mb-2">History</h1>
                    <p className="text-gray-500">나의 활동 내역을 확인하세요.</p>
                </div>

                <div className="animate-fadeInUp">
                     <div className="flex items-center justify-between mb-6 px-4">
                        <h2 className="text-xl font-bold text-gray-900">포인트 내역</h2>
                        <span className="text-2xl font-bold text-blue-600">{points} P</span>
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
            </div>
        </div>  
    );
}
