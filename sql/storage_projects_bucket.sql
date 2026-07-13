-- Supabase Storage setup for portfolio project images.
-- Run this in Supabase SQL Editor before using image upload in the admin dashboard.

insert into storage.buckets (id, name, public)
values ('projects', 'projects', true)
on conflict (id) do update set
  public = excluded.public;

drop policy if exists "Allow public project image reads" on storage.objects;
drop policy if exists "Allow public project image uploads" on storage.objects;
drop policy if exists "Allow public project image updates" on storage.objects;
drop policy if exists "Allow public project image deletes" on storage.objects;

create policy "Allow public project image reads"
on storage.objects
for select
using (bucket_id = 'projects');

create policy "Allow public project image uploads"
on storage.objects
for insert
with check (bucket_id = 'projects');

create policy "Allow public project image updates"
on storage.objects
for update
using (bucket_id = 'projects')
with check (bucket_id = 'projects');

create policy "Allow public project image deletes"
on storage.objects
for delete
using (bucket_id = 'projects');
