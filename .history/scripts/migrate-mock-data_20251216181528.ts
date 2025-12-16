// scripts/migrate-mock-data.ts
// Mock 데이터를 Supabase Api 테이블로 마이그레이션하는 스크립트

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
    console.error('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// mockData.ts에서 mockAPIs 데이터 추출
function loadMockAPIs() {
    const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');
    const content = fs.readFileSync(mockDataPath, 'utf-8');

    // mockAPIs export 찾기
    const exportMatch = content.match(/export const mockAPIs[^=]*=\s*_mockAPIs/);
    if (!exportMatch) {
        throw new Error('mockAPIs export를 찾을 수 없습니다');
    }

    // _mockAPIs 배열 찾기
    const arrayMatch = content.match(/const _mockAPIs[^=]*=\s*(\[[^\]]*\])/s);
    if (!arrayMatch) {
        throw new Error('_mockAPIs 배열을 찾을 수 없습니다');
    }

    // JSON으로 변환 가능하도록 처리
    // 실제로는 mockData.ts를 수동으로 확인하여 데이터 개수만 파악
    console.log('📦 Mock 데이터 파일을 확인했습니다.');
    console.log('⚠️  수동으로 Supabase 대시보드에서 데이터를 확인해주세요.');

    return null; // 임시로 null 반환
}

async function migrateData() {
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
