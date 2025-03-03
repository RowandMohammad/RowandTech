-- SQL Script to fix the infinite recursion in RLS policies
-- This script will:
-- 1. Drop problematic RLS policies that are causing infinite recursion
-- 2. Create new, simpler policies that work properly

-- Start a transaction to make sure everything runs as a unit
BEGIN;

-- Temporarily disable RLS on the admins table
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 1. Drop all existing policies on the admins table that might be causing problems
DROP POLICY IF EXISTS "Admins can view admin list" ON admins;
DROP POLICY IF EXISTS "Super admin can manage admins" ON admins;
DROP POLICY IF EXISTS "admins_select_all_policy" ON admins;
DROP POLICY IF EXISTS "admins_select_policy" ON admins;
DROP POLICY IF EXISTS admins_insert_policy ON admins;
DROP POLICY IF EXISTS admins_update_policy ON admins;
DROP POLICY IF EXISTS admins_delete_policy ON admins;
DROP POLICY IF EXISTS admins_all_policy ON admins;

-- 2. Create new, simpler policies

-- Policy allowing ANY authenticated user to check the admins table
-- This is necessary for the isAdmin check to work without recursion
CREATE POLICY "admins_select_all_policy" ON admins
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 3. Now fix the posts table policies that may reference the admins table

-- First, drop any problematic policies on the posts table
DROP POLICY IF EXISTS posts_select_policy ON posts;
DROP POLICY IF EXISTS posts_insert_policy ON posts;
DROP POLICY IF EXISTS posts_update_policy ON posts;
DROP POLICY IF EXISTS posts_delete_policy ON posts;

-- Create simpler policies for posts - Check if posts table exists first
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'posts'
  ) THEN
    -- Create policy for posts - anyone can view posts (we're not using is_published)
    EXECUTE '
      CREATE POLICY posts_select_policy ON posts
        FOR SELECT
        USING (true);
    ';

    -- Only admins can insert/update/delete posts
    EXECUTE '
      CREATE POLICY posts_insert_policy ON posts
        FOR INSERT
        WITH CHECK (EXISTS (
          SELECT 1 FROM admins WHERE user_id = auth.uid()
        ));
    ';

    EXECUTE '
      CREATE POLICY posts_update_policy ON posts
        FOR UPDATE
        USING (EXISTS (
          SELECT 1 FROM admins WHERE user_id = auth.uid()
        ));
    ';

    EXECUTE '
      CREATE POLICY posts_delete_policy ON posts
        FOR DELETE
        USING (EXISTS (
          SELECT 1 FROM admins WHERE user_id = auth.uid()
        ));
    ';
  END IF;
END $$;

-- Re-enable RLS on the admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Run a test query to verify policies are working
SELECT EXISTS (
  SELECT 1 FROM admins LIMIT 1
) AS can_query_admins;

-- Add the current user to admins if they aren't already
INSERT INTO admins (user_id, email)
SELECT 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  AND auth.uid() IS NOT NULL;

-- Commit all changes
COMMIT; 