-- Add 'community' to board_type enum

-- boards 테이블의 board_type enum에 'community' 추가
ALTER TYPE board_type ADD VALUE IF NOT EXISTS 'community';

-- 확인
SELECT unnest(enum_range(NULL::board_type)) AS board_types;
