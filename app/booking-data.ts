import type { ServiceLocation } from "./therapists-list/therapists";

export type WalkInLocation = {
  id: string;
  name: string;
  address: string;
};

export type SavedBooking = {
  id: string;
  therapistSlug: string;
  therapistName: string;
  treatment: string;
  durationMinutes: number;
  serviceLocation: ServiceLocation;
  locationDetails: string;
  date: string;
  time: string;
  price: number;
  createdAt: string;
  demo: true;
};

const STORAGE_KEY = "appi.bookings.v1";

function isSavedBooking(value: unknown): value is SavedBooking {
  if (!value || typeof value !== "object") return false;
  const booking = value as Partial<SavedBooking>;
  return (
    typeof booking.id === "string" &&
    typeof booking.therapistSlug === "string" &&
    typeof booking.therapistName === "string" &&
    typeof booking.treatment === "string" &&
    typeof booking.durationMinutes === "number" &&
    (booking.serviceLocation === "home" || booking.serviceLocation === "hotel" || booking.serviceLocation === "walk-in") &&
    typeof booking.locationDetails === "string" &&
    typeof booking.date === "string" &&
    typeof booking.time === "string" &&
    typeof booking.price === "number" &&
    typeof booking.createdAt === "string" &&
    booking.demo === true
  );
}

export function readSavedBookings(): SavedBooking[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(isSavedBooking) : [];
  } catch {
    return [];
  }
}

export function readSavedBooking(id: string): SavedBooking | undefined {
  return readSavedBookings().find((booking) => booking.id === id);
}

export function saveBooking(booking: SavedBooking): boolean {
  if (typeof window === "undefined") return false;

  try {
    const bookings = readSavedBookings().filter((saved) => saved.id !== booking.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...bookings]));
    return true;
  } catch {
    return false;
  }
}

export function deleteSavedBooking(id: string): SavedBooking[] {
  const bookings = readSavedBookings().filter((booking) => booking.id !== id);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Keep the in-memory list usable if browser storage is unavailable.
  }

  return bookings;
}