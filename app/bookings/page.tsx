import type { Metadata } from "next";
import BookingsClient from "./BookingsClient";

export const metadata: Metadata = {
  title: "Your Bookings | Appi",
  description: "Review massage bookings saved in this browser.",
};

export default function BookingsPage() {
  return (
    <main className="app-page min-h-screen flex-1 px-4 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-primary">Your Appi activity</p> */}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your bookings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-app-ink-muted">
            Review massage sessions you have saved on this device.
          </p>
        </header>
        <BookingsClient />
      </div>
    </main>
  );
}
