// Shared class strings, kept as complete literals so Tailwind can detect them.
// Section widths and breakpoints follow the original stylesheet (mobile below 761px).

const button =
  "inline-flex items-center justify-center rounded-[2px] border text-[13px] font-semibold hover:brightness-[1.13]";

export const btn = `${button} border-wine bg-wine px-6 py-[15px] text-white`;
export const btnCream = `${button} border-cream bg-cream px-6 py-[15px] text-wine-dark`;
export const btnSmall = `${button} border-wine bg-wine p-2 text-white md:px-[18px] md:py-3`;

export const eyebrow = "mb-5 text-[9px] font-bold tracking-[.22em] md:mb-[25px] md:text-[10px]";
export const underlined = "text-[13px] underline underline-offset-[6px]";
export const actions = "mt-[30px] flex flex-wrap items-center gap-5 md:gap-[25px]";

export const section = "mx-auto max-w-[1400px] px-[7%] py-[55px] md:px-[8%] md:py-[95px]";
export const sectionHead = "mb-[35px] items-start justify-between gap-5 md:items-end md:gap-[45px]";
export const twoColumns =
  "grid grid-cols-[1fr] items-center gap-[30px] md:grid-cols-[1fr_1fr] md:gap-[90px]";

export const wordmark =
  "flex items-center gap-3.5 text-[15px] font-bold tracking-[.15em] md:text-[19px]";
export const wordmarkSub = "block text-[8px] tracking-[.22em] md:text-[9px]";

// Round prev/next buttons for carousels.
export const roundButton =
  "size-[35px] rounded-full border border-[#b5b4a8] bg-transparent text-[22px] md:size-11";

export const field =
  "min-h-[45px] w-full min-w-0 rounded-[2px] border border-[#869083] bg-cream p-2.5 text-ink";
export const fine = "mt-[15px]! text-[.85rem] leading-[1.6] text-[#d2d9cd]";
