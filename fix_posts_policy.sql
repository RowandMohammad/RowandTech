-- Fix Posts Table Permissions
-- This will ensure admins can create, edit and delete posts

BEGIN;

-- 1. First disable RLS on posts table
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 2. Check posts table structure and see what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'posts';

-- 3. Drop all existing policies on posts table
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

-- 4. Create simple policies that DEFINITELY allow admins to do everything with posts
-- Allow all users to view posts (public blog)
CREATE POLICY "posts_view_for_all" ON posts
  FOR SELECT 
  USING (true);

-- Allow only admins to insert posts
CREATE POLICY "posts_insert_for_admins" ON posts
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- Allow only admins to update posts
CREATE POLICY "posts_update_for_admins" ON posts
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- Allow only admins to delete posts
CREATE POLICY "posts_delete_for_admins" ON posts
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  );

-- 5. Re-enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 6. Add a test post to verify permission (will be auto-assigned to current user)
INSERT INTO posts (
  title, 
  content,
  slug, 
  excerpt,
  author
) VALUES (
  'Test Post from SQL Fix',
  'This is a test post to verify permissions are working correctly.',
  'test-post-sql-fix-' || extract(epoch from now())::text,
  'Test excerpt',
  'Admin'
);

-- Verify posts policies
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- Verify admin status (current user)
SELECT EXISTS (
  SELECT 1 
  FROM admins 
  WHERE user_id = auth.uid()
) AS is_admin;

-- List most recent posts to verify test post was added
SELECT id, title, slug, created_at, updated_at 
FROM posts 
ORDER BY created_at DESC 
LIMIT 5;

COMMIT; 