// A single inline markup form for FAQ answers: [label](https://url).
//
// Kept in one place because it is consumed twice with opposite intent — the FAQ
// component renders it as an anchor, while the FAQPage JSON-LD must strip it, or
// the raw markdown ends up in structured data and Google indexes the brackets.

export const INLINE_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

/** Turn `[label](url)` into plain `label`. For structured data and any other text-only sink. */
export function stripLinks(text: string): string {
  return text.replace(INLINE_LINK, '$1')
}
