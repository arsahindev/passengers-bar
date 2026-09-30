# Passengers Bar

Bilingual (Serbian/English) static Astro website concept for a restaurant/bar. It is an
owner-review concept, not the official site. See `README.md` for deployment and launch
checklist details.

## Commands

- `npm ci` — install (Node 24, see `.nvmrc`)
- `npm run dev` — dev server on 127.0.0.1
- `npm run build` — production build to `dist/`
- `npm run check` — `astro check` type check
- `npm test` — Node test runner over `tests/*.test.mjs` (reservation logic)
- `npm run format` / `npm run format:check` — Prettier (with Astro plugin)

Before committing, run `npm run format:check`, `npm run check`, `npm test` and `npm run build`. All must pass.

CI: `.github/workflows/ci.yml` runs those same four checks on every PR and on pushes to `main`.
Cloudflare deploys `main` only; branch/preview builds are switched off in its dashboard.

Hosting is a Cloudflare **Worker with static assets** (not Pages): build `npm run build`, deploy
`npx wrangler deploy`, configured by `wrangler.jsonc` (assets from `dist/`). Wrangler is a pinned
devDependency. Don't add the Cloudflare adapter, bindings (KV/Images) or run `astro add cloudflare`.
Check config changes with `npm run build && npx wrangler deploy --dry-run`; never deploy from here.

## Layout

- `src/components/PassengersPage.astro` — the whole page; `ReservationForm.astro` — enquiry form
- `src/styles/global.css` — Tailwind v4 entry: `@theme` design tokens (colours, fonts, the `md`
  breakpoint) and a small `@layer base` for element defaults; the only hand-written CSS
- `src/lib/ui.ts` — shared class strings (buttons, eyebrow, section layout, form field, etc.)
- `src/pages/[locale]/index.astro` — `/sr/` and `/en/` routes; `src/pages/index.astro` redirects to `/sr/`
- `src/content/settings.ts` — reservation phone/channels, tour embed URL and `tourIsSample` flag
- `src/content/menu-{en,sr}.json` — menu source data
- `src/lib/reservation.mjs` — phone normalization, message encoding, Belgrade time (unit-tested)
- `src/assets/passengers/` — images; provenance in `sources.json`
- `public/menus/*.pdf` — generated menu PDFs, committed. Regenerate with
  `python3 scripts/build-menu.py en|sr` (needs `reportlab` and macOS fonts; not part of the build)
- `public/_headers`, `_redirects`, `robots.txt` — Cloudflare static-assets config (noindex is intentional)

## Rules

- Every user-facing string needs both Serbian and English. Change both languages together.
- If menu JSON changes, the PDFs are stale; say so rather than silently leaving them out of sync.
- Privacy: guest reservation details must never be stored, logged, sent via fetch/analytics or put
  in own-site URLs. Details leave the page only through the guest's own messaging action.
- No backend, no Cloudflare adapter, no secrets, no new runtime dependencies without asking.
- Keep noindex/concept labelling until the owner approves launch (see README "Before official launch").
- Do not invent menu items, prices, hours or booking rules; prices are RSD and need owner confirmation.
- Never send a test message to the restaurant's phone number.
- Styling is Tailwind utilities in the markup plus tokens in `global.css`; don't add `<style>`
  blocks or new global CSS. Reuse or extend the strings in `src/lib/ui.ts` instead of repeating them.
  Classes must appear as complete literals (no string-built class names) so Tailwind can find them.
- Mobile-first: bare classes are mobile, `md:` is desktop and starts at 761px (the original 760px
  cut-off). Use px/arbitrary values when parity matters: named sizes like `text-sm` also change
  line-height, and `grid-cols-2` means `minmax(0,1fr)` (use `grid-cols-[1fr_1fr]` for the original
  `1fr 1fr`). Don't put two conflicting utilities of one property on an element (e.g. `flex` and
  `block`); Tailwind's stylesheet order, not markup order, decides.
- The header is not sticky, so don't add `scroll-padding-top`; it just leaves a gap above sections.
- Prettier settings are in `.prettierrc.json`; don't hand-format around them.
- Match existing code style and keep changes small and focused; add tests in `tests/` for logic
  changes in `src/lib/`.

## Known open items

- Real-device checks pending: iPhone Safari SMS copy/paste, Android SMS prefill, desktop clipboard
  failure, responsive visual review.
- The Panoee tour is a labelled Space360 apartment sample; replace before launch.
