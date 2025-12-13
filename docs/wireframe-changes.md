# 와이어프레임 → 코드 매핑 (요약)

이 문서는 첨부된 Excalidraw/PDF 와이어프레임을 기반으로 기존 `api-wiki` 프로토타입에서 수정해야 할 항목들을 정리합니다. 각 항목에 대해 수정 대상 파일, 수락 기준(acceptance criteria), 우선순위를 제공합니다.

---

## 1) 헤더 검색 위치 변경 (우선순위: 상)
- 요약: 메인 페이지(`/`)에서는 헤더에 검색창을 표시하지 않고, 탐색/검색 관련 페이지(`/explore`, 상세페이지 등)에서만 헤더 상단(또는 상단바)에 검색창을 표시.
- 대상 파일: `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/SearchBar.tsx`
- 수락 기준:
  - 루트(`/`) 접속 시 헤더에 검색 입력이 보이지 않음.
  - `/explore`에 진입하면 헤더(또는 상단영역)에 검색창이 보이며 입력 후 `router.push(`/explore?q=${encodeURIComponent(query)}`)`가 호출되어 검색 결과로 이동함.

---

## 2) 홈(메인) 레이아웃 조정: 추천/인기/카테고리 섹션 추가 (우선순위: 상)
- 요약: 메인에 '추천 API(사용자 스택 기반 3개)', '최근 인기 Top6', '카테고리 바로가기(8개)' 섹션을 와이어프레임대로 배치.
- 대상 파일: `src/app/page.tsx`, `src/components/CategoryCarousel.tsx`, `src/components/APICarousel.tsx`, `src/components/APICard.tsx`
- 수락 기준:
  - '추천 API' 영역이 존재하고 mockData에서 추천 플래그(또는 `recommendedForStacks`)를 가진 3개를 표시함.
  - '최근 인기 Top6' 영역이 존재하고 `viewsLast7Days` 또는 유사 필드로 상위 6개를 표시함.
  - '카테고리 바로가기'는 8개 항목을 가로 스크롤 또는 그리드로 보여주고 클릭 시 `/?category=` 또는 `/explore?category=`로 이동하도록 구현됨.

---

## 3) Suggest API / 유사 API 캐러셀 (우선순위: 중)
- 요약: 상세 페이지 하단(또는 홈의 추천 영역)에 현재 API와 유사한 API를 보여주는 캐러셀을 추가.
- 대상 파일: `src/app/api/[id]/page.tsx`, `src/components/APICarousel.tsx`, `src/data/mockData.ts`
- 수락 기준:
  - 상세 페이지에서 현재 API의 `relatedIds` 또는 `getRelatedAPIs(id)` 결과를 3~6개 표시.
  - 각 카드 클릭 시 해당 API 상세 페이지로 이동.

---

## 4) Explore 페이지: 필터/정렬 및 페이지당 카드 수 변경 (우선순위: 상)
- 요약: 와이어프레임의 필터 옵션(가격대, 평점, 제공국가, 인증방식, 문서 언어 등)을 반영하고, 한 페이지에 9개씩 로드하도록 변경(무한스크롤 유지).
- 대상 파일: `src/app/explore/page.tsx`
- 수락 기준:
  - 필터 UI가 모두 포함되어 있고 작동(목데이터 필드로 필터링됨).
  - 무한스크롤로 다음 페이지를 불러올 때 9개씩 추가 로드됨.

---

## 5) 비교(Compare) 모달 및 선택 로직 (우선순위: 상)
- 요약: API 카드에서 비교 선택(최대 4개)을 지원하고, '비교하기' 클릭 시 중앙 모달로 간단 비교 표를 표시.
- 대상 파일: `src/components/APICard.tsx`, `src/components/CompareModal.tsx`(신규), `src/app/explore/page.tsx`
- 수락 기준:
  - 카드에서 체크박스 또는 토글로 선택 가능(최대 4개 제한).
  - 2개 이상 선택 시 '비교하기' 버튼 활성화.
  - 비교 모달은 중앙 표시, 배경 블러(흐리게), ESC/닫기 버튼으로 닫기 가능.
  - 비교 표는 최소 항목(이름, 평점, 가격, 주요 기능)을 포함.

---

## 6) 모달 공통 규약 (우선순위: 중)
- 요약: 모든 모달은 페이지 전환 없이 중앙에 표시, 주변 흐리게(blur) 효과 적용, 접근성(포커스 트랩, ESC 닫기) 보장.
- 대상 파일: `src/components/ModalBase.tsx`(신규) 또는 기존 모달 확장, `src/app/layout.tsx`(글로벌 컨텍스트/포털 지원)
- 수락 기준:
  - 중앙 표시, 배경 블러 적용
  - 키보드로 모달 제어(ESC 닫기) 가능

---

## 7) mockData 확장 (우선순위: 상)
- 요약: 와이어프레임에서 필요한 데이터를 위해 `src/data/mockData.ts`에 필드 추가 및 헬퍼 개선.
- 권장 추가/확장 필드 예시:
  - `viewsLast7Days: number` (최근 7일 조회수)
  - `recommendedForStacks?: string[]` (추천 대상 스택 태그)
  - `relatedIds?: string[]` (유사 API id 목록)
  - `usage?: string` 또는 `users?: string` (사용자 수 텍스트)
  - `pricingPerRequest?: string | number` (요청당 가격)
  - `docsLanguages?: string[]` (문서 제공 언어)
  - `authMethods?: string[]` (지원 인증 방식: OAuth2, API Key, JWT 등)
- 대상 파일: `src/data/mockData.ts`
- 수락 기준:
  - 예시 레코드 2~3개에 위 필드가 채워져 있음.
  - `getRelatedAPIs` 헬퍼가 `relatedIds`를 우선 사용하도록 업데이트되거나, 유사도 알고리즘을 강화.

---

## 8) 반응형 및 접근성 점검 (우선순위: 중)
- 요약: 변경된 UI(특히 캐러셀, 모달, 그리드)가 모바일/데스크탑에서 정상 동작하는지 확인하고, 시멘틱한 마크업과 ARIA 속성 추가.
- 대상 파일: 변경된 모든 컴포넌트
- 수락 기준:
  - 주요 페이지에서 심각한 레이아웃 깨짐 없음
  - 모달/버튼/입력에 대해 키보드 접근성(탭 포커스) 확인

---

## 구현 우선순위 제안
1. 헤더/검색 위치 변경 (작업 #2)
2. mockData 확장 (작업 #8)
3. 홈 레이아웃(추천/인기/카테고리) 추가 (작업 #3)
4. Explore 필터/페이지당 아이템(9개) 변경 (작업 #5)
5. 비교 모달/공통 모달 컴포넌트 (작업 #6, #7)
6. Suggest API 캐러셀 (작업 #4)
7. 전체 반응형/접근성 점검 및 스모크 테스트 (작업 #9, #10)

---

## 개발 노트 / 구현 팁
- 클라이언트 컴포넌트는 `"use client"`를 유지해야 합니다. 특히 검색바, 비교 토글, 캐러셀은 클라이언트로 유지.
- 무한스크롤과 페이지당 갯수 변경 시 `IntersectionObserver` 설정에서 페이지 크기를 9로 맞출 것.
- 모달은 React Portal로 `document.body`에 렌더링하고, 배경 블러는 `backdrop-filter: blur(6px)` 혹은 Tailwind 유틸을 사용.
- `NEXT_PUBLIC_KAKAO_KEY`가 없는 환경에서 Kakao SDK 코드를 보호(조건부 로드)할 것.

---

필요하시면 제가 1) 헤더/검색 위치 변경을 바로 적용하거나 2) `src/data/mockData.ts`에 필드 추가를 먼저 적용해서 다른 컴포넌트 구현을 쉽게 만들겠습니다. 어느 작업을 먼저 진행할지 알려주세요.
