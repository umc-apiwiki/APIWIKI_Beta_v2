'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { getUserActivities } from '@/lib/supabaseHelpers';
import type { UserActivity, ActivityType } from '@/types';

export default function ActivityHistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [activities, setActivities] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/');
            return;
        }

        if (user?.id) {
            fetchActivities(user.id);
        }
        // user object might reference change, rely on user.id
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, isAuthenticated, isLoading, router]);

    const fetchActivities = async (userId: string) => {
        try {
            setLoading(true);
            const data = await getUserActivities(userId, { limit: 50 });
            setActivities(data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityLabel = (type: ActivityType) => {
        switch (type) {
            case 'login': return '로그인';
            case 'post': return '게시글 작성';
            case 'comment': return '댓글 작성';
            case 'edit': return '위키 편집';
            case 'feedback': return '피드백 제출';
            case 'api_approval': return 'API 승인됨';
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
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">활동 내역</h1>
                        <p className="text-gray-500">지금까지 쌓은 포인트 히스토리입니다.</p>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="text-sm text-gray-500 mb-1">총 포인트</div>
                        <div className="text-2xl font-bold text-blue-600">{(user as any)?.activity_score || 0} P</div>
                    </div>
                </div>

                {activities.length === 0 ? (
                    <div className="bg-white rounded-[20px] p-20 text-center shadow-sm">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">아직 활동 내역이 없습니다</h3>
                        <p className="text-gray-500">커뮤니티 활동을 통해 포인트를 모아보세요!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                        <div className="divide-y divide-gray-100">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="py-4 flex items-center justify-between group hover:bg-gray-50 px-4 rounded-xl transition-colors -mx-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl">
                                            {getActivityIcon(activity.action_type)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {getActivityLabel(activity.action_type)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(activity.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold text-blue-600">
                                        +{activity.points} P
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
