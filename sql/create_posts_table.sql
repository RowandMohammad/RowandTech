-- SQL script to create the posts table if it doesn't exist

-- Check if the posts table exists, and create it if it doesn't
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

        -- Enable Row Level Security
        ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

        -- Create policies
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
    END IF;
END
$$; 