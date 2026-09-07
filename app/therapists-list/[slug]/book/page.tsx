import BookingClient from "../../BookingClient";
export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-zinc-50 pt-4 pb-8 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto w-full max-w-3xl px-4">
        <BookingClient />
      </div>
    </main>
  );
}
