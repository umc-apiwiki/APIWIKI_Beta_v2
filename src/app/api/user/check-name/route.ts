// src/app/api/user/check-name/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: '닉네임을 입력해주세요' }, { status: 400 });
    }

    // 닉네임 중복 확인
    const { data, error } = await supabase
      .from('User')
      .select('id')
      .eq('name', name.trim())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116은 결과가 없을 때 발생하는 에러 (중복이 없음 = 사용 가능)
      console.error('닉네임 확인 오류:', error);
      return NextResponse.json(
        { success: false, error: '닉네임 확인 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }

    // data가 있으면 이미 사용 중인 닉네임
    if (data) {
      return NextResponse.json({
        success: true,
        available: false,
        message: '이미 사용 중인 닉네임입니다',
      });
    }

    // data가 없으면 사용 가능한 닉네임
    return NextResponse.json({
      success: true,
      available: true,
      message: '사용 가능한 닉네임입니다',
    });
  } catch (error) {
    console.error('닉네임 확인 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
