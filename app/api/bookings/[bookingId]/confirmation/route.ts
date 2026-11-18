import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type RouteParams = { params: Promise<{ bookingId: string }> };

function responseError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request, { params }: RouteParams) {
  const { bookingId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(bookingId)) {
    return responseError("Booking not found.", 404);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return responseError("Booking not found.", 404);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("confirmationToken" in payload) ||
    typeof payload.confirmationToken !== "string" ||
    payload.confirmationToken.length < 32 ||
    payload.confirmationToken.length > 128
  ) {
    return responseError("Booking not found.", 404);
  }

  const expectedHash = createHash("sha256")
    .update(payload.confirmationToken)
    .digest();

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, confirmation_token_hash, therapist_slug, therapist_name, client_name, phone_number, therapist_note, treatment, duration_minutes, service_location, address, appointment_date, appointment_time, time_zone, total, created_at",
      )
      .eq("id", bookingId)
      .maybeSingle();

    if (error) {
      console.error("Supabase booking lookup failed:", error.message);
      return responseError("Booking details are temporarily unavailable.", 503);
    }

    if (!data) return responseError("Booking not found.", 404);

    const storedHash = Buffer.from(data.confirmation_token_hash, "hex");
    if (
      storedHash.length !== expectedHash.length ||
      !timingSafeEqual(storedHash, expectedHash)
    ) {
      return responseError("Booking not found.", 404);
    }

    return NextResponse.json(
      {
        booking: {
          id: data.id,
          therapistSlug: data.therapist_slug,
          therapistName: data.therapist_name,
          clientName: data.client_name,
          phoneNumber: data.phone_number,
          notes: data.therapist_note,
          treatment: data.treatment,
          durationMinutes: data.duration_minutes,
          serviceLocation: data.service_location,
          locationDetails: data.address,
          date: data.appointment_date,
          time: data.appointment_time.slice(0, 5),
          timeZone: data.time_zone,
          price: Number(data.total),
          status: "confirmed",
          createdAt: data.created_at,
          demo: true,
        },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Supabase is not configured")) {
      console.error(error.message);
      return responseError("Booking details are temporarily unavailable.", 503);
    }
    console.error("Booking details could not be retrieved from Supabase.");
    return responseError("Booking details are temporarily unavailable.", 503);
  }
}
