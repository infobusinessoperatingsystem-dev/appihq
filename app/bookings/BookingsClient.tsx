"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deleteSavedBooking, readSavedBookings, type SavedBooking } from "../booking-data";
import { formatGhs } from "../money";

type BookingFilter = "all" | "upcoming" | "past";

const filters: { id: BookingFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

function todayAsIsoDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

export default function BookingsClient() {
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [filter, setFilter] = useState<BookingFilter>("all");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [bookingToRemove, setBookingToRemove] = useState<SavedBooking | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setBookings(readSavedBookings());
      setHasLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const visibleBookings = useMemo(() => {
    const today = todayAsIsoDate();
    return bookings
      .filter((booking) => {
        if (filter === "upcoming") return booking.date >= today;
        if (filter === "past") return booking.date < today;
        return true;
      })
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  }, [bookings, filter]);

  function confirmRemoveBooking() {
    if (!bookingToRemove) return;
    setBookings(deleteSavedBooking(bookingToRemove.id));
    setBookingToRemove(null);
  }

  if (!hasLoaded) {
    return <p className="app-surface rounded-md p-6 text-sm text-app-ink-muted">Loading saved bookings…</p>;
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{bookings.length} saved {bookings.length === 1 ? "booking" : "bookings"}</p>
          {/* <p className="mt-1 text-xs text-app-ink-muted">Stored in this browser</p> */}
        </div>
        <div role="group" aria-label="Filter bookings" className="flex gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`app-button min-h-10 px-3 text-xs ${filter === item.id ? "app-button-brand" : "app-button-secondary"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {visibleBookings.length > 0 ? (
        <ul className="space-y-3">
          {visibleBookings.map((booking) => {
            const isUpcoming = booking.date >= todayAsIsoDate();
            return (
              <li key={booking.id}>
                <article className="app-surface rounded-md p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold">{booking.treatment}</h2>
                        <span className="rounded-full bg-app-surface-muted px-2.5 py-1 text-xs font-medium text-app-primary">
                          {isUpcoming ? "Upcoming" : "Past"}
                        </span>
                        {/* <span className="rounded-full border border-app-border px-2.5 py-1 text-xs text-app-ink-muted">Demo · local only</span> */}
                      </div>
                      <p className="mt-1 text-sm text-app-ink-muted">With {booking.therapistName} · {booking.durationMinutes} mins</p>
                      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-xs text-app-ink-muted">Date and time</dt>
                          <dd className="mt-1 font-medium">{formatDate(booking.date)} at {formatTime(booking.time)}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-app-ink-muted">Location</dt>
                          <dd className="mt-1 font-medium capitalize">{booking.serviceLocation}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-app-ink-muted">Address / venue</dt>
                          <dd className="mt-1 wrap-break-word font-medium">{booking.locationDetails}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-app-border pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                      <p className="text-lg font-semibold">{formatGhs(booking.price)}</p>
                      <div className="flex gap-2">
                        <Link href={`/therapists-list/${booking.therapistSlug}/book?repeat=${encodeURIComponent(booking.id)}`} className="app-button app-button-primary min-h-10 px-3 text-xs">
                          Book again
                        </Link>
                        <button type="button" onClick={() => setBookingToRemove(booking)} className="app-button app-button-secondary min-h-10 px-3 text-xs">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <section className="app-surface rounded-md px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-app-surface-muted text-app-primary">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
              <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold">{filter === "all" ? "No saved bookings yet" : `No ${filter} bookings`}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-app-ink-muted">
            {filter === "all" ? "When you review and confirm a massage selection, it will appear here on this device." : "Try another filter or browse therapists to plan a massage."}
          </p>
          <Link href="/therapists-list" className="app-button app-button-primary mt-5">
            Browse therapists
          </Link>
        </section>
      )}

      {/* <p className="mt-5 text-xs leading-5 text-app-ink-muted">
        These demo bookings are saved only in this browser. They are not sent to therapists and will not sync to another device.
      </p> */}

      {bookingToRemove ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center"
          onClick={() => setBookingToRemove(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setBookingToRemove(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-booking-title"
            aria-describedby="remove-booking-description"
            className="app-surface w-full max-w-md rounded-md p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="remove-booking-title" className="text-xl font-semibold">
              Remove this booking?
            </h2>
            <p id="remove-booking-description" className="mt-2 text-sm leading-6 text-app-ink-muted">
              This will remove your {bookingToRemove.treatment} booking with{" "}
              {bookingToRemove.therapistName} from this device.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                autoFocus
                onClick={() => setBookingToRemove(null)}
                className="app-button app-button-secondary"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={confirmRemoveBooking}
                className="app-button app-button-primary"
              >
                Remove booking
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
