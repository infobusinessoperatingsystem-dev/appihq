import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Host Workspace | Appi",
  description: "Manage provider availability and incoming sessions on Appi.",
};

const hostViews = [
  {
    href: "/host/availability",
    title: "Availability & settings",
    description: "Set your session length, fee, weekly hours, breaks, and time off.",
    icon: CalendarClock,
  },
  {
    href: "/host/sessions",
    title: "Incoming sessions",
    description: "Review client details, notes, and your upcoming or past sessions.",
    icon: CalendarDays,
  },
];

export default function HostHomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <h2 className="text-xl font-semibold tracking-tight text-app-ink sm:text-2xl">
        Your provider workspace
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-app-ink-muted">
        Manage the times clients can book and keep track of sessions saved on
        this device.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {hostViews.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="app-surface rounded-md border border-app-border p-5 shadow-sm transition-colors hover:border-app-primary sm:p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-app-surface-muted text-app-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold text-app-ink">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-app-ink-muted">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
