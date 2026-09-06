-- Add status and admin_note columns to blogs table
alter table public.blogs 
add column if not exists status text not null default 'pending';

alter table public.blogs 
add column if not exists admin_note text;

-- Ensure existing blog posts are marked approved
update public.blogs
set status = 'approved'
where status is null or status = 'pending';

-- Drop existing public read policy to update it
drop policy if exists "Allow public read access to blogs" on public.blogs;

-- Allow public read access to approved blogs only
create policy "Allow public read access to approved blogs"
  on public.blogs for select
  using (status = 'approved');

-- Allow update to blog status
create policy "Allow update to blog status"
  on public.blogs for update
  using (true)
  with check (true);
