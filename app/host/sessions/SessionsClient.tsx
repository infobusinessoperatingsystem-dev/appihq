"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, LoaderCircle, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  readSavedBookingsStrict,
  updateSavedBookingStatus,
  type SavedBooking,
} from "@/app/booking-data";
import { formatGhs } from "@/app/money";
import { therapists } from "@/app/therapists-list/therapists";
import { localDateTimeToUtc } from "@/lib/appointments";

type SessionTab = "upcoming" | "past";

function getTimeZone(booking: SavedBooking) {
  return booking.timeZone || "Africa/Accra";
}

function getSessionInstant(booking: SavedBooking) {
  return localDateTimeToUtc(booking.date, booking.time, getTimeZone(booking));
}

function formatSessionDate(booking: SavedBooking) {
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: getTimeZone(booking),
  }).format(getSessionInstant(booking));
}

function formatSessionTime(booking: SavedBooking) {
  return new Intl.DateTimeFormat("en-GH", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: getTimeZone(booking),
  }).format(getSessionInstant(booking));
}

function isUpcoming(booking: SavedBooking) {
  return getSessionInstant(booking).getTime() >= Date.now();
}

function getWhatsAppHref(phoneNumber: string) {
  const trimmedNumber = phoneNumber.trim();
  let digits = trimmedNumber.replace(/\D/g, "");
  if (!trimmedNumber.startsWith("+") && digits.startsWith("0")) {
    digits = `233${digits.slice(1)}`;
  }
  return digits ? `https://wa.me/${digits}` : null;
}

function getPhoneHref(phoneNumber: string) {
  const dialString = phoneNumber.trim().replace(/[^\d+]/g, "");
  return dialString ? `tel:${dialString}` : null;
}

export default function SessionsClient() {
  const [providerSlug, setProviderSlug] = useState(therapists[0]?.slug ?? "");
  const [bookings, setBookings] = useState<SavedBooking[]>([]);
  const [activeTab, setActiveTab] = useState<SessionTab>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [sessionToCancel, setSessionToCancel] = useState<SavedBooking | null>(null);
  const [actionError, setActionError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setBookings(readSavedBookingsStrict());
        setLoadError("");
      } catch {
        setBookings([]);
        setLoadError(
          "Saved sessions couldn’t be read from this browser. Check storage settings and retry.",
        );
      } finally {
        setIsLoading(false);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [retryCount]);

  const provider = therapists.find((item) => item.slug === providerSlug);
  const sessions = useMemo(
    () =>
      bookings
        .filter((booking) => booking.therapistSlug === providerSlug)
        .filter((booking) =>
          activeTab === "upcoming" ? isUpcoming(booking) : !isUpcoming(booking),
        )
        .sort((a, b) => getSessionInstant(a).getTime() - getSessionInstant(b).getTime()),
    [activeTab, bookings, providerSlug],
  );

  function confirmCancel() {
    if (!sessionToCancel) return;
    setIsCancelling(true);
    setActionError("");

    try {
      setBookings(updateSavedBookingStatus(sessionToCancel.id, "cancelled"));
      setSessionToCancel(null);
    } catch {
      setActionError(
        "This session couldn’t be cancelled. Check browser storage and try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-app-ink sm:text-2xl">
            Incoming sessions
          </h2>
          <p className="mt-1 text-sm leading-6 text-app-ink-muted">
            Review client details and manage sessions saved on this device.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm font-medium text-app-ink">
          Provider
          <select
            value={providerSlug}
            onChange={(event) => setProviderSlug(event.target.value)}
            className="h-11 min-w-56 rounded-md border border-app-border bg-app-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
          >
            {therapists.map((therapist) => (
              <option key={therapist.slug} value={therapist.slug}>
                {therapist.firstName} · {therapist.location}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div role="tablist" aria-label="Session history" className="mb-5 flex gap-2">
        {(["upcoming", "past"] as const).map((tab) => (
          <button
            key={tab}
            id={`sessions-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="host-session-list"
            onClick={() => setActiveTab(tab)}
            className={`min-h-10 rounded-full border px-4 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "border-app-primary bg-app-primary text-white"
                : "border-app-border bg-app-surface text-app-ink hover:border-app-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {actionError ? (
        <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {actionError}
        </p>
      ) : null}

      {isLoading ? (
        <p className="app-surface rounded-md p-6 text-sm text-app-ink-muted">
          Loading sessions…
        </p>
      ) : loadError ? (
        <section role="alert" className="app-surface rounded-md border border-red-200 p-6">
          <h3 className="font-semibold text-app-ink">We couldn’t load sessions</h3>
          <p className="mt-2 text-sm leading-6 text-app-ink-muted">{loadError}</p>
          <Button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setRetryCount((count) => count + 1);
            }}
            className="mt-4 bg-app-primary text-white hover:bg-app-primary-hover"
          >
            Retry
          </Button>
        </section>
      ) : sessions.length ? (
        <ul id="host-session-list" role="tabpanel" aria-labelledby={`sessions-tab-${activeTab}`} className="space-y-3">
          {sessions.map((session) => {
            const status = session.status ?? "confirmed";
            const phoneNumber = session.phoneNumber?.trim();
            const whatsAppHref = phoneNumber ? getWhatsAppHref(phoneNumber) : null;
            const phoneHref = phoneNumber ? getPhoneHref(phoneNumber) : null;
            const upcoming = isUpcoming(session);

            return (
              <li key={session.id}>
                <article className="app-surface rounded-md p-4 shadow-sm sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-app-ink">
                          {session.clientName?.trim() || "Client"}
                        </h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          status === "cancelled"
                            ? "bg-red-50 text-red-800"
                            : status === "rescheduled"
                              ? "bg-app-surface-muted text-app-ink-muted"
                              : "bg-green-50 text-green-800"
                        }`}>
                          {status === "confirmed" ? (upcoming ? "Confirmed" : "Completed") : status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-app-ink-muted">
                        {session.treatment} · {session.durationMinutes} min · {formatGhs(session.price)}
                      </p>

                      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="flex items-center gap-1.5 text-xs text-app-ink-muted">
                            <CalendarDays aria-hidden="true" className="size-3.5" />
                            Session date
                          </dt>
                          <dd className="mt-1 font-medium text-app-ink">
                            {formatSessionDate(session)}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 text-xs text-app-ink-muted">
                            <Clock3 aria-hidden="true" className="size-3.5" />
                            Session time · {getTimeZone(session)}
                          </dt>
                          <dd className="mt-1 font-medium text-app-ink">
                            {formatSessionTime(session)}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 text-xs text-app-ink-muted">
                            <Phone aria-hidden="true" className="size-3.5" />
                            Phone / WhatsApp
                          </dt>
                          <dd className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            {phoneNumber ? (
                              <>
                                {phoneHref ? (
                                  <a href={phoneHref} className="font-medium text-app-primary hover:underline">
                                  {phoneNumber}
                                  </a>
                                ) : <span>{phoneNumber}</span>}
                                {whatsAppHref ? (
                                  <a
                                    href={whatsAppHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-medium text-app-primary hover:underline"
                                  >
                                    Message on WhatsApp
                                  </a>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-app-ink-muted">No number provided</span>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center gap-1.5 text-xs text-app-ink-muted">
                            <UserRound aria-hidden="true" className="size-3.5" />
                            Provider
                          </dt>
                          <dd className="mt-1 font-medium text-app-ink">
                            {provider?.firstName ?? session.therapistName}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-app-ink-muted">Client notes</dt>
                          <dd className="mt-1 whitespace-pre-wrap leading-6 text-app-ink">
                            {session.notes?.trim() || "No pre-session notes shared."}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {upcoming && status === "confirmed" ? (
                      <div className="flex shrink-0 gap-2 border-t border-app-border pt-3 sm:flex-col sm:border-0 sm:pt-0">
                        <Link
                          href={`/therapists-list/${session.therapistSlug}/book?repeat=${encodeURIComponent(session.id)}&reschedule=true`}
                          className="app-button app-button-secondary min-h-10 flex-1 px-3 text-xs sm:flex-none"
                        >
                          Reschedule
                        </Link>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSessionToCancel(session);
                            setActionError("");
                          }}
                          className="min-h-10 flex-1 border-app-border px-3 text-xs sm:flex-none"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <section className="app-surface rounded-md px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-app-surface-muted text-app-primary">
            <CalendarDays aria-hidden="true" className="size-6" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-app-ink">
            No {activeTab} sessions
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-app-ink-muted">
            {activeTab === "upcoming"
              ? `New bookings for ${provider?.firstName ?? "this provider"} will appear here.`
              : "Completed sessions will appear here after their scheduled time."}
          </p>
        </section>
      )}

      <Dialog
        open={sessionToCancel !== null}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setSessionToCancel(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this session?</DialogTitle>
            <DialogDescription>
              The session will be marked as cancelled in this browser. The client
              won’t be notified in this demo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isCancelling}
              onClick={() => setSessionToCancel(null)}
            >
              Keep session
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isCancelling}
              onClick={confirmCancel}
            >
              {isCancelling ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                "Cancel session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
