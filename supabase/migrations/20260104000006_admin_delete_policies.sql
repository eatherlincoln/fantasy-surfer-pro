-- Admin Enhancements: Delete Policies & Heat Assignments

-- 1. Create heat_assignments table (for Heat Draws)
create table if not exists public.heat_assignments (
  id uuid default gen_random_uuid() primary key,
  heat_id uuid references public.heats(id) on delete cascade not null,
  surfer_id uuid references public.surfers(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(heat_id, surfer_id)
);

-- Enable RLS for assignment
alter table public.heat_assignments enable row level security;

-- Policies for assignments
create policy "Assignments are viewable by everyone" on public.heat_assignments for select using (true);
create policy "Admins can insert assignments" on public.heat_assignments for insert to authenticated with check (true);
create policy "Admins can delete assignments" on public.heat_assignments for delete using (auth.role() = 'authenticated'); -- Simplified for MVP

-- 2. Add DELETE Policies for Admin (Authenticated users)

-- Events
create policy "Admins can delete events" 
  on public.events for delete 
  using ( auth.role() = 'authenticated' );

-- Heats
create policy "Admins can delete heats" 
  on public.heats for delete 
  using ( auth.role() = 'authenticated' );

-- Scores
create policy "Admins can delete scores" 
  on public.scores for delete 
  using ( auth.role() = 'authenticated' );

-- Grant permissions for new table
grant all on table public.heat_assignments to authenticated;
grant all on table public.heat_assignments to anon;
