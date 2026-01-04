-- Update surfers table
alter table public.surfers 
add column if not exists status text default 'ACTIVE', -- ACTIVE, ELIMINATED, IN_HEAT
add column if not exists current_season_points numeric default 0;

-- Create events table
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique not null,
  status text default 'UPCOMING', -- UPCOMING, LIVE, COMPLETED
  start_date timestamp with time zone,
  end_date timestamp with time zone
);

-- Create heats table
create table if not exists public.heats (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references public.events(id) on delete cascade not null,
  round_number int not null,
  heat_number int not null,
  status text default 'UPCOMING', -- UPCOMING, LIVE, COMPLETED
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create scores table (logs every scored wave)
create table if not exists public.scores (
  id uuid default gen_random_uuid() primary key,
  heat_id uuid references public.heats(id) on delete cascade not null,
  surfer_id bigint references public.surfers(id) not null,
  wave_score numeric not null,
  is_best_wave boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.heats enable row level security;
alter table public.scores enable row level security;

-- Public Read Policies
create policy "Events are viewable by everyone" on public.events for select using (true);
create policy "Heats are viewable by everyone" on public.heats for select using (true);
create policy "Scores are viewable by everyone" on public.scores for select using (true);

-- Admin Write Policies (initially allowing all authenticated for simplicity, SHOULD be restricted to admin in production)
create policy "Admins can insert events" on public.events for insert to authenticated with check (true);
create policy "Admins can update events" on public.events for update to authenticated using (true);

create policy "Admins can insert heats" on public.heats for insert to authenticated with check (true);
create policy "Admins can update heats" on public.heats for update to authenticated using (true);

create policy "Admins can insert scores" on public.scores for insert to authenticated with check (true);
create policy "Admins can update scores" on public.scores for update to authenticated using (true);

-- Grant Permissions
grant all on table public.events to authenticated;
grant all on table public.heats to authenticated;
grant all on table public.scores to authenticated;
