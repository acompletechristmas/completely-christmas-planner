/** Minimal, dependency-free .ics generation for a single festive activity. */

export interface CalendarEventInput {
  title: string;
  /** ISO date, e.g. "2026-12-06". */
  date: string;
  /** Free text time, e.g. "6pm" or "18:30". */
  time?: string | null;
  location?: string | null;
  description?: string | null;
  url?: string | null;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Accepts "18:30", "6pm", "6.30pm" — returns [hours, minutes] or null. */
function parseTime(time: string): [number, number] | null {
  const t = time.trim().toLowerCase();
  const m = t.match(/^(\d{1,2})[:.]?(\d{2})?\s*(am|pm)?$/);
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = Number(m[2] ?? 0);
  if (m[3] === "pm" && hours < 12) hours += 12;
  if (m[3] === "am" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return null;
  return [hours, minutes];
}

function stamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

export function buildIcs(event: CalendarEventInput): string {
  const parsed = event.time ? parseTime(event.time) : null;
  const dateOnly = event.date.replace(/-/g, "");

  let dtStart: string;
  let dtEnd: string;
  if (parsed) {
    const start = new Date(`${event.date}T${String(parsed[0]).padStart(2, "0")}:${String(parsed[1]).padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    dtStart = `DTSTART:${stamp(start)}`;
    dtEnd = `DTEND:${stamp(end)}`;
  } else {
    const next = new Date(`${event.date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    dtStart = `DTSTART;VALUE=DATE:${dateOnly}`;
    dtEnd = `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, "")}`;
  }

  const description = [event.description, event.url].filter(Boolean).join("\n\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//A Complete Christmas//Festive Activities//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@acompletechristmas.co.uk`,
    `DTSTAMP:${stamp(new Date())}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    ...(description ? [`DESCRIPTION:${escapeText(description)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Triggers a browser download of the .ics file. */
export function downloadIcs(event: CalendarEventInput): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "festive-activity"}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
