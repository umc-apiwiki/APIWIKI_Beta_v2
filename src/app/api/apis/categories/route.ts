// src/app/api/apis/categories/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Api')
      .select('categories')
      .eq('status', 'approved');

    if (error) {
      console.error('카테고리 조회 오류:', error);
      return NextResponse.json(
        { error: '카테고리 조회 실패', details: error.message },
        { status: 500 }
      );
    }

    // 모든 카테고리를 중복 제거하여 반환
    const allCategories = data?.flatMap(api => api.categories || []) || [];
    const uniqueCategories = Array.from(new Set(allCategories)).sort();

    return NextResponse.json(uniqueCategories);
  } catch (error) {
    console.error('카테고리 API 라우트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
