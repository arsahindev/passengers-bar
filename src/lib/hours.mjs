// Opening hours helpers. Hours come from settings.ts: each entry covers some weekdays
// (0 = Sunday … 6 = Saturday, as in Date.getDay()) with Belgrade-local open/close times.

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Weekday in Belgrade (0 = Sunday), whatever the visitor's own time zone.
export function belgradeWeekday(now = new Date()) {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Belgrade",
    weekday: "short",
  }).format(now);
  return WEEKDAYS.indexOf(name);
}

// The hours entry that covers a weekday, or null if the bar is closed that day.
export function hoursOn(hours, weekday) {
  return hours.find((entry) => entry.days.includes(weekday)) ?? null;
}
