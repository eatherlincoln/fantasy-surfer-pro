-- Ensure RLS on profiles allows reading for generating the global leaderboard
alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Ensure RLS on league_members allows reading for compiling league leaderboards
alter table public.league_members enable row level security;

drop policy if exists "League members are viewable by everyone" on public.league_members;
drop policy if exists "League members viewable by authenticated" on public.league_members;

create policy "League members are viewable by everyone"
  on public.league_members for select
  using ( true );

-- leagues table
alter table public.leagues enable row level security;

drop policy if exists "Leagues are viewable by everyone" on public.leagues;

create policy "Leagues are viewable by everyone"
  on public.leagues for select
  using ( true );

grant all on table public.profiles to authenticated;
grant select on table public.profiles to anon;
grant all on table public.league_members to authenticated;
grant select on table public.league_members to anon;
grant all on table public.leagues to authenticated;
grant select on table public.leagues to anon;
