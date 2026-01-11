import { supabase } from '@/lib/supabaseClient';
import { create, update, getById } from '@/lib/supabaseHelpers';
import type { UserActivity, User, ActivityType } from '@/types';

// 활동별 포인트 정의
export const getActivityPoints = (type: ActivityType): number => {
    switch (type) {
        case 'login': return 1;
        case 'post': return 2;
        case 'comment': return 1;
        case 'edit': return 4;
        case 'feedback': return 3;
        default: return 0;
    }
};

/**
 * 사용자 활동을 기록하고 점수를 업데이트합니다.
 * @param userId 사용자 ID
 * @param actionType 활동 타입
 * @param customPoints (선택사항) 지정된 포인트. 없으면 기본값 사용
 * @returns 업데이트된 점수 결과
 */
export async function logUserActivity(userId: string, actionType: ActivityType, customPoints?: number) {
    try {
        console.log(`[Activity] Logging activity: ${actionType} for user: ${userId}`);

        // 1. 사용자 조회
        const user = await getById<User>('User', userId);
        if (!user) {
            console.error(`[Activity] User not found: ${userId}`);
            return null;
        }

        // 2. 점수 계산
        const points = customPoints ?? getActivityPoints(actionType);
        const oldScore = user.activity_score || 0;
        const newScore = oldScore + points;

        // 3. 활동 기록 (user_activities 테이블)
        const activity = await create<UserActivity>('user_activities', {
            user_id: userId,
            action_type: actionType,
            points,
        });

        // 4. 사용자 점수 업데이트 (User 테이블)
        await update<User>('User', userId, {
            activity_score: newScore,
        });

        console.log(`[Activity] Success: +${points} points. Total: ${newScore}`);

        return {
            activityId: activity.id,
            points,
            oldScore,
            newScore,
        };
    } catch (error: any) {
        console.error('[Activity] Error logging activity:', error);
        // 활동 기록 실패가 메인 로직(게시글 작성 등)을 방해하지 않도록 에러를 던지지 않고 무시하거나 로그만 남김
        return null;
    }
}
