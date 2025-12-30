
-- Users Profile
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Surfers Table
create table public.surfers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  country text,
  flag text,
  stance text,
  age integer,
  value numeric, -- millions
  tier text,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- User Teams
create table public.user_teams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  surfer_id uuid references public.surfers(id) not null,
  event_id text, -- e.g., 'pipeline-2024'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Leagues
create table public.leagues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references public.profiles(id) not null,
  code text unique, -- invite code
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- League Members
create table public.league_members (
  id uuid default uuid_generate_v4() primary key,
  league_id uuid references public.leagues(id) not null,
  user_id uuid references public.profiles(id) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.surfers enable row level security;
alter table public.user_teams enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;

-- Policies (Basic)
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

create policy "Surfers are viewable by everyone." on public.surfers for select using ( true );

create policy "Users can view their own team." on public.user_teams for select using ( auth.uid() = user_id );
create policy "Users can insert their own team." on public.user_teams for insert with check ( auth.uid() = user_id );
