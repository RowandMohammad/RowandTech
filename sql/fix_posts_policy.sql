-- SQL script to fix Row Level Security policies for the posts table

-- Step 1: Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Step 2: Remove all existing policies to avoid conflicts
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

-- Step 3: Create a simplified policy for viewing posts (public access)
CREATE POLICY "Allow anyone to view posts" 
ON public.posts FOR SELECT 
USING (true);

-- Step 4: Create clear and specific policies for admin operations
-- Insert policy for admins only
CREATE POLICY "Allow admins to insert posts" 
ON public.posts FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- Update policy for admins only
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

-- Delete policy for admins only
CREATE POLICY "Allow admins to delete posts"
ON public.posts FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admins 
        WHERE admins.user_id = auth.uid()
    )
);

-- Verify the policies have been created
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'posts';

-- Ensure the posts table has the required columns
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'posts';

-- Add a message to show completion
SELECT 'Posts table policies have been successfully updated' as message; 