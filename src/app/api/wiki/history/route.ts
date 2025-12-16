// src/app/api/wiki/history/route.ts
// 위키 편집 이력 조회 API

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// ============================================
// GET: 위키 편집 이력 조회
// ============================================

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const apiId = searchParams.get('apiId');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!apiId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_INPUT',
                    message: 'API ID는 필수입니다',
                },
                { status: 400 }
            );
        }

        console.log(`[위키 편집 이력 조회] API: ${apiId}`);

        // 편집 이력 조회
        const { data: edits, error } = await supabase
            .from('wiki_edits')
            .select('*, User(id, name, email, grade)')
            .eq('api_id', apiId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: edits,
            message: `${edits?.length || 0}개의 편집 이력을 조회했습니다`,
        });
    } catch (error: any) {
        console.error('[위키 편집 이력 조회 오류]', {
            error: error.message,
        });

        return NextResponse.json(
            {
                success: false,
                error: 'INTERNAL_ERROR',
                message: '편집 이력 조회 중 오류가 발생했습니다',
            },
            { status: 500 }
        );
    }
}
