import type { Metadata } from "next";
import AppointmentManagement from "./AppointmentManagement";

type BookingManagementPageProps = {
  params: Promise<{ bookingId: string }>;
};

export async function generateMetadata({
  params,
}: BookingManagementPageProps): Promise<Metadata> {
  const { bookingId } = await params;
  return {
    title: `Appointment ${bookingId} | Appi`,
    description: "View and manage your Appi appointment.",
  };
}

export default async function BookingManagementPage({
  params,
}: BookingManagementPageProps) {
  const { bookingId } = await params;

  return (
    <main className="app-page min-h-screen flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <AppointmentManagement bookingId={bookingId} />
    </main>
  );
}
