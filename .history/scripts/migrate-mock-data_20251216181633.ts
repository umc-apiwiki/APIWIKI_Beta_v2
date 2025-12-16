// scripts/migrate-mock-data.ts
// Mock 데이터를 Supabase Api 테이블로 마이그레이션하는 스크립트

console.log('🚀 Mock 데이터 마이그레이션 안내\n');
console.log('⚠️  mockData.ts 파일의 순환 참조 문제로 인해');
console.log('    자동 마이그레이션 대신 수동 마이그레이션을 권장합니다.\n');
console.log('📝 수동 마이그레이션 방법:\n');
console.log('방법 1: API 등록 폼 사용 (권장)');
console.log('  1. 개발 서버 실행: npm run dev');
console.log('  2. 로그인 후 "API 등록" 버튼 클릭');
console.log('  3. src/data/mockData.ts의 데이터를 참고하여 폼에 입력');
console.log('  4. 관리자 페이지에서 승인\n');
console.log('방법 2: Supabase 대시보드 사용');
console.log('  1. Supabase 대시보드 → Table Editor → Api 테이블');
console.log('  2. "Insert" → "Insert row" 클릭');
console.log('  3. 데이터 입력 (status는 "approved"로 설정)\n');
console.log('방법 3: SQL INSERT 문 사용');
console.log('  1. Supabase 대시보드 → SQL Editor');
console.log('  2. INSERT INTO "Api" (...) VALUES (...) 실행\n');
console.log('💡 참고: 현재 mockData.ts에는 약 50개의 API 데이터가 있습니다.');
console.log('    필요한 만큼만 입력하시면 됩니다.\n');
console.log('✅ 마이그레이션 완료 후:');
console.log('   - HomePage, ExplorePage, APIDetailPage가 실제 DB 데이터를 사용합니다');
console.log('   - mockData.ts는 더 이상 사용되지 않습니다\n');

process.exit(0);
