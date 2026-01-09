-- UNIVERSAL FIX: Smart Trigger Function
-- This function dynamically checks which column exists and updates it.
-- It handles: "updatedAt", "updated_at", "updatedat"

CREATE OR REPLACE FUNCTION set_updated_at_smart()
RETURNS TRIGGER AS $$
BEGIN
  -- Check for "updatedAt" (CamelCase)
  BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
  EXCEPTION WHEN undefined_column THEN
    NULL; -- Ignore and try next
  END;

  -- Check for "updated_at" (snake_case)
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  EXCEPTION WHEN undefined_column THEN
    NULL; -- Ignore and try next
  END;

  -- Check for "updatedat" (lowercase)
  BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
  EXCEPTION WHEN undefined_column THEN
    -- If no column matches, just return NEW without updating time
    RETURN NEW;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop all previous triggers to start fresh
DROP TRIGGER IF EXISTS user_set_updated_at ON "User";
DROP TRIGGER IF EXISTS api_set_updated_at ON "Api";
DROP TRIGGER IF EXISTS boards_set_updated_at ON boards;

-- Re-attach the SMART trigger to all tables
CREATE TRIGGER user_set_updated_at
BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_smart();

CREATE TRIGGER api_set_updated_at
BEFORE UPDATE ON "Api"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_smart();

CREATE TRIGGER boards_set_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW EXECUTE PROCEDURE set_updated_at_smart();

SELECT 'Applied Smart Trigger to all tables' as status;
