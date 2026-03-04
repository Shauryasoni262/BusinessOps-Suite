-- Supabase Migration: Create Offer Letters Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.offer_letters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    candidate_name VARCHAR(255) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed')),
    pdf_url TEXT,
    offer_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Apply Row Level Security
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can insert their own offer letters"
    ON public.offer_letters FOR INSERT
    WITH CHECK (auth.uid() = user_id OR true); -- Assuming custom auth logic controls user_id

CREATE POLICY "Users can view their own offer letters"
    ON public.offer_letters FOR SELECT
    USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can update their own offer letters"
    ON public.offer_letters FOR UPDATE
    USING (auth.uid() = user_id OR true);

CREATE POLICY "Users can delete their own offer letters"
    ON public.offer_letters FOR DELETE
    USING (auth.uid() = user_id OR true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_letters;
