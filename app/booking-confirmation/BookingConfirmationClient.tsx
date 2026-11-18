"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Check } from "lucide-react";
import { isSavedBooking, type SavedBooking } from "../booking-data";
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
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const frame = requestAnimationFrame(() => {
      void (async () => {
        setBooking(undefined);
        setLoadError("");

        if (!bookingId) {
          setBooking(null);
          return;
        }

        let token: string | null;
        try {
          token = window.sessionStorage.getItem(
            `appi.booking-confirmation-token.${bookingId}`,
          );
        } catch {
          setLoadError(
            "We couldn’t access the secure confirmation for this booking in this browser session.",
          );
          return;
        }

        if (!token) {
          setBooking(null);
          return;
        }

        try {
          const response = await fetch(
            `/api/bookings/${encodeURIComponent(bookingId)}/confirmation`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmationToken: token }),
              cache: "no-store",
              signal: controller.signal,
            },
          );
          const result: unknown = await response.json();

          if (!response.ok) {
            if (response.status === 404) {
              setBooking(null);
              return;
            }
            throw new Error(
              result &&
                typeof result === "object" &&
                "error" in result &&
                typeof result.error === "string"
                ? result.error
                : "Booking details are temporarily unavailable.",
            );
          }

          if (
            !result ||
            typeof result !== "object" ||
            !("booking" in result) ||
            !isSavedBooking(result.booking)
          ) {
            throw new Error("The booking details returned by the server are invalid.");
          }

          setBooking(result.booking);
        } catch (error) {
          if (controller.signal.aborted) return;
          setLoadError(
            error instanceof Error
              ? error.message
              : "Booking details are temporarily unavailable.",
          );
        }
      })();
    });

    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
    };
  }, [bookingId, retryCount]);

  if (booking === undefined) {
    return <p className="text-center text-sm text-app-ink-muted">Loading your booking summary…</p>;
  }

  return (
    <section className="confirmation-panel app-surface mt-6 rounded-md p-6 shadow-sm sm:p-10">
      <div
        className={`confirmation-mark mx-auto flex size-26 items-center justify-center rounded-full bg-app-surface-muted ${
          booking ? "text-app-success" : "text-app-accent"
        }`}
      >
        {booking ? (
          <Check aria-hidden="true" className="confirmation-check size-16" />
        ) : (
          <AlertCircle aria-hidden="true" className="size-14" />
        )}
      </div>

      <h1 className="mt-5 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
        {booking
          ? "Booking confirmed"
          : loadError
            ? "We couldn’t load your booking"
            : "Booking not found"}
      </h1>

      {loadError ? (
        <div role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setBooking(undefined);
              setRetryCount((count) => count + 1);
            }}
            className="mt-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : booking ? (
        <>
          <p className="mt-2 text-center text-app-ink-muted">Your therapist will contact you shortly before your scheduled appointment.<br /> Have a great session ahead!</p>
          <dl className="mt-7 divide-y divide-app-border rounded-md border border-app-border px-4">
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Client</dt>
              <dd className="font-medium">{booking.clientName || "Not provided"}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Therapist</dt>
              <dd className="font-medium">{booking.therapistName}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Treatment</dt>
              <dd className="font-medium">{booking.treatment} · {booking.durationMinutes} mins</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Location</dt>
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
              <dt className="text-app-ink-muted">Timezone</dt>
              <dd className="font-medium">{booking.timeZone ?? "Africa/Accra"}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Phone / WhatsApp</dt>
              <dd className="max-w-sm wrap-break-word text-right font-medium">
                {booking.phoneNumber || "Not provided"}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3 text-sm">
              <dt className="text-app-ink-muted">Total</dt>
              <dd className="text-base font-semibold">{formatGhs(booking.price)}</dd>
            </div>
            <div className="py-3 text-sm">
              <dt className="text-app-ink-muted">Note for the therapist</dt>
              <dd className="mt-1 whitespace-pre-wrap font-medium">
                {booking.notes?.trim() || "No note provided"}
              </dd>
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
