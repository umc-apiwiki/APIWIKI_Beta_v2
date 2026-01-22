// src/app/api/apis/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logUserActivity } from '@/lib/activity';
import type { ActivityType } from '@/types';

export const dynamic = 'force-dynamic';

const getPointsForAction = async (actionType: string) => {
  const fallback = actionType === 'csv_upload' ? 5 : 2;

  const { data, error } = await supabaseAdmin
    .from('point_rules')
    .select('points')
    .eq('action_type', actionType)
    .limit(1)
    .maybeSingle();

  if (error || !data || typeof data.points !== 'number') {
    return fallback;
  }

  return data.points;
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from('Api')
      .select('*, logo, wiki_content')
      .eq('id', id)
      .single();

    if (error) {
      console.error('API 조회 오류:', error);
      return NextResponse.json({ error: 'API 조회 실패', details: error.message }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ error: 'API를 찾을 수 없습니다' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API 라우트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const csv: string = body?.csv ?? '';

    if (!csv || typeof csv !== 'string' || csv.trim().length === 0) {
      return NextResponse.json({ error: 'CSV 내용을 입력해주세요.' }, { status: 400 });
    }

    // 기존 데이터 조회해 신규 업로드(5점) vs 수정(2점) 판단
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('Api')
      .select('pricing')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('CSV 조회 실패:', fetchError);
      return NextResponse.json(
        { error: 'API 조회 실패', details: fetchError.message },
        { status: 404 }
      );
    }

    const extractCsv = (pricingValue: unknown): string => {
      if (typeof pricingValue === 'string') return pricingValue;
      if (
        pricingValue &&
        typeof pricingValue === 'object' &&
        typeof (pricingValue as any).csv === 'string'
      ) {
        return (pricingValue as any).csv;
      }
      return '';
    };

    const existingCsv = extractCsv(existing?.pricing);
    const isNewUpload = existingCsv.trim().length === 0;

    // pricing 컬럼이 text이든 jsonb이든 문자열을 저장하도록 처리
    const { error } = await supabaseAdmin.from('Api').update({ pricing: csv }).eq('id', id);

    if (error) {
      console.error('CSV 저장 실패:', error);
      return NextResponse.json({ error: 'CSV 저장 실패', details: error.message }, { status: 500 });
    }

    const actionType: ActivityType = isNewUpload ? 'csv_upload' : 'csv_update';
    const points = await getPointsForAction(actionType);
    await logUserActivity(session.user.id, actionType, points);

    return NextResponse.json({ success: true, pointsAwarded: points });
  } catch (err: any) {
    console.error('CSV 업데이트 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
