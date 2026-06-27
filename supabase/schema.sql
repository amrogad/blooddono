-- ============================================================
-- BloodDono schema. Run the STEPs in order in the Supabase SQL editor.
-- STEP 1-5 create tables/policies and can run before any users exist.
-- STEP 6 runs AFTER seeding the demo accounts (it needs their user ids).
-- ============================================================


-- ============================================================
-- STEP 1: profiles + auth helpers
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  photo_url text,
  blood_group text,
  governorate text,
  city text,
  role text not null default 'donor',
  status text not null default 'active',
  is_searchable boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the current user an admin? SECURITY DEFINER so it can read
-- profiles.role without tripping the row-level policies below (avoids
-- infinite recursion in the "admin can read all" policy).
create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'volunteer')
  );
$$;

-- A user can read their own row; an admin can read everyone (for All Users).
create policy "view own profile or admin views all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Role/status are server-controlled: a user may update their own row, but
-- "role" and "status" are never in the granted column list, so they can't
-- be self-escalated from the client.
revoke update on public.profiles from authenticated;
grant update (display_name, photo_url, blood_group, governorate, city, is_searchable)
  on public.profiles to authenticated;

-- Admin-only mutations for role/status go through SECURITY DEFINER funcs
-- that re-check is_admin() server-side (the client can never set these
-- columns directly because of the column grant above).
create function public.admin_set_role(target_id uuid, new_role text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if new_role not in ('admin', 'donor', 'volunteer') then
    raise exception 'invalid role';
  end if;
  update public.profiles set role = new_role where id = target_id;
end;
$$;

create function public.admin_set_status(target_id uuid, new_status text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  if new_status not in ('active', 'blocked') then
    raise exception 'invalid status';
  end if;
  update public.profiles set status = new_status where id = target_id;
end;
$$;

-- Which donor blood types can give red cells to a recipient of the given
-- type. O- is the universal donor, AB+ the universal recipient. Used by
-- search_donors so a patient finds every compatible donor, not just an
-- exact blood-group match.
create function public.compatible_donor_types(recipient text)
returns text[]
language sql
immutable
as $$
  select case recipient
    when 'O-'  then array['O-']
    when 'O+'  then array['O-','O+']
    when 'A-'  then array['O-','A-']
    when 'A+'  then array['O-','O+','A-','A+']
    when 'B-'  then array['O-','B-']
    when 'B+'  then array['O-','O+','B-','B+']
    when 'AB-' then array['O-','A-','B-','AB-']
    when 'AB+' then array['O-','O+','A-','A+','B-','B+','AB-','AB+']
    else array[]::text[]
  end;
$$;

-- Donor search: SECURITY DEFINER function that returns ONLY non-PII columns
-- (no email) and only for donors who opted in via is_searchable. This is
-- why there is no public SELECT policy on profiles - we never want to expose
-- contact info to anonymous queries. p_blood_group is the RECIPIENT's type;
-- results are donors whose blood is compatible to donate to them.
create function public.search_donors(
  p_blood_group text,
  p_governorate text,
  p_city text
)
returns table (
  id uuid,
  display_name text,
  photo_url text,
  blood_group text,
  governorate text,
  city text
)
language sql
security definer set search_path = public
stable
as $$
  select id, display_name, photo_url, blood_group, governorate, city
  from public.profiles
  where is_searchable = true
    and status = 'active'
    and blood_group = any(public.compatible_donor_types(p_blood_group))
    and governorate = p_governorate
    and city = p_city;
$$;

grant execute on function public.search_donors(text, text, text) to anon, authenticated;

-- Copy sign-up metadata into a profile row on every new auth user.
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
-- STEP 2: blood_donation_requests
-- ============================================================

create table public.blood_donation_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users on delete cascade default auth.uid(),
  requester_name text,
  requester_email text,
  recipient_name text not null,
  recipient_governorate text not null,
  recipient_city text not null,
  hospital_name text not null,
  full_address text not null,
  blood_group text not null,
  donation_date date not null,
  donation_time time not null,
  donation_status text not null default 'pending',
  request_message text,
  donor_id uuid references auth.users on delete set null,
  donor_name text,
  donor_email text,
  created_at timestamptz not null default now()
);

alter table public.blood_donation_requests enable row level security;

-- NOTE: there is deliberately NO public/anon SELECT policy on this table.
-- A row-level "view pending" policy would expose every column (requester
-- email, name, address...) to anonymous PostgREST queries via ?select=.
-- Public/donor access goes through the SECURITY DEFINER functions below,
-- which return non-PII columns only — same approach as search_donors.

-- Owners see all their own requests; staff see everything.
create policy "owner or staff can view requests"
  on public.blood_donation_requests for select
  using (requester_id = auth.uid() or public.is_staff());

create policy "users can create own requests"
  on public.blood_donation_requests for insert
  with check (requester_id = auth.uid());

create policy "owner or admin can update requests"
  on public.blood_donation_requests for update
  using (requester_id = auth.uid() or public.is_admin());

create policy "owner or admin can delete requests"
  on public.blood_donation_requests for delete
  using (requester_id = auth.uid() or public.is_admin());

-- A signed-in donor can accept a pending request (claim it as their own to
-- fulfil). SECURITY DEFINER so they can flip a row they don't own, but only
-- while it is still pending and only by attaching themselves as the donor.
create function public.accept_request(request_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  me_name text;
  me_email text;
begin
  select p.display_name, u.email into me_name, me_email
  from public.profiles p join auth.users u on u.id = p.id
  where p.id = auth.uid();

  update public.blood_donation_requests
    set donor_id = auth.uid(),
        donor_name = me_name,
        donor_email = me_email,
        donation_status = 'inprogress'
  where id = request_id and donation_status = 'pending';
end;
$$;

grant execute on function public.accept_request(uuid) to authenticated;

-- Public, PII-safe pending list: no requester email/name, no address.
-- SECURITY DEFINER so anon can read it despite there being no table SELECT
-- policy for anonymous users.
create function public.get_pending_requests()
returns table (
  id uuid,
  recipient_name text,
  recipient_governorate text,
  recipient_city text,
  blood_group text,
  donation_date date,
  donation_time time
)
language sql
security definer set search_path = public
stable
as $$
  select id, recipient_name, recipient_governorate, recipient_city,
         blood_group, donation_date, donation_time
  from public.blood_donation_requests
  where donation_status = 'pending'
  order by created_at desc;
$$;

grant execute on function public.get_pending_requests() to anon, authenticated;

-- Single-request details for a signed-in donor deciding whether to help.
-- Includes hospital + address (a donor needs to know where to go) but never
-- the requester's email or name. Authenticated only.
create function public.get_request_details(p_id uuid)
returns table (
  id uuid,
  recipient_name text,
  recipient_governorate text,
  recipient_city text,
  hospital_name text,
  full_address text,
  blood_group text,
  donation_date date,
  donation_time time,
  request_message text,
  donation_status text
)
language sql
security definer set search_path = public
stable
as $$
  select id, recipient_name, recipient_governorate, recipient_city,
         hospital_name, full_address, blood_group, donation_date,
         donation_time, request_message, donation_status
  from public.blood_donation_requests
  where id = p_id;
$$;

grant execute on function public.get_request_details(uuid) to authenticated;


-- ============================================================
-- STEP 3: blogs
-- ============================================================

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users on delete set null default auth.uid(),
  title text not null,
  thumbnail text,
  content text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.blogs enable row level security;

create policy "anyone can read published blogs"
  on public.blogs for select
  using (status = 'published' or public.is_staff());

create policy "staff can create blogs"
  on public.blogs for insert
  with check (public.is_staff());

create policy "staff can update blogs"
  on public.blogs for update
  using (public.is_staff());

create policy "staff can delete blogs"
  on public.blogs for delete
  using (public.is_staff());


-- ============================================================
-- STEP 4: funds
-- ============================================================

create table public.funds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null default auth.uid(),
  name text,
  email text,
  amount numeric not null check (amount > 0),
  paid_at timestamptz not null default now()
);

alter table public.funds enable row level security;

-- Funding records are visible to any signed-in user (the page is behind auth).
create policy "authenticated can view funds"
  on public.funds for select
  to authenticated
  using (true);

create policy "users can record own fund"
  on public.funds for insert
  with check (user_id = auth.uid());


-- ============================================================
-- STEP 5: storage buckets (avatars + blog images)
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Public read for both buckets.
create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- A user can write only inside their own folder: avatars/<uid>/...
create policy "users manage own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Staff manage blog images.
create policy "staff upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images' and public.is_staff());


-- ============================================================
-- STEP 6: RUN AFTER seeding demo accounts
-- (node --env-file=.env scripts/seed-demo-accounts.mjs)
-- Sets demo roles, makes the donor searchable, and seeds demo
-- content so the app does not look empty.
-- ============================================================

update public.profiles set role = 'admin'
  where id = (select id from auth.users where email = 'admin@blooddono.demo');

update public.profiles set role = 'volunteer'
  where id = (select id from auth.users where email = 'volunteer@blooddono.demo');

-- Make the demo donor discoverable in search, with a full profile.
update public.profiles
  set is_searchable = true,
      blood_group = coalesce(blood_group, 'O+'),
      governorate = coalesce(governorate, 'Cairo'),
      city = coalesce(city, 'Nasr City')
  where id = (select id from auth.users where email = 'donor@blooddono.demo');

-- Seed a few donation requests owned by the demo donor.
insert into public.blood_donation_requests
  (requester_id, requester_name, requester_email, recipient_name,
   recipient_governorate, recipient_city, hospital_name, full_address,
   blood_group, donation_date, donation_time, donation_status, request_message)
select
  u.id, 'Demo Donor', u.email, v.recipient_name,
  v.gov, v.city, v.hospital, v.address,
  v.blood_group, v.ddate::date, v.dtime::time, v.status, v.msg
from auth.users u
cross join (values
  ('Mona Khaled','Cairo','Nasr City','Cairo University Hospital','12 El Saleh Ayoub St, Nasr City','A+','2026-07-10','10:00','pending','Need a donor for a scheduled surgery.'),
  ('Tarek Aboul Fotouh','Giza','6th of October','Dar Al Fouad Hospital','4 Central Axis, 6th of October','O-','2026-07-05','14:30','inprogress','Patient needs O- for a transfusion.'),
  ('Yasmin Saeed','Alexandria','Sidi Gaber','Alexandria Medical Center','21 Port Said St, Sidi Gaber','B+','2026-06-28','09:00','done','Thanks to everyone, donor found.')
) as v(recipient_name, gov, city, hospital, address, blood_group, ddate, dtime, status, msg)
where u.email = 'donor@blooddono.demo';

-- A few more pending requests (owned by admin) so the public requests page
-- and the admin table look populated.
insert into public.blood_donation_requests
  (requester_id, requester_name, requester_email, recipient_name,
   recipient_governorate, recipient_city, hospital_name, full_address,
   blood_group, donation_date, donation_time, donation_status, request_message)
select
  u.id, 'Demo Admin', u.email, v.recipient_name,
  v.gov, v.city, v.hospital, v.address,
  v.blood_group, v.ddate::date, v.dtime::time, 'pending', v.msg
from auth.users u
cross join (values
  ('Hassan Ibrahim','Cairo','Heliopolis','Cairo University Hospital','8 El Higaz St, Heliopolis','AB+','2026-07-12','17:00','Needed before a dialysis session.'),
  ('Omar Khaled','Giza','6th of October','Dar Al Fouad Hospital','4 Central Axis, 6th of October','A-','2026-07-08','11:00','Urgent A- donor needed.'),
  ('Dina Farouk','Dakahlia','Mansoura','Mansoura General Hospital','3 Gomhouria St, Mansoura','O+','2026-07-15','09:30','Looking for an O+ donor.'),
  ('Yara Adel','Alexandria','Sidi Gaber','Alexandria Medical Center','21 Port Said St, Sidi Gaber','B-','2026-07-20','13:00','Patient needs B- this week.')
) as v(recipient_name, gov, city, hospital, address, blood_group, ddate, dtime, msg)
where u.email = 'admin@blooddono.demo';

-- Seed published blogs (thumbnails reference files already in /public/images).
insert into public.blogs (author_id, title, thumbnail, content, status)
select u.id, b.title, b.thumb, b.content, b.status
from auth.users u
cross join (values
  ('Why Donating Blood Saves Lives in Cairo Hospitals','/images/blog-1.jpg','<p>Every year thousands of patients in Cairo hospitals depend on blood donations to survive surgeries and accidents. A single donation can help save up to three lives.</p>','published'),
  ('Common Myths About Blood Donation','/images/blog-2.jpg','<p>Many people avoid donating because of myths. Donating blood does not make you weak, and the process is quick, safe and supervised by trained staff.</p>','published'),
  ('How Often Can You Donate Blood Safely?','/images/blog-3.jpg','<p>Most healthy adults can donate whole blood every 56 days. Your body needs that time to replace the red blood cells that were removed.</p>','published'),
  ('Preparing for Your First Blood Donation','/images/blog-4.jpg','<p>Eat a healthy meal, drink plenty of water, and get a good night of sleep before your appointment. Bring a valid ID.</p>','published')
) as b(title, thumb, content, status)
where u.email = 'admin@blooddono.demo';

-- Seed funding records.
insert into public.funds (user_id, name, email, amount, paid_at)
select u.id, f.name, f.email, f.amount, f.paid_at::timestamptz
from auth.users u
cross join (values
  ('Ahmed Mostafa','ahmed.mostafa@example.com',50,'2026-06-02T10:15:00'),
  ('Sara Hassan','sara.hassan@example.com',100,'2026-06-10T14:30:00'),
  ('Mohamed Ali','mohamed.ali@example.com',25,'2026-06-18T09:00:00'),
  ('Youssef Adel','youssef.adel@example.com',200,'2026-06-22T11:20:00')
) as f(name, email, amount, paid_at)
where u.email = 'donor@blooddono.demo';
