# Passengers Bar — handoff to Claude

Prepared 2026-09-30 from local repository inspection and the Space360 working conversation. This is an actionable context export, not a production audit. The user wants Claude to take over this website completely.

## Start here

Read `CLAUDE.md`, `README.md`, this file, then inspect Git status before editing. Follow current user instructions over older notes. Keep this website independent from Space360; do not require sibling repositories to build it. Preserve uncommitted work and distinguish local, committed, pushed and verified-live state.

## Snapshot at handoff

- Folder: `/Users/arsahin/Developer/passengers-bar`.
- Remote: `https://github.com/arsahindev/passengers-bar.git`.
- Branch: `setup/claude-config` (do not assume main is checked out).
- HEAD: `a329148` — `chore: add Claude Code setup (CLAUDE.md, settings, hooks)`.
- Earlier commits: `7044470` reservation/menu work; `1288e1a` formatting; `664073e` standalone extraction.
- Pre-existing uncommitted edit: `astro.config.mjs`, one blank line after the import. Preserve it; do not silently reset or include it in unrelated work.
- This handoff is an additional uncommitted documentation file. No application code was changed during this export; no commit, push or deployment of this repository was performed.
- Claude setup already exists: `CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/format.sh`, `.claude/hooks/session-start.sh`. Inspect locally before changing; setup presence does not prove execution was tested here.
- No verified deployment URL is available in this handoff. `https://www.passengersbar.com/en` is the existing venue website, not evidence that this repository is deployed there. README deployment instructions include historical setup steps; the GitHub repository already exists.

## User priorities and latest issue

The user finds the CSS hard to maintain and reported navigation scrolling to sections with an unnecessary header-sized gap. They asked for Tailwind migration in Space360 and reported the same problem in Passengers. Space360 was migrated; Passengers has NOT been migrated. Fixing Passengers and maintaining it now belongs with Claude. A Tailwind migration here is a sensible proposed next task, not completed work or a design approval.

Fresh source evidence for the scrolling issue:

- `src/components/PassengersPage.astro` contains a large `<style is:global>` block.
- Root `html` sets `scroll-padding-top: 110px` around line 458; the `max-width: 760px` rule changes it to `20px` around line 950.
- The `header` is in normal document flow, with no sticky/fixed positioning in the inspected stylesheet.
- This is a source-level explanation for the reported gap; no browser reproduction was run for Passengers during this export.
- Start by reproducing both languages and desktop/mobile. Remove compensation for a header that scrolls away; preserve intentional section padding. Do not substitute a negative margin or make the header sticky just to mask the issue.

Space360 reference, if locally available: `/Users/arsahin/Developer/space-360`, local commit `32982e6`. It uses Tailwind v4 with the official Vite plugin, design tokens, small shared utilities and co-located Astro classes. Its 28 browser tests passed across both languages and four widths, including anchors. Those results apply ONLY to Space360. Use the approach as a reference, not its branding, exact breakpoints or a runtime dependency. Do not modify Space360 as part of this takeover.

## Architecture and file map

Static Astro 7.3.5; Node 24 (`.nvmrc`); no adapter, backend or runtime secrets. Current development dependencies are pinned Prettier 3.9.9 and prettier-plugin-astro 1.1.0. Tailwind is not installed in this repository.

- `src/components/PassengersPage.astro`: complete page, bilingual strings through `tx(sr, en)`, layout, global CSS, menu viewer, gallery, tour and navigation.
- `src/components/ReservationForm.astro`: guest enquiry UI, browser logic and scoped CSS.
- `src/lib/reservation.mjs`: phone normalization, Belgrade time/date validation, bilingual message generation and messaging links.
- `tests/reservation.test.mjs`: existing Node logic tests.
- `src/content/settings.ts`: recipient/channel flags, tour URL, sample flag and Space360 attribution origin. `origin` currently points to Space360 for attribution; do not mistake it for this site's deployment URL.
- `src/pages/[locale]/index.astro`: `/sr/` and `/en/`; root redirects to Serbian. Also `src/pages/404.astro`.
- `src/content/menu-sr.json`, `menu-en.json`: editable menu data.
- `public/menus/`: committed, locally served PDFs, selected by language.
- `scripts/build-menu.py`: optional PDF generator; Python ReportLab and macOS Arial/Georgia fonts. Normal site builds do not need Python.
- `src/assets/passengers/`: venue images and adapted posters. `sources.json` records provenance.
- `public/_headers`, `public/robots.txt`, page metadata: intentional indexing restrictions. `_redirects` is also deployment configuration.

Design: warm cream/burgundy, DM Sans and Playfair Display, venue imagery, bilingual posters. Preserve that identity and existing behaviour during CSS work. Both languages must remain complete. Breakpoint and CSS decisions should be based on this repository rather than copied from Space360.

## Menus, artwork and editable sources

- Both menu PDFs have six pages and 92 food/wine entries per language according to the recorded preparation work. RSD prices/offers still need owner confirmation. Unexplained dual croissant prices were preserved, not interpreted as invented portion sizes.
- If JSON changes, regenerate and visually inspect both affected PDFs; do not silently leave exports stale.
- README's earlier sentence saying the menu PDF is external is stale: current code uses local `/menus/passengers-menu-sr.pdf` and `-en.pdf`. Google Fonts and Panoee remain external.
- Figma document: `https://www.figma.com/design/VAsDnzilZ0pZ454bYy1pmS/Passengers-Bar-Menu`. Recorded deliverables: 12 native-text menu frames, plus a `Promotions · SR + EN` page with four editable promotion frames. Not freshly verified during this export.
- Photo backgrounds remain raster. A breakfast background obscured by text was reconstructed with AI. Existing venue assets are not Space360 photography; verify usage rights before official launch.
- Figma edits do not automatically update JSON, PDFs or website assets. Decide the source of truth and export deliberately. No completed owner account transfer or `.fig` import is recorded.
- Original editable artifacts/guides: `/Users/arsahin/Documents/Codex/2026-09-23/you-are-helping-me-figure-out/outputs/passengers-bar` (menu PDFs, `figma-editable-menu`, `figma-promotions`). Read only files needed for the task.

## Reservation workflow: preserve these properties

The recipient is configured as `+381606464109`. SMS is enabled; WhatsApp and Viber are false pending owner confirmation. Do not infer support merely from a public phone number.

Guests enter name, callback phone with country code, preferred date/time, party size, optional occasion and notes. The site validates and prepares a localized message. Guests explicitly open their messaging app and send it themselves. This is an enquiry, not availability checking, table selection, a booking confirmation, payment or guaranteed delivery.

- Belgrade-local dates/times, including DST, are handled in the library. Preserve tests for boundary cases.
- Standard SMS link can contain the encoded body. Detected iPhone/iPad uses recipient-only SMS and copy/paste instructions; verify real-device behaviour rather than promising prefill.
- Clipboard failure requires a usable manual-copy path.
- Guest details stay in page memory; no local storage, logs, analytics, fetch submission or own-site URL parameters containing those details.
- Fields begin disabled and are enabled by JavaScript, preventing an accidental native GET submission when JavaScript fails. A phone link remains available.
- Any generated message becomes stale when fields change; preserve reset/validation behaviour.
- Never send test messages to the restaurant. Browser tests should mock or intercept external actions.

## Preview, launch and permissions

This remains an owner-review concept; site preparation being considered done is not owner approval or official launch. Customer-facing review banners were removed previously, while the apartment tour is explicitly labelled a sample.

`tourIsSample: true` and the Panoee apartment tour must not be presented as Passengers footage. Replace with the actual approved venue capture and then change the flag. No venue tour has been established by this handoff.

Indexing restrictions exist in page robots metadata, HTTP `X-Robots-Tag` and `robots.txt`. Keep them until prerequisites are resolved: owner approval, rights to images/artwork, current menu/offers/hours/booking rules, actual venue tour and verified booking workflow. Noindex is not access control.

Cloudflare Pages is the documented hosting target: separate project, Node 24, `npm run build`, output `dist`, repository root. Do not deploy, change domains, remove restrictions, send outreach, enable unverified channels or add paid services merely because development has been handed over. No push/deployment is authorised by this export alone.

## Verification and next work

No build, unit test, formatting check, device test or production check was rerun during this documentation-only export. Earlier README reports logic tests/formatting/build passing; treat them as historical, not fresh proof. Device/browser QA listed below remains pending unless newer evidence is found.

From the project root:

```sh
npm ci
npm run format:check
npm test
npm run build
npm run dev
```

Follow `CLAUDE.md`: formatting, tests and build must pass before commits. Preserve unrelated existing edits. No need to repeat broad research before reading the working code.

Prioritize:
1. Reproduce/fix anchor gaps for `#story`, `#menu`, `#celebrate`, `#reserve`, `#tour` and skip navigation. Check direct hash loads, smooth scrolling, reduced motion and both languages.
2. If undertaking the Tailwind migration, capture before/after screenshots and retain the design, mobile breakpoints, form behaviour and hidden/disabled states. Shared tokens/components should reduce repetition, not simply relocate a tangled cascade.
3. Verify 320/390/768/1440px layouts, overflow, keyboard focus, menus in each language, PDF fallback links, gallery, sample tour labels and reservation errors. Never submit real enquiries.
4. Finish outstanding device checks: iPhone Safari SMS recipient/copy/paste, Android SMS body prefill, desktop clipboard failure/manual selection. Report unavailable devices honestly.
5. Report local changes, exact checks, remaining blockers and one next action. Separate code readiness from owner approval and production state.

## Private business context

Commercial negotiations and sales records intentionally are not duplicated here. The user keeps them in a separate private repository. For a business task, ask the user to supply the private Passengers handoff or relevant client record; they are not needed to build this site. Never copy those records into public assets/build output or this customer repository.
