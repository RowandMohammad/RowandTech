-- Modify the existing admins table without dropping it

-- Disable RLS temporarily to make changes
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Check if user_id column has a unique constraint, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key' AND conrelid = 'admins'::regclass
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist, create it
    CREATE TABLE admins (
      id SERIAL PRIMARY KEY,
      user_id UUID UNIQUE NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
END $$;

-- Insert your user directly as an admin (if not exists)
INSERT INTO admins (user_id, email)
SELECT '345df789-b368-47fc-9266-2a714b7b89c3', 'rowandmohammad@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM admins 
  WHERE user_id = '345df789-b368-47fc-9266-2a714b7b89c3'
);

-- Fix existing policies (if needed)
DROP POLICY IF EXISTS admins_select_policy ON admins;
DROP POLICY IF EXISTS admins_insert_policy ON admins;

-- Create proper policies
CREATE POLICY admins_select_policy ON admins
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY admins_insert_policy ON admins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY; 