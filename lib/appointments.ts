export type MeetingPlatform = "Google Meet" | "Zoom" | "In person";
export type AppointmentStatus = "confirmed" | "cancelled" | "rescheduled";

export type BookingHost = {
  username: string;
  name: string;
  title: string;
  profession: string;
  durationMinutes: number;
  meetingPlatform: MeetingPlatform;
  description: string;
  image: string;
  accent: string;
};

export type Appointment = {
  id: string;
  hostUsername: string;
  hostName: string;
  hostTitle: string;
  hostImage: string;
  durationMinutes: number;
  meetingPlatform: MeetingPlatform;
  date: string;
  time: string;
  timeZone: string;
  attendeeName: string;
  attendeeEmail: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
};

export const bookingHosts: BookingHost[] = [
  {
    username: "alex-morgan",
    name: "Alex Morgan",
    title: "Product strategy session",
    profession: "Product strategist",
    durationMinutes: 30,
    meetingPlatform: "Google Meet",
    description:
      "A focused one-on-one to work through your product challenge and leave with a clear next step.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=85",
    accent: "from-indigo-500 to-violet-500",
  },
  {
    username: "jordan-lee",
    name: "Jordan Lee",
    title: "Career coaching",
    profession: "Career coach",
    durationMinutes: 45,
    meetingPlatform: "Zoom",
    description:
      "Get practical support for your next career move, interview, or professional challenge.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=85",
    accent: "from-sky-500 to-cyan-500",
  },
  {
    username: "sam-rivera",
    name: "Sam Rivera",
    title: "Creative consultation",
    profession: "Creative director",
    durationMinutes: 30,
    meetingPlatform: "Google Meet",
    description:
      "Bring an idea, a brief, or a creative roadblock. We’ll shape the next move together.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=85",
    accent: "from-emerald-500 to-teal-500",
  },
];

const APPOINTMENTS_STORAGE_KEY = "appi.appointments.v1";

const mockTimes = ["09:00", "09:30", "10:00", "11:00", "13:00", "14:30", "15:00", "16:00"];

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMockSlots(date: Date, username: string) {
  const dateKey = localDateKey(date);
  const day = new Date(`${dateKey}T12:00:00`).getDay();
  const dayNumber = Number(dateKey.slice(-2));
  const hostOffset = bookingHosts.findIndex((host) => host.username === username);

  if (day === 0 || day === 6 || (dayNumber + hostOffset) % 6 === 0) return [];

  return mockTimes.map((time, index) => ({
    time,
    available: (index + dayNumber + hostOffset) % 4 !== 0,
  }));
}

function isAppointment(value: unknown): value is Appointment {
  if (!value || typeof value !== "object") return false;
  const appointment = value as Partial<Appointment>;

  return (
    typeof appointment.id === "string" &&
    typeof appointment.hostUsername === "string" &&
    typeof appointment.hostName === "string" &&
    typeof appointment.hostTitle === "string" &&
    typeof appointment.hostImage === "string" &&
    typeof appointment.durationMinutes === "number" &&
    (appointment.meetingPlatform === "Google Meet" ||
      appointment.meetingPlatform === "Zoom" ||
      appointment.meetingPlatform === "In person") &&
    typeof appointment.date === "string" &&
    typeof appointment.time === "string" &&
    typeof appointment.timeZone === "string" &&
    typeof appointment.attendeeName === "string" &&
    typeof appointment.attendeeEmail === "string" &&
    typeof appointment.notes === "string" &&
    (appointment.status === "confirmed" ||
      appointment.status === "cancelled" ||
      appointment.status === "rescheduled") &&
    typeof appointment.createdAt === "string"
  );
}

export function readAppointments(): Appointment[] {
  const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isAppointment)) {
    throw new Error("Saved booking data is invalid.");
  }
  return parsed;
}

export function readAppointment(id: string) {
  return readAppointments().find((appointment) => appointment.id === id);
}

export function saveAppointment(appointment: Appointment, rescheduleId?: string) {
  const appointments = readAppointments();
  let nextAppointments = appointments;

  if (rescheduleId) {
    const previousAppointment = appointments.find(
      (saved) => saved.id === rescheduleId,
    );
    if (!previousAppointment || previousAppointment.status !== "confirmed") {
      throw new Error("The appointment you’re rescheduling is no longer active.");
    }

    nextAppointments = appointments.map((saved) =>
      saved.id === rescheduleId
        ? { ...saved, status: "rescheduled" as const }
        : saved,
    );
  }

  window.localStorage.setItem(
    APPOINTMENTS_STORAGE_KEY,
    JSON.stringify([appointment, ...nextAppointments]),
  );
}

export function setAppointmentStatus(
  id: string,
  status: "cancelled" | "rescheduled",
) {
  const appointments = readAppointments();
  let found = false;
  const nextAppointments = appointments.map((appointment) => {
    if (appointment.id !== id) return appointment;
    found = true;
    return { ...appointment, status };
  });

  if (!found) throw new Error("This appointment could not be found.");
  window.localStorage.setItem(
    APPOINTMENTS_STORAGE_KEY,
    JSON.stringify(nextAppointments),
  );
}

export function localDateTimeToUtc(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = desiredUtc;

  for (let iteration = 0; iteration < 3; iteration += 1) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(guess));
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const representedUtc = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
    );
    guess += desiredUtc - representedUtc;
  }

  return new Date(guess);
}

export function formatAppointmentDateTime(appointment: Appointment) {
  const start = localDateTimeToUtc(
    appointment.date,
    appointment.time,
    appointment.timeZone,
  );
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: appointment.timeZone,
    timeZoneName: "short",
  }).format(start);
}

export function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
