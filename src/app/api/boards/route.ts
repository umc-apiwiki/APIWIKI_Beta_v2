// src/app/api/boards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

import type { BoardSubmissionPayload, BoardType } from '@/types';

// GET: 게시판 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as BoardType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('boards')
      .select(
        `
        *,
        author:author_id (
          id,
          name,
          grade
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 타입 필터링
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('게시판 목록 조회 실패:', error);
      return NextResponse.json(
        { success: false, error: '목록 조회 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('게시판 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

// POST: 게시글 작성
export async function POST(request: NextRequest) {
  try {
    let session = null;
    let userUser = null;

    // 세션/토큰 복호화 오류(JWEDecryptionFailed) 방지를 위한 예외 처리
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
      // 인증 실패로 간주하고 진행 -> 아래에서 비회원/로그인 유도 처리됨
    }

    const body: BoardSubmissionPayload = await request.json();

    // 입력 검증
    if (!body.type || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: '필수 필드를 모두 입력해주세요' },
        { status: 400 }
      );
    }

    // 타입 검증
    if (!['inquiry', 'qna', 'free', 'community'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: '올바른 게시판 타입이 아닙니다' },
        { status: 400 }
      );
    }

    // 커뮤니티 게시판은 로그인 필수
    if (body.type === 'community' && !userUser) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다', requiresAuth: true },
        { status: 401 }
      );
    }

    // 회원/비회원 구분
    let boardData: any = {
      type: body.type,
      title: body.title,
      content: body.content,
    };

    if (userUser) {
      // 회원
      boardData.author_id = userUser.id;
    } else {
      // 비회원
      if (!body.author_name || body.author_name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: '작성자 이름을 입력해주세요' },
          { status: 400 }
        );
      }
      boardData.author_name = body.author_name;
    }

    // Supabase에 저장
    const { data, error } = await supabase.from('boards').insert(boardData).select().single();

    if (error) {
      console.error('게시글 작성 실패:', error);
      return NextResponse.json(
        { success: false, error: '게시글 작성 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    // 활동 점수 부여 (게시글 작성) - DB Trigger로 자동 처리됨
    // if (userUser) {
    //    logUserActivity(userUser.id, 'post', 4);
    // }

    return NextResponse.json({
      success: true,
      message: '게시글이 작성되었습니다',
      data,
    });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
