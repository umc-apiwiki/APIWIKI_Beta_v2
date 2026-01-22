// src/components/UserProfile.tsx
// 사용자 프로필 컴포넌트

'use client';

import React, { useEffect, useState } from 'react';
import type { User, UserActivity } from '@/types';

// ============================================
// Props 타입
// ============================================

interface UserProfileProps {
  user: User;
  showActivities?: boolean;
}

// ============================================
// 컴포넌트
// ============================================

export default function UserProfile({ user, showActivities = true }: UserProfileProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // 활동 내역 조회
  useEffect(() => {
    if (showActivities) {
      fetchActivities();
    }
  }, [user.id, showActivities]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/activity?userId=${user.id}&limit=5`);
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('활동 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 사용자 정보 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
          👤
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{user.name || user.email}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* 활동 점수 (등급 관련 진행률 바 등 제거) */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="text-center flex-1">
            <div className="text-xs text-gray-600 mb-1">활동 점수</div>
            <div className="text-lg font-bold text-gray-900">{user.activity_score}점</div>
          </div>
          <div className="text-center flex-1 border-l border-gray-200">
            <div className="text-xs text-gray-600 mb-1">회원 유형</div>
            <div
              className="text-lg font-bold"
              style={{ color: user.grade === 'admin' ? '#1976D2' : 'var(--text-dark)' }}
            >
              {user.grade === 'admin' ? '운영진' : '일반 회원'}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 내역 */}
      {showActivities && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">최근 활동</h3>
          {loading ? (
            <div className="text-center py-4 text-gray-500">로딩 중...</div>
          ) : activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getActivityIcon(activity.action_type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getActivityName(activity.action_type)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(activity.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">+{activity.points}점</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">활동 내역이 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// 헬퍼 함수
// ============================================

function getActivityIcon(actionType: string): string {
  const icons: Record<string, string> = {
    login: '🔑',
    post: '📝',
    comment: '💬',
    edit: '✏️',
  };
  return icons[actionType] || '📌';
}

function getActivityName(actionType: string): string {
  const names: Record<string, string> = {
    login: '로그인',
    post: '게시글 작성',
    comment: '댓글 작성',
    edit: '위키 편집',
  };
  return names[actionType] || '활동';
}
