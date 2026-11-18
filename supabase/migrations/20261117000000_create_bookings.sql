create table if not exists public.bookings (
  id uuid primary key,
  confirmation_token_hash text not null,
  therapist_slug text not null,
  therapist_name text not null,
  client_name text not null,
  phone_number text not null,
  therapist_note text not null default '',
  treatment text not null,
  duration_minutes integer not null check (duration_minutes between 15 and 240),
  service_location text not null check (service_location in ('home', 'hotel', 'walk-in')),
  address text not null,
  appointment_date date not null,
  appointment_time time not null,
  time_zone text not null,
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'rescheduled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_therapist_schedule_idx
  on public.bookings (therapist_slug, appointment_date, appointment_time);

alter table public.bookings enable row level security;

revoke all on table public.bookings from public, anon, authenticated;
grant all on table public.bookings to service_role;
