create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin','owner')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  number text,
  title text not null,
  category text,
  description text,
  link text,
  tags jsonb not null default '[]'::jsonb,
  image_url text,
  preview_class text,
  preview_label text,
  status_label text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text,
  icon text,
  link text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  source text default 'website',
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.chat_conversations (
  id text primary key,
  customer_name text,
  customer_email text,
  status text not null default 'bot' check (status in ('bot','waiting','connected','closed')),
  agent_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references public.chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer','bot','agent')),
  sender_id uuid references auth.users(id) on delete set null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  rating int not null check (rating between 0 and 5),
  text text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.site_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.reviews enable row level security;
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  featured_image text,
  category text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  type text,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
alter table public.media_assets enable row level security;


-- Server uses the Supabase service role. These policies keep browser access closed by default.
-- Add explicit RLS policies only if you later want direct browser access to these tables.

insert into public.site_settings(key,value) values
('site_name','"BrandSpire"'::jsonb),
('contact_email','"contact@brandspire.tech"'::jsonb),
('location','"Ghaziabad, Uttar Pradesh"'::jsonb)
on conflict (key) do nothing;
