// src/app/api/apis/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import type { ApiStatus } from '@/types';

interface ApproveRequestBody {
    apiId: string;
    action: 'approve' | 'reject';
}

export async function POST(request: NextRequest) {
    try {
        // 인증 확인
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '로그인이 필요합니다' },
                { status: 401 }
            );
        }

        // 관리자 권한 확인
        if (session.user.grade !== 'admin') {
            return NextResponse.json(
                { success: false, error: '관리자 권한이 필요합니다' },
                { status: 403 }
            );
        }

        const body: ApproveRequestBody = await request.json();

        // 입력 검증
        if (!body.apiId || !body.action) {
            return NextResponse.json(
                { success: false, error: '필수 필드를 모두 입력해주세요' },
                { status: 400 }
            );
        }

        if (body.action !== 'approve' && body.action !== 'reject') {
            return NextResponse.json(
                { success: false, error: '잘못된 액션입니다' },
                { status: 400 }
            );
        }

        // API 상태 업데이트
        const newStatus: ApiStatus = body.action === 'approve' ? 'approved' : 'rejected';
        const updateData: any = {
            status: newStatus,
            approved_by: session.user.id,
            approved_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('Api')
            .update(updateData)
            .eq('id', body.apiId)
            .select()
            .single();

        if (error) {
            console.error('API 승인/거부 실패:', error);
            return NextResponse.json(
                { success: false, error: 'API 상태 업데이트 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: body.action === 'approve' ? 'API가 승인되었습니다' : 'API가 거부되었습니다',
            data,
        });
    } catch (error) {
        console.error('API 승인/거부 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
