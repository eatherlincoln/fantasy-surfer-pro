-- 1. robustly create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('event-headers', 'event-headers', true)
on conflict (id) do nothing;

-- 2. ensure RLS policies exist (re-applying them is safe if we use 'if not exists' or drop/create logic, 
-- but simpler here to just ensure the bucket exists and rely on previous or subsequent idempotent policy creation)

DO $$
BEGIN
    -- 3. Add is_current to events if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_current') THEN
        ALTER TABLE events ADD COLUMN is_current BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 4. Create a function to easily swap the current event (ensures only one is true)
create or replace function set_active_event(target_event_id uuid)
returns void as $$
begin
  -- Set all to false
  update events set is_current = false;
  
  -- Set target to true
  update events set is_current = true where id = target_event_id;
end;
$$ language plpgsql security definer;
