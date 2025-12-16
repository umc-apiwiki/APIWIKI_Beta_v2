// placeholder: shared types
// src/types/index.ts

export interface API {
  id: string;
  name: string;
  company: string;
  logo: string;
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
}

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