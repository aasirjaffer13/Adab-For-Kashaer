-- Harden public.blogs.
--
-- Before this migration any anonymous client could:
--   * insert rows with `status = 'approved'` and any `author_id` it liked,
--   * update ANY row (including status and content) with `with check (true)`,
-- meaning moderation was purely a client-side convention.
--
-- The moderation dashboard now reads and writes through a server function that
-- uses the service-role key, so no RLS bypass is needed for moderators.

-- 1. Status must be a known moderation state.
alter table public.blogs drop constraint if exists blogs_status_check;
alter table public.blogs
  add constraint blogs_status_check check (status in ('pending', 'approved', 'rejected'));

-- tags is read as a non-nullable list by the app; make the column match.
update public.blogs set tags = array[]::text[] where tags is null;
alter table public.blogs alter column tags set default array[]::text[];
alter table public.blogs alter column tags set not null;

-- 2. Keep updated_at honest for every write path (the app used to set it by hand).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

-- 3. The public feed sorts by created_at; the admin queue filters by status.
create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
create index if not exists blogs_status_created_at_idx on public.blogs (status, created_at desc);
create index if not exists blogs_author_id_idx on public.blogs (author_id);

-- 4. Drop the wide-open policies from the earlier migrations.
drop policy if exists "Allow public read access to blogs" on public.blogs;
drop policy if exists "Allow public read access to approved blogs" on public.blogs;
drop policy if exists "Allow anyone to create blogs" on public.blogs;
drop policy if exists "Allow update to likes count" on public.blogs;
drop policy if exists "Allow update to blog status" on public.blogs;

-- 5. Read: everyone sees approved posts, authors additionally see their own.
create policy "Read approved blogs or your own submissions"
  on public.blogs for select
  using (
    status = 'approved'
    or (auth.uid() is not null and author_id = auth.uid())
  );

-- 6. Insert: signed-in authors may only create pending rows they own.
create policy "Insert your own pending blog"
  on public.blogs for insert
  with check (
    auth.uid() is not null
    and author_id = auth.uid()
    and status = 'pending'
  );

-- 7. There is deliberately NO update/delete policy for authors.
--    Status changes happen only through the service-role server function.

-- 8. The like RPC was SECURITY DEFINER with an unbounded `amount`, so a caller
--    could set likes_count to any number. Clamp it to -1..1 and pin search_path.
create or replace function public.increment_blog_likes(blog_id text, amount int)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  update public.blogs
  set likes_count = greatest(0, likes_count + least(1, greatest(-1, amount)))
  where id = blog_id;
$$;

revoke execute on function public.increment_blog_likes(text, integer) from public;
grant execute on function public.increment_blog_likes(text, integer) to anon, authenticated;
