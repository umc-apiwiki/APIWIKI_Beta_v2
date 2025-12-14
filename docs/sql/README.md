# Supabase SQL 적용 가이드

1) Supabase 콘솔 > SQL Editor에서 `supabase-init.sql` 실행
   - 위치: `docs/sql/supabase-init.sql`
   - 포함: `User`, `Api` 테이블 생성, FK, `updatedAt` 트리거

2) 연결 확인 (둘 중 택1)
   - SQL Editor에서 `select 1;`
   - psql 사용 시: `psql "$DATABASE_URL" -c "select 1;"`

3) 환경변수 확인
   - `DATABASE_URL=postgresql://<user>:<password>@<host>:5432/postgres`
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값 채우기

4) 실패 시 체크
   - DB 포트/방화벽, 비밀번호, 호스트 확인
   - Supabase 프로젝트 리전/URL이 맞는지 재확인
