-- Create leagues table
create table public.leagues (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  code text not null unique,
  created_by uuid references public.profiles(id) not null
);

-- Create league_members table
create table public.league_members (
  id uuid default gen_random_uuid() primary key,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  league_id uuid references public.leagues(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  is_admin boolean default false,
  unique(league_id, user_id)
);

-- Enable RLS
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;

-- Policies for leagues
create policy "Leagues are viewable by everyone"
  on public.leagues for select
  using ( true );

create policy "Users can create leagues"
  on public.leagues for insert
  with check ( auth.uid() = created_by );

-- Policies for league_members
create policy "League members are viewable by everyone"
  on public.league_members for select
  using ( true );

create policy "Users can join leagues"
  on public.league_members for insert
  with check ( auth.uid() = user_id );

create policy "Users can leave leagues"
  on public.league_members for delete
  using ( auth.uid() = user_id );
