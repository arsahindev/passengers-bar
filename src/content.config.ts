import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// One file per language: { "Category": [[name, price in RSD, description], ...] }.
// Prices are strings exactly as printed on the menu, e.g. "580", "1.050" or "2,350 / 410"
// (bottle / glass); the PDFs are built from these files.
const price = z.string().regex(/^\d[\d.,]*( \/ \d[\d.,]*)?$/);
const item = z.tuple([z.string().min(1), price, z.string()]);

const menu = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/menu" }),
  schema: z.record(z.string().min(1), z.array(item).min(1)),
});

export const collections = { menu };
