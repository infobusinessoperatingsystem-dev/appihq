import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "../favorite-button";
import { getTherapistBySlug, therapists } from "../therapists";
import { BookButton, ShareButton } from "./profile-actions";

type TherapistProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export function generateStaticParams() {
  return therapists.map((therapist) => ({
    slug: therapist.slug,
  }));
}

export async function generateMetadata({
  params,
}: TherapistProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const therapist = getTherapistBySlug(slug);

  if (!therapist) {
    return {
      title: "Therapist Not Found | Appi",
    };
  }

  return {
    title: `${therapist.firstName}, ${therapist.age} | Appi`,
    description: `View ${therapist.firstName}'s massage therapist profile, specialties, gallery, and booking details on Appi.`,
  };
}

export default async function TherapistProfilePage({
  params,
}: TherapistProfilePageProps) {
  const { slug } = await params;
  const therapist = getTherapistBySlug(slug);

  if (!therapist) {
    notFound();
  }

  return (
    <main className="app-page min-h-screen font-sans">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6 sm:max-w-lg">

        <article className="app-surface overflow-hidden rounded-md shadow-xl">
          <div className="relative aspect-[4/3.55] overflow-hidden bg-zinc-200 dark:bg-zinc-900">
            <Image
              src={therapist.image}
              alt={`${therapist.firstName}, Appi massage therapist`}
              fill
              priority
              sizes="(min-width: 640px) 32rem, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
              <Link
                href="/therapists-list"
                aria-label="Back to therapist list"
                className="app-icon-button-overlay"
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

              <div className="flex items-center gap-3">
                <ShareButton therapistName={therapist.firstName} />
                <FavoriteButton therapistName={therapist.firstName} />
              </div>
            </div>

            <div className="absolute bottom-5 left-5 rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
              {therapist.distance}
            </div>
          </div>

          <div className="-mt-5 rounded-t-md bg-app-surface px-5 pb-5 pt-6">
            <section aria-labelledby="profile-name">
              <h2
                id="profile-name"
                className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
              >
                {therapist.firstName}, {therapist.age}
              </h2>

              <div className="mt-3 flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-app-accent" aria-hidden="true">
                    ★
                  </span>
                  <span>
                    {therapist.rating} ({therapist.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4 text-app-success"
                    fill="currentColor"
                  >
                    <path d="M12 2 4.5 5.2v5.7c0 4.7 3.2 9.1 7.5 10.1 4.3-1 7.5-5.4 7.5-10.1V5.2L12 2Zm3.5 8.4-4.2 4.2-2.1-2.1 1.1-1.1 1 1 3.1-3.1 1.1 1.1Z" />
                  </svg>
                  <span>Verified Therapist</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{therapist.experience}</span>
                </div>
              </div>
            </section>

            <section className="mt-6" aria-labelledby="specialties">
              <h3 id="specialties" className="text-base font-semibold">
                Specialties
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {therapist.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="rounded-md bg-app-surface-muted px-3 py-2 text-xs font-semibold text-app-ink"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-5" aria-label="Visit location options">
              <div className="grid grid-cols-3 overflow-hidden rounded-md border border-app-border bg-app-surface shadow-sm">
                {therapist.visitTypes.map((visitType) => (
                  <div
                    key={visitType}
                    className="flex items-center justify-center gap-2 border-r border-app-border px-2 py-4 text-xs font-semibold last:border-r-0"
                  >
                    <VisitTypeIcon visitType={visitType} />
                    <span>{visitType}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6" aria-labelledby="about">
              <h3 id="about" className="text-base font-semibold">
                About {therapist.firstName}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {therapist.about}
              </p>
            </section>

            <section className="mt-6" aria-labelledby="gallery">
              <h3 id="gallery" className="text-base font-semibold">
                Gallery
              </h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {therapist.gallery.map((image, index) => (
                  <div
                    key={image}
                    className="relative aspect-4/3 overflow-hidden rounded-md bg-app-surface-muted"
                  >
                    <Image
                      src={image}
                      alt={`${therapist.firstName} gallery image ${index + 1}`}
                      fill
                      sizes="9rem"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6" aria-labelledby="reviews">
              <h3 id="reviews" className="text-base font-semibold">
                Reviews
              </h3>
              <div className="mt-3 space-y-4">
                {therapist.reviews && therapist.reviews.length > 0 ? (
                  therapist.reviews.map((r, i) => (
                    <div key={i} className="rounded-md border border-app-border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{r.author}</p>
                          {r.date && <p className="text-xs text-zinc-500">{r.date}</p>}
                        </div>
                        <div className="font-semibold text-app-accent">★ {r.rating}</div>
                      </div>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">No reviews yet.</p>
                )}
              </div>
            </section>
          </div>

          <footer className="sticky bottom-0 grid grid-cols-[1fr_auto] items-center gap-4 border-t border-app-border bg-app-surface/95 px-5 py-4 backdrop-blur">
            <div>
              <p className="text-xl font-semibold tracking-tight">
                {therapist.price}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {therapist.duration}
              </p>
            </div>
            <BookButton therapistName={therapist.firstName} therapistSlug={therapist.slug} />
          </footer>
        </article>
      </section>
    </main>
  );
}

function VisitTypeIcon({ visitType }: { visitType: string }) {
  if (visitType === "Hotel") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M3 21h18" />
        <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
        <path d="M9 8h1" />
        <path d="M14 8h1" />
        <path d="M9 12h1" />
        <path d="M14 12h1" />
      </svg>
    );
  }

  if (visitType === "Office") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
        <rect width="18" height="14" x="3" y="6" rx="2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}
