import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { logUserActivity } from '@/lib/activity';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        // 1. Check Admin Auth
        if (!session?.user?.id || session.user.grade !== 'admin') {
            return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
        }

        const apiId = params.id;

        // 2. Fetch API to check current status and creator
        const { data: api, error: fetchError } = await supabase
            .from('Api')
            .select('*')
            .eq('id', apiId)
            .single();

        if (fetchError || !api) {
            return NextResponse.json({ error: 'API를 찾을 수 없습니다.' }, { status: 404 });
        }

        if (api.status === 'approved') {
            return NextResponse.json({ error: '이미 승인된 API입니다.' }, { status: 400 });
        }

        // 3. Update Status to 'approved'
        const { error: updateError } = await supabase
            .from('Api')
            .update({
                status: 'approved',
                approved_by: session.user.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', apiId);

        if (updateError) {
            console.error('Approval DB updating error:', updateError);
            return NextResponse.json({ error: '승인 처리 중 오류가 발생했습니다.' }, { status: 500 });
        }

        // 4. Award Points (5 points)
        if (api.created_by) {
            await logUserActivity(api.created_by, 'api_approval');
        }

        return NextResponse.json({ success: true, message: 'API가 승인되었으며 포인트가 지급되었습니다.' });

    } catch (error: any) {
        console.error('Approval API Error:', error);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
