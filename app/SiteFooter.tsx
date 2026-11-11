import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Link href="/" className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Appi
          </Link>
          <p className="mt-1 text-xs">Massage care, made more personal.</p>
        </div>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/about" className="transition hover:text-zinc-950 dark:hover:text-white">About</Link>
          <Link href="/terms#clients" className="transition hover:text-zinc-950 dark:hover:text-white">Client terms</Link>
          <Link href="/terms#therapists" className="transition hover:text-zinc-950 dark:hover:text-white">Therapist terms</Link>
          <Link href="/terms#privacy" className="transition hover:text-zinc-950 dark:hover:text-white">Privacy</Link>
        </nav>
        <p className="text-xs">© {new Date().getFullYear()} Appi</p>
      </div>
    </footer>
  );
}
