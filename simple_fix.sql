-- Super Simple Admin Fix
-- This is a minimal script that just adds you as an admin and ensures basic policies

-- Start transaction
BEGIN;

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Add yourself as admin (this uses your current auth.uid())
INSERT INTO admins (user_id, email)
SELECT 
  auth.uid(), 
  (SELECT email FROM auth.users WHERE id = auth.uid())
WHERE 
  NOT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())
  AND auth.uid() IS NOT NULL;

-- Check for the admins_select_policy - if it doesn't exist, create it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' AND policyname = 'admins_select_policy'
  ) THEN
    -- Create a basic policy allowing authenticated users to view the admins table
    EXECUTE 'CREATE POLICY "admins_select_policy" ON admins FOR SELECT USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Show current admins (should include you now)
SELECT id, user_id, email FROM admins;

-- Commit all changes
COMMIT; 