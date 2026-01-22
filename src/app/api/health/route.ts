import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Supabase 연결 확인
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('DB healthcheck failed', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('DB healthcheck failed', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
