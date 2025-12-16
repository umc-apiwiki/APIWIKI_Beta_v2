-- Supabase SQL: Extended schema for API WIKI Beta
-- Run this in Supabase SQL editor (public schema)
-- This extends the initial schema with additional tables and columns

-- ============================================
-- ENUM 타입 정의
-- ============================================

-- 사용자 등급 (브론즈, 실버, 골드, 관리자)
CREATE TYPE user_grade AS ENUM ('bronze', 'silver', 'gold', 'admin');

-- API 승인 상태 (대기, 승인, 거부)
CREATE TYPE api_status AS ENUM ('pending', 'approved', 'rejected');

-- 게시판 타입 (문의, QnA, 자유게시판)
CREATE TYPE board_type AS ENUM ('inquiry', 'qna', 'free');

-- 피드백 타입 (오류, 기능, 아이디어)
CREATE TYPE feedback_type AS ENUM ('error', 'feature', 'idea');

-- 피드백 상태 (대기, 검토됨, 해결됨)
CREATE TYPE feedback_status AS ENUM ('pending', 'reviewed', 'resolved');

-- 활동 타입 (로그인, 게시글, 댓글, 편집)
CREATE TYPE activity_type AS ENUM ('login', 'post', 'comment', 'edit');

-- ============================================
-- 기존 테이블 확장
-- ============================================

-- User 테이블에 인증 및 등급 관련 컬럼 추가
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS grade user_grade DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS activity_score INTEGER DEFAULT 0;

-- Api 테이블에 회사, 카테고리, 가격, 승인 관련 컬럼 추가
ALTER TABLE "Api"
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS categories TEXT[],
ADD COLUMN IF NOT EXISTS price TEXT,
ADD COLUMN IF NOT EXISTS status api_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD CONSTRAINT "Api_approved_by_fkey" FOREIGN KEY (approved_by) 
  REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- 새 테이블 생성
-- ============================================

-- 게시판 테이블 (문의/QnA/자유게시판)
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type board_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  author_name TEXT, -- 비회원 작성자 이름
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT boards_author_id_fkey FOREIGN KEY (author_id) 
    REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  -- 비회원 게시글의 경우 author_id는 NULL이고 author_name이 필수
  CONSTRAINT boards_author_check CHECK (
    (author_id IS NOT NULL) OR (author_name IS NOT NULL)
  )
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL,
  content TEXT NOT NULL,
  author_id UUID,
  author_name TEXT, -- 비회원 댓글 작성자 이름
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT comments_board_id_fkey FOREIGN KEY (board_id) 
    REFERENCES boards(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT comments_author_id_fkey FOREIGN KEY (author_id) 
    REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  -- 비회원 댓글의 경우 author_id는 NULL이고 author_name이 필수
  CONSTRAINT comments_author_check CHECK (
    (author_id IS NOT NULL) OR (author_name IS NOT NULL)
  )
);

-- 피드백 테이블
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type feedback_type NOT NULL,
  content TEXT NOT NULL,
  user_id UUID, -- 비회원도 피드백 가능하므로 nullable
  status feedback_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 사용자 활동 추적 테이블
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type activity_type NOT NULL,
  points INTEGER NOT NULL DEFAULT 0, -- 활동에 따른 점수
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 위키 편집 이력 테이블
CREATE TABLE IF NOT EXISTS wiki_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL, -- 편집된 전체 내용
  diff JSONB, -- 변경 사항 (이전/이후 비교)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT wiki_edits_api_id_fkey FOREIGN KEY (api_id) 
    REFERENCES "Api"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT wiki_edits_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- 게시판 인덱스
CREATE INDEX IF NOT EXISTS idx_boards_type ON boards(type);
CREATE INDEX IF NOT EXISTS idx_boards_author_id ON boards(author_id);
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at DESC);

-- 댓글 인덱스
CREATE INDEX IF NOT EXISTS idx_comments_board_id ON comments(board_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 피드백 인덱스
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- 사용자 활동 인덱스
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at DESC);

-- 위키 편집 인덱스
CREATE INDEX IF NOT EXISTS idx_wiki_edits_api_id ON wiki_edits(api_id);
CREATE INDEX IF NOT EXISTS idx_wiki_edits_user_id ON wiki_edits(user_id);
CREATE INDEX IF NOT EXISTS idx_wiki_edits_created_at ON wiki_edits(created_at DESC);

-- API 상태 인덱스
CREATE INDEX IF NOT EXISTS idx_api_status ON "Api"(status);

-- ============================================
-- 트리거 추가 (updatedAt 자동 업데이트)
-- ============================================

-- boards 테이블 updatedAt 트리거
CREATE TRIGGER boards_set_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- ============================================
-- 코멘트
-- ============================================

-- 스키마 확장 완료
-- 다음 단계: TypeScript 타입 정의 및 Supabase 헬퍼 함수 작성
