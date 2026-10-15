// Scroll-driven walk-in hero (WalkIn.astro). Turns the static hero into a 400vh section with a
// sticky full-screen stage and scrubs the walkthrough video with the scroll position: the name and
// tagline fade out early, "Come on in" with the reservation button fades in at the end, and a thin
// line at the bottom shows progress. Skipped entirely with prefers-reduced-motion, so the static
// hero stays and the video is never downloaded.
const section = document.querySelector<HTMLElement>("[data-walkin]");

if (section && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const part = <T extends HTMLElement>(name: string) =>
    section.querySelector<T>(`[data-walkin-${name}]`)!;
  const video = part<HTMLVideoElement>("video");
  const start = part("start");
  const end = part("end");
  const cue = part("cue");
  const progressLine = part("progress");
  const shade = part("shade");

  // Phones get the smaller portrait video; the choice is made once, on load.
  const small = matchMedia("(max-width: 760px)").matches;
  video.src = (small ? section.dataset.srcMobile : section.dataset.src) || "";
  video.preload = "auto";
  section.dataset.active = "";
  // iOS Safari only paints seeked frames after the video has played once.
  video.addEventListener(
    "loadeddata",
    () => {
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
      request();
    },
    { once: true },
  );
  video.load();

  // 0 → 1 as p goes from a to b.
  const ramp = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

  let target = 0;
  let current = 0;
  let frame = 0;

  const measure = () => {
    const run = section.offsetHeight - innerHeight;
    target = run > 0 ? Math.min(1, Math.max(0, -section.getBoundingClientRect().top / run)) : 0;
  };

  const render = () => {
    // Ease towards the scroll position so the scrubbing glides instead of stepping.
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0005) current = target;

    if (video.duration) {
      const time = current * (video.duration - 0.05);
      if (Math.abs(video.currentTime - time) > 0.01) video.currentTime = time;
    }

    const startOut = ramp(current, 0.03, 0.18);
    start.style.opacity = String(1 - startOut);
    start.style.translate = `0 ${-40 * startOut}px`;
    start.inert = startOut > 0.9;
    cue.style.opacity = String(1 - ramp(current, 0, 0.05));

    const endIn = ramp(current, 0.82, 0.95);
    end.style.opacity = String(endIn);
    end.inert = endIn < 0.5;
    shade.style.opacity = String(0.45 * endIn);

    progressLine.style.scale = `${current} 1`;

    frame = current === target ? 0 : requestAnimationFrame(render);
  };

  function request() {
    measure();
    if (!frame) frame = requestAnimationFrame(render);
  }

  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
  request();
}
