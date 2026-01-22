// src/components/admin/FeedbackList.tsx
// 관리자용 피드백 목록 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import type { Feedback, FeedbackType, FeedbackStatus } from '@/types';

// ============================================
// 타입 정의
// ============================================

interface FeedbackWithUser extends Feedback {
  User?: {
    id: string;
    name: string;
    email: string;
  };
}

// ============================================
// 상수
// ============================================

const FEEDBACK_TYPE_INFO: Record<FeedbackType, { label: string; icon: string; color: string }> = {
  error: { label: '오류 제보', icon: '🐛', color: 'red' },
  feature: { label: '기능 제안', icon: '💡', color: 'blue' },
  idea: { label: '아이디어', icon: '✨', color: 'purple' },
};

const FEEDBACK_STATUS_INFO: Record<FeedbackStatus, { label: string; color: string }> = {
  pending: { label: '대기중', color: 'yellow' },
  reviewed: { label: '검토완료', color: 'blue' },
  resolved: { label: '해결완료', color: 'green' },
};

// ============================================
// 컴포넌트
// ============================================

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FeedbackType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithUser | null>(null);

  // 피드백 목록 조회
  useEffect(() => {
    fetchFeedbacks();
  }, [filterType, filterStatus]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/feedback?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('피드백 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 피드백 상태 변경
  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // 목록 새로고침
        fetchFeedbacks();
        alert('피드백 상태가 업데이트되었습니다');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다');
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">피드백 관리</h2>
        <button
          onClick={fetchFeedbacks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 필터 */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">타입</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FeedbackType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="error">오류 제보</option>
            <option value="feature">기능 제안</option>
            <option value="idea">아이디어</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FeedbackStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="pending">대기중</option>
            <option value="reviewed">검토완료</option>
            <option value="resolved">해결완료</option>
          </select>
        </div>
      </div>

      {/* 피드백 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">피드백이 없습니다</div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{FEEDBACK_TYPE_INFO[feedback.type].icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {FEEDBACK_TYPE_INFO[feedback.type].label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {feedback.User ? (
                        <>
                          {feedback.User.name} ({feedback.User.email})
                        </>
                      ) : (
                        '비회원'
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-${
                      FEEDBACK_STATUS_INFO[feedback.status].color
                    }-100 text-${FEEDBACK_STATUS_INFO[feedback.status].color}-700`}
                  >
                    {FEEDBACK_STATUS_INFO[feedback.status].label}
                  </span>
                  <select
                    value={feedback.status}
                    onChange={(e) =>
                      handleStatusChange(feedback.id, e.target.value as FeedbackStatus)
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="pending">대기중</option>
                    <option value="reviewed">검토완료</option>
                    <option value="resolved">해결완료</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
              </div>

              <div className="text-xs text-gray-500">
                {new Date(feedback.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
