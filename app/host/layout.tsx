import type { ReactNode } from "react";
import Link from "next/link";
import HostNav from "./HostNav";

export default function HostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-page min-h-screen flex-1">
      <header className="border-b border-app-border bg-app-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
          <Link href="/" className="app-link text-sm font-medium">
            ← Back to Appi
          </Link>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
              Provider workspace
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-app-ink sm:text-3xl">
              Host tools
            </h1>
          </div>
          <HostNav />
        </div>
      </header>
      {children}
    </div>
  );
}
