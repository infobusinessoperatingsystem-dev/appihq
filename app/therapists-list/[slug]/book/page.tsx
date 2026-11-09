import BookingClient from "../../BookingClient";
export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <main className="min-h-screen flex-1 bg-[#f7f5ef] font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-300">Personal care, on your time</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Book your massage</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Choose a treatment, a location, and a time that works for you.</p>
        </div>
        <BookingClient />
      </div>
    </main>
  );
}
