#!/usr/bin/env node
// One-off: puts Beth's November 2026 copy ("Housing Program Page: Content and Edits for Web
// Update") onto the live Housing page, replacing the stand-ins housing-setup.mjs seeded.
//
//   node --env-file=.env scripts/directus/housing-content-2026-11.mjs            # dry run
//   node --env-file=.env scripts/directus/housing-content-2026-11.mjs --apply    # make the changes
//
// Unlike housing-setup.mjs, this overwrites what is there, so it is a one-off: once staff start
// editing these fields, running it again would put this copy back over theirs (the dry run shows
// exactly which fields would change). Saves the current values to scripts/directus/backups/ first.
//
// The program's title is changed by housing-setup.mjs --rename-program, not here.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { TOOLS_INTRO, FRAMEWORK_LINKS } from './housing-setup.mjs'

const APPLY = process.argv.includes('--apply')
const BASE = (process.env.DIRECTUS_URL || '').replace(/\/$/, '')
const TOKEN = process.env.DIRECTUS_TOKEN
const BACKUP_DIR = join(dirname(fileURLToPath(import.meta.url)), 'backups')

const PROGRAM_SLUG = 'housing'
const OLD_SUMMIT_TITLE = 'Developers Summit 2025 Schedule'
const NEW_SUMMIT = {
  status: 'published',
  title: 'Developers Summit 2026 Schedule',
  type: 'External Link',
  category: 'Infrastructure',
  link: 'https://regionalboard.regfox.com/southerntiersummit',
}

const PAGE = {
  title: 'Regional Workforce Housing Investment Framework',
  // The framework's name is now the title, so the old subtitle would only repeat it.
  subtitle: null,
  intro: TOOLS_INTRO,
  framework_links: FRAMEWORK_LINKS,
  share_description:
    'The Regional Workforce Housing Investment Framework: data, maps and reports for workforce housing across the Southern Tier.',
  banner_text: 'Explore the Regional Workforce Housing Investment Framework.',
}

const ABOUT =
  '<p>The Southern Tier lacks the housing it needs to attract workers and grow. Southern Tier 8 has worked with the eight counties of the region to define shared housing needs, align resources, and position communities for scaled investment in workforce housing. The Regional Workforce Housing Investment Framework, developed with national experts CommunityScale, Public Innovate and Housing Innovations Group, defines the coordinated approach to resources and financing so that more of the right projects get underway in the right places.</p>'

const DELIVERS =
  "<p>The framework brings public, private, and philanthropic partners and capital together behind the projects and programs that serve shared regional priorities, and it ties housing production to what the region's current and future workforce can afford. It is designed for local officials, developers, nonprofits, lenders, employers, and community organizations, with an emphasis on building local capacity while fostering regional coordination.</p>"

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (res.status === 204) return null
  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(
      `${method} ${path} → ${res.status}: ` +
        (json?.errors?.map((e) => e.message).join('; ') || '')
    )
  }
  return json?.data ?? null
}

const show = (v) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return s && s.length > 100 ? s.slice(0, 97) + '…' : s
}

const changes = []
const change = (text, run) => changes.push({ text, run })

async function plan() {
  const page = await api('GET', '/items/housing_page')
  const pageFills = {}
  for (const [k, v] of Object.entries(PAGE)) {
    if (!isDeepStrictEqual(page[k] ?? null, v)) pageFills[k] = v
  }
  for (const k of Object.keys(pageFills)) {
    change(`housing_page.${k}: ${show(page[k])}\n      → ${show(PAGE[k])}`)
  }
  if (Object.keys(pageFills).length) {
    changes[changes.length - 1].run = () =>
      api('PATCH', '/items/housing_page', pageFills)
  }

  const [program] = await api(
    'GET',
    `/items/programs?filter[url][_eq]=${PROGRAM_SLUG}&fields=id,what_is_it,what_it_accomplishes&limit=1`
  )
  // Keep the "Join our network today & register here!" paragraph and its link as they are.
  const join =
    (program.what_is_it || '').match(
      // One paragraph only: no </p> between its opening <p> and the words.
      /<p>(?:(?!<\/p>)[^])*Join our network[^]*?<\/p>/
    )?.[0] || ''
  const about = ABOUT + join
  const programFills = {}
  if (program.what_is_it !== about) programFills.what_is_it = about
  if (program.what_it_accomplishes !== DELIVERS) {
    programFills.what_it_accomplishes = DELIVERS
  }
  for (const k of Object.keys(programFills)) {
    change(
      `programs #${program.id}.${k}: ${show(program[k])}\n      → ${show(
        programFills[k]
      )}`
    )
  }
  if (Object.keys(programFills).length) {
    changes[changes.length - 1].run = () =>
      api('PATCH', '/items/programs/' + program.id, programFills)
  }

  // Summit schedule: a new 2026 resource in place of the 2025 one on this program. The 2025
  // resource itself stays as it is.
  const links = await api(
    'GET',
    `/items/programs_resources?filter[programs_id][_eq]=${program.id}&fields=id,resources_id.id,resources_id.title&limit=-1`
  )
  const linked = (title) =>
    links.find((l) => l.resources_id && l.resources_id.title === title)
  const [existing2026] = await api(
    'GET',
    `/items/resources?filter[title][_eq]=${encodeURIComponent(
      NEW_SUMMIT.title
    )}&fields=id&limit=1`
  )
  let summitId = existing2026?.id
  if (!summitId) {
    change(
      `create resource "${NEW_SUMMIT.title}" → ${NEW_SUMMIT.link}`,
      async () => {
        summitId = (await api('POST', '/items/resources', NEW_SUMMIT)).id
      }
    )
  }
  if (!linked(NEW_SUMMIT.title)) {
    change(`link "${NEW_SUMMIT.title}" to programs #${program.id}`, () =>
      api('POST', '/items/programs_resources', {
        programs_id: program.id,
        resources_id: summitId,
      })
    )
  }
  const old = linked(OLD_SUMMIT_TITLE)
  if (old) {
    change(
      `unlink "${OLD_SUMMIT_TITLE}" from programs #${program.id} (the resource itself is kept)`,
      () => api('DELETE', '/items/programs_resources/' + old.id)
    )
  }
  return { page, program, links }
}

async function main() {
  if (!BASE || !TOKEN) throw new Error('Set DIRECTUS_URL and DIRECTUS_TOKEN.')
  console.log(
    `Housing content (Beth, Nov 2026) — ${
      APPLY ? 'APPLYING to' : 'DRY RUN against'
    } ${BASE}\n`
  )
  const before = await plan()
  if (!changes.length)
    return console.log('No changes: the content already matches.')
  console.log(`${changes.length} change(s)${APPLY ? '' : ' to make'}:`)
  for (const c of changes) console.log('  ~ ' + c.text)
  if (!APPLY) return

  await mkdir(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const path = join(BACKUP_DIR, `${stamp}-housing-content-before.json`)
  await writeFile(path, JSON.stringify(before, null, 2))
  console.log(`\nBacked up to ${path}\n`)
  for (const c of changes) {
    if (c.run) await c.run()
    console.log('  ✓ ' + c.text.split('\n')[0])
  }
  console.log('\nDone. Run again to confirm "No changes".')
}

main().catch((e) => {
  console.error('Error: ' + e.message)
  process.exit(1)
})
