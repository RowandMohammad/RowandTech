-- Script to inspect the admins table structure
-- View the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
  AND table_name = 'admins';

-- View primary keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name
FROM
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE
  tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_name = 'admins';

-- View foreign keys
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE
  tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'admins';

-- View unique constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name
FROM
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE
  tc.constraint_type = 'UNIQUE'
  AND tc.table_name = 'admins';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'admins';

-- Check if RLS is enabled
SELECT
  relname as table_name,
  relrowsecurity as rls_enabled
FROM
  pg_class
WHERE
  relname = 'admins';

-- See the current contents of the table
SELECT * FROM admins; 