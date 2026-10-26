-- ==============================================================================
-- TAWASUL PLATFORM - DATABASE SCHEMA FOR SUPABASE
-- Run this whole file once in the Supabase SQL editor (it is safe to run again):
-- https://supabase.com/dashboard/project/auxdpgqqlcrpmdzjgnky/sql/new
--
-- What it creates
--   * content tables (translations, organization_info, sectors, regions, projects,
--     bank_accounts, site_settings) that the public site reads with the anon key
--   * donations and contact_messages that visitors may insert into
--   * admin_audit_log written by the admin API
--   * the public "media" storage bucket that the admin uploads into
--
-- Writes from the admin panel go through Next.js API routes that use the service
-- role key, so no table grants write access to the anon or authenticated roles.
-- ==============================================================================

create extension if not exists pgcrypto;

-- Keeps updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ------------------------------------------------------------------------------
-- 1. Site texts in the three languages (one row, id = 'main')
-- ------------------------------------------------------------------------------
create table if not exists public.translations (
  id text primary key,
  ar jsonb not null default '{}'::jsonb,
  tr jsonb not null default '{}'::jsonb,
  en jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. Organization information (about page sections, keyed by section)
-- ------------------------------------------------------------------------------
create table if not exists public.organization_info (
  key text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. Sectors of work
-- ------------------------------------------------------------------------------
create table if not exists public.sectors (
  id text primary key,
  slug text unique not null,
  icon_name text not null,
  cover_image text,
  title jsonb not null,
  subtitle jsonb,
  description jsonb,
  objectives jsonb default '[]'::jsonb,
  stats jsonb default '{}'::jsonb,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. Regions and countries
-- ------------------------------------------------------------------------------
create table if not exists public.regions (
  id text primary key,
  slug text unique not null,
  flag text,
  cover_image text,
  name jsonb not null,
  headline jsonb,
  overview jsonb,
  beneficiaries_count int default 0,
  active_projects_count int default 0,
  key_interventions jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. Projects
-- ------------------------------------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  slug text unique not null,
  title jsonb not null,
  summary jsonb,
  description jsonb,
  sector_slug text not null,
  country_slug text not null,
  country_name jsonb,
  target_groups jsonb default '[]'::jsonb,
  beneficiaries_count int default 0,
  goal_amount numeric not null default 0,
  raised_amount numeric not null default 0,
  donors_count int default 0,
  status text not null default 'active',
  featured boolean default false,
  cover_image text,
  gallery jsonb default '[]'::jsonb,
  updates jsonb default '[]'::jsonb,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.projects add column if not exists sort_order int default 0;

-- ------------------------------------------------------------------------------
-- 6. Bank accounts
-- ------------------------------------------------------------------------------
create table if not exists public.bank_accounts (
  id text primary key,
  bank_name text not null,
  account_holder text not null,
  currency text not null,
  iban text not null,
  swift_code text,
  branch_name text,
  icon_color text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.bank_accounts add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;

-- ------------------------------------------------------------------------------
-- 7. Donations (inserted by the public donation flow)
-- ------------------------------------------------------------------------------
create table if not exists public.donations (
  id text primary key,
  receipt_number text unique not null,
  donor_name text not null,
  donor_email text,
  donor_phone text,
  is_anonymous boolean default false,
  amount numeric not null,
  currency text not null,
  amount_usd numeric not null,
  project_id text,
  project_title text,
  sector_slug text,
  payment_method text not null,
  status text not null default 'success',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 8. Contact messages (inserted by the /contact form)
-- ------------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  name text not null,
  email text not null,
  phone text,
  topic text not null default 'other',
  message text not null,
  language text not null default 'ar',
  status text not null default 'new',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.contact_messages add column if not exists notes text;

-- ------------------------------------------------------------------------------
-- 9. Site settings (contact details, hero media, payment mode...), keyed by group
-- ------------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 10. Admin activity log (written by the admin API with the service role)
-- ------------------------------------------------------------------------------
create table if not exists public.admin_audit_log (
  id bigserial primary key,
  actor_id uuid,
  actor_email text,
  action text not null,
  table_name text not null,
  record_id text,
  summary text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);

-- ------------------------------------------------------------------------------
-- updated_at triggers
-- ------------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['translations','organization_info','sectors','regions','projects','bank_accounts','site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ------------------------------------------------------------------------------
-- Row level security
-- ------------------------------------------------------------------------------
alter table public.translations enable row level security;
alter table public.organization_info enable row level security;
alter table public.sectors enable row level security;
alter table public.regions enable row level security;
alter table public.projects enable row level security;
alter table public.bank_accounts enable row level security;
alter table public.donations enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_audit_log enable row level security;

-- Remove the old "full access to everyone" policies from the first schema version.
drop policy if exists "Admin full access translations" on public.translations;
drop policy if exists "Admin full access organization_info" on public.organization_info;
drop policy if exists "Admin full access sectors" on public.sectors;
drop policy if exists "Admin full access regions" on public.regions;
drop policy if exists "Admin full access projects" on public.projects;
drop policy if exists "Admin full access bank_accounts" on public.bank_accounts;
drop policy if exists "Admin full access donations" on public.donations;

-- Public content: everyone can read.
drop policy if exists "Public can read translations" on public.translations;
create policy "Public can read translations" on public.translations for select using (true);
drop policy if exists "Public can read organization_info" on public.organization_info;
create policy "Public can read organization_info" on public.organization_info for select using (true);
drop policy if exists "Public can read sectors" on public.sectors;
create policy "Public can read sectors" on public.sectors for select using (true);
drop policy if exists "Public can read regions" on public.regions;
create policy "Public can read regions" on public.regions for select using (true);
drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects for select using (true);
drop policy if exists "Public can read bank_accounts" on public.bank_accounts;
create policy "Public can read bank_accounts" on public.bank_accounts for select using (true);
drop policy if exists "Public can read site_settings" on public.site_settings;
create policy "Public can read site_settings" on public.site_settings for select using (true);

-- Donations: the live ticker reads them and the donation flow inserts them.
drop policy if exists "Public can read donations" on public.donations;
create policy "Public can read donations" on public.donations for select using (true);
drop policy if exists "Public can create donations" on public.donations;
create policy "Public can create donations" on public.donations for insert with check (true);
-- The donation flow bumps the project's totals through this function instead of a
-- broad update policy, so the anon key can never edit project content.
create or replace function public.apply_donation(p_project_id text, p_amount_usd numeric)
returns void
language sql
security definer
set search_path = public
as $$
  update public.projects
  set raised_amount = least(goal_amount, raised_amount + greatest(coalesce(p_amount_usd, 0), 0)),
      donors_count = coalesce(donors_count, 0) + 1
  where id = p_project_id;
$$;
grant execute on function public.apply_donation(text, numeric) to anon, authenticated, service_role;
drop policy if exists "Public can update project totals" on public.projects;

-- Contact messages: visitors may only add messages; reading them is admin-only (service role).
drop policy if exists "Public can create contact_messages" on public.contact_messages;
create policy "Public can create contact_messages" on public.contact_messages
  for insert to anon, authenticated with check (true);
drop policy if exists "Staff can read contact_messages" on public.contact_messages;

-- ------------------------------------------------------------------------------
-- Storage: public "media" bucket for images, documents and videos uploaded in the admin
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media" on storage.objects for select using (bucket_id = 'media');
