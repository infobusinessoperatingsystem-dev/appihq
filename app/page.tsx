import type { Metadata } from "next";
import Link from "next/link";
import TherapistsListClient from "./therapists-list/TherapistsListClient";
import { therapists } from "./therapists-list/therapists";
import ProviderDropdown from "./therapists-list/ProviderDropdown";

export const metadata: Metadata = {
  title: "Appi | At your service!",
  description: "Find a massage therapist on Appi.",
};

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

    </main>
  );
}
