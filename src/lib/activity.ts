import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import type { UserActivity, User, ActivityType } from '@/types';

// 활동별 포인트 정의
export const getActivityPoints = (type: ActivityType): number => {
  switch (type) {
    case 'login':
      return 1;
    case 'post':
      return 2;
    case 'comment':
      return 1;
    case 'edit':
      return 4;
    case 'feedback':
      return 3;
    case 'api_approval':
      return 5;
    case 'csv_upload':
      return 5; // 비용 CSV 신규 등록 기본값
    case 'csv_update':
      return 2; // 비용 CSV 수정 기본값
    default:
      return 0;
  }
};

/**
 * 사용자 활동을 기록하고 점수를 업데이트합니다.
 * @param userId 사용자 ID
 * @param actionType 활동 타입
 * @param customPoints (선택사항) 지정된 포인트. 없으면 기본값 사용
 * @returns 업데이트된 점수 결과
 */
export async function logUserActivity(
  userId: string,
  actionType: ActivityType,
  customPoints?: number
) {
  try {
    console.log(`[Activity] Logging activity: ${actionType} for user: ${userId}`);

    // 1. 사용자 조회 (admin client 사용해 RLS 영향 방지)
    const { data: user, error: userError } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('[Activity] User fetch failed:', userError);
      return null;
    }

    if (!user) {
      console.error(`[Activity] User not found: ${userId}`);
      return null;
    }

    // 3. 활동 기록 (user_activities 테이블)
    // 트리거(on_activity_created)가 실행되어 User.activity_score가 자동으로 업데이트됩니다.
    const { data: activity, error: insertError } = await supabaseAdmin
      .from('user_activities')
      .insert({
        user_id: userId,
        action_type: actionType,
        points: customPoints ?? getActivityPoints(actionType),
      })
      .select()
      .single();

    // DB enum이 아직 확장되지 않은 경우(csv_* 타입 미등록) edit으로 폴백
    if (insertError) {
      const needsFallback =
        (actionType === 'csv_upload' || actionType === 'csv_update') &&
        insertError.message?.toLowerCase().includes('activity_type');

      if (needsFallback) {
        const fallbackType: ActivityType = 'edit';
        console.warn('[Activity] csv_* enum 미등록, edit으로 폴백합니다.');
        const { data: fallbackActivity, error: fallbackError } = await supabaseAdmin
          .from('user_activities')
          .insert({
            user_id: userId,
            action_type: fallbackType,
            points: customPoints ?? getActivityPoints(actionType),
          })
          .select()
          .single();

        if (fallbackError) {
          console.error('[Activity] Fallback insert failed:', fallbackError);
          return null;
        }

        console.log(`[Activity] Logged (fallback): ${fallbackType} (+${fallbackActivity.points}p)`);
        return {
          activityId: fallbackActivity.id,
          points: fallbackActivity.points,
          oldScore: 0,
          newScore: 0,
        };
      }

      console.error('[Activity] Insert failed:', insertError);
      return null;
    }

    console.log(`[Activity] Logged: ${actionType} (+${activity.points}p)`);

    return {
      activityId: activity.id,
      points: activity.points,
      oldScore: 0, // Legacy support (dummy value)
      newScore: 0, // Legacy support (dummy value)
    };
  } catch (error: any) {
    console.error('[Activity] Error logging activity:', error);
    // 활동 기록 실패가 메인 로직(게시글 작성 등)을 방해하지 않도록 에러를 던지지 않고 무시하거나 로그만 남김
    return null;
  }
}
