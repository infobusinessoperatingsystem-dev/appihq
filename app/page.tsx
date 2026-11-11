import Link from "next/link";

export default function Home() {
  return (
        <div className="app-page flex flex-1 flex-col items-center justify-center font-sans">
      <div className="flex w-full p-4">
          <h1 className="max-w-xs text-2xl font-semibold leading-10 tracking-tight text-app-ink">
          <span className="italic">App</span>i
        </h1>
      </div>
      <main className="app-surface flex w-full max-w-3xl flex-1 flex-col items-center justify-between px-5 py-24 sm:items-start sm:px-16 sm:py-32">
        {/* <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          <span className="italic">App</span>i
        </h1> */}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/5 p-3 sm:items-center md:hidden">
            <div className="app-surface max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md p-5 shadow-2xl sm:p-6">
              <div className="flex flex-col items-center gap-0 text-center sm:items-start sm:text-left">
                <h1 className="max-w-sm text-xl font-semibold leading-10 tracking-tight text-app-ink">
                  Get a Massage!{" "}
                </h1>
                <p className="max-w-md text-base leading-8 text-app-ink-muted">
                  Your place. Your time. Your choice{" "}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-app-border pt-4">
                <Link
                  className="app-button app-button-primary w-full md:w-60"
                  href="/therapists-list"
                >
                  See Available Therapists
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
