-- Update project status options to include all required statuses
-- Execute this in your Supabase SQL Editor

-- Drop the existing check constraint on projects status
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new check constraint with updated status options
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('idea', 'planning', 'in_progress', 'on_hold', 'review', 'completed', 'cancelled'));

-- Update default status to 'idea' instead of 'active'
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'idea';

-- Update any existing projects with 'active' status to 'in_progress'
UPDATE projects SET status = 'in_progress' WHERE status = 'active';

-- Update any existing projects with 'on_hold' status (if any exist with different casing)
UPDATE projects SET status = 'on_hold' WHERE status = 'on hold' OR status = 'on-hold';

-- Verify the changes
SELECT DISTINCT status FROM projects;
