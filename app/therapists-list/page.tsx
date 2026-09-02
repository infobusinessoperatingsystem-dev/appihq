import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./favorite-button";
import { therapists } from "./therapists";
import TherapistsListClient from "./TherapistsListClient";

export const metadata: Metadata = {
  title: "Available Therapists | Appi",
  description:
    "Browse available massage therapists on Appi without creating an account.",
};

export default function TherapistsListPage() {
  return (
    <main className="min-h-screen bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-900 dark:bg-black">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            aria-label="Back to Appi home"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-transparent text-sm font-medium text-foreground transition-colors hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black dark:hover:text-zinc-300 dark:focus:ring-white"
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

          <Link
            href="#"
            aria-label="Back to Appi home"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:hover:bg-zinc-200 dark:focus:ring-white"
          >
            Bookings
            {/* <span>
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
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span> */}
          </Link>
        </div>
      </header>

      <TherapistsListClient therapists={therapists} initialLocation="New York, NY" />
    </main>
  );
}
