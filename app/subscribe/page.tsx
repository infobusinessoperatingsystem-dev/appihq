import type { Metadata } from "next";
import Link from "next/link";
import { formatGhs } from "../money";

export const metadata: Metadata = {
  title: "Appi Membership | Appi",
  description: "Unlock the full Appi massage experience with an annual membership.",
};

const benefits = [
  {
    title: "Priority access",
    description: "See new therapist availability and peak-time openings first.",
    icon: "calendar",
  },
  {
    title: "Member-only rates",
    description: "Get better value across your massage bookings throughout the year.",
    icon: "sparkle",
  },
  {
    title: "A better fit, faster",
    description: "Use your preferences and saved therapists to book with less searching.",
    icon: "heart",
  },
  {
    title: "Flexible booking",
    description: "Book trusted care at a location and time that works for you.",
    icon: "pin",
  },
];

function BenefitIcon({ name }: { name: string }) {
  if (name === "calendar") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
      </svg>
    );
  }

  if (name === "sparkle") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        <path d="M20.8 8.7c0 5.4-8.8 10.4-8.8 10.4S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function SubscribePage() {
  return (
    <main className="app-page min-h-screen overflow-hidden">
      <header className="border-b border-app-border bg-app-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="app-link text-xl font-semibold tracking-tight" aria-label="Back to Appi home">
            <span className="italic">App</span>i
          </Link>
          <Link href="/" className="app-link inline-flex items-center gap-2 text-sm font-medium">
            Browse therapists
            <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-20">
        <section>
          {/* <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#b34a2b]">Appi membership</p> */}
          <h1 className="max-w-2xl text-2xl text-center font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
            See photos of 10+ <br /> available therapists now
          </h1>
          {/* <p className="mt-7 max-w-xl text-lg leading-8 text-[#20211d]/65 sm:text-xl">
            One simple membership for easier access to the therapists, treatments, and time slots that fit your life.
          </p> */}
          <p className="mt-5 text-center max-w-md text-sm leading-6">
            ...and get notified when even more new ones join.
          </p>
{/* 
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t border-[#20211d]/15 pt-4">
                <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-[#d9e3d2] text-[#31543d]">
                  <BenefitIcon name={benefit.icon} />
                </div>
                <h2 className="text-base font-semibold">{benefit.title}</h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[#20211d]/60">{benefit.description}</p>
              </div>
            ))}
          </div> */}
        </section>

        <aside id="payment" className="relative rounded-md bg-app-brand p-6 text-white shadow-xl sm:p-8">
          <div className="mt-2 flex items-end justify-center gap-2 border-b border-white/20 pb-7">
            <span className="text-5xl font-semibold tracking-[-0.04em]">{formatGhs(750)}</span>
            <span className="mb-2 text-sm text-white/65">/ year</span>
          </div>

          <div className="space-y-4 py-7 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/65">Membership</span>
              <span>{formatGhs(750)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/65">Billing</span>
              <span>Once yearly</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/20 pt-4 font-semibold">
              <span>Total today</span>
              <span>{formatGhs(750)}</span>
            </div>
          </div>

          <Link href="/" className="app-button app-button-primary w-full">
            Start your membership
          </Link>
          <p className="mt-2 text-center text-xs leading-5 text-white/65">No name or phone number required.</p>
        </aside>
      </div>

      {/* <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 border-t border-[#20211d]/10 px-5 py-6 text-xs text-[#20211d]/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span>Massage care, made more personal.</span>
        <Link href="/" className="font-medium text-[#20211d]/70 hover:text-[#20211d]">Back to Appi</Link>
      </footer> */}
    </main>
  );
}
