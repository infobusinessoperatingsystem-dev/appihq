import { createHash, randomBytes, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,30}$/;
const SERVICE_LOCATIONS = new Set(["home", "hotel", "walk-in"]);
const MAX_BODY_BYTES = 16_384;

type BookingSubmission = {
  therapistSlug: string;
  therapistName: string;
  clientName: string;
  phoneNumber: string;
  therapistNote: string;
  treatment: string;
  durationMinutes: number;
  serviceLocation: "home" | "hotel" | "walk-in";
  address: string;
  date: string;
  time: string;
  timeZone: string;
  total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown, maximum: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maximum
  );
}

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function parseBookingSubmission(value: unknown): BookingSubmission | null {
  if (!isRecord(value)) return null;
  if (
    !isNonEmptyString(value.therapistSlug, 100) ||
    !/^[a-z0-9-]+$/.test(value.therapistSlug) ||
    !isNonEmptyString(value.therapistName, 100) ||
    !isNonEmptyString(value.clientName, 100) ||
    typeof value.phoneNumber !== "string" ||
    !PHONE_PATTERN.test(value.phoneNumber.trim()) ||
    value.phoneNumber.trim().replace(/\D/g, "").length < 7 ||
    value.phoneNumber.trim().replace(/\D/g, "").length > 15 ||
    typeof value.therapistNote !== "string" ||
    value.therapistNote.trim().length > 1000 ||
    !isNonEmptyString(value.treatment, 120) ||
    typeof value.durationMinutes !== "number" ||
    !Number.isInteger(value.durationMinutes) ||
    value.durationMinutes < 15 ||
    value.durationMinutes > 240 ||
    typeof value.serviceLocation !== "string" ||
    !SERVICE_LOCATIONS.has(value.serviceLocation) ||
    !isNonEmptyString(value.address, 500) ||
    typeof value.date !== "string" ||
    !isValidDate(value.date) ||
    typeof value.time !== "string" ||
    !TIME_PATTERN.test(value.time) ||
    typeof value.timeZone !== "string" ||
    value.timeZone.length > 100 ||
    !isValidTimeZone(value.timeZone) ||
    !Number.isFinite(value.total) ||
    typeof value.total !== "number" ||
    value.total < 0 ||
    value.total > 1_000_000
  ) {
    return null;
  }

  return {
    therapistSlug: value.therapistSlug,
    therapistName: value.therapistName.trim(),
    clientName: value.clientName.trim(),
    phoneNumber: value.phoneNumber.trim(),
    therapistNote: value.therapistNote.trim(),
    treatment: value.treatment.trim(),
    durationMinutes: value.durationMinutes,
    serviceLocation: value.serviceLocation as BookingSubmission["serviceLocation"],
    address: value.address.trim(),
    date: value.date,
    time: value.time,
    timeZone: value.timeZone,
    total: value.total,
  };
}

function unavailableResponse(status = 503) {
  return NextResponse.json(
    { error: "Booking storage is temporarily unavailable. Please try again." },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Booking details are too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Booking details are invalid." }, { status: 400 });
  }

  const booking = parseBookingSubmission(payload);
  if (!booking) {
    return NextResponse.json({ error: "Please check your booking details and try again." }, { status: 400 });
  }

  const id = randomUUID();
  const confirmationToken = randomBytes(32).toString("base64url");
  const confirmationTokenHash = createHash("sha256")
    .update(confirmationToken)
    .digest("hex");

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("bookings").insert({
      id,
      confirmation_token_hash: confirmationTokenHash,
      therapist_slug: booking.therapistSlug,
      therapist_name: booking.therapistName,
      client_name: booking.clientName,
      phone_number: booking.phoneNumber,
      therapist_note: booking.therapistNote,
      treatment: booking.treatment,
      duration_minutes: booking.durationMinutes,
      service_location: booking.serviceLocation,
      address: booking.address,
      appointment_date: booking.date,
      appointment_time: booking.time,
      time_zone: booking.timeZone,
      total: booking.total,
    });

    if (error) {
      console.error("Supabase booking insert failed:", error.message);
      return unavailableResponse();
    }

    return NextResponse.json(
      { bookingId: id, confirmationToken },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Supabase is not configured")) {
      console.error(error.message);
      return unavailableResponse();
    }
    console.error("Booking could not be saved to Supabase.");
    return unavailableResponse();
  }
}
