-- This script attempts to fix common issues with admin authentication
-- Replace YOUR_USER_ID_HERE with your actual Supabase auth user ID
-- Replace YOUR_EMAIL_HERE with your actual email address

-- Start a transaction so we can roll back if needed
BEGIN;

-- Temporarily disable RLS
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 1. Make sure the user_id column has the correct type for Auth IDs (UUID)
-- This is safe and only executes if the column is not already UUID type
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'admins' AND column_name = 'user_id' AND data_type != 'uuid'
  ) THEN
    ALTER TABLE admins ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    RAISE NOTICE 'Changed user_id column to UUID type';
  ELSE
    RAISE NOTICE 'user_id column is already UUID type';
  END IF;
END $$;

-- 2. Add your user to the admins table (if not already there)
-- Using the WITH clause to check existence first
WITH check_exists AS (
  SELECT 1 FROM admins WHERE user_id = 'YOUR_USER_ID_HERE'::uuid
),
inserted AS (
  INSERT INTO admins (user_id, email)
  SELECT 'YOUR_USER_ID_HERE'::uuid, 'YOUR_EMAIL_HERE'
  WHERE NOT EXISTS (SELECT 1 FROM check_exists)
  RETURNING 1
)
SELECT CASE 
  WHEN EXISTS (SELECT 1 FROM check_exists) THEN 'User already exists in admins table'
  WHEN EXISTS (SELECT 1 FROM inserted) THEN 'User successfully added to admins table'
  ELSE 'Failed to add user to admins table'
END as result;

-- 3. Fix RLS policies to ensure admins can always access their own record
-- Drop any existing policies
DROP POLICY IF EXISTS admins_select_policy ON admins;
DROP POLICY IF EXISTS admins_insert_policy ON admins;
DROP POLICY IF EXISTS admins_update_policy ON admins;
DROP POLICY IF EXISTS admins_delete_policy ON admins;

-- Create better policies
-- Allow users to select their own record
CREATE POLICY admins_select_policy ON admins
  FOR SELECT USING (auth.uid() = user_id);

-- Allow any logged-in user to read all admin records (for admin verification)
-- Note: This works for this use case but may need to be adjusted for security
CREATE POLICY admins_select_all_policy ON admins
  FOR SELECT USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Verify the result
SELECT * FROM admins WHERE user_id = 'YOUR_USER_ID_HERE'::uuid;

-- If everything looks good, commit the transaction
COMMIT; 