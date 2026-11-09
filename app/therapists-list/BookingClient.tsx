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
import Link from "next/link";

type Props = { therapist?: Therapist };

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
    } catch (e) {
      // ignore
    }
  }, [therapistProp]);

  const offerings = therapist?.massageOfferings || [];
  const availability = therapist?.availability || [];
  const serviceLocations = therapist?.serviceLocations || [];

  const [step, setStep] = useState(0);
  const [selectedOffering, setSelectedOffering] =
    useState<MassageOffering | null>(offerings[0] || null);
  const [selectedLocation, setSelectedLocation] =
    useState<ServiceLocation | null>(serviceLocations[0] || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    availability[0]?.date || null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
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
    // Mock booking create
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-zinc-950 sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>
        </div>
        <h2 className="mt-5 text-center text-2xl font-semibold">Booking request received</h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Your request for {therapist?.firstName} is confirmed.
        </p>
        <div className="mt-7 divide-y divide-zinc-200 rounded-lg border border-zinc-200 px-4 dark:divide-zinc-800 dark:border-zinc-800">
          <p className="py-3 text-sm">
            <span className="font-medium">Treatment</span><br />
            {selectedOffering?.massageType} —{" "}
            {selectedOffering?.durationMinutes} mins
          </p>
          <p className="py-3 text-sm"><span className="font-medium">Location</span><br />{selectedLocation}</p>
          <p className="py-3 text-sm">
            <span className="font-medium">Date and time</span><br />
            {selectedDate} at {selectedTime}
          </p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading therapist details…</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-transparent pr-3 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-black dark:text-zinc-300 dark:hover:text-white dark:focus:ring-white"
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
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-col gap-5 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            {/* <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200">
            ← Back
          </button> */}

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
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{therapist.location}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-900 sm:self-center dark:bg-amber-950/50 dark:text-amber-200">
            <span aria-hidden="true">★</span>
            <span className="font-semibold">{therapist.rating}</span>
            <span className="text-amber-900/65 dark:text-amber-200/65">({therapist.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="px-4 pt-5 sm:px-6 sm:pt-6">
          <ol aria-label="Booking progress" className="grid grid-cols-4">
            {["Treatment", "Location", "Time", "Review"].map((label, index) => (
              <li key={label} className="relative flex flex-col items-center text-center">
                {index < 3 && <span aria-hidden="true" className={`absolute left-1/2 top-4 h-px w-full ${step > index ? "bg-emerald-700 dark:bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`} />}
                <span className={`relative z-10 flex size-8 items-center justify-center rounded-full border text-xs font-semibold ${step === index ? "border-emerald-800 bg-emerald-800 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-zinc-950" : step > index ? "border-emerald-700 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200" : "border-zinc-300 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"}`}>{index + 1}</span>
                <span className={`mt-2 text-[11px] sm:text-xs ${step === index ? "font-semibold text-zinc-950 dark:text-white" : "text-zinc-500 dark:text-zinc-400"}`}>{label}</span>
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
                  <p className="text-sm text-zinc-500">
                    No offerings available.
                  </p>
                )}
                {offerings.map((o) => {
                  const img =
                    massageTypeImages[o.massageType] || therapist.image;
                  return (
                    <div
                      key={o.massageType}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSelectedOffering(o);
                          setStep(1);
                          setSelectedTime(null);
                        }
                      }}
                      onClick={() => {
                        setSelectedOffering(o);
                        setStep(1);
                        setSelectedTime(null);
                      }}
                      aria-pressed={selectedOffering?.massageType === o.massageType}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400 ${selectedOffering?.massageType === o.massageType ? "border-emerald-700 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-950/40" : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"}`}
                    >
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md sm:h-18 sm:w-24">
                        <Image
                          src={img}
                          alt={o.massageType}
                          fill
                          sizes="6rem"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-zinc-950 dark:text-zinc-100">{o.massageType}</div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {o.durationMinutes} mins • GHS {o.price}
                        </div>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalOffering(o);
                          }}
                          className="shrink-0 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Learn more
                        </button>
                      </div>
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
                  <p className="text-sm text-zinc-500">
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
                    className={`flex min-h-14 items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium capitalize transition-colors ${selectedLocation === loc ? "border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100" : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600"}`}
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
                  <label htmlFor="booking-date" className="mb-2 block text-sm font-medium">Date</label>
                  <select
                    id="booking-date"
                    value={selectedDate || ""}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(null);
                    }}
                    className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-400"
                  >
                    <option value="">Select date</option>
                    {availableDates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label htmlFor="booking-time" className="mb-2 block text-sm font-medium">Start time</label>
                  <select
                    id="booking-time"
                    value={selectedTime || ""}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:ring-emerald-400"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step !== 0 && (
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="min-h-11 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                Back
              </button>
              {step < 3 && (
                <button
                  disabled={step === 2 && (!selectedDate || !selectedTime)}
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="min-h-11 rounded-md bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {step >= 3 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Summary</h4>
              <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 px-4 dark:divide-zinc-800 dark:border-zinc-800">
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
                  className={`min-h-12 flex-1 rounded-md px-5 py-3 text-sm font-semibold ${canProceedToSummary() ? "bg-emerald-800 text-white hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 dark:bg-emerald-400 dark:text-zinc-950 dark:hover:bg-emerald-300" : "cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"}`}
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="min-h-12 rounded-md border border-zinc-300 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
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
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-3 flex items-start justify-between">
              <div>
                {/* <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{modalOffering.massageType}</p> */}
                <h4 className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {modalOffering.massageType}
                </h4>
                <p className="mt-1 text-sm text-zinc-600">
                  {modalOffering.durationMinutes} mins • GHS{" "}
                  {modalOffering.price}
                </p>
              </div>
              <button
                onClick={() => setModalOffering(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-lg text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200"
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

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-200">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
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
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Next available
                </p>
                <p>
                  {availability[0]?.date} • {availability[0]?.startTime} -{" "}
                  {availability[0]?.endTime}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <button
                onClick={() => setModalOffering(null)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedOffering(modalOffering);
                  setModalOffering(null);
                  setStep(1);
                }}
                className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background"
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
