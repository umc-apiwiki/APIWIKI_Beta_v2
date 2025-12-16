// src/app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
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
        const session = await getServerSession(authOptions);
        const body: CommentSubmissionPayload = await request.json();

        // 입력 검증
        if (!body.board_id || !body.content) {
            return NextResponse.json(
                { success: false, error: '필수 필드를 모두 입력해주세요' },
                { status: 400 }
            );
        }

        // 회원/비회원 구분
        let commentData: any = {
            board_id: body.board_id,
            content: body.content,
        };

        if (session?.user) {
            // 회원
            commentData.author_id = session.user.id;
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
