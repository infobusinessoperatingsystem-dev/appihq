# Supabase booking storage

This integration writes only booking records to `public.bookings`. It does not
send therapist profiles, provider availability, analytics, or account data to
Supabase.

1. Apply `migrations/20261117000000_create_bookings.sql` in the Supabase SQL
   Editor or with the Supabase CLI.
2. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` from the Supabase project settings.
3. Keep the service-role key server-only. Do not prefix it with `NEXT_PUBLIC_`
   or expose it in browser code.

The database has row-level security enabled and grants table access only to
`service_role`. The app uses server route handlers to create bookings and
retrieve a booking confirmation with its one-time-per-booking secret token.
Only the SHA-256 hash of that token is stored with the booking.
