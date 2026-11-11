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

export default function TherapistsListClient({
  therapists,
  initialLocation,
}: Props) {
  const categories = useMemo(() => {
    const topRated = [...therapists].sort(
      (a, b) => Number(b.rating) - Number(a.rating),
    );
    const specialists = therapists.filter(
      (t) => t.specialties && t.specialties.length > 0,
    );
    const newTherapists = therapists.filter((t) => t.isNew);
    const available = therapists; // will be filtered by category UI (Kumasi / Accra)
    return [
      {
        key: "available",
        title: "Available at Your Location",
        items: available,
      },
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
          <CategorySection
            key={cat.key}
            title={cat.title}
            items={cat.items}
            categoryKey={cat.key}
          />
        ))}
      </div>
      <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <Link
          className="app-button app-button-primary w-full md:w-60"
          href="/subscribe"
        >
          See More Therapists
        </Link>
        <Link
          className="app-button app-button-secondary w-full md:w-60"
          href="/subscribe"
        >
          Your Bookings
        </Link>
      </div>
    </section>
  );
}

function CategorySection({
  title,
  items,
  categoryKey,
}: {
  title: string;
  items: Therapist[];
  categoryKey: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasRestoredPositionRef = useRef(false);

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
  const positionKey = `therapists.position.${categoryKey}.${activeFilter}`;
  const hasLoadedRef = useRef(false);
  // Load persisted filter for this category on mount
  useEffect(() => {
    let frame: number | undefined;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && filtersForCategory.includes(saved)) {
        frame = requestAnimationFrame(() => setActiveFilter(saved));
      }
    } catch (e) {
      // ignore
    }
    hasLoadedRef.current = true;
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
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
      if (activeFilter === "5★")
        return items.filter((t) => Math.round(Number(t.rating)) === 5);
      if (activeFilter === "4★+")
        return items.filter((t) => Number(t.rating) >= 4);
    }
    if (categoryKey === "specialists") {
      return items.filter((t) =>
        (t.specialties || []).some((s) =>
          s.toLowerCase().includes(activeFilter.toLowerCase()),
        ),
      );
    }
    if (categoryKey === "new") {
      if (activeFilter === "Recent") return items.filter((t) => t.isNew);
    }
    return items;
  }, [items, activeFilter, categoryKey]);

  // Load persisted currentIndex/position for this category (or reset)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current;
      const cards = container?.querySelectorAll<HTMLElement>(
        "[data-therapist-card]",
      );
      if (!container || !cards?.length) {
        hasRestoredPositionRef.current = true;
        return;
      }

      let savedIndex = 0;
      try {
        const saved = localStorage.getItem(positionKey);
        if (saved !== null && !Number.isNaN(Number(saved))) {
          savedIndex = Number(saved);
        }
      } catch (e) {
        // ignore
      }

      const index = Math.min(
        Math.max(savedIndex, 0),
        Math.max(displayedItems.length - 1, 0),
      );
      const cardWidth = cards[0].offsetWidth;
      const cardLeft = index * (cardWidth + 12);
      const left = Math.max(
        0,
        Math.min(
          cardLeft - (container.clientWidth - cardWidth) / 2,
          container.scrollWidth - container.clientWidth,
        ),
      );

      container.scrollTo({ left, behavior: "auto" });
      setCurrentIndex(index);
      hasRestoredPositionRef.current = true;
    });

    return () => cancelAnimationFrame(frame);
  }, [displayedItems.length, positionKey]);

  const clampIndex = (nextIndex: number) =>
    Math.min(Math.max(nextIndex, 0), Math.max(displayedItems.length - 1, 0));

  const scrollToIndex = (nextIndex: number) => {
    const container = scrollRef.current;
    if (!container || displayedItems.length === 0) return;

    const cards = container.querySelectorAll<HTMLElement>(
      "[data-therapist-card]",
    );
    if (!cards.length) return;

    const firstCard = cards[0];
    const gap = 12;
    const cardW = firstCard.offsetWidth + gap;
    const cardLeft = nextIndex * cardW;
    // center the card in the container
    const containerWidth = container.clientWidth;
    const left = Math.max(
      0,
      Math.min(
        cardLeft - (containerWidth - firstCard.offsetWidth) / 2,
        container.scrollWidth - containerWidth,
      ),
    );

    container.scrollTo({
      left,
      behavior: hasRestoredPositionRef.current ? "smooth" : "auto",
    });
    setCurrentIndex(nextIndex);

    // persist position
    try {
      localStorage.setItem(positionKey, String(nextIndex));
    } catch (e) {
      // ignore
    }
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || items.length === 0) return;

    const cards = container.querySelectorAll<HTMLElement>(
      "[data-therapist-card]",
    );
    if (!cards.length) return;

    const firstCard = cards[0];
    const gap = 12;
    const cardWidth = firstCard.offsetWidth + gap;
    const nextIndex = Math.round(container.scrollLeft / cardWidth);
    const clamped = clampIndex(nextIndex);
    setCurrentIndex(clamped);
    // persist live scroll position per active filter
    try {
      localStorage.setItem(positionKey, String(clamped));
    } catch (e) {
      // ignore
    }
  };

  const maxIndex = Math.max(displayedItems.length - 1, 0);
  const canGoPrev = currentIndex > 0 && displayedItems.length > 0;
  const canGoNext = currentIndex < maxIndex && displayedItems.length > 0;

  return (
    <section className="p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToIndex(clampIndex(currentIndex - 1))}
            disabled={!canGoPrev}
            className="app-icon-button disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Previous ${title}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => scrollToIndex(clampIndex(currentIndex + 1))}
            disabled={!canGoNext}
            className="app-icon-button disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Next ${title}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
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
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-none [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] scroll-smooth [&::-webkit-scrollbar]:hidden"
          >
            {displayedItems.map((therapist) => (
              <TherapistCard
                key={therapist.slug}
                therapist={therapist}
                categoryKey={categoryKey}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TherapistCard({
  therapist,
  categoryKey,
}: {
  therapist: Therapist;
  categoryKey: string;
}) {
  const imageList =
    therapist.gallery && therapist.gallery.length > 0
      ? therapist.gallery
      : [therapist.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showPreviousImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageList.length) % imageList.length,
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  return (
    <>
      <article
        data-therapist-card
        className="group flex flex-[0_0_85%] flex-col snap-center overflow-hidden sm:min-w-68.75 sm:max-w-73.75 sm:flex-1"
      >
        <div className="relative block h-112 w-full overflow-hidden rounded-xl border border-app-border bg-app-surface-muted shadow-sm transition-all duration-200 hover:shadow-md">
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

          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/15 to-transparent" />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-x-0 bottom-0 z-20 w-full p-4 pb-3 text-left"
          >
            <div className="mb-1.5 text-[1.05rem] font-semibold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
              {therapist.firstName}, {therapist.age}
            </div>
            <div className="text-[11px] leading-5 text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <CategoryDetails
                therapist={therapist}
                categoryKey={categoryKey}
              />
            </div>
          </button>

          <div className="absolute bottom-3 right-2 z-30">
            <Link
              href={`/therapists-list/${therapist.slug}/book`}
              className="app-button app-button-primary min-h-9 gap-2 rounded-md px-3.5 py-2 text-xs shadow-md"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              >
                <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 14h3m-1.5-1.5v3" />
              </svg>
              Book 
              {/* {therapist.firstName} */}
            </Link>
          </div>
        </div>
      </article>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center">
          <div className="app-surface max-h-[90vh] w-full max-w-md overflow-y-auto rounded-md p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                {/* <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Therapist</p> */}
                <h4 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {therapist.firstName}, {therapist.age}
                </h4>
              </div>
              <button
                type="button"
                aria-label="Close therapist details"
                onClick={() => setIsModalOpen(false)}
                className="app-icon-button"
              >
                ×
              </button>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {imageList.slice(0, 3).map((img, index) => (
                <div
                  key={`${therapist.slug}-modal-${index}`}
                  className="relative h-20 overflow-hidden rounded-lg"
                >
                  <Image
                    src={img}
                    alt={`${therapist.firstName} gallery ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 10rem"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-200">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  About
                </p>
                <p>{therapist.about}</p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-2">
                  {(therapist.specialties || []).map((specialty) => (
                    <span
                      key={`${therapist.slug}-${specialty}`}
                      className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Reviews
                </p>
                <div className="space-y-2">
                  {(therapist.reviews || [])
                    .slice(0, 3)
                    .map((review, index) => (
                      <div
                        key={`${therapist.slug}-review-${index}`}
                        className="rounded-md bg-app-surface-muted p-2"
                      >
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-900 dark:text-zinc-50">
                            {review.author}
                          </span>
                          <span>★ {review.rating}</span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {review.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  From
                </p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {therapist.price}
                </p>
              </div>
              <Link
                href={`/therapists-list/${therapist.slug}/book`}
                onClick={() => setIsModalOpen(false)}
                className="app-button app-button-primary"
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
  if (diffHours > 0)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
}

function CategoryDetails({
  therapist,
  categoryKey,
}: {
  therapist: Therapist;
  categoryKey: string;
}) {
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
            <span>{therapist.location}, GH</span>
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
            <span>
              {therapist.rating} ({therapist.reviewCount} reviews)
            </span>
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
