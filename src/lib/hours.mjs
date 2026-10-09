// Opening hours helpers. Hours come from settings.ts: each entry covers some weekdays
// (0 = Sunday … 6 = Saturday, as in Date.getDay()) with Belgrade-local open/close times.
// A close at or before the open time (e.g. 00:00 or 01:00) means after midnight.

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Weekday (0 = Sunday) and minutes since midnight in Belgrade, whatever the visitor's time zone.
export function belgradeNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Belgrade",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type) => parts.find((p) => p.type === type).value;
  return {
    weekday: WEEKDAYS.indexOf(part("weekday")),
    minutes: (Number(part("hour")) % 24) * 60 + Number(part("minute")),
  };
}

// The hours entry that covers a weekday, or null if the bar is closed that day.
export function hoursOn(hours, weekday) {
  return hours.find((entry) => entry.days.includes(weekday)) ?? null;
}

// Whether the bar is open at `now`:
//   { open: true, until: "01:00" }
//   { open: false, opens: "08:30", day: "today" | "tomorrow" | "later" }
//   { open: false } when no hours are set
export function openStatus(hours, now = new Date()) {
  const { weekday, minutes } = belgradeNow(now);
  const yesterday = hoursOn(hours, (weekday + 6) % 7);
  if (
    yesterday &&
    toMinutes(yesterday.close) <= toMinutes(yesterday.open) &&
    minutes < toMinutes(yesterday.close)
  )
    return { open: true, until: yesterday.close };
  const today = hoursOn(hours, weekday);
  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && (close <= open || minutes < close))
      return { open: true, until: today.close };
    if (minutes < open) return { open: false, opens: today.open, day: "today" };
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = hoursOn(hours, (weekday + ahead) % 7);
    if (next) return { open: false, opens: next.open, day: ahead === 1 ? "tomorrow" : "later" };
  }
  return { open: false };
}
