create table if not exists public.site_data (
  id text primary key default 'main',
  products jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  leads jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_data (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_data enable row level security;

create policy "Public can read site data"
on public.site_data for select
to anon, authenticated
using (id = 'main');

create policy "Public can update site data"
on public.site_data for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

create policy "Public can view site images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-images');

create policy "Public can upload site images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'site-images');