-- NUCLEAR OPTION: Reset ALL Triggers
-- This script will fix the "updatedAt" vs "updated_at" error for ALL tables (User, Api, boards).

-- 1. Create BOTH helper functions (CamelCase and snake_case)
CREATE OR REPLACE FUNCTION set_updated_at_camel_case()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_updated_at_snake_case()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if updated_at exists to avoid errors on some tables if schema drift occurred
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Drop potential conflicting triggers
DROP TRIGGER IF EXISTS user_set_updated_at ON "User";
DROP TRIGGER IF EXISTS api_set_updated_at ON "Api";
DROP TRIGGER IF EXISTS boards_set_updated_at ON boards;

-- Also drop generic name triggers just in case
DROP TRIGGER IF EXISTS set_updated_at ON "User";
DROP TRIGGER IF EXISTS set_updated_at ON "Api";
DROP TRIGGER IF EXISTS set_updated_at ON boards;

-- 3. Re-attach correct triggers

-- For "User" table (uses "updatedAt")
CREATE TRIGGER user_set_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_camel_case();

-- For "Api" table (uses "updatedAt")
CREATE TRIGGER api_set_updated_at
BEFORE UPDATE ON "Api"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_camel_case();

-- For "boards" table (uses updated_at)
CREATE TRIGGER boards_set_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_snake_case();

SELECT 'All triggers reset successfully' as status;
