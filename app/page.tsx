import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          <span className="italic">App</span>i
        </h1>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/5 p-3 sm:items-center md:hidden">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-col items-center gap-0 text-center sm:items-start sm:text-left">
                <h1 className="max-w-sm text-xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                  Get the massage you need!{" "}
                </h1>
                <p className="max-w-md text-base leading-8 text-zinc-600 dark:text-zinc-400">
                  Anywhere. Anytime.{" "}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <Link
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-59.5"
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
