"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  CalendarCheck2,
  CalendarPlus,
  Check,
  Clock3,
  Download,
  LoaderCircle,
  MapPin,
  RefreshCcw,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  escapeCalendarText,
  localDateTimeToUtc,
  readAppointment,
  setAppointmentStatus,
  type Appointment,
} from "@/lib/appointments";

type ManagementAction = "cancel" | "reschedule";

function formatUtcCalendarDate(date: Date) {
  return date.toISOString().replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}/, "");
}

function downloadIcs(appointment: Appointment) {
  const start = localDateTimeToUtc(
    appointment.date,
    appointment.time,
    appointment.timeZone,
  );
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  const description = [
    appointment.hostTitle,
    `With ${appointment.hostName}`,
    `Meeting: ${appointment.meetingPlatform}`,
    appointment.notes ? `Notes: ${appointment.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Appi//Appointment//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${appointment.id}@appi.local`,
    `DTSTAMP:${formatUtcCalendarDate(new Date())}`,
    `DTSTART:${formatUtcCalendarDate(start)}`,
    `DTEND:${formatUtcCalendarDate(end)}`,
    `SUMMARY:${escapeCalendarText(appointment.hostTitle)}`,
    `DESCRIPTION:${escapeCalendarText(description)}`,
    `LOCATION:${escapeCalendarText(appointment.meetingPlatform)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([calendar], { type: "text/calendar;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `appi-appointment-${appointment.id}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getGoogleCalendarUrl(appointment: Appointment) {
  const start = localDateTimeToUtc(
    appointment.date,
    appointment.time,
    appointment.timeZone,
  );
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: appointment.hostTitle,
    dates: `${formatUtcCalendarDate(start)}/${formatUtcCalendarDate(end)}`,
    details: `One-on-one with ${appointment.hostName}. ${appointment.notes}`,
    location: appointment.meetingPlatform,
    ctz: appointment.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function AppointmentManagement({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<ManagementAction | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setAppointment(readAppointment(bookingId) ?? null);
      } catch {
        setError("We couldn’t read your saved appointment from this browser.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [bookingId]);

  function confirmAction() {
    if (!appointment || !pendingAction) return;

    if (pendingAction === "reschedule") {
      router.push(
        `/book/${appointment.hostUsername}?reschedule=${encodeURIComponent(appointment.id)}`,
      );
      return;
    }

    setIsWorking(true);
    try {
      setAppointmentStatus(appointment.id, "cancelled");
      setAppointment({ ...appointment, status: "cancelled" });
      setPendingAction(null);
    } catch {
      setError("We couldn’t update this appointment. Please try again.");
    } finally {
      setIsWorking(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-app-border bg-app-surface">
          <CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-app-ink-muted">
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
            Loading your appointment…
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <Card className="mx-auto max-w-xl border-app-border bg-app-surface">
        <CardHeader>
          <Badge variant="destructive" className="w-fit">Appointment unavailable</Badge>
          <CardTitle className="text-2xl text-app-ink">We couldn’t find this booking</CardTitle>
          <CardDescription className="text-app-ink-muted">
            {error || "This appointment may have been created in another browser or device."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="rounded-xl bg-app-primary text-white hover:bg-app-primary-hover">
            <Link href="/book/alex-morgan">
              <ArrowLeft aria-hidden="true" />
              Browse available times
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isConfirmed = appointment.status === "confirmed";
  const statusLabel =
    appointment.status === "confirmed"
      ? "Confirmed"
      : appointment.status === "cancelled"
        ? "Cancelled"
        : "Rescheduled";
  const start = localDateTimeToUtc(
    appointment.date,
    appointment.time,
    appointment.timeZone,
  );
  const startDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: appointment.timeZone,
  }).format(start);
  const startTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: appointment.timeZone,
  }).format(start);

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-app-ink-muted hover:text-app-ink">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to Appi
      </Link>

      <Card className="overflow-hidden border-app-border bg-app-surface shadow-sm">
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <CardHeader className="items-center px-5 pt-8 text-center sm:px-8">
          <div className={`flex size-14 items-center justify-center rounded-full ${
            isConfirmed ? "bg-emerald-100 text-emerald-700" : "bg-app-surface-muted text-app-ink-muted"
          }`}>
            {isConfirmed ? (
              <Check aria-hidden="true" className="size-7" />
            ) : appointment.status === "cancelled" ? (
              <Ban aria-hidden="true" className="size-6" />
            ) : (
              <RefreshCcw aria-hidden="true" className="size-6" />
            )}
          </div>
          <Badge variant={isConfirmed ? "secondary" : "outline"} className="mt-2">
            {statusLabel}
          </Badge>
          <CardTitle className="mt-1 text-2xl font-semibold text-app-ink sm:text-3xl">
            {isConfirmed ? "You’re all booked" : `Appointment ${appointment.status}`}
          </CardTitle>
          <CardDescription className="max-w-md text-app-ink-muted">
            {isConfirmed
              ? `Your session with ${appointment.hostName} is confirmed. We’ve saved the details in this browser.`
              : "You can still review the appointment details below."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="flex items-center gap-4 rounded-2xl bg-app-surface-muted p-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
              <Image
                src={appointment.hostImage}
                alt={appointment.hostName}
                fill
                sizes="3.5rem"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-app-ink-muted">Your host</p>
              <p className="font-semibold text-app-ink">{appointment.hostName}</p>
              <p className="text-sm text-app-ink-muted">{appointment.hostTitle}</p>
            </div>
          </div>

          <dl className="divide-y divide-app-border rounded-2xl border border-app-border px-4">
            <div className="flex items-start gap-3 py-4">
              <CalendarCheck2 aria-hidden="true" className="mt-0.5 size-4 text-app-primary" />
              <div>
                <dt className="text-xs text-app-ink-muted">Date</dt>
                <dd className="mt-1 text-sm font-medium text-app-ink">{startDate}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-4">
              <Clock3 aria-hidden="true" className="mt-0.5 size-4 text-app-primary" />
              <div>
                <dt className="text-xs text-app-ink-muted">Time</dt>
                <dd className="mt-1 text-sm font-medium text-app-ink">
                  {startTime} · {appointment.timeZone} · {appointment.durationMinutes} min
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-4">
              {appointment.meetingPlatform === "In person" ? (
                <MapPin aria-hidden="true" className="mt-0.5 size-4 text-app-primary" />
              ) : (
                <Video aria-hidden="true" className="mt-0.5 size-4 text-app-primary" />
              )}
              <div>
                <dt className="text-xs text-app-ink-muted">Meeting location</dt>
                <dd className="mt-1 text-sm font-medium text-app-ink">{appointment.meetingPlatform}</dd>
                <dd className="mt-1 text-xs text-app-ink-muted">
                  Meeting details will be shared by email.
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 py-4">
              <span aria-hidden="true" className="mt-0.5 size-4 text-center text-xs font-bold text-app-primary">@</span>
              <div>
                <dt className="text-xs text-app-ink-muted">Booked for</dt>
                <dd className="mt-1 text-sm font-medium text-app-ink">{appointment.attendeeName}</dd>
                <dd className="text-sm text-app-ink-muted">{appointment.attendeeEmail}</dd>
              </div>
            </div>
            {appointment.notes ? (
              <div className="flex items-start gap-3 py-4">
                <span aria-hidden="true" className="mt-0.5 size-4 text-center text-xs text-app-primary">✎</span>
                <div>
                  <dt className="text-xs text-app-ink-muted">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-app-ink">{appointment.notes}</dd>
                </div>
              </div>
            ) : null}
          </dl>

          {error ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {isConfirmed ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => downloadIcs(appointment)}
                  className="h-11 rounded-xl border-app-border"
                >
                  <Download aria-hidden="true" />
                  Download .ics
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-app-border"
                >
                  <a
                    href={getGoogleCalendarUrl(appointment)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CalendarPlus aria-hidden="true" />
                    Google Calendar
                  </a>
                </Button>
              </div>

              <div className="grid gap-3 border-t border-app-border pt-5 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPendingAction("reschedule")}
                  className="h-11 rounded-xl border-app-border"
                >
                  <RefreshCcw aria-hidden="true" />
                  Reschedule
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setPendingAction("cancel")}
                  className="h-11 rounded-xl"
                >
                  <Ban aria-hidden="true" />
                  Cancel appointment
                </Button>
              </div>
            </>
          ) : (
            <Button asChild variant="outline" className="h-11 w-full rounded-xl">
              <Link href={`/book/${appointment.hostUsername}`}>
                Book another session
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open && !isWorking) setPendingAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "cancel"
                ? "Cancel this appointment?"
                : "Reschedule this appointment?"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "cancel"
                ? "This will mark your appointment as cancelled in this browser."
                : "You’ll choose a new date and time. Your current booking stays active until you confirm the replacement."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isWorking}
              onClick={() => setPendingAction(null)}
            >
              Keep appointment
            </Button>
            <Button
              type="button"
              variant={pendingAction === "cancel" ? "destructive" : "default"}
              disabled={isWorking}
              onClick={confirmAction}
              className={pendingAction === "reschedule" ? "bg-app-primary text-white hover:bg-app-primary-hover" : ""}
            >
              {isWorking ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : pendingAction === "cancel" ? (
                "Yes, cancel"
              ) : (
                "Choose a new time"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
