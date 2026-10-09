# Passengers Bar

Standalone bilingual Astro website concept, extracted from Space360. All design assets and dependencies belong to this project; no sibling repository is required to build or serve it.

## Run locally

Use Node 24, then:

```sh
npm ci
npm run dev
```

Routes: `/sr/` and `/en/`. Root redirects to Serbian.

## Cloudflare Workers

The site is deployed as a **Cloudflare Worker serving static assets** (not Cloudflare Pages), connected to this GitHub repository through Workers Builds. It is live at `https://passengers-bar.arsahin-dev.workers.dev`.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: leave blank (repository root)
- Production branch: `main`
- Node version: 24 (`.nvmrc` is honoured)
- Preview builds for non-production branches are switched off (Settings → Builds → Branch control). CI on pull requests is GitHub Actions (`.github/workflows/ci.yml`).
- `wrangler.jsonc` points the Worker at `dist/` and serves `404.html` for unknown URLs. Wrangler is pinned in devDependencies so deploys are repeatable. `public/_headers` and `public/_redirects` are applied by Workers static assets.
- No Cloudflare adapter, bindings (KV, Images, etc.) or secrets are needed. Do not run `astro add cloudflare`; without `wrangler.jsonc`, Wrangler would try to add the adapter automatically during the deploy.

To check a deploy locally without deploying: `npm run build && npx wrangler deploy --dry-run`, or `npx wrangler dev` to serve `dist/` on 127.0.0.1:8787.

See https://developers.cloudflare.com/workers/static-assets/

## Important current boundaries

This is an owner-review concept, not the official restaurant website. Customer-facing review labels have been removed; noindex instructions remain. Noindex is not password protection: deploying makes the preview publicly accessible unless you add access controls.

Reservations use a client-side enquiry form that prepares a message for +381606464109. Guests send it themselves through their messaging app. There is no automatic availability, table selection, payment or booking confirmation. The apartment tour is displayed as a sample for the owner presentation. Replace `tourEmbedUrl` and set `tourIsSample: false` in `src/content/settings.ts` when the restaurant tour is ready.

The Panoee embed is the clearly labelled Space360 apartment example, not Passengers Bar. `src/content/settings.ts` holds its URL and the external Space360 attribution link; neither is a build dependency on Space360. Google Fonts also remains an external service; the menu PDFs are served locally from `public/menus/`.

Before official launch: confirm owner approval, rights to existing photographs/promotional artwork, current offers/menu/hours and booking rules; replace the example tour; configure and verify the real booking workflow; then review/remove concept labels and indexing restrictions. Do not point the restaurant's existing domain here prematurely.

## Edit

- Website: `src/components/PassengersPage.astro` (sections in `src/components/sections/`)
- Assets and provenance: `src/assets/passengers/`
- Language routes: `src/pages/sr/index.astro` and `src/pages/en/index.astro`
- Tour and attribution settings: `src/content/settings.ts`
- Design tokens (colours, fonts, breakpoint) and base styles: `src/styles/global.css`
- Shared Tailwind class strings (buttons, section layout, form fields): `src/lib/ui.ts`

Styling uses Tailwind CSS v4 through the official Vite plugin (build-time only, no runtime cost). Classes live in the markup; the desktop layout starts at 761px and below that the mobile layout applies. Google Fonts is still loaded from `global.css`.

Images are existing venue assets plus English poster adaptations, not Space360 portfolio work. No licence to redistribute third-party photographs is implied by this repository.

## Formatting

Prettier with the official Astro plugin is pinned in devDependencies. Run `npm run format`, or `npm run format:check` to verify. The Astro VS Code extension uses the project configuration; format-on-save is enabled for Astro files. `htmlWhitespaceSensitivity: "ignore"` lets adjacent elements be formatted on separate lines. Preserve intentional inline spacing explicitly when needed.

## Menus

English and Serbian menu PDFs are served locally from `public/menus/`. The menu section shows the first three pages as a fanned stack; they and the "Browse the menu" button open a full-screen viewer, and a smaller "Download PDF" link offers the file itself. All of these select the current language. The viewer shows each PDF page as an image rather than embedding the PDF, because mobile browsers can't display a PDF inside a page (iOS shows a fixed first page, Android nothing). `scripts/menu-pages.mjs` renders the pages from the PDFs automatically before every `npm run dev` and `npm run build` (gitignored output in `src/assets/menus/`). The viewer has pinch, double-tap and button zoom, so the A4 text is readable on phones. The food photograph that used to sit beside the menu now has its own full-width band after the menu and offers, with a link to reservations. Both PDFs use the same six-page design, preserving the supplied menu’s 92 food/wine entries, RSD prices and offers. Serbian uses local number formatting. The source includes unexplained dual croissant prices, which are retained without inventing portion sizes. Verify current prices and promotions with the owner before public launch.

Updating prices: the customer edits the Figma menu file and exports the Serbian and English PDFs. Replace `public/menus/passengers-menu-sr.pdf` and `public/menus/passengers-menu-en.pdf` with the exports, keeping the same filenames, check the file size and fonts, then deploy. The page images are regenerated from the new PDFs by the build; nothing else needs updating. The PDFs are the only source of menu content; there is no menu data in the repository.

## Reservation messaging

- `src/content/settings.ts`: `reservations.phone` is the recipient; `whatsapp` and `viber` remain false until the owner confirms those channels.
- SMS is enabled. Standard SMS body links follow RFC 5724. On detected iPhone/iPad devices, the recipient-only link follows Apple's documented scheme: copy the prepared request, open SMS, then paste. Other phones may also need copy/paste. SMS carrier charges can apply; no paid API or backend is used.
- WhatsApp, when enabled, uses an international-number `wa.me` link with encoded text. Viber, when enabled, displays copy/paste instructions and the number; bot-only deep links are not used for this ordinary phone number.
- Requests stay in the page's memory until the guest copies them or opens a messaging link. No storage, analytics events, fetch requests or own-site URL parameters contain guest details. External apps receive details only on the guest's action. The browser/device may retain clipboard or messaging drafts.
- Fields stay disabled if JavaScript fails, preventing accidental native GET submissions. A phone link remains available without JavaScript.
- No availability check, delivery receipt or booking confirmation is implied. The restaurant must reply.
- `npm test` checks phone normalization, message encoding in both languages, Belgrade time and DST boundaries. Formatting and Astro production build pass.
- Pending real-device checks: iPhone Safari recipient/copy/paste, Android SMS prefill, desktop clipboard failure/manual selection, responsive visual review. Do not send a test to the restaurant without permission. Browser QA was blocked by automatic approval review because the account usage limit was reached.

References: [SMS RFC](https://datatracker.ietf.org/doc/html/rfc5724), [Apple SMS links](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/SMSLinks/SMSLinks.html), [WhatsApp click-to-chat](https://faq.whatsapp.com/5913398998672934), [Viber bot deep links](https://developers.viber.com/docs/tools/deep-links/).
