-- Script to view the current structure of the admins table

-- View table columns and data types
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admins'
ORDER BY ordinal_position;

-- View constraints (primary key, unique, etc.)
SELECT con.conname, con.contype, 
       pg_get_constraintdef(con.oid) as constraint_def
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'admins'
AND nsp.nspname = current_schema();

-- View existing RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'admins'; 