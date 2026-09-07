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
      <div className="rounded-lg bg-white p-6 text-center shadow border border-zinc-200 dark:border-zinc-900 dark:bg-black">
        <h2 className="mb-2 text-2xl font-semibold">Booking Confirmed</h2>
        <p className="text-sm text-zinc-600">
          Your request for {therapist?.firstName} is confirmed.
        </p>
        <div className="mt-4 text-left">
          <p className="font-medium">Details</p>
          <p className="text-sm">
            {selectedOffering?.massageType} —{" "}
            {selectedOffering?.durationMinutes} mins
          </p>
          <p className="text-sm">{selectedLocation}</p>
          <p className="text-sm">
            {selectedDate} at {selectedTime}
          </p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow border border-zinc-200 dark:border-zinc-900 dark:bg-black">
        <p className="text-sm text-zinc-500">Loading therapist details…</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => router.back()}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-transparent text-sm font-medium text-foreground transition-colors hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-black dark:hover:text-zinc-300 dark:focus:ring-white"
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
      <div className="rounded-lg bg-white p-4 shadow border border-zinc-200 dark:border-zinc-900 dark:bg-black">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200">
            ← Back
          </button> */}

            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <Image
                src={therapist.image}
                alt={therapist.firstName}
                fill
                sizes="7rem"
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
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
                <p className="text-sm text-zinc-600">{therapist.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
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
                      className={`w-full rounded-md border border-zinc-200 px-3 py-2 text-left flex items-center gap-3 ${selectedOffering?.massageType === o.massageType ? "bg-foreground text-background" : "bg-white dark:bg-black"}`}
                    >
                      <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={img}
                          alt={o.massageType}
                          fill
                          sizes="6rem"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{o.massageType}</div>
                        <div className="text-xs text-zinc-500">
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
                          className="rounded-md bg-white/95 px-3 py-1 text-xs text-zinc-800 shadow-sm"
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
              <div className="flex gap-2">
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
                    className={`rounded-md border border-zinc-200 px-3 py-2 text-sm ${selectedLocation === loc ? "bg-foreground text-background" : "bg-white dark:bg-black"}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Choose date & time</h4>
              <div className="flex gap-2">
                <div>
                  <label className="text-xs">Date</label>
                  <select
                    value={selectedDate || ""}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(null);
                    }}
                    className="ml-2 rounded-md border border-zinc-200 px-2 py-1 bg-white dark:bg-black"
                  >
                    <option value="">Select date</option>
                    {availableDates.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs">Time</label>
                  <select
                    value={selectedTime || ""}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="ml-2 rounded-md border border-zinc-200 px-2 py-1 bg-white dark:bg-black"
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm"
              >
                Back
              </button>
              {step < 3 && (
                <button
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="rounded-md bg-foreground px-3 py-2 text-sm text-background"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {step >= 3 && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Summary</h4>
              <div className="rounded-md border p-3">
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{" "}
                  {selectedOffering?.massageType}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span>{" "}
                  {selectedLocation}
                </p>
                <p className="text-sm">
                  <span className="font-medium">When:</span> {selectedDate} at{" "}
                  {selectedTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Price:</span> GHS{" "}
                  {selectedOffering?.price}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  disabled={!canProceedToSummary()}
                  onClick={handleConfirm}
                  className={`rounded-md px-4 py-2 text-sm ${canProceedToSummary() ? "bg-foreground text-background shadow-lg shadow-foreground/25 hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-background" : "bg-zinc-300/60 text-zinc-600"}`}
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="rounded-md border px-3 py-2 text-sm"
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
