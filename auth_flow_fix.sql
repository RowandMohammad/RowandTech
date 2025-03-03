-- FINAL AUTHENTICATION FIX
-- This script will directly set your specific user as admin with your exact ID

BEGIN;

-- Disable RLS to allow direct modifications
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Clear all existing policies (to eliminate any conflicts)
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

-- IMPORTANT: Direct insert with your specific ID from the debug page
-- This ensures we're using the exact ID shown in your session
DELETE FROM admins WHERE user_id = '345df789-b368-47fc-9266-2a714b7b89c3';
INSERT INTO admins (user_id, email)
VALUES 
  ('345df789-b368-47fc-9266-2a714b7b89c3', 'rowandmohammad@gmail.com');

-- Ensure user_id is unique to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Create a simple, foolproof policy for admin lookups
CREATE POLICY "admins_view_policy" ON admins
  FOR SELECT
  USING (true);  -- Allow ALL queries to the admins table (simplest solution)

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Verify admin is set
SELECT * FROM admins;

COMMIT; 