-- Fix Unindexed Foreign Keys and Remove Unused Indexes
-- This script adds indexes for foreign keys and removes unused indexes
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: This will NOT break your website because:
-- 1. Adding indexes improves query performance
-- 2. Removing unused indexes frees up space
-- 3. Your backend uses service role key, so queries will work either way

-- ============================================
-- ADD INDEXES FOR FOREIGN KEYS (if missing)
-- ============================================

-- Index for projects.owner_id (foreign key to users)
-- Check if any index exists on owner_id column, create if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes i
        JOIN pg_class c ON c.relname = i.indexname
        JOIN pg_index idx ON idx.indexrelid = c.oid
        JOIN pg_attribute a ON a.attrelid = idx.indrelid AND a.attnum = ANY(idx.indkey)
        WHERE i.schemaname = 'public' 
        AND i.tablename = 'projects' 
        AND a.attname = 'owner_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_projects_owner_id_fk ON projects(owner_id);
    END IF;
END $$;

-- Index for project_members.project_id (foreign key to projects)
CREATE INDEX IF NOT EXISTS idx_project_members_project_id_fk ON project_members(project_id);

-- Index for project_members.user_id (foreign key to users)
CREATE INDEX IF NOT EXISTS idx_project_members_user_id_fk ON project_members(user_id);

-- Index for tasks.project_id (foreign key to projects)
CREATE INDEX IF NOT EXISTS idx_tasks_project_id_fk ON tasks(project_id);

-- Index for tasks.assigned_to (foreign key to users, nullable)
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to_fk ON tasks(assigned_to) WHERE assigned_to IS NOT NULL;

-- Index for milestones.project_id (foreign key to projects)
CREATE INDEX IF NOT EXISTS idx_milestones_project_id_fk ON milestones(project_id);

-- Index for project_files.project_id (foreign key to projects)
CREATE INDEX IF NOT EXISTS idx_project_files_project_id_fk ON project_files(project_id);

-- Index for project_files.uploaded_by (foreign key to users)
CREATE INDEX IF NOT EXISTS idx_project_files_uploaded_by_fk ON project_files(uploaded_by);

-- Index for invoices.created_by (foreign key to users)
CREATE INDEX IF NOT EXISTS idx_invoices_created_by_fk ON invoices(created_by);

-- Index for payments.invoice_id (foreign key to invoices)
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id_fk ON payments(invoice_id);

-- ============================================
-- REMOVE UNUSED INDEXES
-- ============================================

-- Remove unused indexes on milestones
DROP INDEX IF EXISTS idx_milestones_deadline;

-- Remove unused indexes on messages (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
        DROP INDEX IF EXISTS idx_messages_room_timestamp;
        DROP INDEX IF EXISTS idx_messages_user_timestamp;
    END IF;
END $$;

-- Note: idx_project_files_uploaded_by is kept as it's a foreign key index

-- Remove unused indexes on invoices
DROP INDEX IF EXISTS idx_invoices_status_date;
DROP INDEX IF EXISTS idx_invoices_user_date;

-- Remove unused indexes on payments
DROP INDEX IF EXISTS idx_payments_status;

-- ============================================
-- NOTES
-- ============================================
-- 
-- This script:
-- 1. Adds indexes for all foreign keys (improves JOIN performance)
-- 2. Removes unused indexes (frees up space)
-- 
-- Foreign key indexes are important because:
-- - They speed up JOINs between tables
-- - They speed up DELETE operations on parent tables
-- - They speed up UPDATE operations on foreign key columns
-- 
-- IMPORTANT: Your backend uses Supabase service role key which has full access,
-- so these optimizations will improve performance without breaking functionality.

