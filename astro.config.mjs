import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  i18n: {
    locales: ["sr", "en"],
    defaultLocale: "sr",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
