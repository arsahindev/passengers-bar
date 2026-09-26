export function normalizePhone(value) {
  const clean = value
    .trim()
    .replace(/[\s().-]/g, "")
    .replace(/^00/, "+");
  return /^\+[1-9]\d{6,14}$/.test(clean) ? clean : null;
}
export function belgradeStamp(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Belgrade",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
export function futureSlot(date, time, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  const stamp = `${date}T${time}`;
  const wall = Date.parse(stamp + ":00Z");
  // Check real Belgrade instants: rejects spring DST gaps and invalid dates.
  return [60, 120].some((offset) => {
    const instant = new Date(wall - offset * 60000);
    return Number.isFinite(instant.getTime()) && instant > now && belgradeStamp(instant) === stamp;
  });
}
export function messageFor(data, locale) {
  const sr = locale === "sr";
  const clean = (value) =>
    String(value || "")
      .replace(/[\r\n]+/g, " ")
      .trim();
  return [
    sr ? "Passengers Bar - upit za rezervaciju" : "Passengers Bar - reservation request",
    `${sr ? "Ime" : "Name"}: ${clean(data.name)}`,
    `${sr ? "Telefon" : "Callback phone"}: ${normalizePhone(data.phone)}`,
    `${sr ? "Datum" : "Date"}: ${data.date.split("-").reverse().join(".")}`,
    `${sr ? "Vreme" : "Time"}: ${data.time} (${sr ? "vreme u Beogradu" : "Belgrade time"})`,
    `${sr ? "Broj gostiju" : "Guests"}: ${data.guests}`,
    data.occasion && `${sr ? "Povod" : "Occasion"}: ${clean(data.occasion)}`,
    data.notes && `${sr ? "Napomena" : "Special requests"}: ${clean(data.notes)}`,
    sr ? "Molim vas da potvrdite dostupnost. Hvala!" : "Please confirm availability. Thank you!",
  ]
    .filter(Boolean)
    .join("\n");
}
export function smsLink(phone, message, apple = false) {
  return `sms:${phone}${apple ? "" : "?body=" + encodeURIComponent(message)}`;
}
export function whatsappLink(phone, message) {
  return `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
}
