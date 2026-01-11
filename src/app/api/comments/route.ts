// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import { logUserActivity } from '@/lib/activity';
import type { CommentSubmissionPayload } from '@/types';

// GET: 댓글 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const boardId = searchParams.get('board_id');

        if (!boardId) {
            return NextResponse.json(
                { success: false, error: 'board_id가 필요합니다' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('comments')
            .select(`
        *,
        author:author_id (
          id,
          name,
          grade
        )
      `)
            .eq('board_id', boardId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('댓글 목록 조회 실패:', error);
            return NextResponse.json(
                { success: false, error: '댓글 조회 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('댓글 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

// POST: 댓글 작성
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
             // 인증 실패로 간주하고 진행
        }

        const body: CommentSubmissionPayload = await request.json();

        // 입력 검증
        if (!body.board_id || !body.content) {
            return NextResponse.json(
                { success: false, error: '필수 필드를 모두 입력해주세요' },
                { status: 400 }
            );
        }

        // 커뮤니티 게시판은 로그인 필수
        const { data: board } = await supabase
            .from('boards')
            .select('type')
            .eq('id', body.board_id)
            .single();

        if (board?.type === 'community' && !userUser) {
            return NextResponse.json(
                { success: false, error: '로그인이 필요합니다', requiresAuth: true },
                { status: 401 }
            );
        }

        // 회원/비회원 구분
        let commentData: any = {
            board_id: body.board_id,
            content: body.content,
        };

        if (userUser) {
            // 회원
            commentData.author_id = userUser.id;
        } else {
            // 비회원
            if (!body.author_name || body.author_name.trim().length === 0) {
                return NextResponse.json(
                    { success: false, error: '작성자 이름을 입력해주세요' },
                    { status: 400 }
                );
            }
            commentData.author_name = body.author_name;
        }

        // Supabase에 저장
        const { data, error } = await supabase
            .from('comments')
            .insert(commentData)
            .select()
            .single();

        if (error) {
            console.error('댓글 작성 실패:', error);
            return NextResponse.json(
                { success: false, error: '댓글 작성 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        // 활동 점수 부여 (댓글 작성)
        if (userUser) {
            // 1 point for comment
            logUserActivity(userUser.id, 'comment', 1);
        }

        return NextResponse.json({
            success: true,
            message: '댓글이 작성되었습니다',
            data,
        });
    } catch (error) {
        console.error('댓글 작성 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
