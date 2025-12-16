// scripts/migrate-mock-data.ts
// Mock 데이터를 Supabase Api 테이블로 마이그레이션하는 스크립트

import { createClient } from '@supabase/supabase-js';
import { mockAPIs } from '../src/data/mockData';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
    console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
    console.log('🚀 Mock 데이터 마이그레이션 시작...\n');

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const api of mockAPIs) {
        try {
            // 중복 체크 (이름 기준)
            const { data: existing, error: checkError } = await supabase
                .from('Api')
                .select('id, name')
                .eq('name', api.name)
                .single();

            if (existing) {
                console.log(`⏭️  건너뜀: "${api.name}" (이미 존재함)`);
                skipCount++;
                continue;
            }

            // API 데이터 준비
            const apiData = {
                name: api.name,
                company: api.company,
                logo: api.logo,
                rating: api.rating,
                users: api.users,
                price: api.price,
                description: api.description,
                categories: api.categories,
                status: 'approved' as const, // 모든 Mock 데이터는 승인 상태로
                // 선택적 필드
                ...(api.features && { features: api.features }),
                ...(api.pricing && { pricing: api.pricing }),
                ...(api.countries && { countries: api.countries }),
                ...(api.authMethods && { authMethods: api.authMethods }),
                ...(api.docsLanguages && { docsLanguages: api.docsLanguages }),
                ...(api.relatedIds && { relatedIds: api.relatedIds }),
                ...(api.viewsLast7Days && { viewsLast7Days: api.viewsLast7Days }),
                ...(api.recommendedForStacks && { recommendedForStacks: api.recommendedForStacks }),
            };

            // Supabase에 삽입
            const { error: insertError } = await supabase
                .from('Api')
                .insert(apiData);

            if (insertError) {
                console.error(`❌ 실패: "${api.name}" - ${insertError.message}`);
                errorCount++;
            } else {
                console.log(`✅ 성공: "${api.name}"`);
                successCount++;
            }
        } catch (error: any) {
            console.error(`❌ 오류: "${api.name}" - ${error.message}`);
            errorCount++;
        }
    }

    console.log('\n📊 마이그레이션 완료!');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`⏭️  건너뜀: ${skipCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📦 전체: ${mockAPIs.length}개\n`);

    if (errorCount > 0) {
        process.exit(1);
    }
}

// 스크립트 실행
migrateData()
    .then(() => {
        console.log('🎉 마이그레이션이 성공적으로 완료되었습니다!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 마이그레이션 중 오류 발생:', error);
        process.exit(1);
    });
