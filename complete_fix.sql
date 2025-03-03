-- COMPLETE RESET AND FIX for admin access
-- This script will:
-- 1. Clear ALL existing policies (to eliminate conflicts)
-- 2. Set up a SINGLE set of proper policies
-- 3. Add current user as admin
-- 4. Fix any potential database issues causing UI glitches

-- Start transaction
BEGIN;

-- ===== STEP 1: DISABLE RLS AND CLEAN UP ALL POLICIES =====
-- Temporarily disable RLS on all tables
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Remove ALL policies from the admins table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'admins'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON admins', policy_record.policyname);
    END LOOP;
END $$;

-- Remove ALL policies from the posts table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'posts'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON posts', policy_record.policyname);
    END LOOP;
END $$;

-- ===== STEP 2: ENSURE DATABASE STRUCTURE IS CORRECT =====
-- Make sure user_id is UNIQUE in admins table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Clean up any duplicate admin records that might cause UI glitches
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

-- ===== STEP 3: ADD CURRENT USER AS ADMIN =====
-- Insert current user as admin (will do nothing if already exists)
INSERT INTO admins (user_id, email)
SELECT 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  AND auth.uid() IS NOT NULL;

-- ===== STEP 4: CREATE NEW CLEAN POLICIES =====
-- Simple policy for admins table - ANY authenticated user can VIEW the admins table
-- This is crucial for checking admin status
CREATE POLICY "admins_view_policy" ON admins
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can modify the admins table
CREATE POLICY "admins_modify_policy" ON admins
  FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

-- For posts table - ANY authenticated user can VIEW posts
CREATE POLICY "posts_view_policy" ON posts
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only admins can CREATE posts
CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

-- Only admins can UPDATE posts
CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM admins))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admins));

-- Only admins can DELETE posts
CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM admins));

-- ===== STEP 5: RE-ENABLE RLS =====
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ===== STEP 6: VERIFY RESULTS =====
-- Show current admins and policies to confirm changes
SELECT id, user_id, email FROM admins;

COMMIT; 