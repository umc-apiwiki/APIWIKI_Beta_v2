// src/app/api/users/grade/route.ts
// 사용자 등급 업데이트 API

import { NextRequest, NextResponse } from 'next/server';
import { getById, update } from '@/lib/supabaseHelpers';
import type { User, UserGrade } from '@/types';

const getGradeInfo = (grade: UserGrade) => {
    switch (grade) {
        case 'bronze': return { name: '브론즈', color: '#CD7F32', icon: '🥉' };
        case 'silver': return { name: '실버', color: '#C0C0C0', icon: '🥈' };
        case 'gold': return { name: '골드', color: '#FFD700', icon: '🥇' };
        case 'admin': return { name: '관리자', color: '#EF4444', icon: '👑' };
        default: return { name: '브론즈', color: '#CD7F32', icon: '🥉' };
    }
};

// ============================================
// 요청/응답 타입
// ============================================

interface GradeUpdateRequest {
    userId: string;
}

interface GradeUpdateResponse {
    success: boolean;
    data?: {
        userId: string;
        oldGrade: UserGrade;
        newGrade: UserGrade;
        score: number;
        upgraded: boolean;
    };
    error?: string;
    message?: string;
}

interface GradeInfoResponse {
    success: boolean;
    data?: {
        userId: string;
        grade: UserGrade;
        score: number;
        gradeInfo: ReturnType<typeof getGradeInfo>;
    };
    error?: string;
    message?: string;
}

// ============================================
// POST: 등급 재계산 및 업데이트 (No-op after removing grading system)
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<GradeUpdateResponse>> {
    try {
        const body: GradeUpdateRequest = await request.json();
        const { userId } = body;

        // 입력 검증
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

        const oldGrade = user.grade;
        const currentScore = user.activity_score;
        const newGrade = oldGrade; // Keep same grade (Grading system removed)

        console.log(`[등급 업데이트] 사용자 ${userId}: ${oldGrade} (유지)`, {
            score: currentScore,
        });

        // 등급 변경 없음
        return NextResponse.json({
            success: true,
            data: {
                userId,
                oldGrade,
                newGrade,
                score: currentScore,
                upgraded: false,
            },
            message: '현재 등급이 유지됩니다',
        });
    } catch (error: any) {
        console.error('[등급 업데이트 API 오류]', {
            error: error.message,
            stack: error.stack,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '등급 업데이트 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET: 사용자 등급 정보 조회
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse<GradeInfoResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

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

        const gradeInfo = getGradeInfo(user.grade);

        return NextResponse.json({
            success: true,
            data: {
                userId,
                grade: user.grade,
                score: user.activity_score,
                gradeInfo,
            },
        });
    } catch (error: any) {
        console.error('[등급 정보 조회 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '등급 정보 조회 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
