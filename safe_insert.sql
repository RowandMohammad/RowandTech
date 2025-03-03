-- Very simple direct insert with better error handling

-- Disable RLS temporarily
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Insert admin directly if they don't exist
INSERT INTO admins (user_id, email)
SELECT '345df789-b368-47fc-9266-2a714b7b89c3', 'rowandmohammad@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM admins 
  WHERE user_id = '345df789-b368-47fc-9266-2a714b7b89c3'
);

-- Re-enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY; 