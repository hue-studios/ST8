#!/usr/bin/env node
// The Directus on/off switch for Ask ST8, the AI answer above the search results.
// See docs/plans/search-services-podcast-updates.md, "Session 12".
//
//   node --env-file=.env scripts/directus/ask-switch-setup.mjs                    # dry run
//   node --env-file=.env scripts/directus/ask-switch-setup.mjs --apply            # make the change
//   node --env-file=.env scripts/directus/ask-switch-setup.mjs --remove --apply   # undo
//
// Adds one boolean field, organization.ask_ai_enabled, default on. The site shows AI answers only when this is on AND
// the server has ANTHROPIC_API_KEY set, so on its own the field changes nothing. Staff turn it off to stop the answers
// within about 30 seconds, without a deploy. Safe to re-run. --apply first saves a schema snapshot to
// scripts/directus/backups/ (gitignored).
//
// Needs DIRECTUS_URL and DIRECTUS_TOKEN (admin static token). Plain fetch.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const argv = process.argv.slice(2)
const APPLY = argv.includes('--apply')
const REMOVE = argv.includes('--remove')
const unknown = argv.filter((a) => !['--apply', '--remove'].includes(a))
if (unknown.length) fail('Unknown argument: ' + unknown.join(' '))

const BASE = (process.env.DIRECTUS_URL || '').replace(/\/$/, '')
const TOKEN = process.env.DIRECTUS_TOKEN
if (!BASE || !TOKEN) fail('Set DIRECTUS_URL and DIRECTUS_TOKEN (run with node --env-file=.env).')

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'
const FIELD = 'ask_ai_enabled'

function fail(message) {
  console.error(message)
  process.exit(1)
}

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { Authorization: 'Bearer ' + TOKEN, ...(body !== undefined && { 'Content-Type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (res.status === 204) return null
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {}
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ` + (json?.errors?.map((e) => e.message).join('; ') || text.slice(0, 200)))
    err.status = res.status
    throw err
  }
  return json?.data ?? null
}

async function exists() {
  try {
    await api('GET', `/fields/organization/${FIELD}`)
    return true
  } catch (e) {
    if (e.status === 403 || e.status === 404) return false
    throw e
  }
}

const DEF = {
  field: FIELD,
  type: 'boolean',
  schema: { default_value: true, is_nullable: false },
  meta: {
    interface: 'boolean',
    special: ['cast-boolean'],
    width: 'full',
    options: { label: 'Show AI answers above search results' },
    display: 'boolean',
    note:
      'Ask ST8. When on, questions typed into the site search get a short AI-written answer above the results, written only from ST8’s own pages. Turn off to stop the answers at once (takes effect within a minute, no deploy). The answers also need the model API key set on the server; without it this switch has no effect.',
  },
}

async function backup() {
  const dir = join(HERE, 'backups')
  await mkdir(dir, { recursive: true })
  const file = join(dir, `ask-switch-${new Date().toISOString().replace(/[:.]/g, '-')}-schema.json`)
  await writeFile(file, JSON.stringify(await api('GET', '/schema/snapshot'), null, 2))
  console.log('Saved schema snapshot to ' + file)
}

async function main() {
  console.log(`Ask ST8 switch ${REMOVE ? 'REMOVE' : 'SETUP'} — ${APPLY ? 'APPLYING to' : 'DRY RUN against'} ${BASE}`)
  const have = await exists()

  // The public role must be able to read the field, or the site reads the switch as off.
  const perms = await api('GET', `/permissions?filter[collection][_eq]=organization&filter[policy][_eq]=${PUBLIC_POLICY}&filter[action][_eq]=read&fields=id,fields`)
  const publicReads = perms?.some((p) => p.fields?.includes('*') || p.fields?.includes(FIELD))
  if (!perms?.length) console.log('WARNING: the public policy has no read permission on organization.')
  else if (!publicReads) console.log(`WARNING: the public read permission on organization lists fields; add ${FIELD} to it by hand.`)

  if (REMOVE) {
    if (!have) return console.log('Nothing to remove.')
    console.log(`- delete field organization.${FIELD}`)
    if (!APPLY) return console.log('(dry run; add --apply)')
    await backup()
    await api('DELETE', `/fields/organization/${FIELD}`)
    return console.log('Done.')
  }

  if (have) return console.log(`organization.${FIELD} already exists. No changes.`)
  console.log(`+ add field organization.${FIELD} (boolean, default on)`)
  if (!APPLY) return console.log('(dry run; add --apply)')
  await backup()
  await api('POST', '/fields/organization', DEF)
  const row = await api('GET', `/items/organization?fields=${FIELD}`)
  console.log(`Done. organization.${FIELD} is now ${row?.[FIELD]}.`)
}

main().catch((e) => fail(e.message))
