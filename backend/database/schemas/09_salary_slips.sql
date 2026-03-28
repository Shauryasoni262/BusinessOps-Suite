-- Create salary_slips table
CREATE TABLE IF NOT EXISTS public.salary_slips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    designation TEXT,
    month_year TEXT NOT NULL,
    bank_name TEXT,
    account_number TEXT,
    pan_number TEXT,
    earnings JSONB NOT NULL DEFAULT '[]'::jsonb,
    deductions JSONB NOT NULL DEFAULT '[]'::jsonb,
    gross_earnings NUMERIC DEFAULT 0,
    total_deductions NUMERIC DEFAULT 0,
    net_pay NUMERIC DEFAULT 0,
    net_pay_words TEXT,
    currency TEXT DEFAULT '$',
    status TEXT DEFAULT 'generated',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for performance
CREATE INDEX IF NOT EXISTS salary_slips_created_by_idx ON public.salary_slips(created_by);

-- Enable RLS (Row Level Security)
ALTER TABLE public.salary_slips ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own salary slips
CREATE POLICY "Users can only see their own salary slips"
ON public.salary_slips
FOR SELECT
USING (auth.uid() = created_by);

-- Policy: Users can only insert their own salary slips
CREATE POLICY "Users can only insert their own salary slips"
ON public.salary_slips
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Policy: Users can only delete their own salary slips
CREATE POLICY "Users can only delete their own salary slips"
ON public.salary_slips
FOR DELETE
USING (auth.uid() = created_by);
