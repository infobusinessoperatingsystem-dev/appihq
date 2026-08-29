import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./favorite-button";
import { therapists } from "./therapists";

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
            Request a Massage
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-2 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {therapists.map((therapist) => (
            <article
              key={therapist.firstName}
              className="group relative overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-900 dark:bg-zinc-950"
            >
              <Link
                href={`/therapists-list/${therapist.slug}`}
                aria-label={`View ${therapist.firstName}'s therapist profile`}
                className="block"
              >
                <div className="relative aspect-[4/6] overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                  <Image
                    src={therapist.image}
                    alt={`${therapist.firstName}, Appi massage therapist`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-16">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {therapist.firstName}, {therapist.age}
                    </h2>
                  </div>
                </div>
              </Link>
              <div className="absolute right-3 top-3 z-10">
                <FavoriteButton therapistName={therapist.firstName} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
