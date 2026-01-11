import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const DEFAULTS: Record<string, number> = {
  csv_upload: 5,
  csv_update: 2,
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const actionTypesParam = url.searchParams.get('actionTypes');
    const actionTypes = actionTypesParam
      ? actionTypesParam.split(',').map((s) => s.trim()).filter(Boolean)
      : Object.keys(DEFAULTS);

    const { data, error } = await supabase
      .from('point_rules')
      .select('action_type, points')
      .in('action_type', actionTypes);

    const result: Record<string, number> = { ...DEFAULTS };

    if (error) {
      console.error('point_rules 조회 오류:', error);
      return NextResponse.json(result, { status: 200 });
    }

    if (Array.isArray(data)) {
      data.forEach((row) => {
        if (row?.action_type && typeof row.points === 'number') {
          result[row.action_type] = row.points;
        }
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('point_rules 핸들러 오류:', err);
    return NextResponse.json(DEFAULTS, { status: 200 });
  }
}
