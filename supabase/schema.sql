-- ============================================================
-- STEP 1: Run this in the Supabase SQL editor BEFORE signing
-- up any users (including demo accounts).
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  photo_url text,
  blood_group text,
  governorate text,
  city text,
  role text not null default 'donor',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Role is server-controlled only: combined with the policy above,
-- a user can update their own row but "role" is never in the
-- allowed column list, so it can't be self-escalated from the client.
revoke update on public.profiles from authenticated;
grant update (display_name, photo_url, blood_group, governorate, city)
  on public.profiles to authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, photo_url, blood_group, governorate, city)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'photo_url',
    new.raw_user_meta_data ->> 'blood_group',
    new.raw_user_meta_data ->> 'governorate',
    new.raw_user_meta_data ->> 'city'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- STEP 2: Run AFTER seeding demo accounts
-- (node --env-file=.env scripts/seed-demo-accounts.mjs).
-- Donor keeps the default role from STEP 1, so only admin and
-- volunteer need an explicit update.
-- ============================================================

update public.profiles set role = 'admin'
  where id = (select id from auth.users where email = 'admin@blooddono.demo');

update public.profiles set role = 'volunteer'
  where id = (select id from auth.users where email = 'volunteer@blooddono.demo');
