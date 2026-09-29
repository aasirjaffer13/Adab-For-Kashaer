-- Boards, board items and the private image bucket.
-- These tables were previously only present as generated client types, so a
-- fresh `supabase db reset` produced a broken app. This migration makes the
-- core product reproducible and locks it behind owner-only row level security.

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  title text not null default 'Untitled Board',
  description text,
  thumbnail_url text,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc', now()),
  updated_at timestamp with time zone not null default timezone('utc', now())
);

create table if not exists public.board_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  type text not null default 'image',
  x double precision not null default 0,
  y double precision not null default 0,
  width double precision not null default 320,
  height double precision not null default 240,
  rotation double precision not null default 0,
  z_index integer not null default 0,
  image_url text,
  source_url text,
  notes text,
  tags text[],
  metadata jsonb,
  created_at timestamp with time zone not null default timezone('utc', now())
);

create index if not exists boards_user_id_idx on public.boards (user_id);
create index if not exists boards_user_sort_idx on public.boards (user_id, sort_order);
create index if not exists board_items_board_id_idx on public.board_items (board_id, z_index);

alter table public.boards enable row level security;
alter table public.board_items enable row level security;

drop policy if exists "boards_select_own" on public.boards;
drop policy if exists "boards_insert_own" on public.boards;
drop policy if exists "boards_update_own" on public.boards;
drop policy if exists "boards_delete_own" on public.boards;

create policy "boards_select_own"
  on public.boards for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "boards_insert_own"
  on public.boards for insert
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "boards_update_own"
  on public.boards for update
  using (auth.uid() is not null and user_id = auth.uid())
  with check (auth.uid() is not null and user_id = auth.uid());

create policy "boards_delete_own"
  on public.boards for delete
  using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists "board_items_select_own" on public.board_items;
drop policy if exists "board_items_insert_own" on public.board_items;
drop policy if exists "board_items_update_own" on public.board_items;
drop policy if exists "board_items_delete_own" on public.board_items;

-- An item is reachable when the caller owns it directly or owns its board.
create policy "board_items_select_own"
  on public.board_items for select
  using (
    (auth.uid() is not null and user_id = auth.uid())
    or exists (
      select 1 from public.boards b
      where b.id = board_items.board_id and b.user_id = auth.uid()
    )
  );

create policy "board_items_insert_own"
  on public.board_items for insert
  with check (
    auth.uid() is not null
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.boards b
        where b.id = board_items.board_id and b.user_id = auth.uid()
      )
    )
  );

create policy "board_items_update_own"
  on public.board_items for update
  using (
    (auth.uid() is not null and user_id = auth.uid())
    or exists (
      select 1 from public.boards b
      where b.id = board_items.board_id and b.user_id = auth.uid()
    )
  )
  with check (
    (auth.uid() is not null and user_id = auth.uid())
    or exists (
      select 1 from public.boards b
      where b.id = board_items.board_id and b.user_id = auth.uid()
    )
  );

create policy "board_items_delete_own"
  on public.board_items for delete
  using (
    (auth.uid() is not null and user_id = auth.uid())
    or exists (
      select 1 from public.boards b
      where b.id = board_items.board_id and b.user_id = auth.uid()
    )
  );

-- Private bucket: paths are `<board-id>/<file>`, so ownership is derived from
-- the first path segment matching the caller's uid.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'board-images',
  'board-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do nothing;

drop policy if exists "board_images_read_own" on storage.objects;
drop policy if exists "board_images_insert_own" on storage.objects;
drop policy if exists "board_images_update_own" on storage.objects;
drop policy if exists "board_images_delete_own" on storage.objects;

create policy "board_images_read_own"
  on storage.objects for select
  using (
    bucket_id = 'board-images'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "board_images_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'board-images'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "board_images_update_own"
  on storage.objects for update
  using (
    bucket_id = 'board-images'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "board_images_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'board-images'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );
