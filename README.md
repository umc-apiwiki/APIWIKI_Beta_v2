# API WIKI - 개발자들이 함께 만드는 API 선택 가이드

## 📋 프로젝트 개요

API 위키는 개발자들이 실제 사용 경험을 공유하며 함께 만드는 API 선택 가이드 플랫폼입니다.

### 핵심 기능
- 🔍 **API 통합 검색** - 다양한 API를 한 곳에서 검색하고 비교
- 📊 **실사용자 후기** - 실제 사용 경험 기반 평가
- 💰 **비용 계산기** - 예상 사용량 기반 비용 산정
- 📖 **코드 예제** - 언어별 샘플 코드 제공
- 🎯 **카테고리별 탐색** - 결제, 지도, AI 등 카테고리 분류

## 🚀 빠른 시작
  d
### 1. 프로젝트 생성

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest api-wiki --typescript --tailwind --app

# 프로젝트 디렉토리로 이동
cd api-wiki
```

### 2. 의존성 설치

```bash
# lucide-react 아이콘 라이브러리 설치
npm install lucide-react
```
 
### 3. 프로젝트 구조 생성

```
api-wiki/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── explore/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryCarousel.tsx
│   │   ├── APICard.tsx
│   │   ├── NewsCard.tsx
│   │   └── APICarousel.tsx
│   ├── types/
│   │   └── index.ts
│   └── data/
│       └── mockData.ts
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

### 4. 파일 복사

위에서 제공된 각 파일의 내용을 해당 위치에 복사합니다:

1. **Types 정의**: `src/types/index.ts`
2. **Mock 데이터**: `src/data/mockData.ts`
3. **컴포넌트들**: `src/components/` 폴더에 모든 컴포넌트 파일
4. **페이지들**: `src/app/` 폴더에 페이지 파일들
5. **설정 파일들**: 루트 디렉토리에 config 파일들

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 파일 구조 설명

### Pages (라우팅)

- **`/`** (src/app/page.tsx) - 홈 페이지
  - 검색바, 카테고리, 인기 API, 추천 API, 뉴스
  
- **`/explore`** (src/app/explore/page.tsx) - 탐색 페이지
  - 검색 필터, 정렬, API 그리드
  
- **`/api/[id]`** (src/app/api/[id]/page.tsx) - API 상세 페이지
  - 개요, 비용 정보, 후기, 코드 예제 탭

### Components

| 컴포넌트 | 설명 |
|---------|------|
| `Header.tsx` | 상단 네비게이션 바 (로고, 메뉴, 로그인 버튼) |
| `Footer.tsx` | 하단 푸터 |
| `SearchBar.tsx` | 검색 입력창 및 버튼 |
| `CategoryCarousel.tsx` | 카테고리 가로 스크롤 |
| `APICard.tsx` | API 정보 카드 |
| `NewsCard.tsx` | 뉴스 카드 |
| `APICarousel.tsx` | API 카드 가로 스크롤 |

### Data & Types

- **`types/index.ts`**: TypeScript 인터페이스 정의
- **`data/mockData.ts`**: Mock API 데이터 및 헬퍼 함수

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* Primary Colors */
--blue-500: #4A90E2 (메인 색상)
--cyan-400: #81FFEF (그라디언트 시작)
--pink-400: #F067B4 (그라디언트 끝)

/* Status Colors */
--green-500: #34A853 (무료)
--yellow-500: #FBBC05 (혼합)
--red-500: #EA4335 (유료)

/* Neutral Colors */
--gray-50: #F9FAFB (배경)
--gray-900: #111827 (텍스트)
```

### 타이포그래피

- **헤딩**: Inter font (굵기: 600-700)
- **본문**: Inter font (굵기: 400-500)
- **크기**: 텍스트 sm(14px) ~ 6xl(60px)

## 🔧 주요 기능 구현

### 1. 검색 기능

```typescript
// SearchBar 컴포넌트에서 검색 시
router.push(`/explore?q=${encodeURIComponent(query)}`);

// Explore 페이지에서 쿼리 파라미터 읽기
const searchParams = useSearchParams();
const query = searchParams.get('q') || '';
```

### 2. 필터링 & 정렬

```typescript
// 검색 필터
result = result.filter(api => 
  api.name.toLowerCase().includes(query.toLowerCase())
);

// 정렬
result.sort((a, b) => b.rating - a.rating); // 인기순
```

### 3. 동적 라우팅

```typescript
// API 상세 페이지 URL: /api/[id]
const params = useParams();
const api = getAPIById(params.id as string);
```

## 📱 반응형 디자인

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Grid 시스템

```css
/* 모바일: 1열 */
grid-cols-1

/* 태블릿: 2열 */
md:grid-cols-2

/* 데스크톱: 3열 */
lg:grid-cols-3
```

## 🚧 다음 단계 (To-Do)

### Phase 1 - MVP 완성
- [ ] 로그인/회원가입 모달 구현
- [ ] 북마크 기능 (LocalStorage)
- [ ] 비교하기 모달
- [ ] 후기 작성 폼

### Phase 2 - 백엔드 연동
- [ ] Next.js API Routes 생성
- [ ] 데이터베이스 연결 (PostgreSQL/MongoDB)
- [ ] 실제 API 데이터 연동
- [ ] 사용자 인증 (NextAuth.js)

### Phase 3 - 고급 기능
- [ ] 위키 편집 기능
- [ ] 실시간 API 테스트 환경
- [ ] AI 기반 API 추천
- [ ] 커뮤니티 Q&A

## 🛠️ 개발 가이드

### 새로운 API 추가하기

1. `src/data/mockData.ts`의 `mockAPIs` 배열에 추가

```typescript
{
  id: '9',
  name: 'New API',
  company: 'Company Name',
  logo: '🎨',
  rating: 4.5,
  users: '100M',
  price: 'free',
  description: 'API 설명',
  categories: ['카테고리1', '카테고리2'],
  features: ['기능1', '기능2'],
  pricing: {
    free: '무료 플랜 설명'
  }
}
```

### 새로운 페이지 추가하기

```bash
# src/app 폴더에 새 폴더 생성
mkdir src/app/new-page

# page.tsx 파일 생성
touch src/app/new-page/page.tsx
```

### 스타일 커스터마이징

`tailwind.config.ts`에서 테마 확장:

```typescript
theme: {
  extend: {
    colors: {
      'custom-blue': '#YOUR_COLOR',
    },
  },
}
```

## 📦 빌드 & 배포

### 프로덕션 빌드

```bash
npm run build
npm run start
```

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👥 제작자

API WIKI Project Team

---

**문의사항**: api-wiki@example.com
**프로젝트 URL**: https://github.com/your-username/api-wiki