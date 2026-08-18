-- Dreamweave Digital admin CMS: form submissions (leads) and newsletter subscribers.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor, after
-- 0001_admin_content.sql. See supabase/README.md for the full setup checklist.

-- ============================================================================
-- 1) form_submissions — every Contact / Apply as Creator / Book Campaign
--    submission. Field shapes differ per form, so they're kept as a jsonb blob
--    rather than one column per possible field; the admin dashboard renders
--    each form_type with its own field labels (see src/lib/leads.ts).
-- ============================================================================
create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null check (form_type in ('contact', 'apply', 'book_campaign')),
  data jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.form_submissions is
  'Leads captured from the public Contact, Apply as Creator, and Book Campaign forms.';

create index form_submissions_form_type_idx on public.form_submissions (form_type);
create index form_submissions_created_at_idx on public.form_submissions (created_at desc);

-- Reuses the trigger function created in 0001_admin_content.sql.
create trigger trg_form_submissions_updated_at
before update on public.form_submissions
for each row execute function public.update_updated_at_column();

-- ============================================================================
-- 2) newsletter_subscribers — footer newsletter signups.
-- ============================================================================
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(trim(email)) > 0),
  created_at timestamptz not null default now()
);

create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email));

-- ============================================================================
-- 3) Row Level Security
-- ============================================================================
alter table public.form_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- form_submissions: any site visitor (including anonymous) can submit a lead by inserting a
-- row; only admins can read, update (change status), or delete — leads are private, unlike
-- the public-readable blogs/testimonials content in 0001.
create policy "Anyone can submit a lead"
on public.form_submissions for insert
with check (true);

create policy "Admins can read leads"
on public.form_submissions for select
using (public.is_admin());

create policy "Admins can update leads"
on public.form_submissions for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete leads"
on public.form_submissions for delete
using (public.is_admin());

-- newsletter_subscribers: same shape — public insert, admin-only read/delete.
create policy "Anyone can subscribe to the newsletter"
on public.newsletter_subscribers for insert
with check (true);

create policy "Admins can read newsletter subscribers"
on public.newsletter_subscribers for select
using (public.is_admin());

create policy "Admins can delete newsletter subscribers"
on public.newsletter_subscribers for delete
using (public.is_admin());
