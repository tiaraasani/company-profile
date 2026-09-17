const DATE = new Intl.DateTimeFormat('en', { dateStyle: 'medium' })

/** Epoch milliseconds -> "Sep 17, 2026". */
export function formatDate(epochMs: number): string {
  return DATE.format(new Date(epochMs))
}

/** Rough reading time from a Markdown body, at ~200 words per minute (minimum 1). */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
