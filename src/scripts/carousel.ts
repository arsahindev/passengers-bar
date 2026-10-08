// Horizontal scroll-snap carousels (gallery, menu pages). Markup:
//   [data-carousel]            root
//     [data-carousel-track]    scroll container; each child is one item
//     [data-carousel-prev]     button, scrolls back one item
//     [data-carousel-next]     button, scrolls forward one item
//     [data-carousel-status]   optional, shows e.g. "1 / 6" or "1–2 / 6"
// Swiping and keyboard scrolling are the browser's own scroll-snap behaviour.
for (const root of document.querySelectorAll<HTMLElement>("[data-carousel]")) {
  const track = root.querySelector<HTMLElement>("[data-carousel-track]");
  if (!track) continue;
  const status = root.querySelector<HTMLElement>("[data-carousel-status]");
  const items = () => [...track.children] as HTMLElement[];
  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;

  const move = (direction: number) =>
    track.scrollBy({
      left: direction * ((items()[0]?.getBoundingClientRect().width || 300) + gap()),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => move(-1));
  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => move(1));

  if (status) {
    const update = () => {
      const view = track.getBoundingClientRect();
      // Items at least half visible count as shown.
      const shown = items()
        .map((item, i) => [item.getBoundingClientRect(), i + 1] as const)
        .filter(
          ([box]) =>
            Math.min(box.right, view.right) - Math.max(box.left, view.left) > box.width / 2,
        )
        .map(([, n]) => n);
      if (!shown.length) return;
      const first = shown[0];
      const last = shown[shown.length - 1];
      status.textContent = `${first === last ? first : `${first}–${last}`} / ${items().length}`;
    };
    let frame = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    });
    // Recalculate when the track becomes visible (e.g. a <details> opens) or resizes.
    new ResizeObserver(update).observe(track);
  }
}
