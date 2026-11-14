export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type MeetingMode = "video" | "phone" | "in-person";

export type AvailabilityBreak = {
  id: string;
  startTime: string;
  endTime: string;
};

export type WeeklyHours = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  breaks: AvailabilityBreak[];
};

export type ProviderSettings = {
  sessionDurationMinutes: 30 | 45 | 60;
  bufferMinutes: 0 | 10 | 15;
  sessionFee: number;
  meetingModes: MeetingMode[];
  weeklyHours: Record<Weekday, WeeklyHours>;
  blockedDates: string[];
};

export type ProviderAvailabilityDay = {
  date: string;
  startTime: string;
  endTime: string;
  breaks: AvailabilityBreak[];
};

const STORAGE_KEY = "appi.provider-settings.v1";
const CHANGE_EVENT = "appi:provider-settings-change";
const PROVIDER_TIME_ZONE = "Africa/Accra";
export const weekdays: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const dayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const weekdayByJsDay: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function isTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isAvailabilityBreak(value: unknown): value is AvailabilityBreak {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<AvailabilityBreak>;
  return (
    typeof item.id === "string" &&
    isTime(item.startTime) &&
    isTime(item.endTime)
  );
}

function isWeeklyHours(value: unknown): value is WeeklyHours {
  if (!value || typeof value !== "object") return false;
  const hours = value as Partial<WeeklyHours>;
  return (
    typeof hours.enabled === "boolean" &&
    isTime(hours.startTime) &&
    isTime(hours.endTime) &&
    Array.isArray(hours.breaks) &&
    hours.breaks.every(isAvailabilityBreak)
  );
}

export function isProviderSettings(value: unknown): value is ProviderSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Partial<ProviderSettings>;
  return (
    (settings.sessionDurationMinutes === 30 ||
      settings.sessionDurationMinutes === 45 ||
      settings.sessionDurationMinutes === 60) &&
    (settings.bufferMinutes === 0 ||
      settings.bufferMinutes === 10 ||
      settings.bufferMinutes === 15) &&
    typeof settings.sessionFee === "number" &&
    Number.isFinite(settings.sessionFee) &&
    settings.sessionFee >= 0 &&
    Array.isArray(settings.meetingModes) &&
    settings.meetingModes.every(
      (mode) => mode === "video" || mode === "phone" || mode === "in-person",
    ) &&
    !!settings.weeklyHours &&
    weekdays.every((day) => isWeeklyHours(settings.weeklyHours?.[day])) &&
    Array.isArray(settings.blockedDates) &&
    settings.blockedDates.every((date) => typeof date === "string")
  );
}

export function createDefaultProviderSettings(
  sessionFee = 800,
): ProviderSettings {
  const defaultDay = (enabled: boolean): WeeklyHours => ({
    enabled,
    startTime: "09:00",
    endTime: "17:00",
    breaks: [],
  });
  const weeklyHours: Record<Weekday, WeeklyHours> = {
    monday: defaultDay(true),
    tuesday: defaultDay(true),
    wednesday: defaultDay(true),
    thursday: defaultDay(true),
    friday: defaultDay(true),
    saturday: defaultDay(true),
    sunday: defaultDay(false),
  };

  return {
    sessionDurationMinutes: 60,
    bufferMinutes: 10,
    sessionFee,
    meetingModes: ["in-person"],
    weeklyHours,
    blockedDates: [],
  };
}

function readSettingsMap(): Record<string, ProviderSettings> {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Saved provider settings are invalid.");
  }

  const entries = Object.entries(parsed);
  if (!entries.every(([, value]) => isProviderSettings(value))) {
    throw new Error("Saved provider settings are invalid.");
  }

  return Object.fromEntries(entries) as Record<string, ProviderSettings>;
}

export function readProviderSettings(providerSlug: string) {
  return readSettingsMap()[providerSlug];
}

export function saveProviderSettings(
  providerSlug: string,
  settings: ProviderSettings,
) {
  if (!isProviderSettings(settings)) {
    throw new Error("Provider settings are invalid.");
  }

  const settingsByProvider = readSettingsMap();
  settingsByProvider[providerSlug] = settings;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(settingsByProvider),
  );
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function subscribeToProviderSettings(
  listener: () => void,
) {
  const handleChange = () => listener();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };

  window.addEventListener(CHANGE_EVENT, handleChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, handleChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getProviderAvailability(
  settings: ProviderSettings,
  fromDate = new Date(),
  days = 60,
): ProviderAvailabilityDay[] {
  const dates: ProviderAvailabilityDay[] = [];
  const firstDateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PROVIDER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(fromDate);
  const firstDate = new Date(
    Date.UTC(
      Number(firstDateParts.find((part) => part.type === "year")?.value),
      Number(firstDateParts.find((part) => part.type === "month")?.value) - 1,
      Number(firstDateParts.find((part) => part.type === "day")?.value),
      12,
    ),
  );

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(firstDate);
    date.setUTCDate(date.getUTCDate() + offset);
    const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    if (settings.blockedDates.includes(dateKey)) continue;

    const daySettings = settings.weeklyHours[weekdayByJsDay[date.getUTCDay()]];
    if (!daySettings.enabled) continue;

    dates.push({
      date: dateKey,
      startTime: daySettings.startTime,
      endTime: daySettings.endTime,
      breaks: daySettings.breaks,
    });
  }

  return dates;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

export function getProviderTimeSlots(
  dateKey: string,
  settings: ProviderSettings,
  now = new Date(),
) {
  if (settings.blockedDates.includes(dateKey)) return [];

  const day = new Date(`${dateKey}T12:00:00Z`);
  const daySettings = settings.weeklyHours[weekdayByJsDay[day.getUTCDay()]];
  if (!daySettings.enabled) return [];

  const start = timeToMinutes(daySettings.startTime);
  const end = timeToMinutes(daySettings.endTime);
  const sessionMinutes = settings.sessionDurationMinutes;
  const nextStartOffset =
    Math.ceil((sessionMinutes + settings.bufferMinutes) / 15) * 15;
  const nowParts = new Intl.DateTimeFormat("en-US", {
    timeZone: PROVIDER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const nowValues = Object.fromEntries(nowParts.map((part) => [part.type, part.value]));
  const todayKey = `${nowValues.year}-${nowValues.month}-${nowValues.day}`;
  const currentMinute = Number(nowValues.hour) * 60 + Number(nowValues.minute);
  const slots: string[] = [];

  const breaks = [...daySettings.breaks]
    .map((breakTime) => ({
      start: timeToMinutes(breakTime.startTime),
      end: timeToMinutes(breakTime.endTime),
    }))
    .sort((a, b) => a.start - b.start);
  const segments: { start: number; end: number }[] = [];
  let segmentStart = start;

  for (const breakTime of breaks) {
    if (breakTime.start > segmentStart) {
      segments.push({ start: segmentStart, end: breakTime.start });
    }
    segmentStart = Math.max(segmentStart, breakTime.end);
  }
  if (segmentStart < end) segments.push({ start: segmentStart, end });

  for (const segment of segments) {
    for (
      let slotStart = segment.start;
      slotStart + sessionMinutes <= segment.end;
      slotStart += nextStartOffset
    ) {
      if (dateKey === todayKey && slotStart <= currentMinute) continue;
      slots.push(minutesToTime(slotStart));
    }
  }

  return slots;
}

export function validateProviderSettings(settings: ProviderSettings) {
  if (settings.meetingModes.length === 0) {
    return "Choose at least one meeting mode.";
  }

  for (const day of weekdays) {
    const hours = settings.weeklyHours[day];
    if (!hours.enabled) continue;
    const start = timeToMinutes(hours.startTime);
    const end = timeToMinutes(hours.endTime);
    if (start >= end) {
      return `${dayLabels[day]} must end after it starts.`;
    }

    const breaks = [...hours.breaks]
      .map((item) => ({
        start: timeToMinutes(item.startTime),
        end: timeToMinutes(item.endTime),
      }))
      .sort((a, b) => a.start - b.start);

    for (let index = 0; index < breaks.length; index += 1) {
      const current = breaks[index];
      const previous = breaks[index - 1];
      if (
        current.start < start ||
        current.end > end ||
        current.start >= current.end ||
        (previous && current.start < previous.end)
      ) {
        return `Check the break times on ${dayLabels[day]}.`;
      }
    }
  }

  return null;
}

export function formatDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PROVIDER_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}
