// Renders each menu PDF in public/menus/ to one PNG per page in src/assets/menus/<locale>/.
// Mobile browsers can't show a PDF inside an <iframe> (iOS shows a fixed first page, Android
// nothing), so the menu viewer shows these images instead. Runs before `dev` and `build`, so a
// replaced PDF is picked up automatically; the output is gitignored.
import { mkdir, rm, writeFile } from "node:fs/promises";
import { pdf } from "pdf-to-img";

const out = new URL("../src/assets/menus/", import.meta.url);
// A4 is 595pt wide, so scale 4 gives ~2381px: still sharp when the full-screen viewer zooms a
// page to 2.5x on a 3x phone screen. The carousel uses smaller versions made by astro:assets.
const scale = 4;

await rm(out, { recursive: true, force: true });
for (const locale of ["sr", "en"]) {
  const dir = new URL(`${locale}/`, out);
  await mkdir(dir, { recursive: true });
  const file = new URL(`../public/menus/passengers-menu-${locale}.pdf`, import.meta.url);
  let page = 0;
  for await (const image of await pdf(file.pathname, { scale })) {
    page += 1;
    await writeFile(new URL(`page-${String(page).padStart(2, "0")}.png`, dir), image);
  }
  if (page === 0) throw new Error(`${file.pathname} has no pages`);
  console.log(`menu-pages: ${locale} → ${page} page(s)`);
}
