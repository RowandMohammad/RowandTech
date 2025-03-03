-- User Login Fix Script
-- This allows you to verify and reset password issues
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- Start transaction
BEGIN;

-- Part 1: Check if the user exists
SELECT id, email, last_sign_in_at, created_at 
FROM auth.users 
WHERE email = 'rowandmohammad@gmail.com';

-- Part 2: Check admin status (for verification)
SELECT * FROM admins 
WHERE email = 'rowandmohammad@gmail.com';

-- Part 3: Update user password (ONLY IF NEEDED)
-- This will set the password to 'newpassword123' 
-- CHANGE THIS to your desired password before running!
UPDATE auth.users
SET 
  encrypted_password = crypt('newpassword123', gen_salt('bf')),
  updated_at = now()
WHERE email = 'rowandmohammad@gmail.com';

-- Part 4: Re-add to admins table with CORRECT user ID
-- First, find the correct auth.uid
DO $$
DECLARE
  correct_user_id UUID;
BEGIN
  -- Get the real user ID from auth.users
  SELECT id INTO correct_user_id 
  FROM auth.users 
  WHERE email = 'rowandmohammad@gmail.com';
  
  -- If user exists
  IF correct_user_id IS NOT NULL THEN
    -- Remove any existing entries
    DELETE FROM admins 
    WHERE email = 'rowandmohammad@gmail.com';
    
    -- Add with correct ID
    INSERT INTO admins (user_id, email)
    VALUES (correct_user_id, 'rowandmohammad@gmail.com');
    
    RAISE NOTICE 'User added as admin with ID: %', correct_user_id;
  ELSE
    RAISE NOTICE 'User not found in auth.users!';
  END IF;
END $$;

-- Make sure RLS won't block queries
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Clean up any duplicate records
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

-- Create simple admin lookup policy
DROP POLICY IF EXISTS "admins_view_policy" ON admins;
CREATE POLICY "admins_view_policy" ON admins
  FOR SELECT
  USING (true);

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Verify final result
SELECT a.id, a.user_id, a.email, u.email as auth_email
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.email = 'rowandmohammad@gmail.com';

-- COMMIT to apply changes (uncomment when ready)
-- COMMIT;

-- ROLLBACK to discard changes (comment out when ready to commit)
ROLLBACK; 