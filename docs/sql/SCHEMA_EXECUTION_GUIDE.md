# Supabase 스키마 실행 및 검증 가이드

## Task 2.2: Supabase 콘솔에서 스키마 실행 및 적용 확인

### 사전 준비

1. Supabase 프로젝트 콘솔에 로그인
2. 데이터베이스 백업 (선택사항이지만 권장)

### 실행 단계

#### Step 1: SQL Editor 열기

1. Supabase Dashboard → 프로젝트 선택
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New query** 버튼 클릭

#### Step 2: 스키마 SQL 실행

1. `docs/sql/supabase-schema-extension.sql` 파일 내용 전체 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 클릭 (또는 Ctrl+Enter)
4. 실행 결과 확인:
   - 성공 메시지: "Success. No rows returned"
   - 오류가 있다면 오류 메시지 확인

> **주의**: ENUM 타입은 한 번 생성되면 수정이 어렵습니다. 실행 전 타입 이름과 값을 신중히 검토하세요.

#### Step 3: 스키마 검증

1. 새로운 SQL Editor 탭 열기
2. `docs/sql/schema-validation-test.sql` 파일 내용 복사
3. 각 섹션별로 실행하여 결과 확인:

**3-1. 테이블 존재 확인**

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('User', 'Api', 'boards', 'comments', 'feedback', 'user_activities', 'wiki_edits')
ORDER BY table_name;
```

✅ 예상 결과: 7개 테이블

**3-2. ENUM 타입 확인**

```sql
SELECT typname, typtype
FROM pg_type
WHERE typtype = 'e'
AND typname IN ('user_grade', 'api_status', 'board_type', 'feedback_type', 'feedback_status', 'activity_type')
ORDER BY typname;
```

✅ 예상 결과: 6개 ENUM 타입

**3-3. 외래 키 확인**

```sql
SELECT
    tc.table_name AS from_table,
    kcu.column_name AS from_column,
    ccu.table_name AS to_table,
    ccu.column_name AS to_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN ('Api', 'boards', 'comments', 'feedback', 'user_activities', 'wiki_edits')
ORDER BY tc.table_name;
```

✅ 예상 결과: 최소 8개의 외래 키 관계

**3-4. 인덱스 확인**

```sql
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('boards', 'comments', 'feedback', 'user_activities', 'wiki_edits', 'Api')
ORDER BY tablename, indexname;
```

✅ 예상 결과: 각 테이블에 여러 인덱스 생성됨

#### Step 4: Table Editor에서 시각적 확인

1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. 각 테이블 선택하여 구조 확인:
   - `boards`: type, title, content, author_id, author_name 등
   - `comments`: board_id, content, author_id, author_name 등
   - `feedback`: type, content, user_id, status 등
   - `user_activities`: user_id, action_type, points 등
   - `wiki_edits`: api_id, user_id, content, diff 등

3. User 테이블 확인:
   - 새 컬럼: password_hash, grade, activity_score

4. Api 테이블 확인:
   - 새 컬럼: company, categories, price, status, approved_by, approved_at

### 검증 체크리스트

- [ ] 모든 ENUM 타입이 생성되었는가?
- [ ] User 테이블에 3개 컬럼이 추가되었는가? (password_hash, grade, activity_score)
- [ ] Api 테이블에 6개 컬럼이 추가되었는가? (company, categories, price, status, approved_by, approved_at)
- [ ] 5개의 새 테이블이 생성되었는가? (boards, comments, feedback, user_activities, wiki_edits)
- [ ] 모든 외래 키 제약조건이 올바르게 설정되었는가?
- [ ] 인덱스가 생성되었는가?
- [ ] boards 테이블에 updatedAt 트리거가 설정되었는가?

### 문제 해결

#### 오류: "type already exists"

- ENUM 타입이 이미 존재하는 경우
- 해결: SQL 파일에서 해당 CREATE TYPE 문을 주석 처리하거나 제거

#### 오류: "column already exists"

- 컬럼이 이미 존재하는 경우
- 해결: `IF NOT EXISTS` 구문이 있으므로 정상. 무시하고 진행

#### 오류: "relation already exists"

- 테이블이 이미 존재하는 경우
- 해결: `IF NOT EXISTS` 구문이 있으므로 정상. 무시하고 진행

### 다음 단계

스키마 검증이 완료되면:

1. Task 2.2 완료 표시
2. Git 커밋 수행
3. Task 2.3 (TypeScript 타입 정의) 진행
