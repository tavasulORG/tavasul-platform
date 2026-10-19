-- ==============================================================================
-- TAWASUL PLATFORM - DATABASE SCHEMA FOR SUPABASE
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/auxdpgqqlcrpmdzjgnky/sql/new
-- ==============================================================================

-- 1. Site Content & Translations (All texts, strings, descriptions)
CREATE TABLE IF NOT EXISTS public.translations (
  id text PRIMARY KEY,
  ar jsonb NOT NULL DEFAULT '{}'::jsonb,
  tr jsonb NOT NULL DEFAULT '{}'::jsonb,
  en jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Organization Information (About, Story, Vision, Mission, Goals, Values, Governance)
CREATE TABLE IF NOT EXISTS public.organization_info (
  key text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sectors of Work (مجالات العمل)
CREATE TABLE IF NOT EXISTS public.sectors (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  icon_name text NOT NULL,
  cover_image text,
  title jsonb NOT NULL,
  subtitle jsonb,
  description jsonb,
  objectives jsonb DEFAULT '[]'::jsonb,
  stats jsonb DEFAULT '{}'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Regions & Countries (أين نعمل)
CREATE TABLE IF NOT EXISTS public.regions (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  flag text,
  cover_image text,
  name jsonb NOT NULL,
  headline jsonb,
  overview jsonb,
  beneficiaries_count int DEFAULT 0,
  active_projects_count int DEFAULT 0,
  key_interventions jsonb DEFAULT '[]'::jsonb,
  sort_order int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Projects (المشاريع الإنسانية والتنموية)
CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  summary jsonb,
  description jsonb,
  sector_slug text NOT NULL,
  country_slug text NOT NULL,
  country_name jsonb,
  target_groups jsonb DEFAULT '[]'::jsonb,
  beneficiaries_count int DEFAULT 0,
  goal_amount numeric NOT NULL DEFAULT 0,
  raised_amount numeric NOT NULL DEFAULT 0,
  donors_count int DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  featured boolean DEFAULT false,
  cover_image text,
  gallery jsonb DEFAULT '[]'::jsonb,
  updates jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Bank Accounts (الحسابات البنكية الرسمية)
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id text PRIMARY KEY,
  bank_name text NOT NULL,
  account_holder text NOT NULL,
  currency text NOT NULL,
  iban text NOT NULL,
  swift_code text,
  branch_name text,
  icon_color text,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Donations (سجل التبرعات والإيصالات)
CREATE TABLE IF NOT EXISTS public.donations (
  id text PRIMARY KEY,
  receipt_number text UNIQUE NOT NULL,
  donor_name text NOT NULL,
  donor_email text,
  donor_phone text,
  is_anonymous boolean DEFAULT false,
  amount numeric NOT NULL,
  currency text NOT NULL,
  amount_usd numeric NOT NULL,
  project_id text,
  project_title text,
  sector_slug text,
  payment_method text NOT NULL,
  status text NOT NULL DEFAULT 'success',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create Policies: Public Read Access (Everyone can read content)
CREATE POLICY "Public can read translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Public can read organization_info" ON public.organization_info FOR SELECT USING (true);
CREATE POLICY "Public can read sectors" ON public.sectors FOR SELECT USING (true);
CREATE POLICY "Public can read regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can read bank_accounts" ON public.bank_accounts FOR SELECT USING (true);
CREATE POLICY "Public can read donations" ON public.donations FOR SELECT USING (true);

-- Allow Public to insert new donations
CREATE POLICY "Public can create donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Allow Service Role and authenticated full access
CREATE POLICY "Admin full access translations" ON public.translations FOR ALL USING (true);
CREATE POLICY "Admin full access organization_info" ON public.organization_info FOR ALL USING (true);
CREATE POLICY "Admin full access sectors" ON public.sectors FOR ALL USING (true);
CREATE POLICY "Admin full access regions" ON public.regions FOR ALL USING (true);
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL USING (true);
CREATE POLICY "Admin full access bank_accounts" ON public.bank_accounts FOR ALL USING (true);
CREATE POLICY "Admin full access donations" ON public.donations FOR ALL USING (true);
