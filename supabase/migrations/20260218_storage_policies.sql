-- Storage policies for site-assets bucket
-- Allows authenticated users (admins) to upload, update, and delete images
-- Public read is handled by the bucket being set to "public"

CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');
