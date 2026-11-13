import type { Metadata } from "next";
import Link from "next/link";
import TherapistsListClient from "./therapists-list/TherapistsListClient";
import { therapists } from "./therapists-list/therapists";
import ProviderDropdown from "./therapists-list/ProviderDropdown";

export const metadata: Metadata = {
  title: "Appi | At your service!",
  description: "Find a massage therapist on Appi.",
};

const navigationItems = [
  {
    label: "Explore",
    href: "/therapists-list",
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

export default function Home() {
  return (
    <main className="app-page flex min-h-screen flex-1 flex-col font-sans">
        <header className="border-b border-app-border bg-app-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" aria-label="Appi home" className="app-link text-2xl font-semibold tracking-tight">
            <span className="italic">App</span>i
          </Link>

          <ProviderDropdown />
        </div>
      </header>

      <div className="app-page min-h-screen font-sans">
        <TherapistsListClient therapists={therapists} initialLocation="Ghana, GH" />
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
  );
}
