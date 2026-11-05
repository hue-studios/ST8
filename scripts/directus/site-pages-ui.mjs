#!/usr/bin/env node
// Makes the other Site Pages collections in Directus (Home, Organization, How to Apply) easier for
// staff to edit: plain-English labels that match the headings on the site, a note on every field
// saying where it shows up, sections on the Organization page, a dropdown for social platforms,
// and a Preview button that opens the live page.
//
//   node --env-file=.env scripts/directus/site-pages-ui.mjs            # dry run
//   node --env-file=.env scripts/directus/site-pages-ui.mjs --apply    # make the changes
//
// Only how fields look and are labelled changes. No column is added, removed or retyped and no
// content is touched; the section headers and notices are display-only fields that hold no data.
// Safe to re-run: it compares with what is there and changes only what differs. --apply saves the
// schema snapshot to scripts/directus/backups/ (gitignored) first, which is also how to undo it.
//
// The Housing collection in the same group is set up by housing-setup.mjs.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const SITE_URL = 'https://southerntier8.org'
const APPLY = process.argv.includes('--apply')
const unknown = process.argv.slice(2).filter((a) => a !== '--apply')
if (unknown.length) fail('Unknown argument: ' + unknown.join(' '))

const BASE = (process.env.DIRECTUS_URL || '').replace(/\/$/, '')
const TOKEN = process.env.DIRECTUS_TOKEN
if (!BASE || !TOKEN) {
  fail('Set DIRECTUS_URL and DIRECTUS_TOKEN (run with node --env-file=.env).')
}
const BACKUP_DIR = join(dirname(fileURLToPath(import.meta.url)), 'backups')

// --- Directus API -------------------------------------------------------------------------------

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
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {}
  if (!res.ok) {
    throw new Error(
      `${method} ${path} → ${res.status}: ` +
        (json?.errors?.map((e) => e.message).join('; ') || text.slice(0, 200))
    )
  }
  return json?.data ?? null
}

// --- Definitions --------------------------------------------------------------------------------

const label = (text) => [{ language: 'en-US', translation: text }]
const collectionLabel = (text) => [
  { language: 'en-US', translation: text, singular: text, plural: text },
]

function section(field, name, sort, start, icon) {
  return {
    field,
    type: 'alias',
    meta: {
      interface: 'group-detail',
      special: ['alias', 'no-data', 'group'],
      options: { start, headerIcon: icon },
      translations: label(name),
      sort,
      width: 'full',
      group: null,
      hidden: false,
    },
  }
}

function notice(field, sort, text, group = null) {
  return {
    field,
    type: 'alias',
    meta: {
      interface: 'presentation-notice',
      special: ['alias', 'no-data'],
      options: { color: 'info', icon: 'info', text },
      sort,
      width: 'full',
      group,
      hidden: false,
    },
  }
}

// These fields are printed as plain text, and the page runs line breaks together.
const PLAIN_TEXT =
  'Plain text only. Line breaks don’t show on the page: it all runs as one paragraph.'

// Per collection: the collection's own settings, new display-only fields (section headers and
// notices), and label/note/layout changes to existing fields. Existing fields are only patched
// with the keys given here.
const COLLECTIONS = [
  {
    collection: 'home',
    meta: {
      translations: collectionLabel('Home'),
      note: 'The home page: the welcome text and the featured resource.',
      preview_url: SITE_URL + '/',
    },
    add: [
      notice(
        'home_notice',
        2,
        'The **Mission Statement** on the home page comes from **Site Pages → Organization**. The housing banner is under **Site Pages → Housing → 4. Home Page Banner**.'
      ),
    ],
    fields: {
      introduction: {
        sort: 3,
        translations: label('Welcome text'),
        note:
          'The short text over the photo at the top of the home page. Two or three sentences. If it is empty the page says "Welcome to our digital experience." ' +
          PLAIN_TEXT,
      },
      featured_resource: {
        sort: 4,
        translations: label('Featured resource'),
        note: 'The resource in the "Featured Resource" box on the home page. Leave empty to hide the box. Add or edit resources under Website → Resources.',
      },
    },
  },
  {
    collection: 'organization',
    meta: {
      translations: collectionLabel('Organization'),
      note: 'The Organization page, the contact details and social links in the footer, and the site-wide default images.',
      preview_url: SITE_URL + '/regional-organization',
    },
    add: [
      section('section_about', '1. About Us', 2, 'open', 'apartment'),
      section(
        'section_contact',
        '2. Contact Details & Footer',
        3,
        'closed',
        'contact_phone'
      ),
      section(
        'section_files',
        '3. Default Images & Documents',
        4,
        'closed',
        'image'
      ),
    ],
    fields: {
      mission_statement: {
        group: 'section_about',
        sort: 1,
        translations: label('Mission statement'),
        note:
          'Under "Mission" on the Organization page, and in the Mission Statement band on the home page. ' +
          PLAIN_TEXT,
      },
      who_we_are: {
        group: 'section_about',
        sort: 2,
        translations: label('Our Vision'),
        note: 'Under "Our Vision" on the Organization page. ' + PLAIN_TEXT,
      },
      our_role: {
        group: 'section_about',
        sort: 3,
        translations: label('Our Approach'),
        note: 'Under "Our Approach" on the Organization page. ' + PLAIN_TEXT,
      },
      our_history: {
        group: 'section_about',
        sort: 4,
        translations: label('Our History'),
        note: 'Under "Our History" on the Organization page. ' + PLAIN_TEXT,
      },
      phone: {
        group: 'section_contact',
        sort: 1,
        width: 'half',
        translations: label('Phone'),
        note: 'Shown in the footer on every page.',
        options: {
          placeholder: '(607) 724-1327',
          iconLeft: 'call',
          trim: true,
        },
      },
      fax: {
        group: 'section_contact',
        sort: 2,
        width: 'half',
        translations: label('Fax'),
        note: 'Shown in the footer on every page.',
        options: { placeholder: '(607) 724-1194', iconLeft: 'fax', trim: true },
      },
      email: {
        group: 'section_contact',
        sort: 3,
        width: 'half',
        translations: label('Email'),
        note: 'Shown in the footer on every page; clicking it opens an email.',
        options: {
          placeholder: 'contact@southerntier8.org',
          iconLeft: 'mail',
          trim: true,
        },
      },
      locations: {
        group: 'section_contact',
        sort: 4,
        translations: label('Office locations'),
        note: 'Each office listed in the footer, in this order. Drag the handle to reorder.',
        options: {
          template: '{{title}}',
          addLabel: 'Add a location',
          fields: [
            {
              field: 'title',
              name: 'Location name',
              type: 'string',
              meta: {
                field: 'title',
                type: 'string',
                interface: 'input',
                width: 'full',
                note: "Shown above the address, e.g. 'At The MetroCenter'.",
                options: { placeholder: 'At The MetroCenter', trim: true },
              },
            },
            {
              field: 'address',
              name: 'Address',
              type: 'text',
              meta: {
                field: 'address',
                type: 'text',
                interface: 'input-multiline',
                width: 'full',
                note: 'One line of the address per line.',
                options: {
                  placeholder:
                    '49 Court Street\nSuite #222\nBinghamton, NY 13901',
                },
              },
            },
          ],
        },
      },
      social_links: {
        group: 'section_contact',
        sort: 5,
        translations: label('Social media links'),
        note: 'The icons in the footer. Only these four platforms have icons.',
        options: {
          template: '{{platform}}',
          addLabel: 'Add a social link',
          fields: [
            {
              field: 'platform',
              name: 'Platform',
              type: 'string',
              meta: {
                field: 'platform',
                type: 'string',
                interface: 'select-dropdown',
                width: 'half',
                required: true,
                note: 'Which icon to show.',
                // The values are what the footer matches on, so they keep their old spelling.
                options: {
                  choices: [
                    { text: 'Facebook', value: 'Facebook' },
                    { text: 'Instagram', value: 'Instagram' },
                    { text: 'LinkedIn', value: 'Linkedin' },
                    { text: 'X (Twitter)', value: 'Twitter' },
                  ],
                },
              },
            },
            {
              field: 'link',
              name: 'Link (URL)',
              type: 'string',
              meta: {
                field: 'link',
                type: 'string',
                interface: 'input',
                width: 'half',
                required: true,
                note: 'The full address of the profile page, starting with https://.',
                options: {
                  placeholder: 'https://www.facebook.com/…',
                  iconLeft: 'link',
                  trim: true,
                },
                validation: { _and: [{ link: { _regex: '^https://' } }] },
                validation_message:
                  'The link has to be a full web address starting with https:// — copy it from the address bar.',
              },
            },
          ],
        },
      },
      default_cover_image: {
        group: 'section_files',
        sort: 1,
        translations: label('Default news & event image'),
        note: 'Used for news articles and events that have no image of their own.',
      },
      default_person_image: {
        group: 'section_files',
        sort: 2,
        translations: label('Default person photo'),
        note: 'Used for staff and board members who have no photo.',
      },
      ceds_document: {
        group: 'section_files',
        sort: 3,
        translations: label('CEDS plan (PDF)'),
        note: 'The current five-year CEDS plan. The "View our 5 year plan" button on the Organization page opens it.',
      },
    },
  },
  {
    collection: 'how_to_apply',
    meta: {
      translations: collectionLabel('How to Apply'),
      note: 'The ARC Opportunities page (southerntier8.org/how-to-apply).',
      preview_url: SITE_URL + '/how-to-apply',
    },
    add: [
      notice(
        'how_to_apply_notice',
        2,
        'This is the **ARC Opportunities** page on the site, at southerntier8.org/how-to-apply. It is linked as "ARC Opportunities" in the footer.'
      ),
    ],
    fields: {
      introduction: {
        sort: 3,
        translations: label('Introduction'),
        note:
          'The short paragraph under the "ARC Opportunities" heading. ' +
          PLAIN_TEXT,
      },
      steps: {
        sort: 4,
        translations: label('How to apply (main text)'),
        note: 'The main body of the page: the current grant cycle and the steps to apply. Links to files and other websites go here.',
      },
      arc_info: {
        sort: 5,
        translations: label('What is ARC?'),
        note: 'Under the "What is ARC?" heading.',
      },
      resources: {
        sort: 6,
        translations: label('Resources'),
        note: 'Shown as cards at the bottom of the page, in this order. Pick existing resources; add new ones under Website → Resources.',
      },
    },
  },
]

// --- Comparison ---------------------------------------------------------------------------------

function matches(want, have) {
  if (want === null || typeof want !== 'object') {
    return isDeepStrictEqual(want, have ?? null)
  }
  if (Array.isArray(want)) {
    return (
      Array.isArray(have) &&
      want.length === have.length &&
      want.every((w, i) => matches(w, have[i]))
    )
  }
  if (!have || typeof have !== 'object') return false
  return Object.keys(want).every((k) => matches(want[k], have[k]))
}

const differingKeys = (want, have = {}) =>
  Object.keys(want).filter((k) => !matches(want[k], have?.[k]))

// --- Plan ---------------------------------------------------------------------------------------

const changes = []
const change = (text, run) => changes.push({ text, run })

async function plan() {
  for (const def of COLLECTIONS) {
    const name = def.collection
    const collection = await api('GET', '/collections/' + name)
    const diff = differingKeys(def.meta, collection.meta)
    if (diff.length) {
      change(`update collection ${name}: ${diff.join(', ')}`, () =>
        api('PATCH', '/collections/' + name, { meta: def.meta })
      )
    }

    const existing = Object.fromEntries(
      (await api('GET', '/fields/' + name)).map((f) => [f.field, f])
    )

    // Section headers first, so the fields below can be moved into them.
    for (const add of def.add) {
      const have = existing[add.field]
      if (!have) {
        change(`create ${add.meta.interface} ${name}.${add.field}`, () =>
          api('POST', '/fields/' + name, add)
        )
      } else {
        const d = differingKeys(add.meta, have.meta)
        if (d.length) {
          change(`update ${name}.${add.field}: ${d.join(', ')}`, () =>
            api('PATCH', `/fields/${name}/${add.field}`, { meta: add.meta })
          )
        }
      }
    }

    for (const [field, meta] of Object.entries(def.fields)) {
      const have = existing[field]
      if (!have) fail(`${name}.${field} does not exist in Directus.`)
      const d = differingKeys(meta, have.meta)
      if (d.length) {
        change(`update ${name}.${field}: ${d.join(', ')}`, () =>
          api('PATCH', `/fields/${name}/${field}`, { meta })
        )
      }
    }
  }
}

// --- Run ----------------------------------------------------------------------------------------

function fail(message) {
  console.error('Error: ' + message)
  process.exit(1)
}

async function main() {
  console.log(
    `Site Pages UI — ${APPLY ? 'APPLYING to' : 'DRY RUN against'} ${BASE}` +
      (APPLY ? '' : ' (nothing will change; add --apply to make these changes)')
  )
  console.log('')
  await plan()
  if (!changes.length) {
    console.log('No changes: Directus already matches.')
    return
  }
  console.log(`${changes.length} change(s)${APPLY ? '' : ' to make'}:`)
  for (const c of changes) console.log('  ~ ' + c.text)
  if (!APPLY) return

  await mkdir(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const path = join(BACKUP_DIR, `${stamp}-schema-snapshot.json`)
  await writeFile(
    path,
    JSON.stringify(await api('GET', '/schema/snapshot'), null, 2)
  )
  console.log(`\nBacked up to ${path}\n`)

  let done = 0
  try {
    for (const c of changes) {
      await c.run()
      done++
      console.log('  ✓ ' + c.text)
    }
  } catch (e) {
    console.error('  ✗ ' + e.message)
    console.error(
      `Stopped after ${done} of ${changes.length}. Re-run to pick up where it left off.`
    )
    process.exit(1)
  }
  console.log(
    `\nDone: ${done} change(s) applied. Run again to confirm "No changes".`
  )
}

await main()
