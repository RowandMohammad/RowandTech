-- Create a SQL function to add an admin user bypassing RLS

-- This function will be used to add a user to the admins table
-- It uses SECURITY DEFINER to run with the privileges of the creator
-- This bypasses RLS policies

CREATE OR REPLACE FUNCTION add_admin_bypass_rls(user_id_param UUID, email_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
  
  -- Insert the admin record
  INSERT INTO admins (user_id, email)
  VALUES (user_id_param, email_param)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Re-enable RLS
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 