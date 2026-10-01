alter table public.user_profiles enable row level security;
alter table public.vehicle_favorites enable row level security;

grant select, insert, update, delete on public.user_profiles to authenticated;
grant select, insert, update, delete on public.vehicle_favorites to authenticated;

drop policy if exists "Users manage their own profile" on public.user_profiles;
create policy "Users manage their own profile"
on public.user_profiles
for all
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Users manage their own favorites" on public.vehicle_favorites;
create policy "Users manage their own favorites"
on public.vehicle_favorites
for all
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar images are public" on storage.objects;
create policy "Avatar images are public"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'avatars');

drop policy if exists "Users upload their own avatars" on storage.objects;
create policy "Users upload their own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users update their own avatars" on storage.objects;
create policy "Users update their own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Users delete their own avatars" on storage.objects;
create policy "Users delete their own avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);