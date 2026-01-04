-- Safely update RLS policies for leagues (Idempotent)

-- Leagues Table Policies
drop policy if exists "Leagues are viewable by everyone" on public.leagues;
drop policy if exists "Users can create leagues" on public.leagues;

create policy "Leagues are viewable by everyone"
  on public.leagues for select
  using ( true );

create policy "Users can create leagues"
  on public.leagues for insert
  to authenticated
  with check ( auth.uid() = created_by );

-- League Members Table Policies
drop policy if exists "League members are viewable by everyone" on public.league_members;
drop policy if exists "Users can join leagues" on public.league_members;
drop policy if exists "Users can leave leagues" on public.league_members;

create policy "League members are viewable by everyone"
  on public.league_members for select
  using ( true );

create policy "Users can join leagues"
  on public.league_members for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can leave leagues"
  on public.league_members for delete
  using ( auth.uid() = user_id );

-- Explicitly grant permissions
grant all on table public.leagues to authenticated;
grant all on table public.league_members to authenticated;
