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
  clientName?: string;
  notes?: string;
  treatment: string;
  durationMinutes: number;
  serviceLocation: ServiceLocation;
  locationDetails: string;
  date: string;
  time: string;
  timeZone?: string;
  price: number;
  phoneNumber?: string;
  status?: "confirmed" | "cancelled" | "rescheduled";
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
    (booking.clientName === undefined || typeof booking.clientName === "string") &&
    (booking.notes === undefined || typeof booking.notes === "string") &&
    typeof booking.treatment === "string" &&
    typeof booking.durationMinutes === "number" &&
    (booking.serviceLocation === "home" || booking.serviceLocation === "hotel" || booking.serviceLocation === "walk-in") &&
    typeof booking.locationDetails === "string" &&
    typeof booking.date === "string" &&
    typeof booking.time === "string" &&
    (booking.timeZone === undefined || typeof booking.timeZone === "string") &&
    typeof booking.price === "number" &&
    (booking.phoneNumber === undefined || typeof booking.phoneNumber === "string") &&
    (booking.status === undefined ||
      booking.status === "confirmed" ||
      booking.status === "cancelled" ||
      booking.status === "rescheduled") &&
    typeof booking.createdAt === "string" &&
    booking.demo === true
  );
}

export function readSavedBookings(): SavedBooking[] {
  try {
    return readSavedBookingsStrict();
  } catch {
    return [];
  }
}

export function readSavedBookingsStrict(): SavedBooking[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];

  const stored: unknown = JSON.parse(raw);
  if (!Array.isArray(stored)) {
    throw new Error("Saved booking data is invalid.");
  }

  return stored.filter(isSavedBooking);
}

export function readSavedBooking(id: string): SavedBooking | undefined {
  return readSavedBookings().find((booking) => booking.id === id);
}

export function saveBooking(booking: SavedBooking, rescheduleId?: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const bookings = readSavedBookingsStrict();
    if (rescheduleId && !bookings.some((saved) => saved.id === rescheduleId)) {
      return false;
    }

    const nextBookings = bookings
      .filter((saved) => saved.id !== booking.id)
      .map((saved) =>
        saved.id === rescheduleId ? { ...saved, status: "rescheduled" as const } : saved,
      );
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...booking, status: "confirmed" }, ...nextBookings]),
    );
    return true;
  } catch {
    return false;
  }
}

export function updateSavedBookingStatus(
  id: string,
  status: NonNullable<SavedBooking["status"]>,
) {
  const bookings = readSavedBookingsStrict();
  let found = false;
  const nextBookings = bookings.map((booking) => {
    if (booking.id !== id) return booking;
    found = true;
    return { ...booking, status };
  });

  if (!found) throw new Error("This session could not be found.");
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBookings));
  return nextBookings;
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