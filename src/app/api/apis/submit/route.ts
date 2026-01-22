// src/app/api/apis/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import type { APISubmissionPayload } from '@/types';

export async function POST(request: NextRequest) {
  try {
    let session = null;
    let userUser = null;

    // 세션/토큰 복호화 오류 방지를 위한 예외 처리
    try {
      session = await getServerSession(authOptions);
      userUser = session?.user;

      // getServerSession이 실패하거나 유저가 없을 경우 getToken으로 재시도
      if (!userUser) {
        const { getToken } = await import('next-auth/jwt');
        const token = await getToken({ req: request });
        if (token) {
          userUser = {
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
            grade: token.grade as any,
          };
        }
      }
    } catch (authError) {
      console.warn('Auth check failed (likely due to invalid/old session cookie):', authError);
    }

    // 인증 확인
    if (!userUser) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다', requiresAuth: true },
        { status: 401 }
      );
    }

    const body: APISubmissionPayload = await request.json();

    // 입력 검증
    if (!body.name || !body.company || !body.description) {
      return NextResponse.json(
        { success: false, error: '필수 필드를 모두 입력해주세요' },
        { status: 400 }
      );
    }

    if (!body.categories || body.categories.length === 0) {
      return NextResponse.json(
        { success: false, error: '최소 1개의 카테고리를 선택해주세요' },
        { status: 400 }
      );
    }

    // API 등록 데이터 준비
    const apiData = {
      name: body.name,
      company: body.company,
      description: body.description,
      categories: body.categories,
      price: body.price,
      logo: body.logo || '📦',
      status: 'pending' as const,
      created_by: userUser.id,
      // 선택적 필드
      ...(body.features &&
        body.features.length > 0 && {
          features: body.features,
        }),
      ...(body.pricing &&
        Object.keys(body.pricing).length > 0 && {
          pricing: body.pricing,
        }),
    };

    // Supabase에 저장
    const { data, error } = await supabase.from('Api').insert(apiData).select().single();

    if (error) {
      console.error('API 등록 실패:', error);
      return NextResponse.json(
        { success: false, error: 'API 등록 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API가 성공적으로 등록되었습니다',
      data,
    });
  } catch (error) {
    console.error('API 등록 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
