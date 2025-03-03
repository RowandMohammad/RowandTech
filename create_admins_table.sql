-- Create or recreate the admins table with proper constraints

-- First, check if the table exists and drop it if it does
DROP TABLE IF EXISTS admins;

-- Create the admins table with proper constraints
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert your user as an admin
INSERT INTO admins (user_id, email)
VALUES ('345df789-b368-47fc-9266-2a714b7b89c3', 'rowandmohammad@gmail.com');

-- Set up RLS policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows admins to see all records
CREATE POLICY admins_select_policy ON admins
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own record
CREATE POLICY admins_insert_policy ON admins
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Make sure the table requires authentication
ALTER TABLE admins FORCE ROW LEVEL SECURITY; 