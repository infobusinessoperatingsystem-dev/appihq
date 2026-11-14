"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { therapists, type Therapist } from "@/app/therapists-list/therapists";
import {
  createDefaultProviderSettings,
  formatDateKey,
  readProviderSettings,
  saveProviderSettings,
  validateProviderSettings,
  weekdays,
  type ProviderSettings,
  type Weekday,
} from "@/lib/provider-settings";

const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const minutes = index * 15;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

const dayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function getDefaultFee(therapist: Therapist) {
  const prices = therapist.massageOfferings?.map(({ price }) => price) ?? [];
  return prices.length ? Math.min(...prices) : 0;
}

function formatLongDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export default function AvailabilityClient() {
  const [providerSlug, setProviderSlug] = useState(therapists[0]?.slug ?? "");
  const [settings, setSettings] = useState<ProviderSettings>(() =>
    createDefaultProviderSettings(therapists[0] ? getDefaultFee(therapists[0]) : 0),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dateToBlock, setDateToBlock] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const selectedProvider =
    therapists.find((therapist) => therapist.slug === providerSlug) ?? therapists[0];

  useEffect(() => {
    let active = true;
    const frame = requestAnimationFrame(() => {
      try {
        const saved = readProviderSettings(providerSlug);
        const therapist = therapists.find((item) => item.slug === providerSlug);
        if (active && therapist) {
          setSettings(saved ?? createDefaultProviderSettings(getDefaultFee(therapist)));
          setErrorMessage("");
          setLoadError("");
        }
      } catch {
        if (active) {
          setLoadError(
            "Saved provider settings couldn’t be read from this browser. Check storage settings and retry.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    });

    return () => {
      active = false;
      cancelAnimationFrame(frame);
    };
  }, [providerSlug, retryCount]);

  function updateDay(
    day: Weekday,
    changes: Partial<ProviderSettings["weeklyHours"][Weekday]>,
  ) {
    setSettings((current) => ({
      ...current,
      weeklyHours: {
        ...current.weeklyHours,
        [day]: { ...current.weeklyHours[day], ...changes },
      },
    }));
    setSaveMessage("");
    setErrorMessage("");
  }

  function updateSettings(changes: Partial<ProviderSettings>) {
    setSettings((current) => ({ ...current, ...changes }));
    setSaveMessage("");
    setErrorMessage("");
  }

  function toggleMeetingMode(mode: ProviderSettings["meetingModes"][number]) {
    const meetingModes = settings.meetingModes.includes(mode)
      ? settings.meetingModes.filter((item) => item !== mode)
      : [...settings.meetingModes, mode];
    updateSettings({ meetingModes });
  }

  function addBreak(day: Weekday) {
    const hours = settings.weeklyHours[day];
    updateDay(day, {
      breaks: [
        ...hours.breaks,
        {
          id: crypto.randomUUID(),
          startTime: "12:00",
          endTime: "13:00",
        },
      ],
    });
  }

  function save() {
    if (!selectedProvider) return;
    const validationError = validateProviderSettings(settings);
    if (validationError) {
      setErrorMessage(validationError);
      setSaveMessage("");
      return;
    }

    try {
      saveProviderSettings(providerSlug, settings);
      setErrorMessage("");
      setSaveMessage(
        `Availability saved for ${selectedProvider.firstName}. Your public booking times are updated on this device.`,
      );
    } catch {
      setSaveMessage("");
      setErrorMessage(
        "Your availability couldn’t be saved. Check this browser’s storage settings and try again.",
      );
    }
  }

  function addBlockedDate() {
    if (!dateToBlock || settings.blockedDates.includes(dateToBlock)) return;
    updateSettings({
      blockedDates: [...settings.blockedDates, dateToBlock].sort(),
    });
    setDateToBlock("");
  }

  const meetingModes = [
    { value: "video", label: "Video call" },
    { value: "phone", label: "Phone / WhatsApp" },
    { value: "in-person", label: "In person" },
  ] as const;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-app-ink sm:text-2xl">
            Availability & session settings
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-app-ink-muted">
            Set the hours and session details clients can book. This demo stores
            provider settings in this browser.
          </p>
        </div>
        <label className="grid gap-1.5 text-sm font-medium text-app-ink">
          Manage provider
          <select
            value={providerSlug}
            onChange={(event) => {
              setProviderSlug(event.target.value);
              setIsLoading(true);
              setSaveMessage("");
              setErrorMessage("");
            }}
            className="h-11 min-w-56 rounded-md border border-app-border bg-app-surface px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
          >
            {therapists.map((therapist) => (
              <option key={therapist.slug} value={therapist.slug}>
                {therapist.firstName} · {therapist.location}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? (
        <div className="app-surface rounded-md p-6 text-sm text-app-ink-muted">
          Loading saved settings…
        </div>
      ) : loadError ? (
        <section role="alert" className="app-surface rounded-md border border-red-200 p-6">
          <h3 className="font-semibold text-app-ink">We couldn’t load provider settings</h3>
          <p className="mt-2 text-sm leading-6 text-app-ink-muted">{loadError}</p>
          <Button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setRetryCount((count) => count + 1);
            }}
            className="mt-4 bg-app-primary text-white hover:bg-app-primary-hover"
          >
            Retry
          </Button>
        </section>
      ) : (
        <div className="space-y-5">
          {errorMessage ? (
            <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {errorMessage}
            </p>
          ) : null}
          {saveMessage ? (
            <p role="status" aria-live="polite" className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
              <Check aria-hidden="true" className="mr-2 inline size-4" />
              {saveMessage}
            </p>
          ) : null}

          <section aria-labelledby="session-settings-heading" className="app-surface rounded-md p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 id="session-settings-heading" className="text-lg font-semibold text-app-ink">
                Session settings
              </h3>
              <p className="mt-1 text-sm text-app-ink-muted">
                These details are used when clients book a session with {selectedProvider?.firstName}.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-app-ink">
                Session duration
                <select
                  value={settings.sessionDurationMinutes}
                  onChange={(event) =>
                    updateSettings({
                      sessionDurationMinutes: Number(event.target.value) as ProviderSettings["sessionDurationMinutes"],
                    })
                  }
                  className="h-11 rounded-md border border-app-border bg-app-surface px-3 outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
                >
                  {[30, 45, 60].map((minutes) => (
                    <option key={minutes} value={minutes}>{minutes} minutes</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-app-ink">
                Buffer between sessions
                <select
                  value={settings.bufferMinutes}
                  onChange={(event) =>
                    updateSettings({
                      bufferMinutes: Number(event.target.value) as ProviderSettings["bufferMinutes"],
                    })
                  }
                  className="h-11 rounded-md border border-app-border bg-app-surface px-3 outline-none focus-visible:ring-2 focus-visible:ring-app-focus"
                >
                  {[0, 10, 15].map((minutes) => (
                    <option key={minutes} value={minutes}>{minutes} minutes</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-app-ink">
                Session fee (GHS)
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.sessionFee}
                  onChange={(event) =>
                    updateSettings({ sessionFee: Number(event.target.value) })
                  }
                  className="h-11 rounded-md border-app-border"
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-medium text-app-ink">Meeting modes</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {meetingModes.map(({ value, label }) => {
                  const selected = settings.meetingModes.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMeetingMode(value)}
                      className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                        selected
                          ? "border-app-primary bg-app-surface-muted text-app-primary"
                          : "border-app-border bg-app-surface text-app-ink-muted hover:border-app-primary"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </section>

          <section aria-labelledby="weekly-hours-heading" className="app-surface rounded-md p-4 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 id="weekly-hours-heading" className="text-lg font-semibold text-app-ink">
                Weekly recurring hours
              </h3>
              <p className="mt-1 text-sm text-app-ink-muted">
                Add breaks to split a day into separate bookable periods.
              </p>
            </div>
            <div className="space-y-3">
              {weekdays.map((day) => {
                const hours = settings.weeklyHours[day];
                return (
                  <article key={day} className="rounded-md border border-app-border p-3 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={hours.enabled}
                          aria-label={`${dayLabels[day]} availability`}
                          onClick={() => updateDay(day, { enabled: !hours.enabled })}
                          className={`relative h-6 w-11 rounded-full transition-colors ${hours.enabled ? "bg-app-primary" : "bg-slate-300"}`}
                        >
                          <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${hours.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                        <h4 className="min-w-24 text-sm font-semibold text-app-ink">
                          {dayLabels[day]}
                        </h4>
                        {!hours.enabled ? (
                          <span className="text-sm text-app-ink-muted">Unavailable</span>
                        ) : null}
                      </div>
                      {hours.enabled ? (
                        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-64">
                          <label className="grid gap-1 text-xs text-app-ink-muted">
                            Start
                            <select
                              value={hours.startTime}
                              onChange={(event) => updateDay(day, { startTime: event.target.value })}
                              className="h-10 rounded-md border border-app-border bg-app-surface px-2 text-sm text-app-ink"
                            >
                              {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                            </select>
                          </label>
                          <label className="grid gap-1 text-xs text-app-ink-muted">
                            End
                            <select
                              value={hours.endTime}
                              onChange={(event) => updateDay(day, { endTime: event.target.value })}
                              className="h-10 rounded-md border border-app-border bg-app-surface px-2 text-sm text-app-ink"
                            >
                              {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                            </select>
                          </label>
                        </div>
                      ) : null}
                    </div>

                    {hours.enabled ? (
                      <>
                        {hours.breaks.map((breakTime) => (
                          <div key={breakTime.id} className="mt-3 rounded-md bg-app-surface-muted p-3">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-app-ink-muted">
                                Break / split shift
                              </p>
                              <button
                                type="button"
                                aria-label={`Remove ${dayLabels[day]} break`}
                                onClick={() =>
                                  updateDay(day, {
                                    breaks: hours.breaks.filter((item) => item.id !== breakTime.id),
                                  })
                                }
                                className="rounded p-1 text-app-ink-muted hover:text-red-700"
                              >
                                <Trash2 aria-hidden="true" className="size-4" />
                              </button>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <label className="grid gap-1 text-xs text-app-ink-muted">
                                Break starts
                                <select
                                  value={breakTime.startTime}
                                  onChange={(event) =>
                                    updateDay(day, {
                                      breaks: hours.breaks.map((item) =>
                                        item.id === breakTime.id
                                          ? { ...item, startTime: event.target.value }
                                          : item,
                                      ),
                                    })
                                  }
                                  className="h-10 rounded-md border border-app-border bg-app-surface px-2 text-sm text-app-ink"
                                >
                                  {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                                </select>
                              </label>
                              <label className="grid gap-1 text-xs text-app-ink-muted">
                                Break ends
                                <select
                                  value={breakTime.endTime}
                                  onChange={(event) =>
                                    updateDay(day, {
                                      breaks: hours.breaks.map((item) =>
                                        item.id === breakTime.id
                                          ? { ...item, endTime: event.target.value }
                                          : item,
                                      ),
                                    })
                                  }
                                  className="h-10 rounded-md border border-app-border bg-app-surface px-2 text-sm text-app-ink"
                                >
                                  {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
                                </select>
                              </label>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => addBreak(day)}
                          className="mt-2 min-h-9 px-2 text-app-primary"
                        >
                          <Plus aria-hidden="true" className="size-4" />
                          Add break / split shift
                        </Button>
                      </>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="time-off-heading" className="app-surface rounded-md p-4 shadow-sm sm:p-6">
            <div className="mb-4">
              <h3 id="time-off-heading" className="text-lg font-semibold text-app-ink">
                Date overrides & time off
              </h3>
              <p className="mt-1 text-sm text-app-ink-muted">
                Block specific dates without changing your weekly schedule.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="date-to-block">Choose a date to block</label>
              <Input
                id="date-to-block"
                type="date"
                min={formatDateKey(new Date())}
                value={dateToBlock}
                onChange={(event) => setDateToBlock(event.target.value)}
                className="h-11 border-app-border sm:max-w-xs"
              />
              <Button
                type="button"
                variant="outline"
                disabled={!dateToBlock || settings.blockedDates.includes(dateToBlock)}
                onClick={addBlockedDate}
                className="h-11 border-app-border"
              >
                <Plus aria-hidden="true" className="size-4" />
                Block date
              </Button>
            </div>
            {settings.blockedDates.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {settings.blockedDates.map((date) => (
                  <li key={date} className="inline-flex items-center gap-2 rounded-full border border-app-border bg-app-surface-muted px-3 py-1.5 text-sm text-app-ink">
                    {formatLongDate(date)}
                    <button
                      type="button"
                      aria-label={`Remove blocked date ${formatLongDate(date)}`}
                      onClick={() =>
                        updateSettings({
                          blockedDates: settings.blockedDates.filter((item) => item !== date),
                        })
                      }
                      className="text-app-ink-muted hover:text-app-primary"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-app-ink-muted">No dates blocked.</p>
            )}
          </section>

          <div className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-20">
            <div className="rounded-md border border-app-border bg-app-surface/95 p-3 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between sm:px-4">
              <p className="hidden text-sm text-app-ink-muted sm:block">
                Changes stay on this device until saved.
              </p>
              <Button
                type="button"
                onClick={save}
                className="h-12 w-full rounded-md bg-app-primary text-white hover:bg-app-primary-hover sm:w-auto sm:min-w-52"
              >
                Save Availability
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
