// src/app/api/wiki/request/route.ts
// 비회원 위키 수정 요청 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getById } from '@/lib/supabaseHelpers';
import type { API } from '@/types';

// ============================================
// 요청/응답 타입
// ============================================

interface WikiEditRequestBody {
    apiId: string;
    content: string;
    summary: string;
    authorName?: string;
}

// ============================================
// POST: 비회원 수정 요청 제출
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body: WikiEditRequestBody = await request.json();
        const { apiId, content, summary, authorName } = body;

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
        const api = await getById<Api>('Api', apiId);
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

        console.log(`[비회원 수정 요청] API: ${apiId}, 요청자: ${authorName || '익명'}`);

        // 수정 요청 저장 (승인 대기 상태)
        const { data: editRequest, error } = await supabase
            .from('wiki_edits')
            .insert({
                api_id: apiId,
                user_id: null,
                author_name: authorName || '익명',
                content_before: api.description || '',
                content_after: content,
                edit_summary: summary,
                is_approved: false,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        console.log(`[비회원 수정 요청 저장] 요청 ID: ${editRequest.id}`);

        return NextResponse.json({
            success: true,
            data: {
                requestId: editRequest.id,
            },
            message: '수정 요청이 제출되었습니다. 관리자 승인 후 반영됩니다.',
        });
    } catch (error: any) {
        console.error('[비회원 수정 요청 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '수정 요청 제출 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// GET: 수정 요청 목록 조회 (관리자용)
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // pending, approved, rejected
        const limit = parseInt(searchParams.get('limit') || '50');

        console.log(`[수정 요청 목록 조회] 상태: ${status || '전체'}`);

        let query = supabase
            .from('wiki_edits')
            .select('*, Api(id, name)')
            .is('user_id', null)
            .order('created_at', { ascending: false })
            .limit(limit);

        // 상태 필터
        if (status === 'pending') {
            query = query.is('is_approved', null);
        } else if (status === 'approved') {
            query = query.eq('is_approved', true);
        } else if (status === 'rejected') {
            query = query.eq('is_approved', false);
        }

        const { data: requests, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: requests,
        });
    } catch (error: any) {
        console.error('[수정 요청 목록 조회 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '수정 요청 목록 조회 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}

// ============================================
// PATCH: 수정 요청 승인/거부 (관리자용)
// ============================================

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { requestId, approved } = body;

        if (!requestId || approved === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: '요청 ID와 승인 여부는 필수입니다',
                },
                { status: 400 }
            );
        }

        console.log(`[수정 요청 처리] 요청 ID: ${requestId}, 승인: ${approved}`);

        // 수정 요청 조회
        const { data: editRequest, error: fetchError } = await supabase
            .from('wiki_edits')
            .select('*, Api(id, description)')
            .eq('id', requestId)
            .single();

        if (fetchError || !editRequest) {
            throw fetchError || new Error('수정 요청을 찾을 수 없습니다');
        }

        // 승인 상태 업데이트
        const { error: updateError } = await supabase
            .from('wiki_edits')
            .update({ is_approved: approved })
            .eq('id', requestId);

        if (updateError) {
            throw updateError;
        }

        // 승인된 경우 API 문서 업데이트
        if (approved) {
            const { error: apiUpdateError } = await supabase
                .from('Api')
                .update({ description: editRequest.content_after })
                .eq('id', editRequest.api_id);

            if (apiUpdateError) {
                throw apiUpdateError;
            }

            console.log(`[수정 요청 승인 완료] API 문서 업데이트됨`);
        }

        return NextResponse.json({
            success: true,
            message: approved ? '수정 요청이 승인되었습니다' : '수정 요청이 거부되었습니다',
        });
    } catch (error: any) {
        console.error('[수정 요청 처리 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '수정 요청 처리 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
