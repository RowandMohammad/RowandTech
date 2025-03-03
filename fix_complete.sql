-- Comprehensive fix script for admin access and post management issues
-- This script resolves RLS policy issues, adds the current user as an admin,
-- and ensures proper permissions for post creation and editing

BEGIN;

-- Step 1: Temporarily disable RLS on the admins table
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Step 2: Add current user as admin if not already present
DO $$
DECLARE
  current_user_id TEXT;
  current_user_email TEXT;
BEGIN
  -- Get current user info
  SELECT auth.uid(), auth.email() INTO current_user_id, current_user_email;
  
  -- Add user to admins table if not already there
  INSERT INTO public.admins (user_id, email)
  VALUES (current_user_id, current_user_email)
  ON CONFLICT (user_id) DO NOTHING;
  
  RAISE NOTICE 'Added user % (%) to admins table', current_user_email, current_user_id;
END $$;

-- Step 3: Drop all existing policies on the admins table
DROP POLICY IF EXISTS "public_select_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_insert_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_update_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_delete_admins" ON public.admins;
DROP POLICY IF EXISTS "enable admins to view their own record" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admins;
DROP POLICY IF EXISTS "Allow individual read access" ON public.admins;
DROP POLICY IF EXISTS "Enable insert for users based on email" ON public.admins;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.admins;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated users to check admins table" ON public.admins;

-- Step 4: Create simplified policies for the admins table
-- Simple policy allowing anyone to check if a user is in the admins table
CREATE POLICY "Allow check admin status" 
ON public.admins FOR SELECT 
TO authenticated
USING (true);

-- Step 5: Re-enable RLS on the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Step 6: Now fix the posts table policies

-- First, check if Row Level Security is enabled on the posts table
SELECT CASE 
  WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'posts' 
    AND rowsecurity = true
  ) 
  THEN 'Row Level Security is enabled on posts table'
  ELSE 'Row Level Security is NOT enabled on posts table'
END;

-- Enable RLS if not already enabled
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on the posts table
DROP POLICY IF EXISTS "Allow select for all" ON public.posts;
DROP POLICY IF EXISTS "Allow insert for admins" ON public.posts;
DROP POLICY IF EXISTS "Allow update for admins" ON public.posts;
DROP POLICY IF EXISTS "Allow delete for admins" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.posts;
DROP POLICY IF EXISTS "Allow public to view posts" ON public.posts;
DROP POLICY IF EXISTS "Allow admins to insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow admins to update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow admins to delete posts" ON public.posts;

-- Create a simple policy for viewing posts (public access)
CREATE POLICY "Allow public to view posts" 
ON public.posts FOR SELECT 
USING (true);

-- Create a policy allowing admins to insert posts
CREATE POLICY "Allow admins to insert posts" 
ON public.posts FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
  )
);

-- Create a policy allowing admins to update posts
CREATE POLICY "Allow admins to update posts" 
ON public.posts FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
  )
);

-- Create a policy allowing admins to delete posts
CREATE POLICY "Allow admins to delete posts" 
ON public.posts FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
  )
);

-- Step 7: Create an admin function for emergency access
CREATE OR REPLACE FUNCTION public.add_admin_direct(
  userid text,
  useremail text
) RETURNS jsonb
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Temporarily disable RLS
  ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
  
  -- Check if admin exists
  IF EXISTS (SELECT 1 FROM public.admins WHERE user_id = userid) THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin already exists',
      'user_id', userid,
      'email', useremail
    );
  ELSE
    -- Insert admin
    INSERT INTO public.admins (user_id, email)
    VALUES (userid, useremail);
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Admin added successfully',
      'user_id', userid,
      'email', useremail
    );
  END IF;
  
  -- Re-enable RLS
  ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Verify the current state
-- Check current user's admin status
DO $$
DECLARE
  current_user_id TEXT;
  current_user_email TEXT;
  is_admin BOOLEAN;
BEGIN
  -- Get current user info
  SELECT auth.uid(), auth.email() INTO current_user_id, current_user_email;
  
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = current_user_id
  ) INTO is_admin;
  
  IF is_admin THEN
    RAISE NOTICE 'User % (%) is an admin', current_user_email, current_user_id;
  ELSE
    RAISE NOTICE 'User % (%) is NOT an admin', current_user_email, current_user_id;
  END IF;
END $$;

SELECT 'Fix script completed successfully' as message;

COMMIT; 