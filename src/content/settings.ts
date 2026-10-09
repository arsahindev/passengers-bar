export const settings = {
  reservations: {
    phone: "+381606464109",
    phoneDisplay: "+381 60 646 4109",
    whatsapp: false,
    viber: false,
  },
  // Opening hours (Belgrade time; a 00:00 or 01:00 close is after midnight). days: 0 = Sunday …
  // 6 = Saturday. Shown in the Visit section and, for today, in the hero. Owner to confirm.
  hours: [
    { days: [1, 2, 3, 4], label: { sr: "Pon–čet", en: "Mon–Thu" }, open: "08:30", close: "00:00" },
    { days: [5, 6], label: { sr: "Pet–sub", en: "Fri–Sat" }, open: "08:30", close: "01:00" },
    { days: [0], label: { sr: "Nedelja", en: "Sunday" }, open: "09:00", close: "00:00" },
  ],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Passengers Bar Simina 5 Belgrade"),
  origin: "https://space-360.pages.dev",
  // Replace the sample with the restaurant’s tour after approval.
  tourEmbedUrl:
    "https://tour.panoee.net/iframe/6ab2aef37a79bdb43d18b7a2?embedFullscreen=1&embedVr=1&embedGyro=1",
  tourIsSample: true,
};
