-- Create storage bucket for diagnosis images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('diagnosis-images', 'diagnosis-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for diagnosis images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'diagnosis-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view diagnosis images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'diagnosis-images');

CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'diagnosis-images' AND auth.uid()::text = (storage.foldername(name))[1]);