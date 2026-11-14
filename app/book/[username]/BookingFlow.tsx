"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, format, isBefore, startOfDay, startOfMonth } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Globe2,
  LoaderCircle,
  MapPin,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  bookingHosts,
  getMockSlots,
  localDateTimeToUtc,
  readAppointment,
  saveAppointment,
  type Appointment,
  type BookingHost,
} from "@/lib/appointments";

const timezoneOptions = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Africa/Accra",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function getDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function getAvailableSlots(date: Date, username: string, timeZone: string) {
  return getMockSlots(date, username).filter(({ time }) => {
    return localDateTimeToUtc(getDateKey(date), time, timeZone).getTime() > Date.now();
  });
}

function formatSlot(date: Date, time: string, timeZone: string, use24Hour: boolean) {
  const instant = localDateTimeToUtc(getDateKey(date), time, timeZone);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: !use24Hour,
    timeZone,
  }).format(instant);
}

function MeetingIcon({ platform }: { platform: BookingHost["meetingPlatform"] }) {
  if (platform === "In person") return <MapPin aria-hidden="true" className="size-4" />;
  return <Video aria-hidden="true" className="size-4" />;
}

export default function BookingFlow({
  host,
  rescheduleId,
}: {
  host: BookingHost;
  rescheduleId?: string;
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedTime, setSelectedTime] = useState("");
  const [timeZone, setTimeZone] = useState("UTC");
  const [use24Hour, setUse24Hour] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const today = startOfDay(new Date());
  const lastBookableDay = addDays(today, 60);
  const selectedSlots = useMemo(
    () =>
      selectedDate
        ? getMockSlots(selectedDate, host.username)
        : [],
    [selectedDate, host.username],
  );
  const availableSlots = selectedDate
    ? getAvailableSlots(selectedDate, host.username, timeZone)
    : [];
  const detectedZoneLabel = useMemo(
    () => timeZone.replaceAll("_", " "),
    [timeZone],
  );

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTimeZone) setTimeZone(detectedTimeZone);
  }, []);

  useEffect(() => {
    if (!rescheduleId) return;

    try {
      const previous = readAppointment(rescheduleId);
      if (!previous || previous.hostUsername !== host.username || previous.status !== "confirmed") {
        setFormError("This appointment can’t be rescheduled. It may have already changed.");
        return;
      }

      setAttendeeName(previous.attendeeName);
      setAttendeeEmail(previous.attendeeEmail);
      setNotes(previous.notes);
      setShowDetailsForm(false);
    } catch {
      setFormError("We couldn’t load the saved appointment. Please try again.");
    }
  }, [host.username, rescheduleId]);

  function isDateDisabled(date: Date) {
    return (
      isBefore(startOfDay(date), today) ||
      isBefore(lastBookableDay, startOfDay(date)) ||
      getAvailableSlots(date, host.username, timeZone).length === 0
    );
  }

  function handleSelectDate(date?: Date) {
    setSelectedDate(date);
    setSelectedTime("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedDate || !selectedTime) {
      setFormError("Choose an available date and time to continue.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 550));
      const appointment: Appointment = {
        id: crypto.randomUUID(),
        hostUsername: host.username,
        hostName: host.name,
        hostTitle: host.title,
        hostImage: host.image,
        durationMinutes: host.durationMinutes,
        meetingPlatform: host.meetingPlatform,
        date: getDateKey(selectedDate),
        time: selectedTime,
        timeZone,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim(),
        notes: notes.trim(),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      saveAppointment(appointment, rescheduleId);
      router.push(`/booking/${appointment.id}`);
    } catch {
      setFormError(
        "We couldn’t save this booking in your browser. Check storage settings and try again.",
      );
      setIsSubmitting(false);
    }
  }

  const MeetingIconComponent = MeetingIcon;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight text-app-ink">
          Appi<span className="text-app-primary">.</span>
        </Link>
        <Badge variant="outline" className="gap-1.5 bg-app-surface px-3 py-1.5">
          <Check aria-hidden="true" className="size-3.5 text-app-success" />
          Secure booking
        </Badge>
      </header>

      {rescheduleId ? (
        <div className="mb-4 rounded-2xl border border-app-border bg-app-surface px-4 py-3 text-sm text-app-ink">
          Choose a new time for your appointment with {host.name}.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(17rem,0.82fr)_minmax(0,1.35fr)] lg:gap-8">
        <Card className="h-fit border-app-border bg-app-surface shadow-sm">
          <div className={`h-2 bg-gradient-to-r ${host.accent}`} />
          <CardHeader className="gap-4 p-5 sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative size-16 overflow-hidden rounded-full ring-4 ring-app-surface-muted">
                <Image
                  src={host.image}
                  alt={host.name}
                  fill
                  sizes="4rem"
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-sm text-app-ink-muted">{host.profession}</p>
                <CardTitle className="mt-1 text-xl font-semibold text-app-ink">
                  {host.name}
                </CardTitle>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold leading-tight text-app-ink">
                {host.title}
              </CardTitle>
              <CardDescription className="mt-2 leading-6 text-app-ink-muted">
                {host.description}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-6 sm:px-7">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1.5">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {host.durationMinutes} min
              </Badge>
              <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1.5">
                <MeetingIconComponent platform={host.meetingPlatform} />
                {host.meetingPlatform}
              </Badge>
            </div>
            <div className="rounded-2xl bg-app-surface-muted p-4">
              <p className="text-sm font-medium text-app-ink">A little about this session</p>
              <p className="mt-1 text-sm leading-6 text-app-ink-muted">
                A private, one-on-one appointment. Pick a time that works for you and
                we’ll send the details by email.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-app-border bg-app-surface shadow-sm">
          <CardHeader className="space-y-1 px-5 pt-5 sm:px-7 sm:pt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-app-primary">
              {showDetailsForm ? "Step 2 of 2" : "Step 1 of 2"}
            </p>
            <CardTitle className="text-2xl font-semibold text-app-ink">
              {showDetailsForm ? "Your details" : "Choose a date & time"}
            </CardTitle>
            <CardDescription className="text-app-ink-muted">
              {showDetailsForm
                ? "Add your details to confirm this appointment."
                : "Select an available day, then pick a time that suits you."}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 pb-5 sm:px-7 sm:pb-7">
            {showDetailsForm && selectedDate && selectedTime ? (
              <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
                <div className="flex items-start justify-between gap-3 rounded-2xl border border-app-border bg-app-surface-muted p-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-app-ink-muted">
                      Selected time
                    </p>
                    <p className="mt-1 font-semibold text-app-ink">
                      {format(selectedDate, "EEE, MMM d, yyyy")} ·{" "}
                      {formatSlot(selectedDate, selectedTime, timeZone, use24Hour)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-app-ink-muted">
                      <Globe2 aria-hidden="true" className="size-3.5" />
                      {detectedZoneLabel}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-xl"
                    onClick={() => setShowDetailsForm(false)}
                  >
                    <ArrowLeft aria-hidden="true" />
                    Change
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="attendee-name" className="text-sm font-medium text-app-ink">
                      Name
                    </label>
                    <Input
                      id="attendee-name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Your full name"
                      value={attendeeName}
                      onChange={(event) => setAttendeeName(event.target.value)}
                      className="h-11 rounded-xl border-app-border bg-app-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="attendee-email" className="text-sm font-medium text-app-ink">
                      Email
                    </label>
                    <Input
                      id="attendee-email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      placeholder="you@example.com"
                      value={attendeeEmail}
                      onChange={(event) => setAttendeeEmail(event.target.value)}
                      className="h-11 rounded-xl border-app-border bg-app-surface"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="attendee-notes" className="text-sm font-medium text-app-ink">
                      Notes <span className="font-normal text-app-ink-muted">· optional</span>
                    </label>
                    <textarea
                      id="attendee-notes"
                      rows={4}
                      maxLength={1000}
                      placeholder="What would you like to discuss?"
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="w-full resize-y rounded-xl border border-app-border bg-app-surface px-3 py-2.5 text-base text-app-ink outline-none placeholder:text-app-ink-muted focus-visible:ring-2 focus-visible:ring-app-focus md:text-sm"
                    />
                  </div>
                </div>

                {formError ? (
                  <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                    {formError}
                  </p>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-app-primary text-white hover:bg-app-primary-hover"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle aria-hidden="true" className="animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight aria-hidden="true" />
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-app-ink-muted">
                  No payment is collected in this demo.
                </p>
              </form>
            ) : (
              <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(18rem,1fr)_minmax(12rem,0.82fr)]">
                <section aria-label="Select appointment date" className="min-w-0">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-app-ink">
                    <CalendarDays aria-hidden="true" className="size-4 text-app-primary" />
                    Select a day
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-app-border">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={handleSelectDate}
                      disabled={(date) =>
                        isDateDisabled(date)
                      }
                      className="mx-auto bg-app-surface p-3"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-app-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-app-primary" />
                      Available
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-300" />
                      Unavailable
                    </span>
                  </div>
                </section>

                <section aria-label="Available appointment times" className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium text-app-ink">
                      {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Available times"}
                    </div>
                    <div className="inline-flex rounded-xl border border-app-border p-1">
                      <Button
                        type="button"
                        size="xs"
                        variant={!use24Hour ? "secondary" : "ghost"}
                        aria-pressed={!use24Hour}
                        onClick={() => setUse24Hour(false)}
                        className="rounded-lg"
                      >
                        12h
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant={use24Hour ? "secondary" : "ghost"}
                        aria-pressed={use24Hour}
                        onClick={() => setUse24Hour(true)}
                        className="rounded-lg"
                      >
                        24h
                      </Button>
                    </div>
                  </div>

                  <label htmlFor="booking-timezone" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-app-ink-muted">
                    <Globe2 aria-hidden="true" className="size-3.5" />
                    Your timezone
                  </label>
                  <select
                    id="booking-timezone"
                    value={timeZone}
                    onChange={(event) => setTimeZone(event.target.value)}
                    className="mb-4 h-10 w-full rounded-xl border border-app-border bg-app-surface px-3 text-sm text-app-ink outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
                  >
                    {!timezoneOptions.includes(timeZone) ? (
                      <option value={timeZone}>{timeZone.replaceAll("_", " ")}</option>
                    ) : null}
                    {timezoneOptions.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                      {selectedSlots.map((slot) => {
                        const isAvailable = availableSlots.some(
                          (available) => available.time === slot.time && available.available,
                        );
                        const isSelected = selectedTime === slot.time;
                        return (
                          <Button
                            key={slot.time}
                            type="button"
                            variant={isSelected ? "default" : "outline"}
                            disabled={!slot.available || !isAvailable}
                            aria-pressed={isSelected}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`h-11 rounded-xl ${
                              isSelected
                                ? "bg-app-primary text-white hover:bg-app-primary-hover"
                                : "border-app-border bg-app-surface text-app-ink"
                            }`}
                          >
                            {formatSlot(selectedDate, slot.time, timeZone, use24Hour)}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-app-border px-4 py-8 text-center">
                      <CalendarDays aria-hidden="true" className="mx-auto size-6 text-app-ink-muted" />
                      <p className="mt-2 text-sm font-medium text-app-ink">
                        Select a day to see times
                      </p>
                      <p className="mt-1 text-xs text-app-ink-muted">
                        Times are shown in {detectedZoneLabel}.
                      </p>
                    </div>
                  )}
                  {selectedDate && selectedSlots.length === 0 ? (
                    <p className="mt-3 text-sm text-app-ink-muted">
                      No times remain on this day. Choose another date.
                    </p>
                  ) : null}

                  {selectedTime ? (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => {
                        setShowDetailsForm(true);
                        setFormError("");
                      }}
                      className="mt-5 h-12 w-full rounded-xl bg-app-primary text-white hover:bg-app-primary-hover"
                    >
                      Continue
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  ) : null}
                </section>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-6 flex items-center justify-center gap-2 text-xs text-app-ink-muted">
        <Globe2 aria-hidden="true" className="size-3.5" />
        Times are displayed in {detectedZoneLabel}
      </footer>
    </div>
  );
}
