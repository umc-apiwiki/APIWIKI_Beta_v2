// src/app/api/users/grade/route.ts
// 사용자 등급 업데이트 API

import { NextRequest, NextResponse } from 'next/server';
import { getById, update } from '@/lib/supabaseHelpers';
import { calculateGrade, getGradeInfo, isGradeUpgrade } from '@/lib/gradeUtils';
import type { User, UserGrade } from '@/types';

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
// POST: 등급 재계산 및 업데이트
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
        const newGrade = calculateGrade(currentScore);

        console.log(`[등급 업데이트] 사용자 ${userId} 등급 재계산`, {
            oldGrade,
            newGrade,
            score: currentScore,
        });

        // 등급이 변경된 경우에만 업데이트
        if (newGrade !== oldGrade) {
            // 등급은 상향만 가능 (하향 방지)
            if (!isGradeUpgrade(oldGrade, newGrade)) {
                console.log(`[등급 업데이트] 등급 하향 시도 차단: ${oldGrade} → ${newGrade}`);

                return NextResponse.json({
                    success: true,
                    data: {
                        userId,
                        oldGrade,
                        newGrade: oldGrade, // 기존 등급 유지
                        score: currentScore,
                        upgraded: false,
                    },
                    message: '등급은 하향되지 않습니다',
                });
            }

            // 등급 업데이트
            await update<User>('User', userId, {
                grade: newGrade,
            });

            console.log(`[등급 업그레이드] 사용자 ${userId}: ${oldGrade} → ${newGrade}`, {
                score: currentScore,
            });

            return NextResponse.json({
                success: true,
                data: {
                    userId,
                    oldGrade,
                    newGrade,
                    score: currentScore,
                    upgraded: true,
                },
                message: `축하합니다! ${getGradeInfo(newGrade).name} 등급으로 승급했습니다! 🎉`,
            });
        }

        // 등급 변경 없음
        return NextResponse.json({
            success: true,
            data: {
                userId,
                oldGrade,
                newGrade: oldGrade,
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
