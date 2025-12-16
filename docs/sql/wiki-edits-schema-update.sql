-- Supabase SQL: Wiki edits table schema update
-- Run this in Supabase SQL editor to update wiki_edits table

-- ============================================
-- wiki_edits 테이블 업데이트
-- ============================================

-- 기존 wiki_edits 테이블 삭제 후 재생성 (또는 ALTER TABLE 사용)
DROP TABLE IF EXISTS wiki_edits CASCADE;

-- 위키 편집 이력 테이블 (개선된 버전)
CREATE TABLE wiki_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_id UUID NOT NULL,
  user_id UUID, -- 비회원 수정 요청을 위해 nullable
  author_name TEXT, -- 비회원 작성자 이름
  content_before TEXT NOT NULL, -- 편집 전 내용
  content_after TEXT NOT NULL, -- 편집 후 내용
  edit_summary TEXT NOT NULL, -- 편집 요약
  is_approved BOOLEAN, -- NULL: 대기, TRUE: 승인, FALSE: 거부 (비회원 요청용)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT wiki_edits_api_id_fkey FOREIGN KEY (api_id) 
    REFERENCES "Api"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT wiki_edits_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE,
  -- 회원 편집 또는 비회원 요청 중 하나는 반드시 있어야 함
  CONSTRAINT wiki_edits_author_check CHECK (
    (user_id IS NOT NULL) OR (author_name IS NOT NULL)
  )
);

-- 인덱스 재생성
CREATE INDEX idx_wiki_edits_api_id ON wiki_edits(api_id);
CREATE INDEX idx_wiki_edits_user_id ON wiki_edits(user_id);
CREATE INDEX idx_wiki_edits_created_at ON wiki_edits(created_at DESC);
CREATE INDEX idx_wiki_edits_is_approved ON wiki_edits(is_approved);

-- 코멘트
COMMENT ON TABLE wiki_edits IS '위키 편집 이력 및 비회원 수정 요청';
COMMENT ON COLUMN wiki_edits.is_approved IS 'NULL: 대기중, TRUE: 승인됨, FALSE: 거부됨 (비회원 요청용)';
