-- SQL script to directly add the user as an admin

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

-- Step 6: Create a clear policy that allows the authenticated user to view the admins table
DROP POLICY IF EXISTS "Allow check admin status" ON public.admins;
CREATE POLICY "Allow check admin status" 
ON public.admins FOR SELECT 
TO authenticated
USING (true);

-- Step 7: Verify the admin was added
SELECT * FROM public.admins; 