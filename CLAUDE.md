# Passengers Bar

Bilingual (Serbian/English) static Astro website concept for a restaurant/bar. It is an
owner-review concept, not the official site. See `README.md` for deployment and launch
checklist details.

## Commands

- `npm ci` — install (Node 24, see `.nvmrc`)
- `npm run dev` — dev server on 127.0.0.1
- `npm run build` — production build to `dist/`
- `npm test` — Node test runner over `tests/*.test.mjs` (reservation logic)
- `npm run format` / `npm run format:check` — Prettier (with Astro plugin)

Before committing, run `npm run format:check`, `npm test` and `npm run build`. All must pass.

## Layout

- `src/components/PassengersPage.astro` — the whole page; `ReservationForm.astro` — enquiry form
- `src/pages/[locale]/index.astro` — `/sr/` and `/en/` routes; `src/pages/index.astro` redirects to `/sr/`
- `src/content/settings.ts` — reservation phone/channels, tour embed URL and `tourIsSample` flag
- `src/content/menu-{en,sr}.json` — menu source data
- `src/lib/reservation.mjs` — phone normalization, message encoding, Belgrade time (unit-tested)
- `src/assets/passengers/` — images; provenance in `sources.json`
- `public/menus/*.pdf` — generated menu PDFs, committed. Regenerate with
  `python3 scripts/build-menu.py en|sr` (needs `reportlab` and macOS fonts; not part of the build)
- `public/_headers`, `_redirects`, `robots.txt` — Cloudflare Pages config (noindex is intentional)

## Rules

- Every user-facing string needs both Serbian and English. Change both languages together.
- If menu JSON changes, the PDFs are stale; say so rather than silently leaving them out of sync.
- Privacy: guest reservation details must never be stored, logged, sent via fetch/analytics or put
  in own-site URLs. Details leave the page only through the guest's own messaging action.
- No backend, no Cloudflare adapter, no secrets, no new runtime dependencies without asking.
- Keep noindex/concept labelling until the owner approves launch (see README "Before official launch").
- Do not invent menu items, prices, hours or booking rules; prices are RSD and need owner confirmation.
- Never send a test message to the restaurant's phone number.
- Prettier settings are in `.prettierrc.json`; don't hand-format around them.
- Match existing code style and keep changes small and focused; add tests in `tests/` for logic
  changes in `src/lib/`.

## Known open items

- Real-device checks pending: iPhone Safari SMS copy/paste, Android SMS prefill, desktop clipboard
  failure, responsive visual review.
- The Panoee tour is a labelled Space360 apartment sample; replace before launch.
