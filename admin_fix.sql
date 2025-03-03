-- One-click fix for admin access issues
-- This will:
-- 1. Add you as an admin
-- 2. Fix the policies to prevent infinite recursion

-- Start a transaction
BEGIN;

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Add current user as admin (this uses your current auth.uid())
INSERT INTO admins (user_id, email)
SELECT 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  AND auth.uid() IS NOT NULL;

-- Drop all problematic policies
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

-- Create one simple policy that allows all authenticated users to see admins table
-- This is necessary for checking admin status
CREATE POLICY "admins_select_all_policy" ON admins
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- List who's in the admins table (should include you now!)
SELECT id, user_id, email FROM admins;

-- Commit changes
COMMIT; 