import { test } from "node:test";
import assert from "node:assert/strict";
import { belgradeWeekday, hoursOn } from "../src/lib/hours.mjs";

test("uses the Belgrade weekday across UTC midnight and daylight-saving time", () => {
  // Friday 22:30 UTC is already Saturday 00:30 in Belgrade (summer time, UTC+2).
  assert.equal(belgradeWeekday(new Date("2026-09-25T22:30:00Z")), 6);
  assert.equal(belgradeWeekday(new Date("2026-09-25T21:30:00Z")), 5);
  // Winter time (UTC+1): Sunday 23:30 UTC is Monday 00:30 in Belgrade.
  assert.equal(belgradeWeekday(new Date("2026-01-04T23:30:00Z")), 1);
});

test("finds the hours entry for a weekday, or null when closed", () => {
  const hours = [
    { days: [1, 2, 3, 4], open: "08:30", close: "00:00" },
    { days: [5, 6], open: "08:30", close: "01:00" },
  ];
  assert.equal(hoursOn(hours, 3).close, "00:00");
  assert.equal(hoursOn(hours, 6).close, "01:00");
  assert.equal(hoursOn(hours, 0), null);
});
