// src/app/api/wiki/edit/route.ts
// 위키 편집 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getById, update, create } from '@/lib/supabaseHelpers';
import { canEditWiki } from '@/lib/gradeUtils';
import type { User, API, WikiEdit } from '@/types';

// ============================================
// 요청/응답 타입
// ============================================

interface WikiEditRequest {
    apiId: string;
    content: string;
    summary: string;
    userId?: string;
}

interface WikiEditResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}

// ============================================
// POST: 위키 문서 편집
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<WikiEditResponse>> {
    try {
        const body: WikiEditRequest = await request.json();
        const { apiId, content, summary, userId } = body;

        // 입력 검증
        if (!apiId || !content || !summary) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: 'API ID, 내용, 편집 요약은 필수입니다',
                },
                { status: 400 }
            );
        }

        // 편집 요약 길이 검증
        if (summary.length < 5) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_SUMMARY',
                    message: '편집 요약은 최소 5자 이상이어야 합니다',
                },
                { status: 400 }
            );
        }

        // API 조회
        const api = await getById<API>('Api', apiId);
        if (!api) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'API_NOT_FOUND',
                    message: 'API를 찾을 수 없습니다',
                },
                { status: 404 }
            );
        }

        // 사용자 조회 및 권한 확인
        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'UNAUTHORIZED',
                    message: '로그인이 필요합니다',
                },
                { status: 401 }
            );
        }

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

        // 편집 권한 검증
        const currentLength = api.description?.length || 0;
        const editLength = Math.abs(content.length - currentLength);
        const permission = canEditWiki(user.grade, currentLength, editLength);

        if (!permission.canEdit) {
            console.log(`[위키 편집 거부] 사용자: ${userId}, 등급: ${user.grade}`, {
                currentLength,
                editLength,
                maxAllowed: permission.maxChars,
                reason: permission.reason,
            });

            return NextResponse.json(
                {
                    success: false,
                    error: 'PERMISSION_DENIED',
                    message: permission.reason || '편집 권한이 부족합니다',
                },
                { status: 403 }
            );
        }

        console.log(`[위키 편집] 사용자: ${userId}, API: ${apiId}`, {
            grade: user.grade,
            editLength,
            summary,
        });

        // 편집 이력 저장
        const { data: wikiEdit, error: editError } = await supabase
            .from('wiki_edits')
            .insert({
                api_id: apiId,
                user_id: userId,
                content_before: api.description || '',
                content_after: content,
                edit_summary: summary,
            })
            .select()
            .single();

        if (editError || !wikiEdit) {
            throw editError || new Error('편집 이력 저장 실패');
        }

        // API 문서 업데이트
        await update<API>('Api', apiId, {
            description: content,
        });

        // 활동 점수 증가 (edit: 3점)
        await fetch(`${request.nextUrl.origin}/api/users/activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                actionType: 'edit',
            }),
        });

        console.log(`[위키 편집 완료] 편집 ID: ${wikiEdit.id}`);

        return NextResponse.json({
            success: true,
            data: {
                editId: wikiEdit.id,
            },
            message: '위키 문서가 성공적으로 수정되었습니다! (+3점)',
        });
    } catch (error: any) {
        console.error('[위키 편집 API 오류]', {
            error: error.message,
            stack: error.stack,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '위키 편집 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
