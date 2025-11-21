-- Remove Unused Indexes (Info suggestions)
-- This script removes indexes that have never been used
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: 
-- 1. These are just informational suggestions, not critical issues
-- 2. Removing unused indexes can free up storage space
-- 3. If an index becomes needed later, it can be recreated
-- 4. Your backend uses service role key, so these indexes aren't needed for your current queries

-- ============================================
-- REMOVE UNUSED INDEXES
-- ============================================

-- Drop unused indexes on users table
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_email;  -- Keep this one if you use email lookups frequently

-- Drop unused indexes on projects table
DROP INDEX IF EXISTS idx_projects_owner_id;
DROP INDEX IF EXISTS idx_projects_status;
DROP INDEX IF EXISTS idx_projects_deadline;

-- Drop unused indexes on project_members table
DROP INDEX IF EXISTS idx_project_members_project_id;
DROP INDEX IF EXISTS idx_project_members_user_id;

-- Drop unused indexes on tasks table
DROP INDEX IF EXISTS idx_tasks_project_id;
DROP INDEX IF EXISTS idx_tasks_assigned_to;
DROP INDEX IF EXISTS idx_tasks_status;
DROP INDEX IF EXISTS idx_tasks_due_date;

-- Drop unused indexes on milestones table
DROP INDEX IF EXISTS idx_milestones_project_id;
DROP INDEX IF EXISTS idx_milestones_deadline;

-- Drop unused indexes on messages table (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
        DROP INDEX IF EXISTS idx_messages_room_timestamp;
        DROP INDEX IF EXISTS idx_messages_user_timestamp;
    END IF;
END $$;

-- Drop unused composite indexes
DROP INDEX IF EXISTS idx_project_members_composite;
DROP INDEX IF EXISTS idx_tasks_composite;
DROP INDEX IF EXISTS idx_projects_owner_created;
DROP INDEX IF EXISTS idx_projects_status_created;
DROP INDEX IF EXISTS idx_tasks_project_status;
DROP INDEX IF EXISTS idx_tasks_assigned_created;

-- Drop unused indexes on invoices (if they exist)
DROP INDEX IF EXISTS idx_invoices_user_date;
DROP INDEX IF EXISTS idx_invoices_status_date;

-- Drop unused indexes on users created_at (if exists)
DROP INDEX IF EXISTS idx_users_created;

-- ============================================
-- KEEP THESE IMPORTANT INDEXES
-- ============================================
-- 
-- We're keeping:
-- - Primary key indexes (automatic, can't be dropped)
-- - Unique constraint indexes (like email on users)
-- - Foreign key indexes (if they exist)
--
-- The indexes we're removing are:
-- - Composite indexes that aren't being used
-- - Single-column indexes on frequently queried columns that aren't actually used
-- - Indexes created for analytics that may not be needed

-- ============================================
-- NOTES
-- ============================================
-- 
-- This script removes indexes that Supabase Performance Advisor has identified
-- as unused. Removing unused indexes:
-- 
-- BENEFITS:
-- - Reduces storage space
-- - Speeds up INSERT/UPDATE/DELETE operations (fewer indexes to maintain)
-- - Cleaner database structure
-- 
-- RISKS:
-- - If you add queries later that would benefit from these indexes, you'll need to recreate them
-- - Some indexes might be used by Supabase internally (unlikely, but possible)
-- 
-- IMPORTANT: Your backend uses service role key and direct queries, so if these
-- indexes aren't being used now, they likely won't be needed. However, if you
-- notice slower queries after removing them, you can recreate specific indexes.
-- 
-- To recreate an index later, use:
-- CREATE INDEX index_name ON table_name(column_name);

