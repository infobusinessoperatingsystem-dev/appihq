"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSavedBooking, type SavedBooking } from "../booking-data";
import { formatGhs } from "../money";

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
}

export default function BookingConfirmationClient({ bookingId }: { bookingId?: string }) {
  const [booking, setBooking] = useState<SavedBooking | null | undefined>(undefined);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setBooking(bookingId ? readSavedBooking(bookingId) ?? null : null);
    });
    return () => cancelAnimationFrame(frame);
  }, [bookingId]);

  if (booking === undefined) {
    return <p className="text-center text-sm text-app-ink-muted">Loading your booking summary…</p>;
  }

  return (
    <section className="confirmation-panel app-surface mt-6 rounded-md p-6 shadow-sm sm:p-10">
      <div className="confirmation-mark mx-auto flex size-26 items-center justify-center rounded-full bg-app-surface-muted text-app-success">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="confirmation-check size-16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>

      <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        {booking ? "Booking confirmed" : "Booking not found"}
      </h1>

      {booking ? (
        <>
          <p className="mt-2 text-center text-app-ink-muted">Your therapist will contact you shortly before your scheduled appointment.<br /> Have a great session ahead!</p>
          <dl className="mt-7 divide-y divide-app-border rounded-md border border-app-border px-4">
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Therapist</dt>
              <dd className="font-medium">{booking.therapistName}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Treatment</dt>
              <dd className="font-medium">{booking.treatment} · {booking.durationMinutes} mins</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Service type</dt>
              <dd className="font-medium capitalize">{booking.serviceLocation}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Address / venue</dt>
              <dd className="max-w-sm text-right font-medium">{booking.locationDetails}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Date and time</dt>
              <dd className="font-medium">{formatDate(booking.date)} at {formatTime(booking.time)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Total</dt>
              <dd className="text-base font-semibold">{formatGhs(booking.price)}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="mt-3 text-center leading-7 text-app-ink-muted">
          This booking is missing. Start a new booking or check your saved bookings.
        </p>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/bookings" className="app-button app-button-primary">Your bookings</Link>
        <Link href="/" className="app-button app-button-secondary">Browse therapists</Link>
      </div>
    </section>
  );
}
