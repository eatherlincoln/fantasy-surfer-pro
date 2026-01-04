-- Consolidated Fix for Events Schema & RLS

-- 1. Ensure Tables Exist
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique not null,
  status text default 'UPCOMING',
  start_date timestamp with time zone,
  end_date timestamp with time zone
);

create table if not exists public.heats (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  round_number int not null,
  heat_number int not null,
  status text default 'UPCOMING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  heat_id uuid references public.heats(id) on delete cascade not null,
  surfer_id bigint references public.surfers(id) not null,
  wave_score numeric not null,
  is_best_wave boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Update Surfers Table (if not already done)
alter table public.surfers 
add column if not exists status text default 'ACTIVE',
add column if not exists current_season_points numeric default 0;

-- 3. Reset RLS Policies (Drop first to avoid conflicts)
alter table public.events enable row level security;
alter table public.heats enable row level security;
alter table public.scores enable row level security;

-- Events
drop policy if exists "Events are viewable by everyone" on public.events;
drop policy if exists "Admins can insert events" on public.events;
drop policy if exists "Admins can update events" on public.events;

create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Admins can insert events" on public.events for insert to authenticated with check (true);
create policy "Admins can update events" on public.events for update to authenticated using (true);

-- Heats
drop policy if exists "Heats are viewable by everyone" on public.heats;
drop policy if exists "Admins can insert heats" on public.heats;
drop policy if exists "Admins can update heats" on public.heats;

create policy "Heats are viewable by everyone" on public.heats for select using (true);
create policy "Admins can insert heats" on public.heats for insert to authenticated with check (true);
create policy "Admins can update heats" on public.heats for update to authenticated using (true);

-- Scores
drop policy if exists "Scores are viewable by everyone" on public.scores;
drop policy if exists "Admins can insert scores" on public.scores;
drop policy if exists "Admins can update scores" on public.scores;

create policy "Scores are viewable by everyone" on public.scores for select using (true);
create policy "Admins can insert scores" on public.scores for insert to authenticated with check (true);
create policy "Admins can update scores" on public.scores for update to authenticated using (true);

-- 4. Grant Permissions (Crucial for Vercel/Supabase connections)
grant all on table public.events to authenticated;
grant all on table public.heats to authenticated;
grant all on table public.scores to authenticated;
grant all on table public.events to anon;
grant all on table public.heats to anon;
grant all on table public.scores to anon;
