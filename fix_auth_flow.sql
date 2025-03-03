-- Fix Authentication Flow Issues
-- This script addresses the admin status glitching by fixing the underlying database configuration

-- Start a transaction to ensure all changes happen together
BEGIN;

-- 1. Disable Row Level Security temporarily on admins table
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 2. Ensure user_id has a unique constraint (important for stable authentication)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- 3. Clean up any duplicate records that might cause instability
WITH duplicates AS (
  SELECT user_id, MIN(id) as keep_id
  FROM admins
  GROUP BY user_id
  HAVING COUNT(*) > 1
)
DELETE FROM admins a
WHERE EXISTS (
  SELECT 1 FROM duplicates d
  WHERE a.user_id = d.user_id AND a.id != d.keep_id
);

-- 4. Drop all policies that might be causing recursion issues
DROP POLICY IF EXISTS "Admins can view admin list" ON admins;
DROP POLICY IF EXISTS "Super admin can manage admins" ON admins;
DROP POLICY IF EXISTS "admins_select_all_policy" ON admins;
DROP POLICY IF EXISTS "admins_select_policy" ON admins;
DROP POLICY IF EXISTS admins_select_self_policy ON admins;
DROP POLICY IF EXISTS admins_select_for_auth_policy ON admins;
DROP POLICY IF EXISTS admins_insert_policy ON admins;
DROP POLICY IF EXISTS admins_update_policy ON admins;
DROP POLICY IF EXISTS admins_delete_policy ON admins;
DROP POLICY IF EXISTS admins_all_policy ON admins;

-- 5. Clear any policies on the posts table that depend on admins relation
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON posts;
DROP POLICY IF EXISTS "Enable update for users based on email" ON posts;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON posts;

-- 6. Create simple policy for admins table that won't cause recursion
CREATE POLICY "admins_select_policy" ON admins
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 7. Create simple policies for posts table
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM admins)
  );

-- 8. Make sure current user is an admin (uses current session auth.uid())
INSERT INTO admins (user_id, email)
SELECT 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  AND auth.uid() IS NOT NULL;

-- 9. Re-enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 10. Verify admin users (show current admins)
SELECT id, user_id, email FROM admins;

-- Commit all changes
COMMIT; 