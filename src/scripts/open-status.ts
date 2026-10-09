// Fills every [data-open-status] (OpenStatus.astro) with the current open/closed state for
// Belgrade time, and refreshes it each minute so it changes at opening and closing time.
import { openStatus } from "../lib/hours.mjs";

const elements = [...document.querySelectorAll<HTMLElement>("[data-open-status]")];

const update = () => {
  for (const element of elements) {
    const status = openStatus(JSON.parse(element.dataset.hours || "[]"));
    const template = status.open
      ? element.dataset.open
      : status.day === "today"
        ? element.dataset.opensToday
        : status.day === "tomorrow"
          ? element.dataset.opensTomorrow
          : element.dataset.closed;
    const time = status.open ? status.until : status.opens;
    element.querySelector("[data-open-text]")!.textContent = (template || "").replace(
      "{time}",
      time || "",
    );
    element.querySelector<HTMLElement>("[data-open-dot]")!.hidden = !status.open;
    element.querySelector<HTMLElement>("[data-closed-dot]")!.hidden = status.open;
    element.hidden = false;
  }
};

if (elements.length) {
  update();
  setInterval(update, 60_000);
}
