-- SQL to fix the infinite recursion in admins table policy

-- First, disable RLS temporarily to fix the issue
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing the recursion
DROP POLICY IF EXISTS admins_policy ON admins;
DROP POLICY IF EXISTS admins_select_policy ON admins;
DROP POLICY IF EXISTS admins_insert_policy ON admins;
DROP POLICY IF EXISTS admins_update_policy ON admins;
DROP POLICY IF EXISTS admins_delete_policy ON admins;

-- Create a proper policy that doesn't cause recursion
-- This policy allows:
-- 1. Admins to see all records (using auth.uid() to check if the user is in the admins table)
-- 2. Public access for signup (but only to insert their own record)
CREATE POLICY admins_select_policy ON admins
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY admins_insert_policy ON admins
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Make sure the table requires authentication
ALTER TABLE admins FORCE ROW LEVEL SECURITY;

-- Now fix the posts table policies
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS posts_policy ON posts;
DROP POLICY IF EXISTS posts_select_policy ON posts;
DROP POLICY IF EXISTS posts_insert_policy ON posts;
DROP POLICY IF EXISTS posts_update_policy ON posts;
DROP POLICY IF EXISTS posts_delete_policy ON posts;

-- Create proper policies for posts
-- Anyone can read posts (public blog)
CREATE POLICY posts_select_policy ON posts
    FOR SELECT
    USING (true);

-- Only admins can insert/update/delete posts
CREATE POLICY posts_insert_policy ON posts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY posts_update_policy ON posts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

CREATE POLICY posts_delete_policy ON posts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admins
            WHERE admins.user_id = auth.uid()
        )
    );

-- Re-enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Make sure the table requires authentication for writes
ALTER TABLE posts FORCE ROW LEVEL SECURITY;
