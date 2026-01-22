### 관련 파일

- `package.json` - Sentry/GA 관련 의존성 및 스크립트 정의
- `next.config.js` - Sentry source map 업로드, API 라우트 래핑, GA용 설정(필요 시)
- `sentry.client.config.ts` - 클라이언트 에러/트랜잭션 수집 초기화
- `sentry.server.config.ts` - 서버/Edge 에러/트랜잭션 수집 초기화
- `src/app/api/glitchtip-tunnel/route.ts` - 클라이언트 에러용 GlitchTip 터널 엔드포인트
- `src/app/layout.tsx` - 전역 Sentry 설정 및 GA 스니펫/프로바이더 주입
- `src/app/page.tsx` - 샘플 에러 트리거 및 GA 이벤트 테스트 버튼 추가 위치
- `docs/sql/supabase-init.sql` - Supabase 초기 스키마 SQL (수동 실행용)
- `.env.example` - SENTRY_DSN, GLITCHTIP_URL, GA_ID, DATABASE_URL 등 환경변수 템플릿
- `coolify/README.md` - Coolify 배포 절차/설정 기록(생성 예정)
- `coolify/app.nixpacks.toml` 또는 `Dockerfile` - Next 배포용 Nixpacks/Docker 설정
- `coolify/supabase/docker-compose.yml` - self-hosted Supabase 스택 구성 (생성 예정)

## 작업

- [ ] 1.0 GlitchTip(Sentry) 모니터링 연동 및 클라이언트 터널 경로 준비 (Push 단위)
  - [ ] 1.1 @sentry/nextjs 설치 및 환경변수 키(SENTRY_DSN 등) 추가 (.env.example 반영) (커밋 단위)
    - [ ] 1.1.1 테스트 코드 작성
    - [ ] 1.1.2 테스트 실행 및 검증
    - [ ] 1.1.3 오류 수정 (필요 시)
  - [ ] 1.2 sentry.client.config.ts / sentry.server.config.ts 초기화 및 tracesSampleRate 기본값 설정 (커밋 단위)
    - [ ] 1.2.1 테스트 코드 작성
    - [ ] 1.2.2 테스트 실행 및 검증
    - [ ] 1.2.3 오류 수정 (필요 시)
  - [ ] 1.3 next.config.js에 withSentryConfig 적용, productionBrowserSourceMaps 설정 및 API 라우트 래핑 (커밋 단위)
    - [ ] 1.3.1 테스트 코드 작성
    - [ ] 1.3.2 테스트 실행 및 검증
    - [ ] 1.3.3 오류 수정 (필요 시)
  - [ ] 1.4 app/api/glitchtip-tunnel/route.ts 구현 및 클라이언트 tunnel 옵션 연결 (커밋 단위)
    - [ ] 1.4.1 테스트 코드 작성
    - [ ] 1.4.2 테스트 실행 및 검증
    - [ ] 1.4.3 오류 수정 (필요 시)
  - [ ] 1.5 샘플 에러 트리거 UI 추가 후 GlitchTip 수집 확인(문서화 포함) (커밋 단위)
    - [ ] 1.5.1 테스트 코드 작성
    - [ ] 1.5.2 테스트 실행 및 검증
    - [ ] 1.5.3 오류 수정 (필요 시)

- [ ] 2.0 Supabase 스키마 적용 및 DB 환경 정리 (Push 단위)
  - [ ] 2.1 DATABASE_URL 설정 및 .env/.env.example 정비 (커밋 단위)
    - [ ] 2.1.1 테스트 코드 작성
    - [ ] 2.1.2 테스트 실행 및 검증
    - [ ] 2.1.3 오류 수정 (필요 시)
  - [ ] 2.2 Supabase SQL 초기 스키마 실행(docs/sql/supabase-init.sql) 및 적용 여부 확인 (커밋 단위)
    - [ ] 2.2.1 테스트 코드 작성
    - [ ] 2.2.2 테스트 실행 및 검증
    - [ ] 2.2.3 오류 수정 (필요 시)
  - [ ] 2.3 DB 연결 확인 절차 문서화(예: Supabase 콘솔/psql로 SELECT 1) (커밋 단위)
    - [ ] 2.3.1 테스트 코드 작성
    - [ ] 2.3.2 테스트 실행 및 검증
    - [ ] 2.3.3 오류 수정 (필요 시)

- [ ] 4.0 Google Analytics 연동 및 기본 페이지뷰/이벤트 추적 설정 (Push 단위)
  - [ ] 4.1 GA Measurement ID 환경변수(NEXT_PUBLIC_GA_ID) 추가 및 .env.example 반영 (커밋 단위)
    - [ ] 4.1.1 테스트 코드 작성
    - [ ] 4.1.2 테스트 실행 및 검증
    - [ ] 4.1.3 오류 수정 (필요 시)
  - [ ] 4.2 app/layout.tsx에 GA 스니펫/Script 삽입 및 기본 페이지뷰 훅 구성 (커밋 단위)
    - [ ] 4.2.1 테스트 코드 작성
    - [ ] 4.2.2 테스트 실행 및 검증
    - [ ] 4.2.3 오류 수정 (필요 시)
  - [ ] 4.3 주요 인터랙션(검색/카테고리 클릭) 이벤트 트래킹 헬퍼 추가 및 샘플 이벤트 발생 확인 (커밋 단위)
    - [ ] 4.3.1 테스트 코드 작성
    - [ ] 4.3.2 테스트 실행 및 검증
    - [ ] 4.3.3 오류 수정 (필요 시)
