// src/types/index.ts
// 데이터베이스 엔티티 및 공유 타입 정의

// ============================================
// ENUM 타입 정의 (Supabase enum과 일치)
// ============================================

/** 사용자 등급 */
export type UserGrade = 'bronze' | 'silver' | 'gold' | 'admin';

/** API 승인 상태 */
export type ApiStatus = 'pending' | 'approved' | 'rejected';

/** 게시판 타입 */
export type BoardType = 'inquiry' | 'qna' | 'free';

/** 피드백 타입 */
export type FeedbackType = 'error' | 'feature' | 'idea';

/** 피드백 상태 */
export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved';

/** 사용자 활동 타입 */
export type ActivityType = 'login' | 'post' | 'comment' | 'edit';

// ============================================
// 데이터베이스 엔티티 타입
// ============================================

/** 사용자 */
export interface User {
  id: string;
  email: string;
  password_hash?: string; // 클라이언트에서는 보통 제외
  name: string | null;
  grade: UserGrade;
  activity_score: number;
  created_at: Date | string;
  updated_at: Date | string;
}

/** API (확장된 버전) */
export interface API {
  id: string;
  name: string;
  company: string;
  logo: string;
  slug: string;
  rating: number;
  users: string;
  price: 'free' | 'paid' | 'mixed';
  description: string;
  categories: string[];
  tags?: string[]; // 검색용 상세 태그
  features?: string[];
  pricing?: {
    free?: string;
    basic?: string;
    pro?: string;
  };
  // Additional optional metadata for filtering and UI
  countries?: string[]; // 제공 국가(예: ['한국','미국'])
  authMethods?: string[]; // 인증 방식(예: ['OAuth2','APIKey','JWT'])
  docsLanguages?: string[]; // 문서 제공 언어(예: ['한국어','영어'])
  relatedIds?: string[]; // 수동으로 지정한 유사 API id 목록
  viewsLast7Days?: number; // 최근 7일 조회수 (정렬/인기 지표)
  recommendedForStacks?: string[]; // 추천 스택 태그 (예: ['React','Node.js'])

  // API 승인 관련 필드
  status?: ApiStatus;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API 등록 제출 데이터
export interface APISubmissionPayload {
  name: string;
  company: string;
  description: string;
  categories: string[];
  price: 'free' | 'paid' | 'mixed';
  logo?: string;
  features?: string[];
  pricing?: {
    free?: string;
    basic?: string;
    pro?: string;
  };
}

// 게시글 작성 데이터
export interface BoardSubmissionPayload {
  type: BoardType;
  title: string;
  content: string;
  author_name?: string; // 비회원용
}

// 댓글 작성 데이터
export interface CommentSubmissionPayload {
  board_id: string;
  content: string;
  author_name?: string; // 비회원용
}

/** 게시판 게시글 */
export interface Board {
  id: string;
  type: BoardType;
  title: string;
  content: string;
  author_id: string | null; // 회원 작성자 ID (nullable for non-members)
  author_name: string | null; // 비회원 작성자 이름
  created_at: Date | string;
  updated_at: Date | string;
}

/** 댓글 */
export interface Comment {
  id: string;
  board_id: string; // Board ID
  content: string;
  author_id: string | null; // 회원 작성자 ID (nullable for non-members)
  author_name: string | null; // 비회원 작성자 이름
  created_at: Date | string;
}

/** 피드백 */
export interface Feedback {
  id: string;
  type: FeedbackType;
  content: string;
  user_id: string | null; // User ID (nullable for non-members)
  status: FeedbackStatus;
  created_at: Date | string;
}

/** 사용자 활동 */
export interface UserActivity {
  id: string;
  user_id: string; // User ID
  action_type: ActivityType;
  points: number; // 활동에 따른 점수
  created_at: Date | string;
}

/** 위키 편집 이력 */
export interface WikiEdit {
  id: string;
  api_id: string; // API ID
  user_id: string; // User ID
  content: string; // 편집된 전체 내용
  diff: {
    // 변경 사항 (이전/이후 비교)
    before?: string;
    after?: string;
    changes?: Array<{
      type: 'add' | 'remove' | 'modify';
      position: number;
      content: string;
    }>;
  } | null;
  created_at: Date | string;
}

// ============================================
// UI/기타 타입 (기존 유지)
// ============================================

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  content: string;
  tags: string[];
}

// ============================================
// 요청/응답 타입 (API 통신용)
// ============================================

/** API 등록 요청 */
export interface ApiSubmitRequest {
  name: string;
  company: string;
  description: string;
  categories: string[];
  price: 'free' | 'paid' | 'mixed';
  base_url?: string;
}

/** 게시글 작성 요청 */
export interface BoardCreateRequest {
  type: BoardType;
  title: string;
  content: string;
  author_name?: string; // 비회원인 경우
}

/** 댓글 작성 요청 */
export interface CommentCreateRequest {
  board_id: string;
  content: string;
  author_name?: string; // 비회원인 경우
}

/** 피드백 제출 요청 */
export interface FeedbackSubmitRequest {
  type: FeedbackType;
  content: string;
}

/** 위키 편집 요청 */
export interface WikiEditRequest {
  api_id: string;
  content: string;
  diff?: WikiEdit['diff'];
}

// ============================================
// 유틸리티 타입
// ============================================

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// NextAuth 세션 확장
// ============================================

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      grade: UserGrade;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    grade: UserGrade;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    grade: UserGrade;
  }
}