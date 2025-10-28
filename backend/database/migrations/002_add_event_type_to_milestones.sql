-- Add event_type field to milestones table to support timeline events
-- Execute this in your Supabase SQL Editor

-- Add event_type column to milestones table
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS event_type VARCHAR(20) DEFAULT 'milestone' 
CHECK (event_type IN ('milestone', 'update', 'meeting', 'deadline', 'review'));

-- Update existing milestones to have 'milestone' type
UPDATE milestones 
SET event_type = 'milestone' 
WHERE event_type IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_milestones_event_type ON milestones(event_type);

-- Update the milestones table to be more timeline-focused
-- Add a display_order field for custom ordering
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for display order
CREATE INDEX IF NOT EXISTS idx_milestones_display_order ON milestones(project_id, display_order);
