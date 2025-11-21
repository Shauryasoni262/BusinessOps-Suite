-- Fix Function Search Path Mutable warnings
-- This updates all functions to set search_path for security
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: This will NOT break your website because:
-- 1. Functions are recreated with the same logic
-- 2. Only search_path security is added
-- 3. Your backend uses service role key which has full access

-- ============================================
-- FIX: update_updated_at_column
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- FIX: add_project_owner_as_member
-- ============================================

CREATE OR REPLACE FUNCTION add_project_owner_as_member()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    INSERT INTO project_members (project_id, user_id)
    VALUES (NEW.id, NEW.owner_id)
    ON CONFLICT (project_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- ============================================
-- FIX: generate_invoice_number
-- ============================================

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
DECLARE
  next_number INTEGER;
  invoice_num TEXT;
BEGIN
  -- Get the next invoice number
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number LIKE 'INV-%';
  
  -- Format as INV-001, INV-002, etc.
  invoice_num := 'INV-' || LPAD(next_number::TEXT, 3, '0');
  
  RETURN invoice_num;
END;
$$;

-- ============================================
-- FIX: get_project_analytics
-- ============================================

CREATE OR REPLACE FUNCTION get_project_analytics(
    p_user_id UUID,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE(
    status VARCHAR,
    project_count BIGINT,
    completion_rate NUMERIC,
    avg_duration_days NUMERIC
) 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.status,
        COUNT(p.id)::BIGINT as project_count,
        ROUND(
            COUNT(CASE WHEN p.status = 'completed' THEN 1 END)::NUMERIC * 100 / 
            NULLIF(COUNT(p.id), 0), 2
        ) as completion_rate,
        ROUND(AVG(EXTRACT(EPOCH FROM (p.updated_at - p.created_at))/86400), 2) as avg_duration_days
    FROM projects p
    WHERE p.owner_id = p_user_id
        AND (p_start_date IS NULL OR p.created_at >= p_start_date)
        AND (p_end_date IS NULL OR p.created_at <= p_end_date)
    GROUP BY p.status;
END;
$$;

-- ============================================
-- FIX: get_financial_trends
-- ============================================

CREATE OR REPLACE FUNCTION get_financial_trends(
    p_user_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE(
    month TEXT,
    revenue NUMERIC,
    expenses NUMERIC,
    profit NUMERIC,
    invoice_count BIGINT
) 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(DATE_TRUNC('month', i.invoice_date), 'Mon') as month,
        SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END) as revenue,
        SUM(CASE WHEN i.status = 'paid' THEN i.total_amount * 0.6 ELSE 0 END) as expenses,
        SUM(CASE WHEN i.status = 'paid' THEN i.total_amount * 0.4 ELSE 0 END) as profit,
        COUNT(i.id)::BIGINT as invoice_count
    FROM invoices i
    WHERE i.created_by = p_user_id
        AND (p_start_date IS NULL OR i.invoice_date >= p_start_date)
        AND (p_end_date IS NULL OR i.invoice_date <= p_end_date)
    GROUP BY DATE_TRUNC('month', i.invoice_date)
    ORDER BY DATE_TRUNC('month', i.invoice_date);
END;
$$;

-- ============================================
-- FIX: get_team_performance
-- ============================================

CREATE OR REPLACE FUNCTION get_team_performance(
    p_user_id UUID,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE(
    user_id UUID,
    user_name VARCHAR,
    projects_count BIGINT,
    tasks_completed BIGINT,
    total_tasks BIGINT,
    completion_rate NUMERIC
) 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.name as user_name,
        COUNT(DISTINCT pm.project_id)::BIGINT as projects_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::BIGINT as tasks_completed,
        COUNT(t.id)::BIGINT as total_tasks,
        ROUND(
            COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::NUMERIC * 100 / 
            NULLIF(COUNT(t.id), 0), 2
        ) as completion_rate
    FROM users u
    LEFT JOIN project_members pm ON u.id = pm.user_id
    LEFT JOIN projects p ON pm.project_id = p.id AND p.owner_id = p_user_id
    LEFT JOIN tasks t ON u.id = t.assigned_to AND t.project_id = p.id
    WHERE (p_start_date IS NULL OR t.created_at >= p_start_date)
        AND (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY u.id, u.name
    HAVING COUNT(t.id) > 0
    ORDER BY tasks_completed DESC;
END;
$$;

-- ============================================
-- FIX: get_user_growth_stats
-- ============================================

CREATE OR REPLACE FUNCTION get_user_growth_stats(
    p_months INTEGER DEFAULT 6
)
RETURNS TABLE(
    month TEXT,
    new_users BIGINT,
    total_users BIGINT
) 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    WITH monthly_users AS (
        SELECT 
            DATE_TRUNC('month', created_at) as month_date,
            COUNT(*) as new_count
        FROM users
        WHERE created_at >= DATE_TRUNC('month', NOW() - (p_months || ' months')::INTERVAL)
        GROUP BY DATE_TRUNC('month', created_at)
    )
    SELECT 
        TO_CHAR(month_date, 'Mon') as month,
        new_count::BIGINT as new_users,
        SUM(new_count) OVER (ORDER BY month_date)::BIGINT as total_users
    FROM monthly_users
    ORDER BY month_date;
END;
$$;

-- ============================================
-- FIX: get_performance_kpis
-- ============================================

CREATE OR REPLACE FUNCTION get_performance_kpis(
    p_user_id UUID,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE(
    task_completion_rate NUMERIC,
    on_time_delivery_rate NUMERIC,
    avg_response_time_hours NUMERIC,
    project_success_rate NUMERIC
) 
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    RETURN QUERY
    WITH task_stats AS (
        SELECT 
            COUNT(*) as total_tasks,
            COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.owner_id = p_user_id
            AND (p_start_date IS NULL OR t.created_at >= p_start_date)
            AND (p_end_date IS NULL OR t.created_at <= p_end_date)
    ),
    delivery_stats AS (
        SELECT 
            COUNT(*) as total_projects,
            COUNT(CASE WHEN delivery_status = 'on_time' THEN 1 END) as on_time_projects
        FROM project_delivery_view
        WHERE owner_id = p_user_id
            AND (p_start_date IS NULL OR created_at >= p_start_date)
            AND (p_end_date IS NULL OR created_at <= p_end_date)
    ),
    response_stats AS (
        SELECT 
            AVG(EXTRACT(EPOCH FROM (m2.timestamp - m1.timestamp))/3600) as avg_hours
        FROM messages m1
        LEFT JOIN LATERAL (
            SELECT timestamp
            FROM messages m2
            WHERE m2.room = m1.room 
                AND m2.timestamp > m1.timestamp
            ORDER BY m2.timestamp
            LIMIT 1
        ) m2 ON true
        WHERE (p_start_date IS NULL OR m1.timestamp >= p_start_date)
            AND (p_end_date IS NULL OR m1.timestamp <= p_end_date)
    ),
    project_stats AS (
        SELECT 
            COUNT(*) as total_projects,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_projects
        FROM projects
        WHERE owner_id = p_user_id
            AND (p_start_date IS NULL OR created_at >= p_start_date)
            AND (p_end_date IS NULL OR created_at <= p_end_date)
    )
    SELECT 
        ROUND(COALESCE(ts.completed_tasks::NUMERIC * 100 / NULLIF(ts.total_tasks, 0), 0), 2) as task_completion_rate,
        ROUND(COALESCE(ds.on_time_projects::NUMERIC * 100 / NULLIF(ds.total_projects, 0), 0), 2) as on_time_delivery_rate,
        ROUND(COALESCE(rs.avg_hours, 2.4), 2) as avg_response_time_hours,
        ROUND(COALESCE(ps.successful_projects::NUMERIC * 100 / NULLIF(ps.total_projects, 0), 0), 2) as project_success_rate
    FROM task_stats ts, delivery_stats ds, response_stats rs, project_stats ps;
END;
$$;

-- ============================================
-- NOTES
-- ============================================
-- 
-- This script fixes "Function Search Path Mutable" warnings by setting
-- search_path = public, pg_catalog on all functions.
-- 
-- Setting search_path prevents search path injection attacks where malicious
-- users could manipulate the search_path to execute unintended functions.
-- 
-- IMPORTANT: Your backend uses Supabase service role key which has full access,
-- so these functions will continue to work normally.

