// Full-screen menu page viewer with zoom. Phone browsers zoom the whole site on pinch, and an A4
// page at phone width is too small to read, so pages open here instead. Markup (Menu.astro):
//   [data-viewer-open="<index>"]  page button in the carousel; data-large = full-size image URL
//   dialog[data-viewer]           with [data-viewer-scroll] > img[data-viewer-image],
//                                 [data-viewer-status], [data-viewer-prev|next|zoom-in|zoom-out|close]
// Fit shows the whole page; double-tap (or double-click) toggles 2.5x at that point, and the
// buttons or +/- keys step through the zoom levels. When zoomed, the page pans by normal scrolling/dragging.
const dialog = document.querySelector<HTMLDialogElement>("[data-viewer]");
const openers = [...document.querySelectorAll<HTMLButtonElement>("[data-viewer-open]")];

if (dialog && openers.length) {
  const scroller = dialog.querySelector<HTMLElement>("[data-viewer-scroll]")!;
  const image = dialog.querySelector<HTMLImageElement>("[data-viewer-image]")!;
  const status = dialog.querySelector<HTMLElement>("[data-viewer-status]");
  const levels = [1, 1.75, 2.5, 3.5];
  let page = 0;
  let zoom = 1;

  const thumb = (i: number) => openers[i].querySelector("img")!;
  // Width in px that fits the whole page inside the viewer.
  const fitWidth = () => {
    const ratio = thumb(page).naturalWidth / thumb(page).naturalHeight || 595 / 842;
    return Math.min(scroller.clientWidth, scroller.clientHeight * ratio);
  };

  // Sets the zoom and keeps the page point under (x, y) (viewport coords) in place.
  const setZoom = (next: number, x?: number, y?: number) => {
    const box = scroller.getBoundingClientRect();
    const before = image.getBoundingClientRect();
    const px = x ?? box.left + box.width / 2;
    const py = y ?? box.top + box.height / 2;
    const fx = (px - before.left) / before.width;
    const fy = (py - before.top) / before.height;
    zoom = Math.min(Math.max(next, levels[0]), levels[levels.length - 1]);
    image.style.width = `${fitWidth() * zoom}px`;
    scroller.scrollLeft = image.offsetLeft + fx * image.offsetWidth - (px - box.left);
    scroller.scrollTop = image.offsetTop + fy * image.offsetHeight - (py - box.top);
  };
  const step = (direction: number) => {
    const i = levels.findIndex((level) => level >= zoom - 0.01);
    setZoom(levels[Math.min(Math.max(i + direction, 0), levels.length - 1)]);
  };

  const show = (i: number) => {
    page = (i + openers.length) % openers.length;
    const small = thumb(page);
    const large = openers[page].dataset.large!;
    image.alt = small.alt;
    // Show the already-loaded carousel image at once, then swap in the sharp one.
    image.src = small.currentSrc || small.src;
    const full = new Image();
    full.onload = () => {
      if (openers[page].dataset.large === large) image.src = large;
    };
    full.src = large;
    if (status) status.textContent = `${page + 1} / ${openers.length}`;
    zoom = 1;
    image.style.width = `${fitWidth()}px`;
    scroller.scrollTo(0, 0);
  };

  openers.forEach((button, i) =>
    button.addEventListener("click", () => {
      dialog.showModal();
      document.documentElement.classList.add("overflow-hidden");
      show(i);
    }),
  );
  dialog.addEventListener("close", () =>
    document.documentElement.classList.remove("overflow-hidden"),
  );
  dialog.querySelector("[data-viewer-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-viewer-prev]")?.addEventListener("click", () => show(page - 1));
  dialog.querySelector("[data-viewer-next]")?.addEventListener("click", () => show(page + 1));
  dialog.querySelector("[data-viewer-zoom-in]")?.addEventListener("click", () => step(1));
  dialog.querySelector("[data-viewer-zoom-out]")?.addEventListener("click", () => step(-1));
  addEventListener("resize", () => dialog.open && setZoom(zoom));

  dialog.addEventListener("keydown", (event) => {
    const keys: Record<string, () => void> = {
      ArrowLeft: () => zoom === 1 && show(page - 1),
      ArrowRight: () => zoom === 1 && show(page + 1),
      "+": () => step(1),
      "=": () => step(1),
      "-": () => step(-1),
      "0": () => setZoom(1),
    };
    if (keys[event.key]) {
      event.preventDefault();
      keys[event.key]();
    }
  });

  // Double-tap toggles zoom and a horizontal swipe at fit size changes page. Touch events, not
  // pointer events: browsers cancel pointer events once a finger starts panning.
  let start = { x: 0, y: 0, t: -1 };
  let lastTap = { x: 0, y: 0, t: -1000 };
  let lastTouch = -1000;
  scroller.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      start =
        event.touches.length === 1
          ? { x: touch.clientX, y: touch.clientY, t: event.timeStamp }
          : { x: 0, y: 0, t: -1 }; // pinch: leave it to the browser
    },
    { passive: true },
  );
  scroller.addEventListener("touchend", (event) => {
    lastTouch = event.timeStamp;
    if (start.t < 0 || event.touches.length) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (zoom === 1 && Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      show(page + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.hypot(dx, dy) > 10) return;
    const near = Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 40;
    if (near && event.timeStamp - lastTap.t < 350) {
      event.preventDefault();
      setZoom(zoom > 1 ? 1 : 2.5, touch.clientX, touch.clientY);
      lastTap = { x: 0, y: 0, t: -1000 };
    } else {
      lastTap = { x: touch.clientX, y: touch.clientY, t: event.timeStamp };
    }
  });
  // Mouse: double-click. Skipped right after touches, which may also fire dblclick.
  scroller.addEventListener("dblclick", (event) => {
    if (event.timeStamp - lastTouch < 1000) return;
    setZoom(zoom > 1 ? 1 : 2.5, event.clientX, event.clientY);
  });
}
