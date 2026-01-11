// src/app/api/wiki/edit/route.ts
// 위키 편집 API

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import { getById } from '@/lib/supabaseHelpers';
import type { User, API } from '@/types';

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

        // 사용자 조회 (로그인 여부만 확인)
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

        console.log(`[위키 편집] 사용자: ${userId}, API: ${apiId}`, {
            summary,
        });

        // 편집 이력 저장
        // RLS 영향 없이 저장하기 위해 admin 클라이언트 사용
        const { data: wikiEdit, error: editError } = await supabaseAdmin
            .from('wiki_edits')
            .insert({
                api_id: apiId,
                user_id: userId,
                content: content,
                diff: {
                    before: api.wiki_content || '',
                    after: content,
                    summary: summary
                },
            })
            .select()
            .single();

        if (editError || !wikiEdit) {
            throw editError || new Error('편집 이력 저장 실패');
        }

        // API 문서 업데이트 (wiki_content 컬럼 수정)
        const { error: updateError } = await supabaseAdmin
            .from('Api')
            .update({ wiki_content: content })
            .eq('id', apiId)
            .single();

        if (updateError) {
            throw updateError;
        }

        // 활동 점수 증가 (edit: 3점)
        // 활동 로그는 실패해도 본 편집을 막지 않도록 best-effort 처리
        try {
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
        } catch (activityError) {
            console.warn('[위키 편집] 활동 로그 실패', activityError);
        }

        console.log(`[위키 편집 완료] 편집 ID: ${wikiEdit.id}`);

        return NextResponse.json({
            success: true,
            data: {
                editId: wikiEdit.id,
            },
            message: '위키 문서가 성공적으로 수정되었습니다! (+3점)',
        });
    } catch (error: any) {
        console.error('[위키 편집 API 오류 상세]', {
            message: error.message,
            code: error.code, // Postgres error code
            details: error.details,
            hint: error.hint,
            stack: error.stack,
        });

        // Postgres Error 42703: Undefined Column (e.g. wiki_content missing)
        if (error.code === '42703' || error.message?.includes('wiki_content')) {
             return NextResponse.json(
                {
                    success: false,
                    error: 'DB_SCHEMA_ERROR',
                    message: '데이터베이스에 wiki_content 컬럼이 없습니다. SQL을 실행해주세요.',
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: `위키 편집 중 오류가 발생했습니다: ${error.message}`,
            },
            { status: 500 }
        );
    }
}
