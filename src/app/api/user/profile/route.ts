// src/app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export async function PATCH(request: NextRequest) {
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
      console.warn('Auth check failed:', authError);
    }

    if (!userUser) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다', requiresAuth: true },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, bio, password } = body;

    // 업데이트할 데이터 준비
    const updateData: any = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // 비밀번호 변경
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: '비밀번호는 최소 6자 이상이어야 합니다' },
          { status: 400 }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password_hash = hashedPassword;
    }

    // 업데이트할 데이터가 없으면 에러 반환
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 데이터가 없습니다' },
        { status: 400 }
      );
    }

    console.log('업데이트 데이터:', updateData);

    // Supabase 업데이트
    const { data, error } = await supabase
      .from('User')
      .update(updateData)
      .eq('id', userUser.id)
      .select()
      .single();

    if (error) {
      console.error('프로필 업데이트 실패:', error);
      return NextResponse.json(
        { success: false, error: '프로필 업데이트 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다',
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        grade: data.grade,
      },
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
