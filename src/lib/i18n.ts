import { getRelativeLocaleUrl } from "astro:i18n";

export type Locale = "sr" | "en";

// Per-page translation helpers. `tx(serbian, english)` picks the string for the current locale.
export function useLocale(currentLocale: string | undefined) {
  const locale: Locale = currentLocale === "sr" ? "sr" : "en";
  const sr = locale === "sr";
  const other: Locale = sr ? "en" : "sr";
  const tx = (serbian: string, english: string) => (sr ? serbian : english);
  return { locale, sr, tx, other, otherUrl: getRelativeLocaleUrl(other) };
}
