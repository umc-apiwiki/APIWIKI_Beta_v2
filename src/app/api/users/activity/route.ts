// src/app/api/users/activity/route.ts
// 사용자 활동 추적 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { create, update, getById } from '@/lib/supabaseHelpers';
import type { UserActivity, User, ActivityType } from '@/types';

import { logUserActivity } from '@/lib/activity';

// ============================================
// 요청/응답 타입
// ============================================

interface ActivityRequest {
    userId: string;
    actionType: ActivityType;
    points?: number; // 선택사항: 커스텀 점수 (기본값은 actionType에 따름)
}

interface ActivityResponse {
    success: boolean;
    data?: {
        activityId: string;
        newScore: number;
        oldGrade: string;
        newGrade: string;
        upgraded: boolean;
    };
    error?: string;
    message?: string;
}

// ============================================
// POST: 활동 기록 및 점수 증가
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<ActivityResponse>> {
    try {
        const body: ActivityRequest = await request.json();
        const { userId, actionType, points: customPoints } = body;

        // 입력 검증
        if (!userId || !actionType) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: 'userId와 actionType은 필수입니다',
                },
                { status: 400 }
            );
        }

        // 활동 기록 (공통 함수 사용)
        const result = await logUserActivity(userId, actionType, customPoints);

        if (!result) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'LOGGING_FAILED',
                    message: '활동 기록에 실패했습니다 (사용자를 찾을 수 없거나 DB 오류)',
                },
                { status: 500 } // Or 404 if user not found, simplified here
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                activityId: result.activityId,
                newScore: result.newScore,
                oldGrade: 'maintenance', // 등급 시스템 제거되어 유지
                newGrade: 'maintenance',
                upgraded: false,
            },
            message: `활동이 기록되었습니다. (+${result.points}점)`,
        });
    } catch (error: any) {
        console.error('[활동 추적 API 오류]', {
            error: error.message,
            stack: error.stack,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '활동 기록 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET: 사용자 활동 내역 조회
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: 'userId는 필수입니다',
                },
                { status: 400 }
            );
        }

        // 사용자 활동 내역 조회
        const { data: activities, error } = await supabase
            .from('user_activities')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: activities,
        });
    } catch (error: any) {
        console.error('[활동 내역 조회 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '활동 내역 조회 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
