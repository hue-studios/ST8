/**
 * The Directus on/off switch for Ask ST8 (`organization.ask_ai_enabled`).
 *
 * Read straight from the CMS, not through the page cache (server/utils/directus.ts keeps reads for five minutes and
 * then serves stale copies while it refreshes), so turning it off takes effect within SWITCH_TTL without a deploy.
 * Anything other than an explicit `true` counts as off: a CMS that is down, or a field the public role cannot read,
 * switches the answers off and leaves ordinary search running.
 */
const SWITCH_TTL = 30 * 1000

let held: { at: number, on: boolean } | null = null
let inflight: Promise<boolean> | null = null

async function readSwitch(): Promise<boolean> {
  try {
    const base = useRuntimeConfig().public.directusUrl
    const res = await fetchWithTimeout(`${base}/items/organization?fields=ask_ai_enabled`)
    if (!res.ok) return false
    const json = await res.json() as { data?: { ask_ai_enabled?: unknown } }
    return json.data?.ask_ai_enabled === true
  }
  catch {
    return false
  }
}

export async function askSwitchOn(): Promise<boolean> {
  if (held && Date.now() - held.at < SWITCH_TTL) return held.on
  inflight ??= readSwitch()
    .then((on) => {
      held = { at: Date.now(), on }
      return on
    })
    .finally(() => {
      inflight = null
    })
  return await inflight
}
