// src/app/api/feedback/route.ts
// 피드백 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { create, getAll } from '@/lib/supabaseHelpers';

import type { Feedback, FeedbackType, FeedbackStatus } from '@/types';

// ============================================
// 요청/응답 타입
// ============================================

interface FeedbackSubmitRequest {
    type: FeedbackType;
    content: string;
    userId?: string;
}

interface FeedbackResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}

// ============================================
// POST: 피드백 제출
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
    try {
        const body: FeedbackSubmitRequest = await request.json();
        const { type, content, userId } = body;

        // 입력 검증
        if (!type || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: '피드백 타입과 내용은 필수입니다',
                },
                { status: 400 }
            );
        }

        // 피드백 타입 검증
        const validTypes: FeedbackType[] = ['error', 'feature', 'idea'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_TYPE',
                    message: '유효하지 않은 피드백 타입입니다',
                },
                { status: 400 }
            );
        }

        // 내용 길이 검증
        if (content.length < 10 || content.length > 1000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_CONTENT_LENGTH',
                    message: '피드백 내용은 10자 이상 1000자 이하여야 합니다',
                },
                { status: 400 }
            );
        }

        console.log(`[피드백 제출] 타입: ${type}, 사용자: ${userId || '비회원'}`, {
            contentLength: content.length,
        });

        // 피드백 저장
        const feedback = await create<Feedback>('feedback', {
            type,
            content,
            user_id: userId || null,
            status: 'pending',
        });

        console.log(`[피드백 저장 완료] ID: ${feedback.id}`);

        // 활동 점수 부여 (피드백 제출) - DB Trigger로 자동 처리됨

        return NextResponse.json({
            success: true,
            data: {
                id: feedback.id,
            },
            message: '피드백이 성공적으로 제출되었습니다. 소중한 의견 감사합니다! 🙏',
        });
    } catch (error: any) {
        console.error('[피드백 제출 API 오류]', {
            error: error.message,
            stack: error.stack,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '피드백 제출 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET: 피드백 목록 조회 (관리자용)
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as FeedbackStatus | null;
        const type = searchParams.get('type') as FeedbackType | null;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        console.log(`[피드백 목록 조회] 상태: ${status || '전체'}, 타입: ${type || '전체'}`);

        // 쿼리 빌드
        let query = supabase
            .from('feedback')
            .select('*, User(id, name, email)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        // 상태 필터
        if (status) {
            query = query.eq('status', status);
        }

        // 타입 필터
        if (type) {
            query = query.eq('type', type);
        }

        const { data: feedbacks, error, count } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: feedbacks,
            message: `총 ${count}개의 피드백을 조회했습니다`,
        });
    } catch (error: any) {
        console.error('[피드백 목록 조회 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '피드백 목록 조회 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH: 피드백 상태 업데이트 (관리자용)
// ============================================

export async function PATCH(request: NextRequest): Promise<NextResponse<FeedbackResponse>> {
    try {
        const body = await request.json();
        const { id, status } = body;

        // 입력 검증
        if (!id || !status) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: 'ID와 상태는 필수입니다',
                },
                { status: 400 }
            );
        }

        // 상태 검증
        const validStatuses: FeedbackStatus[] = ['pending', 'reviewed', 'resolved'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_STATUS',
                    message: '유효하지 않은 상태입니다',
                },
                { status: 400 }
            );
        }

        console.log(`[피드백 상태 업데이트] ID: ${id}, 상태: ${status}`);

        // 상태 업데이트
        const { data, error } = await supabase
            .from('feedback')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        console.log(`[피드백 상태 업데이트 완료] ID: ${id}`);

        return NextResponse.json({
            success: true,
            data,
            message: '피드백 상태가 업데이트되었습니다',
        });
    } catch (error: any) {
        console.error('[피드백 상태 업데이트 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '피드백 상태 업데이트 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
