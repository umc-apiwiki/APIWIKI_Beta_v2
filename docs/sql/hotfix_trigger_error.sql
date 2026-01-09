-- Fix for ERROR: 42703: record "new" has no field "updatedAt"
-- The 'boards' table uses snake_case 'updated_at', but the original set_updated_at function expected CamelCase.

-- 1. Create a function that handles snake_case 'updated_at'
CREATE OR REPLACE FUNCTION set_updated_at_snake_case()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Validate if the trigger exists and drop it to avoid conflicts
DROP TRIGGER IF EXISTS boards_set_updated_at ON boards;

-- 3. Re-create the trigger on 'boards' table using the new function
CREATE TRIGGER boards_set_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_snake_case();
