// src/app/api/boards/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

// GET: 게시글 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
            .from('boards')
            .select(`
        *,
        author:author_id (
          id,
          name,
          grade
        )
      `)
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('게시글 조회 실패:', error);
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('게시글 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

// PUT: 게시글 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        // 입력 검증
        if (!body.title || !body.content) {
            return NextResponse.json(
                { success: false, error: '제목과 내용을 입력해주세요' },
                { status: 400 }
            );
        }

        // 기존 게시글 조회
        const { data: existingBoard, error: fetchError } = await supabase
            .from('boards')
            .select('author_id')
            .eq('id', params.id)
            .single();

        if (fetchError || !existingBoard) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        // 권한 확인 (작성자만 수정 가능)
        if (!session?.user || existingBoard.author_id !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '수정 권한이 없습니다' },
                { status: 403 }
            );
        }

        // 게시글 수정
        const { data, error } = await supabase
            .from('boards')
            .update({
                title: body.title,
                content: body.content,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('게시글 수정 실패:', error);
            return NextResponse.json(
                { success: false, error: '게시글 수정 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '게시글이 수정되었습니다',
            data,
        });
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

// DELETE: 게시글 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: '로그인이 필요합니다' },
                { status: 401 }
            );
        }

        // 기존 게시글 조회
        const { data: existingBoard, error: fetchError } = await supabase
            .from('boards')
            .select('author_id')
            .eq('id', params.id)
            .single();

        if (fetchError || !existingBoard) {
            return NextResponse.json(
                { success: false, error: '게시글을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        const isAuthor = existingBoard.author_id === session.user.id;
        const isAdmin = session.user.grade === 'admin';

        if (!isAuthor && !isAdmin) {
            return NextResponse.json(
                { success: false, error: '삭제 권한이 없습니다' },
                { status: 403 }
            );
        }

        // 게시글 삭제
        const { error } = await supabase
            .from('boards')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('게시글 삭제 실패:', error);
            return NextResponse.json(
                { success: false, error: '게시글 삭제 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '게시글이 삭제되었습니다',
        });
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
