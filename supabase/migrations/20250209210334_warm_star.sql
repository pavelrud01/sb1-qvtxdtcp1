-- Create bucket for content images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security for objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies for the content-images bucket
DROP POLICY IF EXISTS "Public read access for content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their content images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their content images" ON storage.objects;

-- Create policies for the content-images bucket
CREATE POLICY "Public read access for content images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-images');

CREATE POLICY "Authenticated users can upload content images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-images'
  AND storage.extension(name) = ANY (ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp'])
);

CREATE POLICY "Users can update their content images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'content-images');

CREATE POLICY "Users can delete their content images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images' AND owner = auth.uid());