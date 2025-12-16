// src/app/api/admin/pending-apis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
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

        // 대기 중인 API 목록 조회 (생성자 정보 포함)
        const { data, error } = await supabase
            .from('Api')
            .select(`
        *,
        creator:created_by (
          id,
          name,
          email,
          grade
        )
      `)
            .eq('status', 'pending')
            .order('createdAt', { ascending: false });

        if (error) {
            console.error('대기 API 목록 조회 실패:', error);
            return NextResponse.json(
                { success: false, error: '목록 조회 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('대기 API 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
