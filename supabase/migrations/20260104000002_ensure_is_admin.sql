-- Ensure is_admin column exists in league_members (Idempotent fix)
alter table public.league_members 
add column if not exists is_admin boolean default false;

-- Re-grant permissions just in case
grant all on table public.league_members to authenticated;
