-- Create a new storage bucket for event headers
insert into storage.buckets (id, name, public)
values ('event-headers', 'event-headers', true);

-- Policy: Public can view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'event-headers' );

-- Policy: Authenticated users (Admins) can upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );

-- Policy: Authenticated users (Admins) can update/delete images
create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );
