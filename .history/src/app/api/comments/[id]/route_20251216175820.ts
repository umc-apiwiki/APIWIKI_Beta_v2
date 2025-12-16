// src/app/api/comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';

// DELETE: 댓글 삭제
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

        // 기존 댓글 조회
        const { data: existingComment, error: fetchError } = await supabase
            .from('comments')
            .select('author_id')
            .eq('id', params.id)
            .single();

        if (fetchError || !existingComment) {
            return NextResponse.json(
                { success: false, error: '댓글을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        // 권한 확인 (작성자 또는 관리자만 삭제 가능)
        const isAuthor = existingComment.author_id === session.user.id;
        const isAdmin = session.user.grade === 'admin';

        if (!isAuthor && !isAdmin) {
            return NextResponse.json(
                { success: false, error: '삭제 권한이 없습니다' },
                { status: 403 }
            );
        }

        // 댓글 삭제
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('댓글 삭제 실패:', error);
            return NextResponse.json(
                { success: false, error: '댓글 삭제 중 오류가 발생했습니다' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '댓글이 삭제되었습니다',
        });
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        return NextResponse.json(
            { success: false, error: '서버 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}
