# API WIKI Beta - PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 목적

잘 알려지지 않은 API(공공데이터, 중소기업 제공 API 등)에 대한 정보를 커뮤니티가 함께 작성하고 공유하는 위키 플랫폼

### 1.2 핵심 문제

- 레퍼런스 찾기 어려움
- 제공 데이터 범위 파악 곤란
- 서비스 지속 여부 불명확
- 비용 산정 어려움
- 오류 발생 시 해결 정보 부족

### 1.3 솔루션

- 커뮤니티 기반 API 정보 위키
- 실사용자 후기 및 비용 정보 공유
- 비슷한 API 비교 기능
- 사용자 등급제를 통한 위키 편집 권한 관리

---

## 2. 기능 요구사항

### 2.1 사용자 인증 (Priority: High)

#### 2.1.1 회원 가입/로그인

- 이메일/비밀번호 기반 인증
- 비회원도 제한적 기능 사용 가능 (조회, 댓글 작성)

#### 2.1.2 사용자 등급 시스템

- **브론즈**: 글의 10% 또는 50자 수정 가능
- **실버**: 글의 20% 또는 100자 수정 가능
- **골드**: 글의 30% 또는 200자 수정 가능

#### 2.1.3 활동량 추적

- 로그인 횟수
- 게시글/댓글 작성
- 위키 편집 기여도
- 활동량에 따른 자동 등급 조정

---

### 2.2 API 등록 및 관리 (Priority: High)

#### 2.2.1 API 등록

- 사용자가 새로운 API 정보 등록 가능
- 필수 정보: API 이름, 제공 회사, 카테고리, 설명, 가격 정책

#### 2.2.2 관리자 승인 시스템

- 등록된 API는 관리자 승인 후 공개
- 관리자 페이지에서 대기 중인 API 목록 확인
- 승인/거부 기능

---

### 2.3 위키 문서 편집 (Priority: High)

#### 2.3.1 등급별 편집 권한

- 브론즈: 50자 또는 10% 수정
- 실버: 100자 또는 20% 수정
- 골드: 200자 또는 30% 수정
- 관리자: 무제한

#### 2.3.2 비회원 수정 요청

- 비회원은 수정 요청만 가능
- 관리자가 요청 검토 후 반영

#### 2.3.3 편집 이력 저장

- 모든 편집 내역 추적
- 버전 관리 기능

---

### 2.4 게시판 시스템 (Priority: Medium)

#### 2.4.1 게시판 종류

- **문의 게시판**: API 사용 관련 질문
- **QnA 게시판**: 기술적 질의응답
- **자유 게시판**: 일반 토론

#### 2.4.2 기능

- 게시글 작성/수정/삭제
- 댓글 작성 (비회원 가능)
- 검색 및 필터링

---

### 2.5 피드백 시스템 (Priority: Medium)

#### 2.5.1 피드백 유형

- 오류 제보
- 기능 제안
- 아이디어 공유

#### 2.5.2 수집 방식

- 모달 형태의 피드백 폼
- Supabase에 저장
- 관리자 페이지에서 조회 가능

---

### 2.6 API 정보 제공 (Priority: High)

#### 2.6.1 제공 정보

- 레퍼런스 GitHub 주소
- 제공 데이터 종류 및 범위
- 실사용자 후기 및 비용 후기
- 서비스 지속 여부 표시
- 비슷한 API 비교 기능

#### 2.6.2 검색 최적화

- 구글 검색 시 우리 서비스 문서가 상위 노출되도록 SEO 최적화

---

## 3. 비기능 요구사항

### 3.1 기술 스택

#### 3.1.1 프론트엔드

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**:
  - Tailwind CSS (유틸리티 기반 스타일링)
  - shadcn/ui (재사용 가능한 UI 컴포넌트 라이브러리)
- **상태 관리**: React Hooks, Context API
- **폼 관리**: React Hook Form + Zod (validation)

#### 3.1.2 백엔드

- **API**: Next.js API Routes
- **인증**: NextAuth.js
- **데이터베이스**: Supabase (PostgreSQL)

#### 3.1.3 모니터링 및 분석

- **에러 추적**: GlitchTip (Sentry 호환)
- **사용자 분석**: Google Analytics 4 (GA4)

#### 3.1.4 배포

- **플랫폼**: Coolify (self-hosted)
- **컨테이너**: Docker
- **빌드**: Nixpacks

### 3.2 성능

- 페이지 로딩 시간 < 3초
- API 응답 시간 < 500ms
- Lighthouse 점수 > 90

### 3.3 보안

- 비밀번호 암호화 (bcrypt)
- SQL Injection 방지
- XSS 공격 방지
- CSRF 토큰 적용
- HTTPS 강제 적용

---

## 4. 모니터링 및 분석 시스템

### 4.1 GlitchTip (Sentry) 에러 추적

#### 4.1.1 목적

- 프로덕션 환경에서 발생하는 에러 실시간 모니터링
- 에러 발생 시 즉각적인 알림 및 대응
- 에러 발생 빈도 및 패턴 분석

#### 4.1.2 추적 대상

**클라이언트 에러**

- JavaScript 런타임 에러
- React 컴포넌트 에러
- API 호출 실패
- 네트워크 에러
- 브라우저 호환성 이슈

**서버 에러**

- API Route 에러
- 데이터베이스 연결 실패
- 인증/인가 에러
- 외부 API 호출 실패

**성능 모니터링**

- 페이지 로딩 시간
- API 응답 시간
- 데이터베이스 쿼리 성능
- 트랜잭션 추적

#### 4.1.3 구현 방식

```typescript
// 클라이언트 에러 자동 캡처
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% 트랜잭션 샘플링
  environment: process.env.NODE_ENV,
  tunnel: '/api/glitchtip-tunnel', // 광고 차단 우회
});

// 커스텀 에러 추적
try {
  await submitAPIRegistration(data);
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'api-registration' },
    user: { id: userId, email: userEmail },
  });
  throw error;
}
```

#### 4.1.4 알림 설정

- 치명적 에러: 즉시 이메일/Slack 알림
- 일반 에러: 일일 요약 리포트
- 성능 저하: 임계값 초과 시 알림

---

### 4.2 Google Analytics 4 (GA4)

#### 4.2.1 목적

- 사용자 행동 패턴 분석
- 주요 기능 사용률 측정
- 전환율(Conversion Rate) 추적
- 사용자 유입 경로 분석

#### 4.2.2 추적 이벤트

**페이지뷰 이벤트**

- 자동 추적: 모든 페이지 방문
- URL, 제목, 참조 페이지

**사용자 행동 이벤트**

```typescript
// 검색 이벤트
gaEvent({
  action: 'search',
  category: 'engagement',
  label: searchQuery,
});

// API 상세 조회
gaEvent({
  action: 'view_api_detail',
  category: 'engagement',
  label: apiName,
  value: apiId,
});

// API 비교 기능 사용
gaEvent({
  action: 'compare_apis',
  category: 'feature_usage',
  label: `${api1} vs ${api2}`,
});

// 위키 편집
gaEvent({
  action: 'edit_wiki',
  category: 'contribution',
  label: apiId,
  value: editCharCount,
});

// 게시글 작성
gaEvent({
  action: 'create_post',
  category: 'contribution',
  label: boardType,
});

// 피드백 제출
gaEvent({
  action: 'submit_feedback',
  category: 'feedback',
  label: feedbackType,
});
```

**전환 이벤트**

- 회원가입 완료
- API 등록 제출
- 첫 위키 편집
- 첫 게시글 작성

**사용자 속성**

- 등급 (브론즈/실버/골드)
- 가입 날짜
- 활동 점수
- 기여 횟수

#### 4.2.3 맞춤 측정기준 (Custom Dimensions)

```typescript
// GA4 설정
gtag('config', GA_ID, {
  user_properties: {
    user_grade: userGrade, // bronze, silver, gold
    contribution_count: contributionCount,
  },
});

// 페이지별 맞춤 차원
gtag('event', 'page_view', {
  page_type: 'api_detail', // home, explore, api_detail, board
  api_category: category,
  is_authenticated: isLoggedIn,
});
```

#### 4.2.4 분석 대시보드 구성

**주요 지표**

- 일일/주간/월간 활성 사용자 (DAU/WAU/MAU)
- 페이지뷰 및 세션 수
- 평균 세션 시간
- 이탈률(Bounce Rate)

**기능별 분석**

- 검색 사용률 및 인기 검색어
- API 상세 페이지 조회수 순위
- 비교 기능 사용률
- 게시판 활성도

**전환 퍼널**

```
방문자 → 회원가입 → 첫 기여 → 활성 기여자
100%    20%       50%      30%
```

---

### 4.3 로그 관리 시스템

#### 4.3.1 구조화된 로깅

```typescript
// 서버 로그
import { logger } from '@/lib/logger';

logger.info('API registration submitted', {
  userId,
  apiName,
  timestamp: new Date(),
  metadata: { category, priceType },
});

logger.error('Database connection failed', {
  error: error.message,
  stack: error.stack,
  context: 'user-registration',
});
```

#### 4.3.2 로그 수준 (Log Levels)

- **ERROR**: 시스템 오류, 즉시 조치 필요
- **WARN**: 잠재적 문제, 모니터링 필요
- **INFO**: 주요 이벤트 (로그인, 등록, 편집)
- **DEBUG**: 개발 환경 디버깅 정보

#### 4.3.3 저장 및 분석

- 로그 파일: `/var/log/api-wiki/`
- 보관 기간: 30일
- 분석 도구: GlitchTip 로그 통합

---

### 4.4 성능 모니터링

#### 4.4.1 Core Web Vitals 추적

```typescript
// Next.js built-in Web Vitals reporting
export function reportWebVitals(metric) {
  // LCP, FID, CLS, FCP, TTFB 자동 추적
  gaEvent({
    action: metric.name,
    category: 'Web Vitals',
    label: metric.id,
    value: Math.round(metric.value),
  });
}
```

#### 4.4.2 API 성능 추적

```typescript
// API Route 성능 측정
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    const data = await fetchAPIs();
    const duration = Date.now() - startTime;

    // 느린 쿼리 감지 (500ms 이상)
    if (duration > 500) {
      logger.warn('Slow API response', {
        endpoint: '/api/apis',
        duration,
      });
    }

    return Response.json(data);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
```

#### 4.4.3 데이터베이스 쿼리 최적화 모니터링

- Supabase Dashboard에서 느린 쿼리 확인
- 인덱스 최적화
- 쿼리 실행 계획 분석

---

### 4.5 사용자 피드백 통합

#### 4.5.1 피드백 → 모니터링 연동

```typescript
// 피드백 제출 시 자동 분류
await supabase.from('feedback').insert({
  type: feedbackType, // error, feature, idea
  content,
  user_id,
  // 에러 피드백인 경우 Sentry 이슈 링크 첨부
  sentry_issue_id: sentryIssueId,
});

// GA 이벤트 전송
gaEvent({
  action: 'submit_feedback',
  category: 'feedback',
  label: feedbackType,
});
```

#### 4.5.2 대시보드 통합

- GlitchTip에서 에러 확인 → 관련 사용자 피드백 조회
- GA에서 이탈률 높은 페이지 → 해당 페이지 피드백 확인

---

### 4.6 A/B 테스트 및 실험

#### 4.6.1 GA4 실험 기능 활용

```typescript
// 버튼 색상 A/B 테스트
gtag('event', 'experiment_impression', {
  experiment_id: 'button_color_test',
  variant_id: variant, // A: blue, B: green
});

// 전환 이벤트 추적
gtag('event', 'button_click', {
  experiment_id: 'button_color_test',
  variant_id: variant,
});
```

#### 4.6.2 테스트 대상

- UI/UX 개선 효과 측정
- 기능 배치 최적화
- 온보딩 플로우 개선

---

### 4.7 알림 및 리포팅

#### 4.7.1 실시간 알림

- **Slack 연동**: 치명적 에러 발생 시 즉시 알림
- **이메일**: 일일/주간 요약 리포트

#### 4.7.2 주간 리포트 내용

- 신규 가입자 수
- 활성 사용자 수 (WAU)
- 새로 등록된 API 수
- 주요 에러 및 해결 상태
- 인기 검색어 Top 10
- 성능 지표 (평균 응답 시간, Core Web Vitals)

#### 4.7.3 월간 리포트 내용

- MAU 추이 분석
- 사용자 등급 분포 변화
- 기능별 사용률 순위
- 전환 퍼널 분석
- 개선 권장 사항

---

## 5. UI/UX 디자인 시스템

### 5.1 shadcn/ui 컴포넌트 활용

#### 5.1.1 사용 이유

- 접근성(Accessibility) 기본 내장
- Radix UI 기반의 견고한 컴포넌트
- 완전한 커스터마이징 가능
- TypeScript 완벽 지원
- 복사-붙여넣기 방식으로 프로젝트에 통합

#### 5.1.2 주요 사용 컴포넌트

```typescript
// 모달/다이얼로그
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// 폼 요소
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 피드백
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 데이터 표시
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// 네비게이션
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

#### 5.1.3 컴포넌트 커스터마이징

```typescript
// tailwind.config.ts에서 테마 확장
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#4A90E2',
          foreground: '#ffffff',
        },
        // ... 추가 색상
      },
    },
  },
};
```

### 5.2 Tailwind CSS 활용

#### 5.2.1 유틸리티 클래스 우선 접근

```typescript
// 컴포넌트 예시
export function APICard({ api }: { api: API }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="text-4xl">{api.logo}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{api.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {api.company}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge variant={api.price === 'free' ? 'success' : 'default'}>
          {api.price}
        </Badge>
        <p className="text-sm line-clamp-3">{api.description}</p>
      </CardContent>
    </Card>
  )
}
```

#### 5.2.2 반응형 디자인

```typescript
// 모바일 우선 접근
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* API 카드들 */}
</div>

// 조건부 스타일링
<Button
  className={cn(
    "w-full sm:w-auto",
    isLoading && "opacity-50 cursor-not-allowed"
  )}
>
  제출
</Button>
```

#### 5.2.3 다크 모드 지원 (선택사항)

```typescript
// 다크 모드 클래스 활용
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
  {/* 콘텐츠 */}
</div>
```

### 5.3 디자인 토큰 및 일관성

#### 5.3.1 색상 시스템

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 210 79% 58%; /* #4A90E2 */
    --success: 142 76% 36%; /* 무료 */
    --warning: 38 92% 50%; /* 혼합 */
    --destructive: 0 84% 60%; /* 유료 */
  }
}
```

#### 5.3.2 타이포그래피

```typescript
// 일관된 폰트 크기
<h1 className="text-4xl font-bold">API WIKI</h1>
<h2 className="text-3xl font-semibold">섹션 제목</h2>
<h3 className="text-xl font-medium">서브 제목</h3>
<p className="text-base">본문 텍스트</p>
<span className="text-sm text-muted-foreground">부가 정보</span>
```

#### 5.3.3 간격 시스템

```typescript
// 일관된 간격 사용
<div className="space-y-4"> {/* 16px */}
  <div className="p-6"> {/* 24px */}
    <div className="mb-2"> {/* 8px */}
```

---

## 6. 데이터베이스 스키마

### 6.1 주요 테이블

#### User

```sql
- id: uuid (PK)
- email: text (unique)
- password_hash: text
- name: text
- grade: enum (bronze, silver, gold, admin)
- activity_score: integer
- created_at: timestamp
- updated_at: timestamp
```

#### Api

```sql
- id: uuid (PK)
- name: text
- company: text
- slug: text (unique)
- description: text
- categories: text[]
- price: enum (free, paid, mixed)
- status: enum (pending, approved, rejected)
- created_by: uuid (FK -> User)
- approved_by: uuid (FK -> User)
- created_at: timestamp
- approved_at: timestamp
```

#### Board

```sql
- id: uuid (PK)
- type: enum (inquiry, qna, free)
- title: text
- content: text
- author_id: uuid (FK -> User, nullable)
- author_name: text (for non-members)
- created_at: timestamp
- updated_at: timestamp
```

#### Comment

```sql
- id: uuid (PK)
- board_id: uuid (FK -> Board)
- content: text
- author_id: uuid (FK -> User, nullable)
- author_name: text (for non-members)
- created_at: timestamp
```

#### Feedback

```sql
- id: uuid (PK)
- type: enum (error, feature, idea)
- content: text
- user_id: uuid (FK -> User, nullable)
- created_at: timestamp
- status: enum (pending, reviewed, resolved)
```

#### WikiEdit

```sql
- id: uuid (PK)
- api_id: uuid (FK -> Api)
- user_id: uuid (FK -> User)
- content: text
- diff: jsonb
- created_at: timestamp
```

#### UserActivity

```sql
- id: uuid (PK)
- user_id: uuid (FK -> User)
- action_type: enum (login, post, comment, edit)
- points: integer
- created_at: timestamp
```

---

## 7. 사용자 스토리

### 7.1 비회원

- "나는 API 정보를 조회하고 싶다"
- "나는 게시판에 댓글을 달고 싶다"
- "나는 위키 수정을 요청하고 싶다"

### 7.2 회원 (브론즈/실버/골드)

- "나는 새로운 API를 등록하고 싶다"
- "나는 위키 문서를 편집하고 싶다"
- "나는 게시글을 작성하고 싶다"
- "나는 활동을 통해 등급을 올리고 싶다"

### 7.3 관리자

- "나는 등록된 API를 승인/거부하고 싶다"
- "나는 피드백을 확인하고 처리하고 싶다"
- "나는 비회원의 수정 요청을 검토하고 싶다"
- "나는 에러 발생 현황을 모니터링하고 싶다"
- "나는 사용자 행동 패턴을 분석하고 싶다"

---

## 8. 우선순위

### Phase 1 (MVP)

1. 사용자 인증 시스템
2. API 등록 및 승인
3. 등급별 위키 편집
4. Mock 데이터 → DB 전환
5. **GlitchTip 에러 추적 설정**
6. **Google Analytics 기본 이벤트 추적**

### Phase 2

1. 게시판 시스템
2. 피드백 시스템
3. 활동량 추적 자동화
4. **상세 GA 이벤트 추적 (검색, 비교, 편집)**
5. **성능 모니터링 대시보드**

### Phase 3

1. API 비교 기능
2. 알림 시스템
3. SEO 최적화
4. **A/B 테스트 시스템**
5. **맞춤형 분석 리포트**

---

## 9. 제외 사항 (Beta에서 구현 안 함)

- ~~AI 기반 편집 내용 검증~~ (수동 관리자 검토로 대체)
- 소셜 로그인 (이메일만 지원)
- 실시간 알림 (이메일 알림만)
- 다크 모드 (추후 구현)

---

## 10. 성공 지표 (KPI)

### 10.1 사용자 지표

- 월간 활성 사용자(MAU): 500명
- 주간 활성 사용자(WAU): 150명
- 평균 세션 시간: 5분 이상
- 이탈률(Bounce Rate): 40% 이하

### 10.2 콘텐츠 지표

- 등록된 API 수: 100개
- 위키 편집 기여자 수: 50명
- 게시판 활성도: 주 10개 이상 게시글
- 승인된 API 비율: 80% 이상

### 10.3 기술 지표

- 페이지 로딩 시간: 평균 < 2초
- API 응답 시간: 평균 < 300ms
- 에러율: < 0.1%
- 서버 가동률(Uptime): > 99.5%

### 10.4 비즈니스 지표

- 회원 가입 전환율: 20% 이상
- 첫 기여까지 걸리는 시간: 평균 < 7일
- 사용자 유지율(Retention): 30일 > 40%
- 피드백 응답률: > 80%
