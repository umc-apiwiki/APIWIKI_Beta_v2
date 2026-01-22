// src/components/CommentSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PointNotificationModal from './PointNotificationModal';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/permissions';
import type { Comment, CommentSubmissionPayload } from '@/types';

interface CommentSectionProps {
  boardId: string;
}

export default function CommentSection({ boardId }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CommentSubmissionPayload>({
    board_id: boardId,
    content: '',
    author_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false); // 동기적 중복 방지용
  const [error, setError] = useState('');
  const [showPointsModal, setShowPointsModal] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [boardId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?board_id=${boardId}`);
      const result = await response.json();

      if (response.ok) {
        setComments(result.data || []);
      }
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 동기적 중복 제출 방지
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setError('');

    if (!formData.content.trim()) {
      setError('댓글 내용을 입력해주세요');
      isSubmittingRef.current = false;
      return;
    }

    if (!isAuthenticated && !formData.author_name?.trim()) {
      setError('작성자 이름을 입력해주세요');
      isSubmittingRef.current = false;
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.requiresAuth || response.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          window.location.reload();
          return;
        }
        throw new Error(result.error || '댓글 작성에 실패했습니다');
      }

      // 성공
      setFormData({ board_id: boardId, content: '', author_name: '' });
      await fetchComments();
      setShowPointsModal(true);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || '댓글 삭제에 실패했습니다');
      }

      await fetchComments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canDeleteComment = (comment: Comment) => {
    if (!isAuthenticated) return false;
    return comment.author_id === user?.id || isAdmin(user);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-[20px] font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
        댓글 ({comments.length})
      </h3>

      {/* 댓글 작성 폼 */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white card-shadow p-4 space-y-3"
        style={{ borderRadius: '20px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {error && (
            <motion.div
              className="p-4 rounded-[12px]"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-[14px]" style={{ color: '#dc2626' }}>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Authenticated State: Show Form */}
        {isAuthenticated ? (
          <>
            <div>
              <label
                className="block text-[14px] font-medium mb-2"
                style={{ color: 'var(--text-dark)' }}
              >
                댓글 내용 *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="댓글을 입력하세요"
                rows={2}
                className="w-full px-3 py-2 border-2 rounded-[12px] focus:outline-none resize-none transition-all text-[14px]"
                style={{
                  borderColor: formData.content ? 'var(--primary-blue)' : 'rgba(0, 0, 0, 0.1)',
                  color: 'var(--text-dark)',
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-md bg-[#0c4a6e] text-white shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -1 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </motion.button>
          </>
        ) : (
          /* Unauthenticated State: Show Login Message */
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <p className="text-[16px] font-medium text-gray-500">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <div className="p-2 bg-gray-50 rounded-lg text-sm text-gray-400">
              🔒 로그인 후 의견을 공유해보세요!
            </div>
          </div>
        )}
      </motion.form>

      {/* 댓글 목록 */}
      {loading ? (
        <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--primary-blue)', borderTopColor: 'transparent' }}
          ></div>
          <p className="mt-3 text-[14px]" style={{ color: 'var(--text-gray)' }}>
            로딩 중...
          </p>
        </motion.div>
      ) : comments.length === 0 ? (
        <motion.div
          className="bg-white card-shadow text-center py-12 rounded-[20px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-[48px] mb-3 opacity-30">💬</div>
          <p className="text-[16px]" style={{ color: 'var(--text-gray)' }}>
            첫 댓글을 작성해보세요
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="bg-white card-shadow rounded-[16px] p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--primary-blue)15' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="8" r="4" stroke="var(--primary-blue)" strokeWidth="2" />
                      <path
                        d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21"
                        stroke="var(--primary-blue)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-[15px]"
                        style={{ color: 'var(--text-dark)' }}
                      >
                        {comment.author?.name || comment.author_name}
                      </span>
                      {comment.author?.grade === 'admin' && (
                        <span
                          className="px-2 py-0.5 text-[11px] font-bold rounded-full"
                          style={{
                            backgroundColor: '#E3F2FD',
                            color: '#1976D2',
                            border: '1px solid #BBDEFB',
                          }}
                        >
                          운영진
                        </span>
                      )}
                    </div>
                    <span className="text-[13px]" style={{ color: 'var(--text-gray)' }}>
                      {new Date(comment.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
                {canDeleteComment(comment) && (
                  <motion.button
                    onClick={() => handleDelete(comment.id)}
                    className="text-[13px] px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:border-sky-400 transition-colors"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    삭제
                  </motion.button>
                )}
              </div>
              <p
                className="text-[15px] whitespace-pre-wrap leading-relaxed"
                style={{ color: 'var(--text-dark)' }}
              >
                {comment.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
      <PointNotificationModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={1}
        message="댓글 작성 완료!"
      />
    </div>
  );
}
