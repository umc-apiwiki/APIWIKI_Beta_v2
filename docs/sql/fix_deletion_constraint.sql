-- FIX: Allow Orphaned Posts (Fix User Deletion Error)
-- The error 23514 happens because "boards_author_check" constraint requires either author_id or author_name.
-- When a user is deleted, author_id becomes NULL, but author_name is also NULL (for member posts).
-- This violates the check.

-- 1. Drop the strict constraints on boards and comments
ALTER TABLE boards DROP CONSTRAINT IF EXISTS boards_author_check;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_check;

-- 2. (Optional) You can add a looser constraint if you want, or just leave it open.
-- For now, dropping it is the safest way to allow account deletion immediately.

SELECT 'Constraints dropped. User deletion should work now.' as status;
