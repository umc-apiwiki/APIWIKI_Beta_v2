-- SQL 스키마 검증 테스트
-- Supabase SQL Editor에서 실행하여 스키마가 올바르게 생성되었는지 확인

-- ============================================
-- 1. 테이블 존재 확인
-- ============================================

-- 모든 테이블이 생성되었는지 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('User', 'Api', 'boards', 'comments', 'feedback', 'user_activities', 'wiki_edits')
ORDER BY table_name;

-- 예상 결과: 7개 테이블 (User, Api, boards, comments, feedback, user_activities, wiki_edits)

-- ============================================
-- 2. ENUM 타입 확인
-- ============================================

-- 모든 ENUM 타입이 생성되었는지 확인
SELECT typname, typtype 
FROM pg_type 
WHERE typtype = 'e' 
AND typname IN ('user_grade', 'api_status', 'board_type', 'feedback_type', 'feedback_status', 'activity_type')
ORDER BY typname;

-- 예상 결과: 6개 ENUM 타입

-- 각 ENUM의 값 확인
SELECT 
    t.typname AS enum_name,
    e.enumlabel AS enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname IN ('user_grade', 'api_status', 'board_type', 'feedback_type', 'feedback_status', 'activity_type')
ORDER BY t.typname, e.enumsortorder;

-- ============================================
-- 3. 컬럼 확인
-- ============================================

-- User 테이블 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

-- Api 테이블 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Api'
ORDER BY ordinal_position;

-- boards 테이블 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'boards'
ORDER BY ordinal_position;

-- ============================================
-- 4. 외래 키 제약 조건 확인
-- ============================================

-- 모든 외래 키 관계 확인
SELECT
    tc.table_name AS from_table, 
    kcu.column_name AS from_column, 
    ccu.table_name AS to_table,
    ccu.column_name AS to_column,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('Api', 'boards', 'comments', 'feedback', 'user_activities', 'wiki_edits')
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 5. 인덱스 확인
-- ============================================

-- 생성된 인덱스 확인
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('boards', 'comments', 'feedback', 'user_activities', 'wiki_edits', 'Api')
ORDER BY tablename, indexname;

-- ============================================
-- 6. 트리거 확인
-- ============================================

-- 트리거 확인
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('User', 'Api', 'boards')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 7. 제약 조건 확인
-- ============================================

-- CHECK 제약 조건 확인 (boards와 comments의 author 체크)
SELECT
    tc.table_name,
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name IN ('boards', 'comments')
ORDER BY tc.table_name;

-- ============================================
-- 8. 샘플 데이터 삽입 테스트 (선택사항)
-- ============================================

-- 테스트 사용자 생성
-- INSERT INTO "User" (email, name, password_hash, grade, activity_score)
-- VALUES ('test@example.com', 'Test User', 'hashed_password', 'bronze', 0)
-- RETURNING *;

-- 테스트 게시글 생성 (비회원)
-- INSERT INTO boards (type, title, content, author_name)
-- VALUES ('free', '테스트 게시글', '테스트 내용입니다.', '익명')
-- RETURNING *;

-- ============================================
-- 검증 완료
-- ============================================

-- 모든 쿼리가 정상적으로 실행되고 예상된 결과가 나오면 스키마가 올바르게 생성된 것입니다.
