-- Create a SQL function to add an admin user bypassing RLS
-- This version doesn't use ON CONFLICT

CREATE OR REPLACE FUNCTION add_admin_bypass_rls(user_id_param UUID, email_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
  
  -- Check if the user already exists
  SELECT EXISTS (
    SELECT 1 FROM admins 
    WHERE user_id = user_id_param
  ) INTO user_exists;
  
  -- Insert the admin record if they don't exist
  IF NOT user_exists THEN
    INSERT INTO admins (user_id, email)
    VALUES (user_id_param, email_param);
  END IF;
  
  -- Re-enable RLS
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 