-- Comprehensive fix script for admin access and post CRUD operations

--------------------------------------------------
-- PART 1: FIX ADMIN ACCESS
--------------------------------------------------

-- Step 1: Temporarily disable RLS on the admins table to allow direct insert
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Step 2: Clean up any existing records for this user to avoid duplicates
DELETE FROM public.admins WHERE user_id = '345df789-b368-47fc-9266-2a714e7a14bf';

-- Step 3: Insert the user directly into the admins table
INSERT INTO public.admins (user_id, email)
VALUES ('345df789-b368-47fc-9266-2a714e7a14bf', 'rowanandmohammad@gmail.com');

-- Step 4: Re-enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Step 5: Clean up any problematic policies that might be interfering
DROP POLICY IF EXISTS "Enable insert for users based on email" ON public.admins;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.admins;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.admins;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.admins;
DROP POLICY IF EXISTS "Allow individual read access" ON public.admins;
DROP POLICY IF EXISTS "Allow authenticated users to check admins table" ON public.admins;
DROP POLICY IF EXISTS "public_select_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_insert_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_update_admins" ON public.admins;
DROP POLICY IF EXISTS "authenticated_delete_admins" ON public.admins;
DROP POLICY IF EXISTS "enable admins to view their own record" ON public.admins;
DROP POLICY IF EXISTS "Allow check admin status" ON public.admins;

-- Step 6: Create a clear policy that allows the authenticated user to view the admins table
CREATE POLICY "Allow check admin status" 
ON public.admins FOR SELECT 
TO authenticated
USING (true);

--------------------------------------------------
-- PART 2: FIX POST POLICIES
--------------------------------------------------

-- Step 1: Enable Row Level Security on posts table
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
DROP POLICY IF EXISTS "Allow anyone to view posts" ON public.posts;

-- Step 3: Create a simplified policy for viewing posts (no auth required)
CREATE POLICY "Allow anyone to view posts" 
ON public.posts FOR SELECT 
USING (true);

-- Step 4: Create clear and specific policies for admin operations with very simple conditions
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

-- Verify the admin was added
SELECT * FROM public.admins;

-- Add a message to show completion
SELECT 'Complete fix applied successfully!' as message; 