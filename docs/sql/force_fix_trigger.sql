-- FORCE FIX: Drop and Re-create Trigger
-- ERROR: 42703: record "new" has no field "updatedAt" means the trigger is still calling the old function.

-- 1. Create the correct snake_case function
CREATE OR REPLACE FUNCTION set_updated_at_snake_case()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. EXPLICITLY Drop the specific trigger from the 'boards' table
DROP TRIGGER IF EXISTS boards_set_updated_at ON boards;

-- 3. Just in case, try dropping it if it was named differently (common mistake)
DROP TRIGGER IF EXISTS set_updated_at ON boards;

-- 4. Re-create the trigger pointing to the NEW function
CREATE TRIGGER boards_set_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_snake_case();

-- This confirms the fix.
SELECT 'Fix applied successfully' as status;
