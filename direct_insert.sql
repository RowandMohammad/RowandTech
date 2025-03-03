-- Simple direct insert without ON CONFLICT

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- First, check if the user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = '345df789-b368-47fc-9266-2a714b7b89c3'
  ) INTO user_exists;
  
  IF NOT user_exists THEN
    -- Insert the user if they don't exist
    INSERT INTO admins (user_id, email)
    VALUES ('345df789-b368-47fc-9266-2a714b7b89c3', 'rowandmohammad@gmail.com');
  END IF;
END $$;

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY; 