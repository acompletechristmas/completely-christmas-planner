
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  postcode text,
  source text,
  interests text[],
  created_at timestamptz not null default now()
);

grant insert on public.waitlist to anon, authenticated;
grant all on public.waitlist to service_role;

alter table public.waitlist enable row level security;

create policy "Anyone can join waitlist"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

create table public.partner_enquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact_name text not null,
  email text not null,
  website text,
  budget text,
  message text,
  created_at timestamptz not null default now()
);

grant insert on public.partner_enquiries to anon, authenticated;
grant all on public.partner_enquiries to service_role;

alter table public.partner_enquiries enable row level security;

create policy "Anyone can submit partner enquiry"
  on public.partner_enquiries for insert
  to anon, authenticated
  with check (true);
