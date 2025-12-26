// test-db-connection.js
// Supabase 데이터베이스 연결 테스트

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 정보:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ 설정됨' : '✗ 미설정');
console.log('');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('📡 데이터베이스 연결 테스트 시작...\n');

  try {
    // 1. 간단한 SELECT 쿼리 테스트
    console.log('1️⃣ SELECT 쿼리 테스트 (users 테이블)');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, grade')
      .limit(5);

    if (usersError) {
      console.error('❌ Users 조회 실패:', usersError.message);
    } else {
      console.log('✅ Users 조회 성공:', users?.length || 0, '개');
      if (users && users.length > 0) {
        console.log('   첫 번째 유저:', users[0]);
      }
    }
    console.log('');

    // 2. APIs 테이블 조회
    console.log('2️⃣ SELECT 쿼리 테스트 (apis 테이블)');
    const { data: apis, error: apisError } = await supabase
      .from('apis')
      .select('id, name, company, status')
      .limit(5);

    if (apisError) {
      console.error('❌ APIs 조회 실패:', apisError.message);
    } else {
      console.log('✅ APIs 조회 성공:', apis?.length || 0, '개');
      if (apis && apis.length > 0) {
        console.log('   첫 번째 API:', apis[0]);
      }
    }
    console.log('');

    // 3. Boards 테이블 조회
    console.log('3️⃣ SELECT 쿼리 테스트 (boards 테이블)');
    const { data: boards, error: boardsError } = await supabase
      .from('boards')
      .select('id, title, type, created_at')
      .limit(5);

    if (boardsError) {
      console.error('❌ Boards 조회 실패:', boardsError.message);
    } else {
      console.log('✅ Boards 조회 성공:', boards?.length || 0, '개');
      if (boards && boards.length > 0) {
        console.log('   첫 번째 게시글:', boards[0]);
      }
    }
    console.log('');

    // 4. 테이블 존재 여부 확인
    console.log('4️⃣ 테이블 구조 확인');
    const tables = ['users', 'apis', 'boards', 'comments', 'feedback'];
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: 접근 불가 (${error.message})`);
      } else {
        console.log(`   ✅ ${table}: ${count || 0}개 레코드`);
      }
    }
    console.log('');

    console.log('✅ 데이터베이스 연결 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
    process.exit(1);
  }
}

testConnection();
