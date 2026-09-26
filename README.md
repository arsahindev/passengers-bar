# Passengers Bar

Standalone bilingual Astro website concept, extracted from Space360. All design assets and dependencies belong to this project; no sibling repository is required to build or serve it.

## Run locally

Use Node 24, then:

```sh
npm ci
npm run dev
```

Routes: `/sr/` and `/en/`. Root redirects to Serbian.

## Cloudflare Pages

Create a new GitHub repository from this folder, then connect that repository to a **separate Cloudflare Pages project**.

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: leave blank (repository root)
- Production branch: `main`
- Node version: 24 (`.nvmrc` included; set `NODE_VERSION=24` if needed)
- No Cloudflare adapter, secrets or special preview environment flag needed.

See https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

## Important current boundaries

This is an owner-review concept, not the official restaurant website. Customer-facing review labels have been removed; noindex instructions remain. Noindex is not password protection: uploading to Pages makes the preview publicly accessible unless you add access controls.

Reservations use a client-side enquiry form that prepares a message for +381606464109. Guests send it themselves through their messaging app. There is no automatic availability, table selection, payment or booking confirmation. The apartment tour is displayed as a sample for the owner presentation. Replace `tourEmbedUrl` and set `tourIsSample: false` in `src/content/settings.ts` when the restaurant tour is ready.

The Panoee embed is the clearly labelled Space360 apartment example, not Passengers Bar. `src/content/settings.ts` holds its URL and the external Space360 attribution link; neither is a build dependency on Space360. The menu PDF and Google Fonts also remain external services.

Before official launch: confirm owner approval, rights to existing photographs/promotional artwork, current offers/menu/hours and booking rules; replace the example tour; configure and verify the real booking workflow; then review/remove concept labels and indexing restrictions. Do not point the restaurant's existing domain here prematurely.

## Edit

- Website: `src/components/PassengersPage.astro`
- Assets and provenance: `src/assets/passengers/`
- Language routes: `src/pages/[locale]/index.astro`
- Tour and attribution settings: `src/content/settings.ts`

Images are existing venue assets plus English poster adaptations, not Space360 portfolio work. No licence to redistribute third-party photographs is implied by this repository.

## Formatting

Prettier with the official Astro plugin is pinned in devDependencies. Run `npm run format`, or `npm run format:check` to verify. The Astro VS Code extension uses the project configuration; format-on-save is enabled for Astro files. `htmlWhitespaceSensitivity: "ignore"` lets adjacent elements be formatted on separate lines. Preserve intentional inline spacing explicitly when needed.

## Menus

English and Serbian menu PDFs are served locally from `public/menus/`. Both the menu button and expandable embedded viewer select the current language. Both PDFs use the same six-page design, preserving the supplied menu’s 92 food/wine entries, RSD prices and offers. Serbian uses local number formatting. The source includes unexplained dual croissant prices, which are retained without inventing portion sizes. Verify current prices and promotions with the owner before public launch.

Editable content: `src/content/menu-en.json` and `src/content/menu-sr.json`. Optional PDF regeneration on macOS: install Python `reportlab`, then run `python3 scripts/build-menu.py en` or `python3 scripts/build-menu.py sr`. The generator uses the system Arial and Georgia fonts. Normal Astro/Cloudflare builds require no Python; the generated PDFs are committed static assets.

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
