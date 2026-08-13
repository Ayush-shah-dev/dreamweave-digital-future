-- Dreamweave Digital admin CMS: admin authorization, blogs, testimonials.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- See supabase/README.md for the full setup checklist (creating the admin user, etc.).

-- ============================================================================
-- 1) admin_users — explicit authorization table. Membership here, not Supabase
--    Auth alone, is what grants admin access to the CMS.
-- ============================================================================
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Authorization allow-list for the content admin. A row here (not just a Supabase Auth account) is required for admin access.';

-- ============================================================================
-- 2) blogs
-- ============================================================================
create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  slug text not null default '',
  short_summary text,
  content text not null default '',
  featured_image text,
  category text,
  author_name text default 'Dreamweave Digital',
  reading_time integer check (reading_time is null or reading_time > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_date timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index blogs_slug_key on public.blogs (slug);

-- ============================================================================
-- 3) testimonials
-- ============================================================================
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  designation text,
  company text,
  quote text not null check (length(trim(quote)) > 0),
  profile_image text,
  rating integer not null default 5 check (rating between 1 and 5),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 4) updated_at trigger (shared by blogs and testimonials)
-- ============================================================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_blogs_updated_at
before update on public.blogs
for each row execute function public.update_updated_at_column();

create trigger trg_testimonials_updated_at
before update on public.testimonials
for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 5) blog slugs — auto-generate from title, keep manually edited slugs,
--    guarantee uniqueness with a numeric suffix.
-- ============================================================================
create or replace function public.slugify(input text)
returns text
language sql
immutable
strict
set search_path = public
as $$
  select trim(both '-' from regexp_replace(lower(input), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.generate_unique_blog_slug(base text, exclude_id uuid default null)
returns text
language plpgsql
set search_path = public
as $$
declare
  base_slug text := public.slugify(base);
  candidate text;
  suffix int := 1;
begin
  if base_slug is null or base_slug = '' then
    base_slug := 'post';
  end if;

  candidate := base_slug;
  while exists (
    select 1 from public.blogs
    where slug = candidate
      and (exclude_id is null or id <> exclude_id)
  ) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix::text;
  end loop;

  return candidate;
end;
$$;

create or replace function public.blogs_set_slug()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_unique_blog_slug(coalesce(new.title, 'post'));
  else
    new.slug := public.generate_unique_blog_slug(new.slug);
  end if;
  return new;
end;
$$;

create trigger trg_blogs_set_slug
before insert on public.blogs
for each row execute function public.blogs_set_slug();

create or replace function public.blogs_sync_slug()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := public.generate_unique_blog_slug(coalesce(new.title, 'post'), old.id);
    return new;
  end if;

  if new.slug is distinct from old.slug then
    new.slug := public.generate_unique_blog_slug(new.slug, old.id);
  end if;

  return new;
end;
$$;

create trigger trg_blogs_sync_slug
before update on public.blogs
for each row execute function public.blogs_sync_slug();

-- ============================================================================
-- 6) is_admin() — single source of truth for "is the current user an admin".
--    SECURITY DEFINER so it can read admin_users regardless of the caller's
--    own RLS visibility into that table, which avoids a recursive-RLS trap
--    (a policy on admin_users that calls is_admin(), which queries
--    admin_users, which is gated by the same policy...).
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ============================================================================
-- 7) Row Level Security
-- ============================================================================
alter table public.admin_users enable row level security;
alter table public.blogs enable row level security;
alter table public.testimonials enable row level security;

-- admin_users: an admin can read their own row (no is_admin() call needed here —
-- this direct auth.uid() = user_id check is what makes it non-recursive). Anonymous
-- users and authenticated non-admins never match a row. No insert/update/delete
-- policy exists for anyone, so self-service role changes are impossible outright;
-- admin_users is only ever modified via the SQL in supabase/README.md.
create policy "Admins can read their own admin_users row"
on public.admin_users for select
using (user_id = auth.uid());

-- blogs: published rows are public; everything else (drafts, and all writes)
-- requires is_admin().
create policy "Anyone can read published blogs, admins read all"
on public.blogs for select
using (status = 'published' or public.is_admin());

create policy "Admins can insert blogs"
on public.blogs for insert
with check (public.is_admin());

create policy "Admins can update blogs"
on public.blogs for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete blogs"
on public.blogs for delete
using (public.is_admin());

-- testimonials: same shape as blogs.
create policy "Anyone can read published testimonials, admins read all"
on public.testimonials for select
using (status = 'published' or public.is_admin());

create policy "Admins can insert testimonials"
on public.testimonials for insert
with check (public.is_admin());

create policy "Admins can update testimonials"
on public.testimonials for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete testimonials"
on public.testimonials for delete
using (public.is_admin());

-- ============================================================================
-- 8) Storage — blog-images and testimonial-images buckets.
--    Public read (so published content renders without auth); admin-only
--    write, scoped so an admin uploads into their own uid folder
--    ({bucket}/{auth.uid()}/{uuid}.{ext}). MIME type and size are enforced at
--    the bucket level in addition to client-side validation.
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('blog-images', 'blog-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('testimonial-images', 'testimonial-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read blog and testimonial images"
on storage.objects for select
using (bucket_id in ('blog-images', 'testimonial-images'));

create policy "Admins can upload blog and testimonial images"
on storage.objects for insert
with check (
  bucket_id in ('blog-images', 'testimonial-images')
  and public.is_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Admins can update blog and testimonial images"
on storage.objects for update
using (bucket_id in ('blog-images', 'testimonial-images') and public.is_admin())
with check (bucket_id in ('blog-images', 'testimonial-images') and public.is_admin());

create policy "Admins can delete blog and testimonial images"
on storage.objects for delete
using (bucket_id in ('blog-images', 'testimonial-images') and public.is_admin());
