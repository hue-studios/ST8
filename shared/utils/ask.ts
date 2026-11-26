/**
 * Ask ST8: the short AI-written answer shown above the search results (plan session 12, option b). Shared because
 * /api/ask builds it and the search panel and /search page show it.
 *
 * The feature is on only when the server has a model API key and the Directus switch (Organization → "Ask ST8 AI
 * answers") is on. When it is off, /api/ask answers `{ enabled: false }` and search behaves exactly as before.
 */

export interface AskSource {
  title: string
  /** A site path, or a full URL when `external`. Always one of the search results the answer was written from. */
  url: string
  external?: boolean
}

export type AskResponse =
  | { enabled: false }
  | {
    enabled: true
    /** Two or three plain-text sentences. Empty when there was nothing to answer from. */
    answer: string
    /** False when the model said ST8's pages do not cover the question. */
    covered: boolean
    sources: AskSource[]
  }

/** The longest question the route accepts (the search field's own limit). */
export const ASK_MAX_LENGTH = 200

/**
 * Whether a query reads as a question worth an answer, rather than a keyword. A single word or a name ("broadband",
 * "CEDS", "Jen Gregory") gets the ordinary results only; three words or more, or anything ending in "?", gets an answer.
 */
export function isAskable(query: string): boolean {
  const q = query.trim()
  if (q.length < 8 || q.length > ASK_MAX_LENGTH) return false
  return q.endsWith('?') || q.split(/\s+/).length >= 3
}
