import Link from "next/link";
import BookingClient from "../../BookingClient";
export const dynamic = "force-dynamic";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ repeat?: string | string[] }>;
}) {
  const { repeat } = await searchParams;
  const repeatBookingId = Array.isArray(repeat) ? repeat[0] : repeat;

  return (
    <main className="app-page min-h-screen flex-1 font-sans">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <Link
            href="/"
            aria-label="Back to Appi home"
            className="app-icon-button mb-4 border-0 bg-transparent"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        {/* <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-app-primary">Personal care, on your time</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Book your massage</h1>
          <p className="mt-2 text-sm leading-6 text-app-ink-muted">Choose a treatment, a location, and a time that works for you.</p>
        </div> */}
        <BookingClient repeatBookingId={repeatBookingId} />
      </div>
    </main>
  );
}
