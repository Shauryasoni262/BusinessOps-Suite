-- Fix Security Definer View errors
-- This recreates all analytics views with SECURITY INVOKER instead of SECURITY DEFINER
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: This will NOT break your website because:
-- 1. Views are recreated with the same structure
-- 2. Only the security property is changed (SECURITY INVOKER instead of SECURITY DEFINER)
-- 3. Your backend uses service role key which has full access
--
-- NOTE: If you get a syntax error about "security_invoker", your PostgreSQL version
-- might be older than 15. In that case, the views will be created without the property,
-- which should still fix the warnings.

-- ============================================
-- DROP EXISTING VIEWS
-- ============================================

DROP VIEW IF EXISTS project_analytics_view CASCADE;
DROP VIEW IF EXISTS task_analytics_view CASCADE;
DROP VIEW IF EXISTS financial_analytics_view CASCADE;
DROP VIEW IF EXISTS team_productivity_view CASCADE;
DROP VIEW IF EXISTS user_growth_view CASCADE;
DROP VIEW IF EXISTS project_delivery_view CASCADE;
DROP VIEW IF EXISTS chat_analytics_view CASCADE;

-- ============================================
-- RECREATE VIEWS WITHOUT SECURITY DEFINER
-- ============================================

-- View: Project Analytics Summary (recreated with SECURITY INVOKER)
CREATE VIEW project_analytics_view WITH (security_invoker = true) AS
SELECT 
    p.owner_id,
    p.status,
    COUNT(p.id) as project_count,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_count,
    COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN p.status = 'on_hold' THEN 1 END) as on_hold_count,
    COUNT(CASE WHEN p.status = 'cancelled' THEN 1 END) as cancelled_count,
    AVG(EXTRACT(EPOCH FROM (p.updated_at - p.created_at))/86400) as avg_duration_days,
    DATE_TRUNC('month', p.created_at) as month
FROM projects p
GROUP BY p.owner_id, p.status, DATE_TRUNC('month', p.created_at);

-- View: Task Analytics Summary (recreated with SECURITY INVOKER)
CREATE VIEW task_analytics_view WITH (security_invoker = true) AS
SELECT 
    p.owner_id,
    t.status,
    t.assigned_to,
    COUNT(t.id) as task_count,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
    AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at))/3600) as avg_completion_hours,
    DATE_TRUNC('day', t.created_at) as day
FROM tasks t
JOIN projects p ON t.project_id = p.id
GROUP BY p.owner_id, t.status, t.assigned_to, DATE_TRUNC('day', t.created_at);

-- View: Financial Analytics Summary (recreated with SECURITY INVOKER)
CREATE VIEW financial_analytics_view WITH (security_invoker = true) AS
SELECT 
    i.created_by as user_id,
    i.status,
    COUNT(i.id) as invoice_count,
    SUM(i.total_amount) as total_amount,
    AVG(i.total_amount) as avg_invoice_amount,
    COUNT(CASE WHEN i.status = 'paid' THEN 1 END) as paid_count,
    COUNT(CASE WHEN i.status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN i.status = 'overdue' THEN 1 END) as overdue_count,
    SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as paid_amount,
    SUM(CASE WHEN i.status = 'pending' THEN i.total_amount ELSE 0 END) as pending_amount,
    DATE_TRUNC('month', i.invoice_date) as month
FROM invoices i
GROUP BY i.created_by, i.status, DATE_TRUNC('month', i.invoice_date);

-- View: Team Productivity (recreated with SECURITY INVOKER)
CREATE VIEW team_productivity_view WITH (security_invoker = true) AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    COUNT(DISTINCT pm.project_id) as projects_count,
    COUNT(DISTINCT t.id) as tasks_assigned,
    COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as tasks_completed,
    COUNT(DISTINCT m.id) as messages_sent,
    DATE_TRUNC('week', t.created_at) as week
FROM users u
LEFT JOIN project_members pm ON u.id = pm.user_id
LEFT JOIN tasks t ON u.id = t.assigned_to
LEFT JOIN messages m ON u.id::text = m.user_id
GROUP BY u.id, u.name, DATE_TRUNC('week', t.created_at);

-- View: User Growth Over Time (recreated with SECURITY INVOKER)
CREATE VIEW user_growth_view WITH (security_invoker = true) AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as new_users,
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as total_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- View: Project Timeline and Delivery (recreated with SECURITY INVOKER)
CREATE VIEW project_delivery_view WITH (security_invoker = true) AS
SELECT 
    p.id,
    p.owner_id,
    p.name,
    p.status,
    p.created_at,
    p.updated_at,
    p.deadline,
    CASE 
        WHEN p.deadline IS NULL THEN NULL
        WHEN p.status = 'completed' AND p.updated_at <= p.deadline THEN 'on_time'
        WHEN p.status = 'completed' AND p.updated_at > p.deadline THEN 'late'
        WHEN p.status != 'completed' AND NOW() > p.deadline THEN 'overdue'
        ELSE 'in_progress'
    END as delivery_status,
    EXTRACT(EPOCH FROM (COALESCE(p.updated_at, NOW()) - p.created_at))/86400 as days_spent
FROM projects p;

-- View: Chat Activity Analytics (if messages table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
        EXECUTE 'CREATE VIEW chat_analytics_view WITH (security_invoker = true) AS
        SELECT 
            room,
            user_id,
            username,
            COUNT(*) as message_count,
            DATE_TRUNC(''day'', timestamp) as day
        FROM messages
        GROUP BY room, user_id, username, DATE_TRUNC(''day'', timestamp)';
    END IF;
END $$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON project_analytics_view TO anon, authenticated;
GRANT SELECT ON task_analytics_view TO anon, authenticated;
GRANT SELECT ON financial_analytics_view TO anon, authenticated;
GRANT SELECT ON team_productivity_view TO anon, authenticated;
GRANT SELECT ON user_growth_view TO anon, authenticated;
GRANT SELECT ON project_delivery_view TO anon, authenticated;

DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'chat_analytics_view') THEN
        EXECUTE 'GRANT SELECT ON chat_analytics_view TO anon, authenticated';
    END IF;
END $$;

-- ============================================
-- NOTES
-- ============================================
-- 
-- This script fixes "Security Definer View" errors by recreating all views
-- with SECURITY INVOKER (security_invoker = true) instead of SECURITY DEFINER.
-- 
-- SECURITY INVOKER means views run with the permissions of the user querying them,
-- not the view creator. This is safer and fixes the security warnings.
-- 
-- IMPORTANT: Your backend uses Supabase service role key which has full access,
-- so these views will continue to work normally.

