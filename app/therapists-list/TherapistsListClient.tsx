"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Therapist } from "./therapists";

type Props = {
  therapists: Therapist[];
  initialLocation?: string;
};

const PAGE_SIZE = 3;

export default function TherapistsListClient({ therapists, initialLocation }: Props) {
  const categories = useMemo(() => {
    const topRated = [...therapists].sort((a, b) => Number(b.rating) - Number(a.rating));
    const specialists = therapists.filter((t) => t.specialties && t.specialties.length > 0);
    const newTherapists = therapists.filter((t) => t.isNew);
    const available = therapists; // will be filtered by category UI (Kumasi / Accra)
    return [
      { key: "available", title: "Available at Your Location", items: available },
      // { key: "top", title: "Top Rated", items: topRated },
      // { key: "specialists", title: "Specialists", items: specialists },
      // { key: "new", title: "Most Recent & Newest Therapists", items: newTherapists },
    ];
  }, [therapists]);

  return (
    <section className="mx-auto w-full max-w-6xl px-2 pt-4 pb-8 sm:px-8 sm:py-10">
      {/* No global location selector — per-category filters are shown in each section */}

      <div className="space-y-6">
        {categories.map((cat) => (
          <CategorySection key={cat.key} title={cat.title} items={cat.items} categoryKey={cat.key} />
        ))}
      </div>
    </section>
  );
}

function CategorySection({ title, items, categoryKey }: { title: string; items: Therapist[]; categoryKey: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filtersForCategory = useMemo(() => {
    switch (categoryKey) {
      case "available":
        return ["All", "Kumasi", "Accra"];
      case "top":
        return ["All", "5★", "4★+"];
      case "specialists":
        return ["All", "Sports", "Deep Tissue"];
      case "new":
        return ["All", "Recent"];
      default:
        return ["All"];
    }
  }, [categoryKey]);

  const storageKey = `therapists.filter.${categoryKey}`;
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const hasLoadedRef = useRef(false);

  // Load persisted filter for this category on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && filtersForCategory.includes(saved)) {
        setActiveFilter(saved);
      }
    } catch (e) {
      // ignore
    }
    hasLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist when activeFilter changes after initial load
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    try {
      localStorage.setItem(storageKey, activeFilter);
    } catch (e) {
      // ignore
    }
  }, [activeFilter, storageKey]);

  const displayedItems = useMemo(() => {
    if (activeFilter === "All") return items;
    if (categoryKey === "available") {
      return items.filter((t) => t.location === activeFilter);
    }
    if (categoryKey === "top") {
      if (activeFilter === "5★") return items.filter((t) => Math.round(Number(t.rating)) === 5);
      if (activeFilter === "4★+") return items.filter((t) => Number(t.rating) >= 4);
    }
    if (categoryKey === "specialists") {
      return items.filter((t) => (t.specialties || []).some((s) => s.toLowerCase().includes(activeFilter.toLowerCase())));
    }
    if (categoryKey === "new") {
      if (activeFilter === "Recent") return items.filter((t) => t.isNew);
    }
    return items;
  }, [items, activeFilter, categoryKey]);

  useEffect(() => {
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [displayedItems]);

  const clampIndex = (nextIndex: number) => Math.min(Math.max(nextIndex, 0), Math.max(displayedItems.length - 1, 0));

  const scrollToIndex = (nextIndex: number) => {
    const container = scrollRef.current;
    if (!container || displayedItems.length === 0) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-therapist-card]");
    if (!cards.length) return;

    const firstCard = cards[0];
    const gap = 12;
    const left = nextIndex * (firstCard.offsetWidth + gap);

    container.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(nextIndex);
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-therapist-card]");
    if (!cards.length) return;

    const firstCard = cards[0];
    const gap = 12;
    const cardWidth = firstCard.offsetWidth + gap;
    const nextIndex = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(clampIndex(nextIndex));
  };

  const maxIndex = Math.max(displayedItems.length - 1, 0);
  const canGoPrev = currentIndex > 0 && displayedItems.length > 0;
  const canGoNext = currentIndex < maxIndex && displayedItems.length > 0;

  return (
    <section 
    className="p-2 sm:p-4 md:p-6 lg:p-8"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToIndex(clampIndex(currentIndex - 1))}
            disabled={!canGoPrev}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
              !canGoPrev ? "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
            aria-label={`Previous ${title}`}
          >
            ‹
          </button>
          <button
            onClick={() => scrollToIndex(clampIndex(currentIndex + 1))}
            disabled={!canGoNext}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${
              !canGoNext ? "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            }`}
            aria-label={`Next ${title}`}
          >
            ›
          </button>
        </div>
      </div>
          {/* Category filter buttons (horizontal) */}
        {/* <div>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtersForCategory.map((f) => (
              <button
                key={f}
                onClick={() => {
                  setActiveFilter(f);
                  setCurrentIndex(0);
                  if (scrollRef.current) scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-sm border ${activeFilter === f ? "bg-foreground text-background border-foreground" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"}`}
              >
                {f}
              </button>
            ))}
          </div>

        </div> */}

      <div className="overflow-hidden">
        {displayedItems.length === 0 ? (
          <p className="text-sm text-zinc-500">No therapists found.</p>
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scroll-behavior:smooth] [&::-webkit-scrollbar]:hidden"
          >
            {displayedItems.map((therapist) => (
              <TherapistCard key={therapist.slug} therapist={therapist} categoryKey={categoryKey} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TherapistCard({ therapist, categoryKey }: { therapist: Therapist; categoryKey: string }) {
  const imageList = therapist.gallery && therapist.gallery.length > 0 ? therapist.gallery : [therapist.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <>
      <article
        data-therapist-card
        className="group flex min-w-[275px] max-w-[295px] snap-start flex-1 flex-col overflow-hidden"
      >
        <div className="relative block h-95 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
          <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-1 p-2">
            {imageList.map((_, index) => (
              <span
                key={`${therapist.slug}-indicator-${index}`}
                className={`h-0.5 flex-1 rounded-full transition-all ${index === currentImageIndex ? "bg-white" : "bg-white/35"}`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label={`Previous image for ${therapist.firstName}`}
            onClick={showPreviousImage}
            className="absolute inset-y-0 left-0 z-10 w-1/2 cursor-pointer bg-transparent"
          />
          <button
            type="button"
            aria-label={`Next image for ${therapist.firstName}`}
            onClick={showNextImage}
            className="absolute inset-y-0 right-0 z-10 w-1/2 cursor-pointer bg-transparent"
          />

          <Image
            src={imageList[currentImageIndex]}
            alt={therapist.firstName}
            fill
            sizes="(min-width: 768px) 14rem, 70vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent" />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-x-0 bottom-0 z-20 w-full p-4 pb-3 text-left"
          >
            <div className="mb-1.5 text-[1.05rem] font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {therapist.firstName}, {therapist.age}
            </div>
            <div className="text-[11px] leading-5 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <CategoryDetails therapist={therapist} categoryKey={categoryKey} />
            </div>
          </button>

          <div className="absolute top-3 right-2 z-30">
            <Link
              href={`/therapists-list/${therapist.slug}/book`}
              className="inline-flex items-center justify-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-black dark:bg-black/85 dark:text-zinc-50 dark:ring-white/15 dark:hover:bg-black dark:focus:ring-white"
            >
              Book {therapist.firstName}
            </Link>
          </div>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Therapist</p>
                <h4 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {therapist.firstName}, {therapist.age}
                </h4>
              </div>
              <button
                type="button"
                aria-label="Close therapist details"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ×
              </button>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {imageList.slice(0, 3).map((img, index) => (
                <div key={`${therapist.slug}-modal-${index}`} className="relative h-20 overflow-hidden rounded-lg">
                  <Image src={img} alt={`${therapist.firstName} gallery ${index + 1}`} fill sizes="(max-width: 768px) 33vw, 10rem" className="object-cover" />
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-200">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">About</p>
                <p>{therapist.about}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {(therapist.specialties || []).map((specialty) => (
                    <span key={`${therapist.slug}-${specialty}`} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">Reviews</p>
                <div className="space-y-2">
                  {(therapist.reviews || []).slice(0, 3).map((review, index) => (
                    <div key={`${therapist.slug}-review-${index}`} className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-900">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-900 dark:text-zinc-50">{review.author}</span>
                        <span>★ {review.rating}</span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">From</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{therapist.price}</p>
              </div>
              <Link
                href={`/therapists-list/${therapist.slug}/book`}
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Book {therapist.firstName}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function formatJoinedLabel(joinedAt?: string) {
  if (!joinedAt) return "Joined recently";

  const diffMs = Date.now() - new Date(joinedAt).getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
}

function CategoryDetails({ therapist, categoryKey }: { therapist: Therapist; categoryKey: string }) {
  switch (categoryKey) {
    case "available":
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span>
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
  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
  <circle cx="12" cy="10" r="2.5" />
</svg>
            </span>
            <span>{therapist.location}, GH
            </span>
          </div>
        </div>
      );
    case "top":
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span>
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
  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
</svg>
            </span>
            <span>{therapist.rating} ({therapist.reviewCount} reviews)</span>
          </div>
        </div>
      );
    case "specialists":
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span>
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
  <path d="M7 11V5a1.5 1.5 0 0 1 3 0v5" />
  <path d="M10 10V3.5a1.5 1.5 0 0 1 3 0V10" />
  <path d="M13 10V5a1.5 1.5 0 0 1 3 0v6" />
  <path d="M16 11V7.5a1.5 1.5 0 0 1 3 0v6.2a6 6 0 0 1-6 6.3h-1.5a6 6 0 0 1-5.2-3L4 13.5a1.5 1.5 0 0 1 2.6-1.5L9 15" />
  <path d="m19 2 .5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5L19 2Z" />
</svg>
            </span>
            <span>{therapist.specialty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>
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
  <circle cx="12" cy="12" r="9" />
  <path d="M12 7v5l3 2" />
</svg>
            </span>
            <span>{therapist.experience}</span>
          </div>
        </div>
      );
    case "new":
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span>
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
  <path d="M12 3 4 7v5c0 4.5 3.4 7.7 8 9 4.6-1.3 8-4.5 8-9V7l-8-4Z" />
  <path d="M12 8v6" />
  <path d="M9 11h6" />
</svg>
            </span>
            <span>Joined {formatJoinedLabel(therapist.joinedAt)}</span>
          </div>
        </div>
      );
  }
}
