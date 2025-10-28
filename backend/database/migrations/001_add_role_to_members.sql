-- Add role column to project_members table
-- Run this in Supabase SQL Editor

-- Add role column to project_members table
ALTER TABLE project_members 
ADD COLUMN IF NOT EXISTS role VARCHAR(100);

-- Update existing members with default role
UPDATE project_members 
SET role = 'Team Member' 
WHERE role IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'project_members'
ORDER BY ordinal_position;

-- Verify existing data
SELECT pm.*, u.name, u.email 
FROM project_members pm
LEFT JOIN users u ON pm.user_id = u.id
LIMIT 5;
