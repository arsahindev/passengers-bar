// Full-screen image viewer with zoom, used for the menu pages and the gallery photos. Phone
// browsers zoom the whole site on pinch, and an A4 menu page at phone width is too small to read,
// so images open here instead. Markup (Viewer.astro):
//   dialog[data-viewer="<name>"]  data-pages = JSON [{ small, large, alt, ratio }] (image URLs,
//                                 ratio = width / height), with [data-viewer-scroll] >
//                                 img[data-viewer-image], [data-viewer-status],
//                                 [data-viewer-prev|next|zoom-in|zoom-out|close]
//   [data-viewer-for="<name>"][data-viewer-open="<index>"]  opens that viewer at an image (0-based)
// Fit shows the whole image. Pinch zooms the image (not the site), double-tap or double-click
// toggles 2.5x at that point, and the buttons or +/- keys step through zoom levels. When zoomed,
// the image pans by normal scrolling/dragging.
type Page = { small: string; large: string; alt: string; ratio: number };

for (const dialog of document.querySelectorAll<HTMLDialogElement>("dialog[data-viewer]"))
  setUp(dialog);

function setUp(dialog: HTMLDialogElement) {
  const pages: Page[] = JSON.parse(dialog.dataset.pages || "[]");
  const openers = [
    ...document.querySelectorAll<HTMLElement>(`[data-viewer-for="${dialog.dataset.viewer}"]`),
  ];
  if (!pages.length) return;
  const scroller = dialog.querySelector<HTMLElement>("[data-viewer-scroll]")!;
  const image = dialog.querySelector<HTMLImageElement>("[data-viewer-image]")!;
  const status = dialog.querySelector<HTMLElement>("[data-viewer-status]");
  const levels = [1, 1.75, 2.5, 3.5];
  const maxZoom = 4; // pinch can go a little past the largest button level
  let page = 0;
  let zoom = 1;

  // Width in px that fits the whole page inside the viewer.
  const fitWidth = () =>
    Math.min(scroller.clientWidth, scroller.clientHeight * (pages[page].ratio || 1));

  // Where viewport point (x, y) falls on the page, as fractions of its width and height.
  const pagePoint = (x: number, y: number) => {
    const rect = image.getBoundingClientRect();
    return { fx: (x - rect.left) / rect.width, fy: (y - rect.top) / rect.height };
  };
  // Sets the zoom and scrolls so that page point (fx, fy) sits under viewport point (x, y).
  const zoomAround = (next: number, x: number, y: number, fx: number, fy: number) => {
    const box = scroller.getBoundingClientRect();
    zoom = Math.min(Math.max(next, 1), maxZoom);
    image.style.width = `${fitWidth() * zoom}px`;
    scroller.scrollLeft = image.offsetLeft + fx * image.offsetWidth - (x - box.left);
    scroller.scrollTop = image.offsetTop + fy * image.offsetHeight - (y - box.top);
  };
  // Sets the zoom, keeping the page point under (x, y) (default: viewer centre) in place.
  const setZoom = (next: number, x?: number, y?: number) => {
    const box = scroller.getBoundingClientRect();
    const px = x ?? box.left + box.width / 2;
    const py = y ?? box.top + box.height / 2;
    const { fx, fy } = pagePoint(px, py);
    zoomAround(next, px, py, fx, fy);
  };
  const step = (direction: number) => {
    const i = levels.findIndex((level) => level >= zoom - 0.01);
    setZoom(levels[Math.min(Math.max(i + direction, 0), levels.length - 1)]);
  };

  const show = (i: number) => {
    page = (i + pages.length) % pages.length;
    const { small, large, alt } = pages[page];
    image.alt = alt;
    // Show a light version at once, then swap in the sharp one when it has loaded.
    image.src = small;
    const full = new Image();
    full.onload = () => {
      if (pages[page].large === large) image.src = large;
    };
    full.src = large;
    if (status) status.textContent = `${page + 1} / ${pages.length}`;
    zoom = 1;
    image.style.width = `${fitWidth()}px`;
    scroller.scrollTo(0, 0);
  };

  for (const opener of openers)
    opener.addEventListener("click", () => {
      dialog.showModal();
      document.documentElement.classList.add("overflow-hidden");
      show(Number(opener.dataset.viewerOpen) || 0);
    });
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

  // Double-tap toggles zoom, a horizontal swipe at fit size changes page, and two fingers pinch.
  // Touch events, not pointer events: browsers cancel pointer events once a finger starts panning.
  // The scroller's touch-action (pan-x pan-y) stops the browser zooming the site on pinch.
  let start = { x: 0, y: 0, t: -1 };
  let lastTap = { x: 0, y: 0, t: -1000 };
  let lastTouch = -1000;
  let pinch: { distance: number; zoom: number; fx: number; fy: number } | null = null;
  const between = (touches: TouchList) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
    distance: Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    ),
  });
  scroller.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];
      start =
        event.touches.length === 1
          ? { x: touch.clientX, y: touch.clientY, t: event.timeStamp }
          : { x: 0, y: 0, t: -1 }; // not a tap or swipe
      if (event.touches.length === 2) {
        const mid = between(event.touches);
        pinch = { distance: mid.distance, zoom, ...pagePoint(mid.x, mid.y) };
      }
    },
    { passive: true },
  );
  scroller.addEventListener(
    "touchmove",
    (event) => {
      if (!pinch || event.touches.length !== 2) return;
      if (event.cancelable) event.preventDefault(); // we move the page, not the browser
      const mid = between(event.touches);
      // The page point that started between the fingers follows them while zooming.
      zoomAround((pinch.zoom * mid.distance) / pinch.distance, mid.x, mid.y, pinch.fx, pinch.fy);
    },
    { passive: false },
  );
  scroller.addEventListener("touchcancel", () => (pinch = null));
  scroller.addEventListener("touchend", (event) => {
    lastTouch = event.timeStamp;
    if (pinch && event.touches.length < 2) {
      pinch = null;
      if (zoom < 1.05) setZoom(1); // snap back to fit
    }
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
