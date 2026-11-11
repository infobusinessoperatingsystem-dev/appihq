import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Appi | Appi",
  description: "Learn about Appi's mission to empower independent professionals, starting with massage therapists.",
};

const values = [
  {
    number: "01",
    title: "Ownership",
    description: "Professionals deserve a meaningful share of the value their skills create.",
  },
  {
    number: "02",
    title: "Freedom",
    description: "People should have room to choose how, when, and with whom they work.",
  },
  {
    number: "03",
    title: "Independence",
    description: "A person’s skill can be the foundation for a sustainable livelihood.",
  },
  {
    number: "04",
    title: "Dignity",
    description: "Every honest profession deserves respect, fair treatment, and recognition.",
  },
  {
    number: "05",
    title: "Empowerment",
    description: "Useful tools and access to opportunity can help independent work grow.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen flex-1 overflow-hidden bg-[#f7f5ef] text-[#19152b] dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-[#261a54]/10 bg-white/80 dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-xl font-semibold tracking-tight" aria-label="Appi home"><span className="italic">App</span>i</Link>
          <Link href="/therapists-list" className="text-sm font-medium text-[#30235e] transition hover:text-[#e87514] dark:text-zinc-300 dark:hover:text-orange-300">Find a therapist <span aria-hidden="true">&#8599;</span></Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#21154f] text-white">
        <div aria-hidden="true" className="absolute -right-32 -top-56 size-136 rounded-full border-[5rem] border-white/6" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">Find · Book · Empower</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">Your skills.<br />Your work.<br /><span className="text-orange-400">Your independence.</span></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">We believe people should own more of the value they create. Appi is building practical ways for independent professionals to meet clients and grow on their own terms.</p>
          </div>
          <div className="border-l border-white/25 pl-6 lg:mb-2">
            <span className="text-sm font-semibold text-orange-300">Where we begin</span>
            <p className="mt-3 text-2xl font-medium leading-snug">A better way to find and book massage therapists.</p>
            <p className="mt-3 text-sm leading-6 text-white/65">We are developing Appi step by step. Massage therapists are our first service category; we’ll introduce other categories only when they’re ready.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-3">
        <article className="bg-[#e9e3ff] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4c32a4]">What is Appi?</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">A service marketplace, built with care.</h2>
          <p className="mt-4 text-sm leading-6 text-[#30235e]/80">Appi connects clients with independent professionals. Today, that means discovering massage therapists, learning about their services, and choosing a provider that suits your needs.</p>
        </article>
        <article className="bg-white p-6 sm:p-8 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4c32a4] dark:text-violet-300">Our mission</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Make independent work more possible.</h2>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">To give independent professionals more opportunity, useful tools, and freedom to earn from their skills and build better livelihoods.</p>
        </article>
        <article className="bg-[#f5a20b] p-6 text-[#21154f] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Our vision</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">A more flexible, independent life.</h2>
          <p className="mt-4 text-sm leading-6 text-[#21154f]/80">A world where people can turn their skills into economic independence, financial opportunity, and more control over their working lives.</p>
        </article>
      </section>

      <section className="border-y border-[#261a54]/10 bg-white dark:border-white/10 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e87514]">Our core values</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">A platform should work for people.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">These principles shape how we build Appi and how we expect people to treat one another here.</p>
          </div>
          <div className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value) => (
              <article key={value.number} className="border-t border-[#261a54]/20 py-5 dark:border-white/20">
                <span className="text-xs font-semibold text-[#e87514]">{value.number}</span>
                <h3 className="mt-3 text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4c32a4] dark:text-violet-300">For clients</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Find care that fits your day.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-400">Explore massage therapist profiles, compare the services they offer, and choose a session based on your preferences, location, and availability. Appi helps with discovery; each therapist remains an independent provider.</p>
        </div>
        <div className="border-t-2 border-[#f5a20b] pt-5 md:border-l-2 md:border-t-0 md:pl-8 md:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4c32a4] dark:text-violet-300">For massage therapists</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Build your work on your terms.</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 dark:text-zinc-400">Appi is being developed to help massage therapists present their services and connect with people looking for massage care. Therapists remain independent and set their own professional approach, subject to applicable requirements and platform terms.</p>
        </div>
      </section>

      <section className="bg-[#21154f] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/65">Appi — Empowering independent professionals</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">For a more independent tomorrow.</h2>
          </div>
          <Link href="/therapists-list" className="inline-flex min-h-12 items-center justify-center bg-[#f5a20b] px-5 text-sm font-semibold text-[#21154f] transition hover:bg-orange-300">Browse massage therapists <span aria-hidden="true" className="ml-2">&#8599;</span></Link>
        </div>
      </section>
    </main>
  );
}
