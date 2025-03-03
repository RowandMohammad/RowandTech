-- Function to directly add a user as an admin while bypassing RLS
-- This is especially useful when having RLS issues

-- Create or replace the function
CREATE OR REPLACE FUNCTION add_admin_direct(userid UUID, useremail TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Disable RLS
  ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
  
  -- Try to insert the user if they don't exist
  INSERT INTO admins (user_id, email)
  SELECT userid, useremail
  WHERE NOT EXISTS (
    SELECT 1 FROM admins WHERE user_id = userid
  );
  
  -- Check if it worked
  SELECT jsonb_build_object(
    'success', true,
    'user_id', user_id,
    'email', email
  ) INTO result
  FROM admins
  WHERE user_id = userid;
  
  -- Re-enable RLS
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 