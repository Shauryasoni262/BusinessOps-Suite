-- Setup file storage for project files
-- Execute this in your Supabase SQL Editor

-- Create storage bucket for project files (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for project files
-- Allow users to upload files to projects they have access to
CREATE POLICY "Users can upload files to projects they have access to" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
);

-- Allow users to view files from projects they have access to
CREATE POLICY "Users can view files from projects they have access to" ON storage.objects
FOR SELECT USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text FROM projects 
        WHERE owner_id = auth.uid() OR 
        id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
    )
);

-- Allow users to delete files they uploaded
CREATE POLICY "Users can delete files they uploaded" ON storage.objects
FOR DELETE USING (
    bucket_id = 'project-files' AND
    owner = auth.uid()
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated;
