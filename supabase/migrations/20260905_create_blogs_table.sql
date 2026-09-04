-- Create public.blogs table for community reflections
create table if not exists public.blogs (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  author_name text not null default 'Anonymous Contributor',
  author_id uuid references auth.users(id) on delete set null,
  category text not null default 'Adab & Etiquette',
  tags text[] default array[]::text[],
  cover_image text,
  read_time_minutes integer not null default 3,
  likes_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.blogs enable row level security;

-- Allow public read access to everyone
create policy "Allow public read access to blogs"
  on public.blogs for select
  using (true);

-- Allow everyone (anonymous or authenticated) to create blog reflections
create policy "Allow anyone to create blogs"
  on public.blogs for insert
  with check (true);

-- Allow updating like counts
create policy "Allow update to likes count"
  on public.blogs for update
  using (true)
  with check (true);

-- Helpful RPC function for atomic like increment
create or replace function public.increment_blog_likes(blog_id text, amount int)
returns void
language sql
security definer
as $$
  update public.blogs
  set likes_count = greatest(0, likes_count + amount)
  where id = blog_id;
$$;

