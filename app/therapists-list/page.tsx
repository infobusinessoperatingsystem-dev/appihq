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
    <main className="app-page min-h-screen font-sans">
    <header className="border-b border-app-border bg-app-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            aria-label="Back to Appi home"
            className="app-icon-button border-0 bg-transparent"
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
            href="/bookings"
            aria-label="View your bookings"
            className="app-button app-button-brand"
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
