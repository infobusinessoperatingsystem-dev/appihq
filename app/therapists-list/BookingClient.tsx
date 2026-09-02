"use client";

import React, { useMemo, useState } from "react";
import type { Therapist, MassageOffering, TherapistAvailability, ServiceLocation } from "./therapists";
import Image from "next/image";

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
  const [therapist, setTherapist] = useState<Therapist | undefined>(therapistProp);

  React.useEffect(() => {
    if (therapistProp) return;
    try {
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      const parts = path.split("/").filter(Boolean);
      // path expected: /therapists-list/:slug/book
      const slugIndex = parts.indexOf("therapists-list") + 1;
      const slug = parts[slugIndex];
      if (slug) {
        // dynamic import of therapist data
        import("./therapists").then((m) => {
          const found = (m.therapists || []).find((t: Therapist) => t.slug === slug);
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
  const [selectedOffering, setSelectedOffering] = useState<MassageOffering | null>(offerings[0] || null);
  const [selectedLocation, setSelectedLocation] = useState<ServiceLocation | null>(serviceLocations[0] || null);
  const [selectedDate, setSelectedDate] = useState<string | null>(availability[0]?.date || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const availableDates = useMemo(() => availability.map((a) => a.date), [availability]);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedOffering) return [];
    const day = availability.find((a) => a.date === selectedDate) as TherapistAvailability | undefined;
    if (!day) return [];
    return generateTimeSlots(day.startTime, day.endTime, selectedOffering.durationMinutes);
  }, [selectedDate, selectedOffering, availability]);

  function canProceedToSummary() {
    return !!selectedOffering && !!selectedLocation && !!selectedDate && !!selectedTime;
  }

  function handleConfirm() {
    // Mock booking create
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow border border-zinc-200 dark:border-zinc-900 dark:bg-black">
        <h2 className="mb-2 text-2xl font-semibold">Booking Confirmed</h2>
        <p className="text-sm text-zinc-600">Your request for {therapist?.firstName} is confirmed.</p>
        <div className="mt-4 text-left">
          <p className="font-medium">Details</p>
          <p className="text-sm">{selectedOffering?.massageType} — {selectedOffering?.durationMinutes} mins</p>
          <p className="text-sm">{selectedLocation}</p>
          <p className="text-sm">{selectedDate} at {selectedTime}</p>
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
    <div className="rounded-lg bg-white p-4 shadow border border-zinc-200 dark:border-zinc-900 dark:bg-black">
      <div className="flex gap-4">
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-md">
          <Image src={therapist.image} alt={therapist.firstName} fill sizes="7rem" className="object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Book {therapist.firstName}</h3>
          <p className="text-sm text-zinc-600">{therapist.specialty} • {therapist.location}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Choose a massage type</h4>
            <div className="flex flex-col gap-2">
              {offerings.length === 0 && <p className="text-sm text-zinc-500">No offerings available.</p>}
              {offerings.map((o) => (
                <button
                  key={o.massageType}
                  onClick={() => { setSelectedOffering(o); setStep(1); setSelectedTime(null); }}
                  className={`w-full rounded-md border border-zinc-200 px-3 py-2 text-left ${selectedOffering?.massageType === o.massageType ? "bg-foreground text-background" : "bg-white dark:bg-black"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{o.massageType}</div>
                      <div className="text-xs text-zinc-500">{o.durationMinutes} mins • GHS {o.price}</div>
                    </div>
                    <div className="text-sm text-zinc-600">Select</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Choose a session location</h4>
            <div className="flex gap-2">
              {serviceLocations.length === 0 && <p className="text-sm text-zinc-500">No service locations available.</p>}
              {serviceLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { setSelectedLocation(loc); setStep(2); }}
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
                <select value={selectedDate || ""} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); }} className="ml-2 rounded-md border border-zinc-200 px-2 py-1 bg-white dark:bg-black">
                  <option value="">Select date</option>
                  {availableDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs">Time</label>
                <select value={selectedTime || ""} onChange={(e) => setSelectedTime(e.target.value)} className="ml-2 rounded-md border border-zinc-200 px-2 py-1 bg-white dark:bg-black">
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step !== 0 && (
          <div className="flex items-center gap-2">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="rounded-md border border-zinc-200 px-3 py-2 text-sm">Back</button>
            {step < 3 && <button onClick={() => setStep((s) => Math.min(3, s + 1))} className="rounded-md bg-foreground px-3 py-2 text-sm text-background">Continue</button>}
          </div>
        )}

        {step >= 3 && (
          <div>
            <h4 className="mb-2 text-sm font-medium">Summary</h4>
            <div className="rounded-md border p-3">
              <p className="text-sm"><span className="font-medium">Type:</span> {selectedOffering?.massageType}</p>
              <p className="text-sm"><span className="font-medium">Location:</span> {selectedLocation}</p>
              <p className="text-sm"><span className="font-medium">When:</span> {selectedDate} at {selectedTime}</p>
              <p className="text-sm"><span className="font-medium">Price:</span> GHS {selectedOffering?.price}</p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button disabled={!canProceedToSummary()} onClick={handleConfirm} className={`rounded-md px-4 py-2 text-sm ${canProceedToSummary() ? "bg-foreground text-background shadow-lg shadow-foreground/25 hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-background" : "bg-zinc-300/60 text-zinc-600"}`}>
                Confirm Booking
              </button>
              <button onClick={() => setStep(2)} className="rounded-md border px-3 py-2 text-sm">Change time</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
