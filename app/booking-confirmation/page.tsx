import type { Metadata } from "next";
import BookingConfirmationClient from "./BookingConfirmationClient";

export const metadata: Metadata = {
  title: "Booking Summary | Appi",
  description: "Review your massage booking details on Appi.",
};

type SearchParams = Promise<{
  bookingId?: string | string[];
}>;

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const bookingId = Array.isArray(params.bookingId)
    ? params.bookingId[0]
    : params.bookingId;

  return (
    <main className="app-page min-h-screen flex-1 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto w-full max-w-2xl">
        <BookingConfirmationClient bookingId={bookingId} />
      </div>
    </main>
  );
}
