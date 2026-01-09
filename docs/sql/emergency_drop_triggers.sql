-- EMERGENCY: DROP ALL TRIGGERS
-- The site is broken because of the "updated_at" trigger issues.
-- This script removes all of them to restore functionality immediately.
-- Automatic "updatedAt" updates will stop, but the site will work.

-- Drop triggers for "User"
DROP TRIGGER IF EXISTS user_set_updated_at ON "User";
DROP TRIGGER IF EXISTS set_updated_at ON "User";

-- Drop triggers for "Api"
DROP TRIGGER IF EXISTS api_set_updated_at ON "Api";
DROP TRIGGER IF EXISTS set_updated_at ON "Api";

-- Drop triggers for "boards"
DROP TRIGGER IF EXISTS boards_set_updated_at ON boards;
DROP TRIGGER IF EXISTS set_updated_at ON boards;

SELECT 'All updated_at triggers dropped. System should be functional.' as status;
