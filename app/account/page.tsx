import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account | Appi",
  description: "Account your Appi account.",
};

export default function AccountPage() {
  return (
    <main className="app-page min-h-screen flex-1 px-5 py-10 sm:px-8 sm:py-16">
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
      <div className="mx-auto max-w-2xl">
        {/* <p className="text-sm font-semibold text-app-primary">Appi</p> */}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-4 leading-7 text-app-ink-muted">
          Account features are coming soon. You can explore therapists, book appointment and manage
          bookings without an account.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/"
            className="app-button app-button-primary"
          >
            Explore therapists
          </Link>
          <Link href="/bookings" className="app-button app-button-secondary">
            View bookings
          </Link>
        </div>
      </div>
    </main>
  );
}
