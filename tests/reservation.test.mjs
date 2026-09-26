import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizePhone,
  belgradeStamp,
  futureSlot,
  messageFor,
  smsLink,
  whatsappLink,
} from "../src/lib/reservation.mjs";
test("international phone formats; rejects local numbers, injected URI content and oversized numbers", () => {
  for (const value of ["+381 60 123-4567", "00381 (60) 1234567"])
    assert.equal(normalizePhone(value), "+381601234567");
  assert.equal(normalizePhone("+44 20 7946 0958"), "+442079460958");
  for (const value of [
    "0601234567",
    "+0123456789",
    "+381?body=oops",
    "+1234567890123456",
    "+381abc",
  ])
    assert.equal(normalizePhone(value), null);
});
test("uses Belgrade date across UTC midnight and rejects past or impossible times", () => {
  const now = new Date("2026-09-26T22:30:00Z");
  assert.equal(belgradeStamp(now), "2026-09-27T00:30");
  assert.equal(futureSlot("2026-09-27", "00:29", now), false);
  assert.equal(futureSlot("2026-09-27", "00:31", now), true);
  for (const [date, time] of [
    ["2026-02-30", "12:00"],
    ["2026-10-10", "25:00"],
    ["", ""],
  ])
    assert.equal(futureSlot(date, time, now), false);
});
test("rejects spring DST gap; accepts real time after it and future autumn repeated hour", () => {
  const now = new Date("2026-01-01T00:00Z");
  assert.equal(futureSlot("2026-03-29", "02:30", now), false);
  assert.equal(futureSlot("2026-03-29", "03:30", now), true);
  assert.equal(futureSlot("2026-10-25", "02:30", new Date("2026-10-25T00:45Z")), true);
});
test("both messages preserve callback, locale, special characters and all details", () => {
  const data = {
    name: "Ana & Đorđe",
    phone: "00381601234567",
    date: "2026-10-10",
    time: "19:30",
    guests: "4",
    occasion: "Birthday",
    notes: "Window & terrace?",
  };
  for (const locale of ["sr", "en"]) {
    const message = messageFor(data, locale);
    for (const value of [
      "Ana & Đorđe",
      "+381601234567",
      "10.10.2026",
      "19:30",
      "4",
      "Birthday",
      "Window & terrace?",
    ])
      assert.ok(message.includes(value));
    assert.ok(message.includes(locale === "sr" ? "Broj gostiju" : "Guests"));
    assert.equal(decodeURIComponent(smsLink("+381606464109", message).split("?body=")[1]), message);
    assert.equal(smsLink("+381606464109", message, true), "sms:+381606464109");
    assert.equal(new URL(whatsappLink("+381606464109", message)).searchParams.get("text"), message);
  }
});
