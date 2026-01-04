-- 1. robustly create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('event-headers', 'event-headers', true)
on conflict (id) do update set public = true;

-- 2. Drop potential conflicting policies (cleaning up previous attempts)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;
drop policy if exists "View Event Headers" on storage.objects;
drop policy if exists "Upload Event Headers" on storage.objects;
drop policy if exists "Update Event Headers" on storage.objects;
drop policy if exists "Delete Event Headers" on storage.objects;

-- 3. Create Comprehensive Policies
-- VIEW
create policy "View Event Headers"
  on storage.objects for select
  using ( bucket_id = 'event-headers' );

-- UPLOAD
create policy "Upload Event Headers"
  on storage.objects for insert
  with check ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );

-- UPDATE
create policy "Update Event Headers"
  on storage.objects for update
  using ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );

-- DELETE
create policy "Delete Event Headers"
  on storage.objects for delete
  using ( bucket_id = 'event-headers' and auth.role() = 'authenticated' );

--------------------------------------------------------------
-- Active Event Logic
--------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_current') THEN
        ALTER TABLE events ADD COLUMN is_current BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

create or replace function set_active_event(target_event_id uuid)
returns void as $$
begin
  -- "WHERE true" satisfies the 'Safe Update' check while still updating all rows
  update events set is_current = false where true;
  
  -- Set target to true
  update events set is_current = true where id = target_event_id;
end;
$$ language plpgsql security definer;
