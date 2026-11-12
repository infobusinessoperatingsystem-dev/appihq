import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-app-border bg-app-surface text-app-ink-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Link href="/" className="app-link font-semibold tracking-tight">
             <h1 className="max-w-xs text-2xl font-semibold leading-10 tracking-tight text-app-ink">
              <span className="italic">App</span>i
            </h1>
          </Link>
          <p className="mt-1 text-xs">At your service!</p>
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/about" className="app-link">About</Link>
          {/* <Link href="/bookings" className="app-link">Your bookings</Link> */}
          <Link href="/terms" className="app-link">Terms</Link>
          {/* <Link href="/terms#therapists" className="app-link">Therapist terms</Link> */}
          <Link href="/terms#privacy" className="app-link">Privacy</Link>
        </nav>
        <div className="text-xs">© {new Date().getFullYear()} Appigh. All rights reserved.</div>
      </div>
    </footer>
  );
}
