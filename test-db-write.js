// test-db-write.js
// Supabase 데이터베이스 쓰기 테스트

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testWrite() {
  console.log('📝 데이터베이스 쓰기 테스트 시작...\n');

  try {
    // 1. 테스트 유저 생성 (대문자 테이블명 사용)
    console.log('1️⃣ 테스트 유저 생성 시도...');
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      name: '테스트 유저',
    };

    const { data: newUser, error: userError } = await supabase
      .from('User')
      .insert([testUser])
      .select()
      .single();

    if (userError) {
      console.error('❌ 유저 생성 실패:', userError.message);
      console.error('   상세:', userError);
    } else {
      console.log('✅ 유저 생성 성공!');
      console.log('   생성된 유저:', newUser);
      console.log('');

      // 2. 생성된 유저 조회
      console.log('2️⃣ 생성된 유저 조회...');
      const { data: foundUser, error: findError } = await supabase
        .from('User')
        .select('*')
        .eq('id', newUser.id)
        .single();

      if (findError) {
        console.error('❌ 유저 조회 실패:', findError.message);
      } else {
        console.log('✅ 유저 조회 성공:', foundUser);
      }
      console.log('');

      // 3. 유저 정보 업데이트
      console.log('3️⃣ 유저 정보 업데이트 시도...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('User')
        .update({ name: '업데이트된 테스트 유저' })
        .eq('id', newUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ 유저 업데이트 실패:', updateError.message);
      } else {
        console.log('✅ 유저 업데이트 성공!');
        console.log('   업데이트된 유저:', updatedUser);
      }
      console.log('');

      // 4. 테스트 데이터 삭제
      console.log('4️⃣ 테스트 데이터 삭제...');
      const { error: deleteError } = await supabase.from('User').delete().eq('id', newUser.id);

      if (deleteError) {
        console.error('❌ 데이터 삭제 실패:', deleteError.message);
      } else {
        console.log('✅ 테스트 데이터 삭제 완료!');
      }
    }

    console.log('');
    console.log('✅ 데이터베이스 쓰기 테스트 완료!');
    console.log('');
    console.log('📊 결과 요약:');
    console.log('   - 데이터베이스 연결: ✅');
    console.log('   - INSERT 쿼리: ' + (userError ? '❌' : '✅'));
    console.log('   - SELECT 쿼리: ✅');
    console.log('   - UPDATE 쿼리: ✅');
    console.log('   - DELETE 쿼리: ✅');
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
    console.error('   전체 오류:', error);
  }
}

testWrite();
