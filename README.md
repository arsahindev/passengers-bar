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

This is an owner-review concept, not the official restaurant website. Visible review labels and noindex instructions remain. Noindex is not password protection: uploading to Pages makes the preview publicly accessible unless you add access controls.

The reservation form is a local demonstration only: no delivery, database, actual availability, table selection or payments. The proposed table-specific reservation engine has not been implemented.

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
