import { test } from "node:test";
import assert from "node:assert/strict";
import { belgradeNow, hoursOn, openStatus } from "../src/lib/hours.mjs";

const hours = [
  { days: [1, 2, 3, 4], open: "08:30", close: "00:00" },
  { days: [5, 6], open: "08:30", close: "01:00" },
  { days: [0], open: "09:00", close: "00:00" },
];

test("uses the Belgrade weekday and time across UTC midnight and daylight-saving time", () => {
  // Friday 22:30 UTC is already Saturday 00:30 in Belgrade (summer time, UTC+2).
  assert.deepEqual(belgradeNow(new Date("2026-09-25T22:30:00Z")), { weekday: 6, minutes: 30 });
  assert.equal(belgradeNow(new Date("2026-09-25T21:30:00Z")).weekday, 5);
  // Winter time (UTC+1): Sunday 23:30 UTC is Monday 00:30 in Belgrade.
  assert.deepEqual(belgradeNow(new Date("2026-01-04T23:30:00Z")), { weekday: 1, minutes: 30 });
});

test("finds the hours entry for a weekday, or null when closed", () => {
  assert.equal(hoursOn(hours, 3).close, "00:00");
  assert.equal(hoursOn(hours, 6).close, "01:00");
  assert.equal(hoursOn(hours.slice(0, 2), 0), null);
});

test("open during the day and until a close at or after midnight", () => {
  // Friday 10:00 Belgrade.
  assert.deepEqual(openStatus(hours, new Date("2026-09-25T08:00:00Z")), {
    open: true,
    until: "01:00",
  });
  // Thursday 23:59 Belgrade, closing at midnight.
  assert.deepEqual(openStatus(hours, new Date("2026-09-24T21:59:00Z")), {
    open: true,
    until: "00:00",
  });
  // Saturday 00:30 Belgrade is still Friday night's opening.
  assert.deepEqual(openStatus(hours, new Date("2026-09-25T22:30:00Z")), {
    open: true,
    until: "01:00",
  });
});

test("closed: says when it opens next", () => {
  // Saturday 01:30 Belgrade, after Friday's 01:00 close.
  assert.deepEqual(openStatus(hours, new Date("2026-09-25T23:30:00Z")), {
    open: false,
    opens: "08:30",
    day: "today",
  });
  // Monday 00:30 Belgrade: Sunday closed at midnight.
  assert.deepEqual(openStatus(hours, new Date("2026-09-27T22:30:00Z")), {
    open: false,
    opens: "08:30",
    day: "today",
  });
  // Sunday 08:45 Belgrade, opening at 09:00.
  assert.deepEqual(openStatus(hours, new Date("2026-09-27T06:45:00Z")), {
    open: false,
    opens: "09:00",
    day: "today",
  });
  // A day with no hours: Saturday 02:00 with Sunday closed reopens on Monday.
  assert.deepEqual(openStatus(hours.slice(0, 2), new Date("2026-09-26T00:00:00Z")), {
    open: false,
    opens: "08:30",
    day: "today",
  });
  // Sunday 01:30 Belgrade with Sunday closed: next opening is Monday.
  assert.deepEqual(openStatus(hours.slice(0, 2), new Date("2026-09-26T23:30:00Z")), {
    open: false,
    opens: "08:30",
    day: "tomorrow",
  });
  // Saturday 12:00 Belgrade, open only Monday–Thursday: two closed days ahead.
  assert.deepEqual(openStatus(hours.slice(0, 1), new Date("2026-09-26T10:00:00Z")), {
    open: false,
    opens: "08:30",
    day: "later",
  });
  assert.deepEqual(openStatus([], new Date("2026-09-26T12:00:00Z")), { open: false });
});
