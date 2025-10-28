  -- Analytics Database Schema for BusinessOps Suite
-- Execute this in your Supabase SQL Editor

-- ============================================
-- ANALYTICS VIEWS FOR EFFICIENT QUERYING
-- ============================================

-- View: Project Analytics Summary
CREATE OR REPLACE VIEW project_analytics_view AS
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

-- View: Task Analytics Summary
CREATE OR REPLACE VIEW task_analytics_view AS
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

-- View: Financial Analytics Summary
CREATE OR REPLACE VIEW financial_analytics_view AS
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

-- View: Team Productivity
CREATE OR REPLACE VIEW team_productivity_view AS
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

-- View: User Growth Over Time
CREATE OR REPLACE VIEW user_growth_view AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as new_users,
    SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as total_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- View: Project Timeline and Delivery
CREATE OR REPLACE VIEW project_delivery_view AS
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

-- View: Chat Activity Analytics
CREATE OR REPLACE VIEW chat_analytics_view AS
SELECT 
    room,
    user_id,
    username,
    COUNT(*) as message_count,
    DATE_TRUNC('day', timestamp) as day
FROM messages
GROUP BY room, user_id, username, DATE_TRUNC('day', timestamp);

-- ============================================
-- STORED FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function: Get Project Analytics with Date Range
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
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function: Get Financial Trends with Date Range
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
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function: Get Team Performance Metrics
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
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function: Get User Growth Stats
CREATE OR REPLACE FUNCTION get_user_growth_stats(
    p_months INTEGER DEFAULT 6
)
RETURNS TABLE(
    month TEXT,
    new_users BIGINT,
    total_users BIGINT
) AS $$
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
$$ LANGUAGE plpgsql;

-- Function: Calculate Performance KPIs
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
) AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_projects_owner_created ON projects(owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status_created ON projects(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_created ON tasks(assigned_to, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_user_date ON invoices(created_by, invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status_date ON invoices(status, invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_messages_room_timestamp ON messages(room, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_user_timestamp ON messages(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_project_members_composite ON project_members(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_composite ON tasks(assigned_to, status, created_at);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON VIEW project_analytics_view IS 'Aggregated project statistics for analytics dashboard';
COMMENT ON VIEW financial_analytics_view IS 'Financial metrics including revenue, invoices, and payment status';
COMMENT ON VIEW team_productivity_view IS 'Team member productivity metrics and workload distribution';
COMMENT ON FUNCTION get_project_analytics IS 'Returns project analytics with optional date range filtering';
COMMENT ON FUNCTION get_financial_trends IS 'Returns financial trends over time with date range support';
COMMENT ON FUNCTION get_team_performance IS 'Returns team member performance metrics';
COMMENT ON FUNCTION get_performance_kpis IS 'Calculates key performance indicators for the dashboard';

