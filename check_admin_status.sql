-- This script checks if your user is properly in the admins table
-- Replace YOUR_USER_ID_HERE with your actual Supabase auth user ID

-- Disable RLS temporarily to make sure we can see everything
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Check if your user exists in the admins table
SELECT * FROM admins WHERE user_id = 'YOUR_USER_ID_HERE';

-- Count how many records are in the admins table
SELECT COUNT(*) FROM admins;

-- List all users in the admins table
SELECT * FROM admins;

-- Print info about the user_id column to verify UUID format
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'admins' 
    AND column_name = 'user_id';

-- Make sure RLS is enabled again when we're done
ALTER TABLE admins ENABLE ROW LEVEL SECURITY; 