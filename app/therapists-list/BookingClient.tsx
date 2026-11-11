"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Therapist,
  MassageOffering,
  TherapistAvailability,
  ServiceLocation,
} from "./therapists";
import Image from "next/image";

type Props = { therapist?: Therapist };

const emptyOfferings: MassageOffering[] = [];
const emptyAvailability: TherapistAvailability[] = [];
const emptyServiceLocations: ServiceLocation[] = [];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function timeToMinutes(t: string) {
  const [hh, mm] = t.split(":").map(Number);
  return hh * 60 + mm;
}

function minutesToTime(mins: number) {
  const hh = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${pad(hh)}:${pad(mm)}`;
}

function formatBookingDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, month - 1, day));
}

function formatBookingTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const suffix = hour < 12 ? "AM" : "PM";
  return `${hour % 12 || 12}:${pad(minute)} ${suffix}`;
}

function generateTimeSlots(start: string, end: string, duration: number) {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  const slots: string[] = [];
  for (let t = startMin; t + duration <= endMin; t += 15) {
    // 15 minute step for flexibility
    slots.push(minutesToTime(t));
  }
  return slots;
}

export default function BookingClient({ therapist: therapistProp }: Props) {
  // When used from `/[slug]/book`, read slug client-side and resolve therapist.
  const [therapist, setTherapist] = useState<Therapist | undefined>(
    therapistProp,
  );

  React.useEffect(() => {
    if (therapistProp) return;
    try {
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      const parts = path.split("/").filter(Boolean);
      // path expected: /therapists-list/:slug/book
      const slugIndex = parts.indexOf("therapists-list") + 1;
      const slug = parts[slugIndex];
      if (slug) {
        // dynamic import of therapist data
        import("./therapists").then((m) => {
          const found = (m.therapists || []).find(
            (t: Therapist) => t.slug === slug,
          );
          setTherapist(found);
        });
      }
    } catch {
      // ignore
    }
  }, [therapistProp]);

  const offerings = therapist?.massageOfferings ?? emptyOfferings;
  const availability = therapist?.availability ?? emptyAvailability;
  const serviceLocations = therapist?.serviceLocations ?? emptyServiceLocations;

  const [step, setStep] = useState(0);
  const [selectedOffering, setSelectedOffering] =
    useState<MassageOffering | null>(offerings[0] || null);
  const [selectedLocation, setSelectedLocation] =
    useState<ServiceLocation | null>(serviceLocations[0] || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    availability[0]?.date || null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [modalOffering, setModalOffering] = useState<MassageOffering | null>(
    null,
  );

  const availableDates = useMemo(
    () => availability.map((a) => a.date),
    [availability],
  );

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedOffering) return [];
    const day = availability.find((a) => a.date === selectedDate) as
      | TherapistAvailability
      | undefined;
    if (!day) return [];
    return generateTimeSlots(
      day.startTime,
      day.endTime,
      selectedOffering.durationMinutes,
    );
  }, [selectedDate, selectedOffering, availability]);

  const router = useRouter();

  // Mapping of massage type to representative images
  const massageTypeImages: Record<string, string> = {
    Swedish:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
    Aromatherapy:
      "https://images.unsplash.com/photo-1556228720-88b58b1a3f64?auto=format&fit=crop&w=1000&q=80",
    "Deep Tissue":
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80",
    Sports:
      "https://images.unsplash.com/photo-1526403224745-1e8d7b7d4c3b?auto=format&fit=crop&w=1000&q=80",
    "Hot Stone":
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80",
    Couples:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80",
    "Trigger Point":
      "https://images.unsplash.com/photo-1523882454942-d7c1730b0b11?auto=format&fit=crop&w=1000&q=80",
    Restorative:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80",
    Relaxation:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80",
  };

  function canProceedToSummary() {
    return (
      !!selectedOffering &&
      !!selectedLocation &&
      !!selectedDate &&
      !!selectedTime
    );
  }

  function handleConfirm() {
    if (!therapist || !selectedOffering || !selectedLocation || !selectedDate || !selectedTime) return;

    const query = new URLSearchParams({
      therapist: therapist.firstName,
      treatment: selectedOffering.massageType,
      duration: String(selectedOffering.durationMinutes),
      location: selectedLocation,
      date: selectedDate,
      time: selectedTime,
      price: String(selectedOffering.price),
    });

    router.push(`/booking-confirmation?${query.toString()}`);
  }

  if (!therapist) {
    return (
      <div className="app-surface rounded-md p-8 text-center shadow-sm">
        <p className="text-sm text-app-ink-muted">Loading therapist details…</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => router.back()}
        className="app-button app-button-quiet mb-4 px-2"
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
        </svg> Therapists
      </button>
      <div className="app-surface overflow-hidden rounded-md shadow-sm">
        <div className="flex flex-col gap-5 border-b border-app-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-18">
              <Image
                src={therapist.image}
                alt={therapist.firstName}
                fill
                sizes="(max-width: 640px) 4rem, 5rem"
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                Book {therapist.firstName}
              </h3>
              <div className="flex items-center gap-1.5">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4 text-app-ink-muted"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                </svg>
                <p className="text-sm text-app-ink-muted">{therapist.location}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-app-surface-muted px-3 py-1.5 text-sm text-app-ink sm:self-center">
            <span aria-hidden="true" className="text-app-accent">★</span>
            <span className="font-semibold">{therapist.rating}</span>
            <span className="text-app-ink-muted">({therapist.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="px-4 pt-5 sm:px-6 sm:pt-6">
          <ol aria-label="Booking progress" className="grid grid-cols-4">
            {["Treatment", "Location", "Time", "Review"].map((label, index) => (
              <li key={label} className="relative flex flex-col items-center text-center">
                {index < 3 && <span aria-hidden="true" className={`absolute left-1/2 top-4 h-px w-full ${step > index ? "bg-app-primary" : "bg-app-border"}`} />}
                <span className={`relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${step === index ? "border-app-primary bg-app-primary text-white" : step > index ? "border-app-accent bg-app-surface-muted text-app-ink" : "border-app-border bg-app-surface text-app-ink-muted"}`}>{index + 1}</span>
                <span className={`mt-2 text-[11px] sm:text-xs ${step === index ? "font-semibold text-app-ink" : "text-app-ink-muted"}`}>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
          {step === 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">
                Choose a massage type
              </h4>
              <div className="flex flex-col gap-2">
                {offerings.length === 0 && (
                  <p className="text-sm text-app-ink-muted">
                    No offerings available.
                  </p>
                )}
                {offerings.map((o) => {
                  const img =
                    massageTypeImages[o.massageType] || therapist.image;
                  return (
                    <div
                      key={o.massageType}
                      className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${selectedOffering?.massageType === o.massageType ? "border-app-primary bg-app-surface-muted" : "border-app-border bg-app-surface hover:border-app-primary"}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOffering(o);
                          setStep(1);
                          setSelectedTime(null);
                        }}
                        aria-pressed={selectedOffering?.massageType === o.massageType}
                        className="flex min-w-0 flex-1 items-center gap-3 border-0 bg-transparent p-0 text-left text-app-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
                      >
                        {/* <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md sm:h-18 sm:w-24">
                          <Image
                            src={img}
                            alt={o.massageType}
                            fill
                            sizes="6rem"
                            className="object-cover"
                          />
                        </span> */}
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{o.massageType}</span>
                          <span className="mt-1 block text-xs text-app-ink-muted">
                            {o.durationMinutes} mins • GHS {o.price}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalOffering(o)}
                        className="app-button app-button-secondary min-h-9 shrink-0 px-3 py-2 text-xs"
                      >
                        Learn more
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">
                Choose a session location
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceLocations.length === 0 && (
                  <p className="text-sm text-app-ink-muted">
                    No service locations available.
                  </p>
                )}
                {serviceLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setStep(2);
                    }}
                    aria-pressed={selectedLocation === loc}
                    className={`app-button min-h-14 w-full justify-between px-4 py-3 text-left text-sm capitalize transition-colors ${selectedLocation === loc ? "border-app-primary bg-app-surface-muted text-app-ink" : "border-app-border bg-app-surface text-app-ink hover:border-app-primary"}`}
                  >
                    {loc}
                    <span aria-hidden="true" className="text-lg">{selectedLocation === loc ? "✓" : "→"}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Choose date & time</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="booking-date" className="mb-2 block text-sm font-medium text-app-ink">Date</label>
                  <div className="app-select-wrap">
                    <select
                      id="booking-date"
                      value={selectedDate || ""}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(null);
                      }}
                      className="app-control app-control-select text-sm focus:outline-none focus:ring-2 focus:ring-app-focus"
                    >
                      <option value="">Choose a date</option>
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {formatBookingDate(date)}
                        </option>
                      ))}
                    </select>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-select-chevron"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>

                <div className="min-w-0">
                  <label htmlFor="booking-time" className="mb-2 block text-sm font-medium text-app-ink">Start time</label>
                  <div className="app-select-wrap">
                    <select
                      id="booking-time"
                      value={selectedTime || ""}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      disabled={!selectedDate || timeSlots.length === 0}
                      className="app-control app-control-select text-sm focus:outline-none focus:ring-2 focus:ring-app-focus disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <option value="">Choose a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {formatBookingTime(time)}
                        </option>
                      ))}
                    </select>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="app-select-chevron"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
              {selectedDate && timeSlots.length === 0 && (
                <p className="mt-3 text-sm text-app-ink-muted">No start times are available for this date and treatment.</p>
              )}
            </div>
          )}

          {step !== 0 && (
            <div className="flex flex-col-reverse gap-3 border-t border-app-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="app-button app-button-secondary"
              >
                Back
              </button>
              {step < 3 && (
                <button
                  disabled={step === 2 && (!selectedDate || !selectedTime)}
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="app-button app-button-primary"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {step >= 3 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Summary</h4>
              <div className="divide-y divide-app-border rounded-md border border-app-border bg-app-surface px-4">
                <p className="py-3 text-sm">
                  <span className="font-medium">Treatment</span><br />
                  {selectedOffering?.massageType}
                </p>
                <p className="py-3 text-sm">
                  <span className="font-medium">Location</span><br />
                  {selectedLocation}
                </p>
                <p className="py-3 text-sm">
                  <span className="font-medium">Date and time</span><br />
                  {selectedDate} at{" "}
                  {selectedTime}
                </p>
                <p className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium">Total</span>
                  <span className="text-base font-semibold">GHS{" "}
                  {selectedOffering?.price}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  disabled={!canProceedToSummary()}
                  onClick={handleConfirm}
                  className={`app-button flex-1 ${canProceedToSummary() ? "app-button-primary" : "app-button-secondary"}`}
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="app-button app-button-secondary"
                >
                  Change time
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOffering ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center">
          <div className="app-surface w-full max-w-lg rounded-md p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="mt-1 text-2xl font-semibold text-app-ink">
                  {modalOffering.massageType}
                </h4>
                <p className="mt-1 text-sm text-app-ink-muted">
                  {modalOffering.durationMinutes} mins • GHS{" "}
                  {modalOffering.price}
                </p>
              </div>
              <button
                onClick={() => setModalOffering(null)}
                className="app-icon-button"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <div className="relative h-44 overflow-hidden rounded-md">
                <Image
                  src={
                    massageTypeImages[modalOffering.massageType] ||
                    therapist.image
                  }
                  alt={modalOffering.massageType}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4 text-sm text-app-ink">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-app-ink-muted">
                  About this massage
                </p>
                <p>
                  Specialized {modalOffering.massageType} session with{" "}
                  {therapist.firstName}. Duration:{" "}
                  {modalOffering.durationMinutes} minutes. Price: GHS{" "}
                  {modalOffering.price}.
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-app-ink-muted">
                  Next available
                </p>
                {availability[0] ? (
                  <p>{formatBookingDate(availability[0].date)} • {formatBookingTime(availability[0].startTime)}–{formatBookingTime(availability[0].endTime)}</p>
                ) : (
                  <p>No availability published yet.</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-app-border pt-4 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => setModalOffering(null)}
                className="app-button app-button-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedOffering(modalOffering);
                  setModalOffering(null);
                  setStep(1);
                }}
                className="app-button app-button-primary"
              >
                Book for {modalOffering.massageType}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
