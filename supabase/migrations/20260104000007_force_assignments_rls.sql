-- Force enable RLS and ensure policies exist for heat_assignments
alter table public.heat_assignments enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Assignments are viewable by everyone" on public.heat_assignments;
drop policy if exists "Admins can insert assignments" on public.heat_assignments;
drop policy if exists "Admins can delete assignments" on public.heat_assignments;

-- Re-create policies
create policy "Assignments are viewable by everyone" 
on public.heat_assignments for select 
using (true);

create policy "Admins can insert assignments" 
on public.heat_assignments for insert 
to authenticated 
with check (true);

create policy "Admins can delete assignments" 
on public.heat_assignments for delete 
to authenticated 
using (true);

-- Ensure permissions
grant all on table public.heat_assignments to authenticated;
grant select on table public.heat_assignments to anon;
