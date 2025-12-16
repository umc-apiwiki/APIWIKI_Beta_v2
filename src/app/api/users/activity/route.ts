// src/app/api/users/activity/route.ts
// 사용자 활동 추적 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { create, update, getById } from '@/lib/supabaseHelpers';
import { calculateGrade, getActivityPoints } from '@/lib/gradeUtils';
import type { UserActivity, User, ActivityType } from '@/types';

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

        // 사용자 조회
        const user = await getById<User>('User', userId);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'USER_NOT_FOUND',
                    message: '사용자를 찾을 수 없습니다',
                },
                { status: 404 }
            );
        }

        // 활동 점수 계산
        const points = customPoints ?? getActivityPoints(actionType);
        const oldScore = user.activity_score;
        const newScore = oldScore + points;
        const oldGrade = user.grade;
        const newGrade = calculateGrade(newScore);

        console.log(`[활동 추적] 사용자 ${userId} - ${actionType} 활동 기록`, {
            oldScore,
            newScore,
            points,
            oldGrade,
            newGrade,
        });

        // 트랜잭션으로 처리 (활동 기록 + 점수 업데이트)
        // 1. 활동 기록 저장
        const activity = await create<UserActivity>('user_activities', {
            user_id: userId,
            action_type: actionType,
            points,
        });

        // 2. 사용자 점수 및 등급 업데이트
        await update<User>('User', userId, {
            activity_score: newScore,
            grade: newGrade,
        });

        const upgraded = newGrade !== oldGrade;

        // 등급 업그레이드 시 로그
        if (upgraded) {
            console.log(`[등급 업그레이드] 사용자 ${userId}: ${oldGrade} → ${newGrade}`, {
                score: newScore,
                activity: actionType,
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                activityId: activity.id,
                newScore,
                oldGrade,
                newGrade,
                upgraded,
            },
            message: upgraded
                ? `축하합니다! ${newGrade} 등급으로 승급했습니다! 🎉`
                : `활동이 기록되었습니다. (+${points}점)`,
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
