import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Summary | Appi",
  description: "Review your massage booking details on Appi.",
};

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour < 12 ? "AM" : "PM";
  return `${hour % 12 || 12}:${match[2]} ${suffix}`;
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const booking = {
    therapist: firstValue(params.therapist),
    treatment: firstValue(params.treatment),
    duration: firstValue(params.duration),
    location: firstValue(params.location),
    date: firstValue(params.date),
    time: firstValue(params.time),
    price: firstValue(params.price),
  };
  const hasBookingDetails = Object.values(booking).every(Boolean);

  return (
    <main className="app-page min-h-screen flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* <Link href="/therapists-list" className="app-link text-sm font-medium">
          Back to therapists
        </Link> */}

        <section className="app-surface mt-6 rounded-md p-6 shadow-sm sm:p-10">
          <div className="mx-auto flex size-26 items-center justify-center rounded-full bg-app-surface-muted text-app-success">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Booking summary
          </h1>

          {hasBookingDetails ? (
            <>
              <p className="mt-2 text-center text-app-ink-muted">
                Your selected massage details are ready to review.
              </p>

              <dl className="mt-7 divide-y divide-app-border rounded-md border border-app-border px-4">
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-app-ink-muted">Therapist</dt>
                  <dd className="font-medium">{booking.therapist}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-app-ink-muted">Treatment</dt>
                  <dd className="font-medium">{booking.treatment} · {booking.duration} mins</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-app-ink-muted">Location</dt>
                  <dd className="font-medium capitalize">{booking.location}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-app-ink-muted">Date and time</dt>
                  <dd className="font-medium">{formatDate(booking.date!)} at {formatTime(booking.time!)}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                  <dt className="text-app-ink-muted">Total</dt>
                  <dd className="text-base font-semibold">GHS {booking.price}</dd>
                </div>
              </dl>

              <p className="mt-5 rounded-md bg-app-surface-muted p-3 text-sm leading-6 text-app-ink-muted">
                This is a demo summary. Your booking has not yet been sent to the therapist or saved to an account.
              </p>
            </>
          ) : (
            <p className="mt-3 text-center leading-7 text-app-ink-muted">
              No booking details were provided. Choose a therapist to start a booking.
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/therapists-list" className="app-button app-button-primary">
              Browse therapists
            </Link>
            <Link href="/" className="app-button app-button-secondary">
              Return home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}