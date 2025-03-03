-- Combined SQL script to set up and populate the posts table

-- Step 1: Create the posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'posts'
    ) THEN
        CREATE TABLE public.posts (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL,
            excerpt TEXT,
            published_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            category TEXT,
            tags TEXT[],
            author TEXT NOT NULL,
            author_image TEXT,
            cover_image TEXT
        );
    END IF;
END
$$;

-- Step 2: Enable Row Level Security and set up policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on the posts table to avoid conflicts
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

-- Create new policies
CREATE POLICY "Allow public to view posts" 
ON public.posts FOR SELECT 
USING (true);

CREATE POLICY "Allow admins to insert posts" 
ON public.posts FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
));

CREATE POLICY "Allow admins to update posts"
ON public.posts FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
));

CREATE POLICY "Allow admins to delete posts"
ON public.posts FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.admins 
    WHERE admins.user_id = auth.uid()
));

-- Step 3: Clean existing posts (optional, uncomment if you want to start fresh)
-- TRUNCATE TABLE public.posts RESTART IDENTITY;

-- Step 4: Populate with mock data
-- Only insert if the posts don't already exist (by checking slugs)

-- Insert first post if it doesn't exist
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
SELECT 
  'Building AI-Powered Data Pipelines with Python and Docker',
  'ai-data-pipelines',
  '# Building AI-Powered Data Pipelines with Python and Docker

This is a sample blog post about AI-powered data pipelines.',
  'Learn how to create efficient, scalable data pipelines that leverage machine learning for real-time insights.',
  '2025-03-10T10:00:00Z',
  '2025-03-10T10:00:00Z',
  'AI/ML',
  ARRAY['Python', 'Docker', 'Machine Learning', 'Data Engineering'],
  'Rowand Mohammad',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.posts WHERE slug = 'ai-data-pipelines'
);

-- Insert second post if it doesn't exist
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
SELECT
  'Raspberry Pi Cluster: Building a Mini Kubernetes Environment',
  'raspberry-pi-kubernetes',
  '# Raspberry Pi Cluster: Building a Mini Kubernetes Environment

This is a sample blog post about building a Raspberry Pi Kubernetes cluster.',
  'A step-by-step guide to creating your own mini K8s cluster for learning and development.',
  '2025-03-05T14:30:00Z',
  '2025-03-05T14:30:00Z',
  'Hardware Integration',
  ARRAY['Raspberry Pi', 'Kubernetes', 'DevOps', 'Homelab'],
  'Rowand Mohammad',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.posts WHERE slug = 'raspberry-pi-kubernetes'
);

-- Insert third post if it doesn't exist
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
SELECT
  'Implementing Zero-Trust Security in Enterprise Environments',
  'zero-trust-security',
  '# Implementing Zero-Trust Security in Enterprise Environments

This is a sample blog post about implementing zero-trust security.',
  'How to architect and deploy modern security principles in complex organizational setups.',
  '2025-02-28T09:15:00Z',
  '2025-02-28T09:15:00Z',
  'Enterprise Solutions',
  ARRAY['Security', 'Zero-Trust', 'Enterprise', 'Cybersecurity'],
  'Rowand Mohammad',
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.posts WHERE slug = 'zero-trust-security'
); 