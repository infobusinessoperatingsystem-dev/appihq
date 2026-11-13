import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTherapistBySlug } from "../../therapists";

type TherapistReportPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TherapistReportPageProps): Promise<Metadata> {
  const { slug } = await params;
  const therapist = getTherapistBySlug(slug);

  return {
    title: therapist
      ? `Report ${therapist.firstName} | Appi`
      : "Report a therapist | Appi",
  };
}

export default async function TherapistReportPage({
  params,
}: TherapistReportPageProps) {
  const { slug } = await params;
  const therapist = getTherapistBySlug(slug);
  if (!therapist) notFound();

  return (
    <main className="app-page min-h-screen flex-1 px-5 py-10 sm:px-8 sm:py-16">
      <Link
        href="/"
        aria-label="Back to Appi home"
        className="app-icon-button mb-4 border-0 bg-transparent"
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
      <div className="mx-auto max-w-xl">
        <section className="app-surface mt-6 rounded-xl p-6 sm:p-8">
          <p className="text-sm font-semibold text-app-primary">Appi safety</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Report {therapist.firstName}
          </h1>
          <p className="mt-3 leading-7 text-app-ink-muted">
            Reporting tools are not available yet. We’re working on a way to
            report a profile directly to Appi.
          </p>
          {/* <Link
            href={`/therapists-list/${therapist.slug}`}
            className="app-button app-button-secondary mt-6"
          >
            Return to {therapist.firstName}&apos;s profile
          </Link> */}
        </section>
      </div>
    </main>
  );
}
