-- "Nuclear" RLS Fix: Reset and Ensure All Permissions
-- This script drops all existing policies and re-creates them to ensure
-- 1. Public can READ everything (Events, Heats, Surfers, Assignments, Scores)
-- 2. Authenticated users (Admins) can DO everything (Insert, Update, Delete)

-- --- EVENTS ---
alter table public.events enable row level security;
drop policy if exists "Events are viewable by everyone" on public.events;
drop policy if exists "Admins can insert events" on public.events;
drop policy if exists "Admins can update events" on public.events;
drop policy if exists "Admins can delete events" on public.events;

create policy "Enable read access for all users" on public.events for select using (true);
create policy "Enable insert for authenticated users only" on public.events for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.events for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.events for delete to authenticated using (true);

-- --- HEATS ---
alter table public.heats enable row level security;
drop policy if exists "Heats are viewable by everyone" on public.heats;
drop policy if exists "Admins can insert heats" on public.heats;
drop policy if exists "Admins can update heats" on public.heats;
drop policy if exists "Admins can delete heats" on public.heats;

create policy "Enable read access for all users" on public.heats for select using (true);
create policy "Enable insert for authenticated users only" on public.heats for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.heats for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.heats for delete to authenticated using (true);

-- --- SURFERS ---
alter table public.surfers enable row level security;
drop policy if exists "Surfers are viewable by everyone" on public.surfers;
drop policy if exists "Admins can insert surfers" on public.surfers;
drop policy if exists "Admins can update surfers" on public.surfers;
drop policy if exists "Admins can delete surfers" on public.surfers;

create policy "Enable read access for all users" on public.surfers for select using (true);
create policy "Enable insert for authenticated users only" on public.surfers for insert to authenticated with check (true);
create policy "Enable update for authenticated users only" on public.surfers for update to authenticated using (true);
create policy "Enable delete for authenticated users only" on public.surfers for delete to authenticated using (true);

-- --- HEAT ASSIGNMENTS ---
alter table public.heat_assignments enable row level security;
drop policy if exists "Assignments are viewable by everyone" on public.heat_assignments;
drop policy if exists "Admins can insert assignments" on public.heat_assignments;
drop policy if exists "Admins can delete assignments" on public.heat_assignments;

create policy "Enable read access for all users" on public.heat_assignments for select using (true);
create policy "Enable insert for authenticated users only" on public.heat_assignments for insert to authenticated with check (true);
create policy "Enable delete for authenticated users only" on public.heat_assignments for delete to authenticated using (true);

-- --- SCORES ---
alter table public.scores enable row level security;
drop policy if exists "Scores are viewable by everyone" on public.scores;
drop policy if exists "Admins can submit scores" on public.scores;
drop policy if exists "Admins can delete scores" on public.scores;

create policy "Enable read access for all users" on public.scores for select using (true);
create policy "Enable insert for authenticated users only" on public.scores for insert to authenticated with check (true);
create policy "Enable delete for authenticated users only" on public.scores for delete to authenticated using (true);

-- --- GRANTS ---
grant all on public.events to authenticated;
grant all on public.heats to authenticated;
grant all on public.surfers to authenticated;
grant all on public.heat_assignments to authenticated;
grant all on public.scores to authenticated;

grant select on public.events to anon;
grant select on public.heats to anon;
grant select on public.surfers to anon;
grant select on public.heat_assignments to anon;
grant select on public.scores to anon;
