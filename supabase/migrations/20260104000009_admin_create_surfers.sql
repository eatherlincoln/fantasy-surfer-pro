-- Allow Admins to maintain the Surfers roster
-- (Insert new surfers and Update existing ones)

-- INSERT Policy
create policy "Admins can insert surfers" 
on public.surfers 
for insert 
to authenticated 
with check (true);

-- UPDATE Policy
create policy "Admins can update surfers" 
on public.surfers 
for update 
to authenticated 
using (true)
with check (true);

-- Ensure permissions
grant insert, update on table public.surfers to authenticated;
