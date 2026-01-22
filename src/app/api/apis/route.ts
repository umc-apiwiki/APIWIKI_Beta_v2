// src/app/api/apis/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Allow anonymous (or optional auth) submission?
    // User requested "I approve from DB... then show".
    // It's better to require login to track 'created_by' for points later.
    // Assuming login required for now to award points easily.
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { name, company, description, categories, price, logo, features, pricing } = body;

    // Validation
    if (!name || !company || !description || !categories || categories.length === 0) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }

    // Prepare data
    // Use 'Api' table.
    // Check schema cols: name, company, description, categories, price, logo, features, pricing (jsonb), status, created_by, slug (generate)

    // Simple slug gen
    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const { data, error } = await supabase
      .from('Api')
      .insert({
        name,
        company,
        description,
        categories,
        price,
        logo,
        features,
        pricing,
        status: 'pending', // Default strictly pending
        created_by: session.user.id,
        slug,
      })
      .select()
      .single();

    if (error) {
      console.error('API Creation DB Error:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: 'DB 저장 실패',
          details: error.message,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('API Registration Error:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const query = searchParams.get('q') || searchParams.get('query');
    const price = searchParams.get('price');
    const minRating = searchParams.get('minRating');
    const sort = searchParams.get('sort'); // popular, latest, rating
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    let supabaseQuery = supabase.from('Api').select('*, logo', { count: 'exact' });

    // 상태 필터 (기본값: approved)
    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    } else {
      supabaseQuery = supabaseQuery.eq('status', 'approved');
    }

    // 카테고리 필터
    if (category) {
      supabaseQuery = supabaseQuery.contains('categories', [category]);
    }

    // 검색어 필터 (이름, 설명, 회사명에서 검색)
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,company.ilike.%${query}%`
      );
    }

    // 가격 필터
    if (price) {
      supabaseQuery = supabaseQuery.eq('price', price);
    }

    // 정렬
    if (sort === 'latest') {
      supabaseQuery = supabaseQuery.order('createdat', { ascending: false });
    } else {
      // 기본 정렬: 최신순
      supabaseQuery = supabaseQuery.order('createdat', { ascending: false });
    }

    // 페이지네이션
    const offset = (page - 1) * limit;
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await supabaseQuery;

    if (error) {
      console.error('API 조회 오류:', error);
      return NextResponse.json({ error: 'API 조회 실패', details: error.message }, { status: 500 });
    }

    // 응답 헤더에 총 개수 포함
    return NextResponse.json(data || [], {
      headers: {
        'X-Total-Count': String(count || 0),
        'X-Page': String(page),
        'X-Limit': String(limit),
      },
    });
  } catch (error) {
    console.error('API 라우트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
