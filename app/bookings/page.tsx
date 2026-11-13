import type { Metadata } from "next";
import BookingsClient from "./BookingsClient";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your Bookings | Appi",
  description: "Review and manage your bookings.",
};

const navigationItems = [
  {
    label: "Explore",
    href: "/",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
  },
  {
    label: "Account",
    href: "/account",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
  },
];

export default function BookingsPage() {
  return (
    <>
    <main className="app-page min-h-screen flex-1 px-4 py-8 sm:px-8 sm:py-12">
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
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8">
          {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-primary">Your Appi activity</p> */}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your bookings</h1>
          {/* <p className="mt-3 max-w-2xl text-sm leading-6 text-app-ink-muted">
            Review massage sessions you have saved on this device.
          </p> */}
        </header>
        <BookingsClient />
      </div>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-app-border bg-app-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(33_21_79/0.08)] backdrop-blur"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">
          {navigationItems.map((item, index) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={index === 0 ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  index === 0
                    ? "text-app-primary"
                    : "text-app-ink-muted hover:text-app-primary"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                >
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
    </>
  );
}
