-- FINAL ATTEMPT: Switch User/Api to snake_case
-- It seems 'User' table also does not have "updatedAt". It likely uses "updated_at" or "updatedat".
-- We will try switching them to the snake_case function.

-- 1. Ensure the snake_case function exists (idempotent)
CREATE OR REPLACE FUNCTION set_updated_at_snake_case()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to set updated_at
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop existing triggers on User and Api
DROP TRIGGER IF EXISTS user_set_updated_at ON "User";
DROP TRIGGER IF EXISTS api_set_updated_at ON "Api";

-- 3. Re-create them pointing to snake_case function
CREATE TRIGGER user_set_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_snake_case();

CREATE TRIGGER api_set_updated_at
BEFORE UPDATE ON "Api"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_snake_case();

SELECT 'Switched User and Api to snake_case trigger' as status;
