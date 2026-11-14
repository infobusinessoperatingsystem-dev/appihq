import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingFlow from "./BookingFlow";
import { bookingHosts } from "@/lib/appointments";

type BookingPageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ reschedule?: string | string[] }>;
};

export function generateStaticParams() {
  return bookingHosts.map((host) => ({ username: host.username }));
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { username } = await params;
  const host = bookingHosts.find((item) => item.username === username);

  return {
    title: host ? `Book a session with ${host.name} | Appi` : "Book a session | Appi",
  };
}

export default async function PublicBookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const [{ username }, query] = await Promise.all([params, searchParams]);
  const host = bookingHosts.find((item) => item.username === username);

  if (!host) notFound();

  const rescheduleValue = query.reschedule;
  const rescheduleId = Array.isArray(rescheduleValue)
    ? rescheduleValue[0]
    : rescheduleValue;

  return (
    <main className="app-page min-h-screen flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <BookingFlow host={host} rescheduleId={rescheduleId} />
    </main>
  );
}
