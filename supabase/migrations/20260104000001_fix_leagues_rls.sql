-- Fix RLS policies for leagues
drop policy "Users can create leagues" on public.leagues;

create policy "Users can create leagues"
  on public.leagues for insert
  to authenticated
  with check ( auth.uid() = created_by );

-- Fix RLS policies for league_members
drop policy "Users can join leagues" on public.league_members;

create policy "Users can join leagues"
  on public.league_members for insert
  to authenticated
  with check ( auth.uid() = user_id );

-- Explicitly grant permissions to authenticated role (just in case)
grant all on table public.leagues to authenticated;
grant all on table public.league_members to authenticated;
