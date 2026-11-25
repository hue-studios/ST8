#!/usr/bin/env node
// Directus schema for search, the five core services, the podcast and Housing media.
// See docs/plans/search-services-podcast-updates.md, "Session 1".
//
//   node --env-file=.env scripts/directus/search-services-podcast-setup.mjs                    # dry run
//   node --env-file=.env scripts/directus/search-services-podcast-setup.mjs --apply            # make the changes
//   node --env-file=.env scripts/directus/search-services-podcast-setup.mjs --remove           # dry run of the undo
//   node --env-file=.env scripts/directus/search-services-podcast-setup.mjs --remove --apply   # undo
//
// Every mode is a dry run until --apply is given. A dry run only reads from Directus.
//
// Adds only: new collections and fields, plus seed rows for the five core services. Nothing the
// Nuxt 2 site reads is changed, so it is safe to run while the site is live. Safe to re-run: each
// piece is compared with what exists and only what is missing is created. Seeds fill empty fields
// only, so a re-run never overwrites staff edits. --apply first saves a schema snapshot to
// scripts/directus/backups/ (gitignored). --remove deletes what this script created, including any
// rows staff have entered in it.
//
// Also writes docs/plans/core-services-mapping.md (local file, every run).
//
// Needs DIRECTUS_URL, DIRECTUS_TOKEN (admin static token) and DIRECTUS_STAFF_ROLE. Plain fetch.

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
const STAFF_ROLE = process.env.DIRECTUS_STAFF_ROLE
if (!BASE || !TOKEN || !STAFF_ROLE) {
  fail('Set DIRECTUS_URL, DIRECTUS_TOKEN and DIRECTUS_STAFF_ROLE (run with node --env-file=.env).')
}

const HERE = dirname(fileURLToPath(import.meta.url))
const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'
const GROUP = 'website' // the collection folder the existing content collections sit in

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
    const err = new Error(
      `${method} ${path} → ${res.status}: ` +
        (json?.errors?.map((e) => e.message).join('; ') || text.slice(0, 200))
    )
    err.status = res.status
    throw err
  }
  return json?.data ?? null
}

// Directus answers 403 rather than 404 for a collection that does not exist, so both mean "absent".
async function find(path) {
  try {
    return await api('GET', path)
  } catch (e) {
    if (e.status === 403 || e.status === 404) return null
    throw e
  }
}

// --- Change log ---------------------------------------------------------------------------------

const changes = []
const notes = []
const state = {}
const change = (symbol, text, run) => changes.push({ symbol, text, run })

function fail(message) {
  console.error('Error: ' + message)
  process.exit(1)
}

// --- Definitions --------------------------------------------------------------------------------

const label = (t) => [{ language: 'en-US', translation: t }]

function f(name, type, meta = {}, schema = {}) {
  return {
    field: name,
    type,
    meta: { hidden: false, required: false, readonly: false, width: 'full', ...meta },
    schema,
  }
}

const statusField = () =>
  f('status', 'string', {
    interface: 'select-dropdown',
    width: 'half',
    options: {
      choices: [
        { text: '$t:published', value: 'published' },
        { text: '$t:draft', value: 'draft' },
        { text: '$t:archived', value: 'archived' },
      ],
    },
    display: 'labels',
    display_options: {
      showAsDot: true,
      choices: [
        { text: '$t:published', value: 'published', foreground: 'var(--theme--primary)', background: 'var(--theme--primary-background)' },
        { text: '$t:draft', value: 'draft', foreground: 'var(--theme--foreground)', background: 'var(--theme--background-normal)' },
        { text: '$t:archived', value: 'archived', foreground: 'var(--theme--warning)', background: 'var(--theme--background-normal)' },
      ],
    },
  }, { default_value: 'draft', is_nullable: false })

const sortField = () => f('sort', 'integer', { interface: 'input', hidden: true })

const urlField = () =>
  f('url', 'string', {
    interface: 'input',
    width: 'half',
    required: true,
    options: { slug: true, trim: true, placeholder: 'a-unique-url-slug' },
    note: 'Web address for this item. Must be unique.',
  }, { is_unique: true })

const needField = () =>
  f('need', 'string', {
    interface: 'input',
    note: 'How a visitor would say it in their own words, e.g. "We need a plan or study before we invest". Weighted heavily in search and offered as an example prompt.',
  })

const phrasesField = () =>
  f('search_phrases', 'json', {
    interface: 'tags',
    special: ['cast-json'],
    note: 'Extra words people search for: synonyms, acronyms, nicknames. Not shown on the site.',
  })

const fileField = (name, title, note) =>
  f(name, 'uuid', { interface: 'file', special: ['file'], display: 'file', translations: label(title), note, width: 'half' })

// New collections: base fields, then everything else. Relations to other collections are in LINKS.
const COLLECTIONS = [
  {
    name: 'core_services',
    meta: {
      icon: 'hub',
      note: 'The five core services that group ST8 services and programs',
      display_template: '{{title}}',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
      sort_field: 'sort',
      group: GROUP,
    },
    fields: [
      statusField(),
      sortField(),
      f('title', 'string', { interface: 'input', required: true }),
      urlField(),
      f('summary', 'text', { interface: 'input-multiline', note: 'One or two sentences shown with the service.' }),
      needField(),
      phrasesField(),
      f('color', 'string', { interface: 'select-color', width: 'half', note: 'Accent colour for its tile.' }),
    ],
  },
  {
    name: 'podcast_episodes',
    meta: {
      icon: 'podcasts',
      note: 'Rebuilding So-Tier episodes',
      display_template: '{{episode_number}}. {{title}}',
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'draft',
      sort_field: 'sort',
      group: GROUP,
    },
    fields: [
      statusField(),
      sortField(),
      f('title', 'string', { interface: 'input', required: true }),
      urlField(),
      f('episode_number', 'integer', { interface: 'input', width: 'half' }),
      f('date_published', 'date', { interface: 'datetime', width: 'half' }),
      f('summary', 'text', { interface: 'input-multiline' }),
      fileField('audio_file', 'Audio file', 'Upload an MP3 to play it on the site. Leave empty if using an embed.'),
      f('embed_url', 'string', { interface: 'input', width: 'half', note: 'YouTube or Spotify link, loaded only when a visitor presses play.' }),
      f('duration', 'string', { interface: 'input', width: 'half', note: 'For example 42:10.' }),
      f('transcript', 'text', { interface: 'input-rich-text-md', note: 'Optional. If present the episode gets its own page.' }),
      fileField('cover_image', 'Cover image'),
    ],
  },
]

// Many-to-many junctions. `a` is the collection that owns the field named `aField`.
const JUNCTIONS = [
  {
    name: 'programs_core_services',
    a: { collection: 'programs', field: 'core_services', fkey: 'programs_id', title: 'Core services' },
    b: { collection: 'core_services', field: 'programs', fkey: 'core_services_id', title: 'Programs' },
    template: '{{core_services_id.title}}',
    reverseTemplate: '{{programs_id.title}}',
  },
  {
    name: 'podcast_episodes_people',
    a: { collection: 'podcast_episodes', field: 'guests', fkey: 'podcast_episodes_id', title: 'Guests' },
    b: { collection: 'people', field: 'podcast_episodes', fkey: 'people_id', title: 'Podcast episodes' },
    template: '{{people_id.name}}',
    reverseTemplate: '{{podcast_episodes_id.title}}',
  },
]

// Many-to-one: services.core_service → core_services, with the reverse list core_services.services.
const M2O = { many: 'services', field: 'core_service', one: 'core_services', reverse: 'services' }

// Plain fields added to collections that already exist.
const ADDED_FIELDS = [
  ...['services', 'programs', 'initiatives'].flatMap((c) => [
    [c, needField()],
    [c, phrasesField()],
  ]),
  [
    'organization',
    f('podcast_title', 'string', { interface: 'input', note: 'Heading of the podcast section on the Organization page.' }, { default_value: 'Rebuilding So-Tier' }),
  ],
  ['organization', f('podcast_intro', 'text', { interface: 'input-multiline', note: 'Short introduction above the episodes.' })],
  [
    'housing_page',
    f('videos', 'json', {
      interface: 'list',
      special: ['cast-json'],
      group: 'tab_documents',
      sort: 99,
      options: {
        template: '{{title}}',
        addLabel: 'Add a video',
        fields: [
          { field: 'title', name: 'Title', type: 'string', meta: { field: 'title', type: 'string', interface: 'input', width: 'half', required: true } },
          { field: 'video_url', name: 'Video link (URL)', type: 'string', meta: { field: 'video_url', type: 'string', interface: 'input', width: 'half', required: true, note: 'YouTube or Vimeo link.' } },
          { field: 'description', name: 'Description', type: 'text', meta: { field: 'description', type: 'text', interface: 'input-multiline', width: 'full' } },
        ],
      },
      note: 'Recordings shown in Videos and Events, such as the summit.',
    }),
  ],
]

// Already in the CMS (events_programs, events.programs); checked, never created.
const EXISTING_RELATIONS = [['events_programs', 'events', 'programs']]

const SEEDS = [
  {
    title: 'Plan',
    url: 'plan',
    sort: 1,
    summary: 'Regional plans, studies and strategies that show where and how to invest.',
    need: 'We need a plan or study before we invest',
    search_phrases: ['regional planning', 'needs assessment', 'strategic planning', 'CEDS', 'feasibility study', 'investment strategy'],
  },
  {
    title: 'Develop',
    url: 'develop',
    sort: 2,
    summary: 'Turning a good idea into a funded, ready-to-build project.',
    need: 'We have a project and need help getting it funded and ready',
    search_phrases: ['project development', 'grant development', 'funding strategy', 'capital planning', 'implementation planning'],
  },
  {
    title: 'Connect',
    url: 'connect',
    sort: 3,
    summary: 'Bringing the right partners, agencies and communities to the table.',
    need: 'We need the right partners and people at the table',
    search_phrases: ['partnership development', 'stakeholder engagement', 'coalition building', 'public private partnership', 'regional convening'],
  },
  {
    title: 'Build Capacity',
    url: 'build-capacity',
    sort: 4,
    summary: 'Helping organizations and communities do more with what they have.',
    need: 'We need our team or organization to be able to do more',
    search_phrases: ['technical assistance', 'organizational capacity', 'grant administration', 'compliance', 'training', 'professional development'],
  },
  {
    title: 'Invest',
    url: 'invest',
    sort: 5,
    summary: 'Putting funding to work in infrastructure, jobs and communities.',
    need: "We're ready to invest in infrastructure, jobs or housing",
    search_phrases: ['infrastructure investment', 'workforce development', 'economic development', 'industry clusters', 'housing', 'broadband', 'energy', 'water', 'community revitalization'],
  },
]

// Approved starting mapping. Services get exactly one core service (the schema is many-to-one);
// programs may have several (many-to-many). Loaded into Directus once, only where no link exists;
// after that the links in Directus are the source of truth and staff edit them there.
const SERVICE_MAP = {
  1: ['Develop', 'Grant and project development is the Develop description almost word for word.'],
  2: ['Plan', 'Regional planning and resiliency planning.'],
  3: ['Connect', 'Intergovernmental review links applicants with the agencies. Could be Build Capacity (compliance).'],
  4: ['Invest', 'Stormwater and municipal infrastructure costs. Could be Build Capacity.'],
  5: ['Connect', 'Networking and convening.'],
}
const PROGRAM_MAP = {
  2: ['Connect'],
  3: ['Develop', 'Build Capacity'],
  4: ['Develop', 'Build Capacity'],
  6: ['Build Capacity', 'Connect'],
  7: ['Plan', 'Invest'],
  8: ['Invest', 'Connect'],
  10: ['Invest'],
  11: ['Invest', 'Connect'],
  12: ['Build Capacity'],
  13: ['Connect'],
  14: ['Invest', 'Plan'],
  15: ['Invest'],
  16: ['Plan'],
  17: ['Build Capacity', 'Invest'],
  18: ['Invest', 'Plan'],
  19: ['Build Capacity'],
}

// --- Planning -----------------------------------------------------------------------------------

async function resolvePolicies() {
  const roles = await api(
    'GET',
    '/roles?filter[name][_eq]=' + encodeURIComponent(STAFF_ROLE) + '&fields=id,policies.policy.id,policies.policy.name,policies.policy.admin_access'
  )
  if (roles.length !== 1) fail(`Expected one role named "${STAFF_ROLE}", found ${roles.length}.`)
  const policies = roles[0].policies.map((p) => p.policy).filter((p) => p && !p.admin_access)
  if (policies.length !== 1) fail(`Expected role "${STAFF_ROLE}" to have one non-admin policy, found ${policies.length}.`)
  state.staffPolicy = policies[0].id
  console.log(`Staff policy:  ${policies[0].name} (${state.staffPolicy})`)
  console.log(`Public policy: ${PUBLIC_POLICY}`)
}

async function existingFields(collection) {
  const rows = await find('/fields/' + collection)
  return new Set((rows || []).map((r) => r.field))
}

async function planJunctionsAndM2O() {
  for (const j of JUNCTIONS) {
    const exists = await find('/collections/' + j.name)
    if (exists) {
      notes.push(`junction ${j.name} already exists; left as it is`)
      continue
    }
    change(
      '+',
      `create many-to-many ${j.a.collection}.${j.a.field} ⇄ ${j.b.collection}.${j.b.field} (junction ${j.name}, hidden)`,
      async () => {
        await api('POST', '/collections', {
          collection: j.name,
          meta: { hidden: true, icon: 'import_export' },
          schema: {},
          fields: [
            { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
            { field: j.a.fkey, type: 'integer', meta: { hidden: true }, schema: {} },
            { field: j.b.fkey, type: 'integer', meta: { hidden: true }, schema: {} },
          ],
        })
        for (const [side, other, tmpl] of [[j.a, j.b, j.template], [j.b, j.a, j.reverseTemplate]]) {
          await api('POST', '/fields/' + side.collection, {
            field: side.field,
            type: 'alias',
            meta: { special: ['m2m'], interface: 'list-m2m', options: { template: tmpl, enableCreate: false }, translations: label(side.title), width: 'full' },
            schema: null,
          })
        }
        await api('POST', '/relations', {
          collection: j.name, field: j.a.fkey, related_collection: j.a.collection,
          meta: { one_field: j.a.field, junction_field: j.b.fkey, sort_field: null, one_deselect_action: 'nullify' },
          schema: { on_delete: 'CASCADE' },
        })
        await api('POST', '/relations', {
          collection: j.name, field: j.b.fkey, related_collection: j.b.collection,
          meta: { one_field: j.b.field, junction_field: j.a.fkey, sort_field: null, one_deselect_action: 'nullify' },
          schema: { on_delete: 'CASCADE' },
        })
      }
    )
  }

  const have = await existingFields(M2O.many)
  if (have.has(M2O.field)) {
    notes.push(`${M2O.many}.${M2O.field} already exists; left as it is`)
  } else {
    change('+', `add ${M2O.many}.${M2O.field} (many-to-one → ${M2O.one}) and reverse list ${M2O.one}.${M2O.reverse}`, async () => {
      await api('POST', '/fields/' + M2O.many, {
        field: M2O.field, type: 'integer',
        meta: { interface: 'select-dropdown-m2o', special: ['m2o'], options: { template: '{{title}}' }, display: 'related-values', display_options: { template: '{{title}}' }, translations: label('Core service'), width: 'half', note: 'Which of the five core services this belongs under.' },
        schema: {},
      })
      await api('POST', '/fields/' + M2O.one, {
        field: M2O.reverse, type: 'alias',
        meta: { special: ['o2m'], interface: 'list-o2m', options: { template: '{{title}}', enableCreate: false }, translations: label('Services'), width: 'full' },
        schema: null,
      })
      await api('POST', '/relations', {
        collection: M2O.many, field: M2O.field, related_collection: M2O.one,
        meta: { one_field: M2O.reverse, sort_field: null, one_deselect_action: 'nullify' },
        schema: { on_delete: 'SET NULL' },
      })
    })
  }
}

// A file field needs a many-to-one relation to directus_files, or the API returns the bare id and refuses to expand
// `audio_file.id` / `cover_image.id` (the first run made the fields without one).
async function planFileRelations() {
  for (const c of COLLECTIONS) {
    for (const def of c.fields.filter((x) => x.meta?.special?.includes('file'))) {
      if (await find(`/relations/${c.name}/${def.field}`)) continue
      change('+', `relate ${c.name}.${def.field} → directus_files`, () =>
        api('POST', '/relations', {
          collection: c.name, field: def.field, related_collection: 'directus_files',
          schema: { on_delete: 'SET NULL' },
        })
      )
    }
  }
}

async function planAddedFields() {
  const cache = {}
  for (const [collection, def] of ADDED_FIELDS) {
    cache[collection] ??= await existingFields(collection)
    if (cache[collection].has(def.field)) continue
    change('+', `add field ${collection}.${def.field} (${def.type}${def.meta.interface ? ', ' + def.meta.interface : ''})`, () => api('POST', '/fields/' + collection, def))
  }
  for (const [junction, a, b] of EXISTING_RELATIONS) {
    const ok = await find('/fields/' + a + '/' + b)
    notes.push(ok ? `${a}.${b} (many-to-many via ${junction}) already exists; nothing to add` : `WARNING: ${a}.${b} is missing`)
  }
}

async function planPermissions() {
  const newCollections = [
    ...COLLECTIONS.map((c) => c.name),
    ...JUNCTIONS.map((j) => j.name),
  ]
  const have = await api('GET', `/permissions?filter[collection][_in]=${newCollections.join(',')}&fields=id,collection,policy,action&limit=-1`)
  const want = []
  for (const name of newCollections) {
    const gated = COLLECTIONS.some((c) => c.name === name)
    want.push({ collection: name, policy: PUBLIC_POLICY, action: 'read', permissions: gated ? { status: { _eq: 'published' } } : {}, who: gated ? 'public (published rows only)' : 'public' })
    for (const action of ['create', 'read', 'update', 'delete']) {
      want.push({ collection: name, policy: state.staffPolicy, action, permissions: {}, who: 'staff' })
    }
  }
  for (const w of want) {
    if (have.some((h) => h.collection === w.collection && h.policy === w.policy && h.action === w.action)) continue
    const { who, ...body } = w
    change('+', `permission: ${who} may ${w.action} ${w.collection}`, () => api('POST', '/permissions', { ...body, fields: ['*'], validation: {} }))
  }

  // Read permissions on existing collections may list fields one by one; flag it rather than guess.
  const checks = ['services', 'programs', 'initiatives', 'organization', 'housing_page', 'people']
  const perms = await api('GET', `/permissions?filter[collection][_in]=${checks.join(',')}&fields=collection,action,policy,fields&limit=-1`)
  for (const p of perms) {
    if (p.fields && !p.fields.includes('*')) notes.push(`WARNING: ${p.action} on ${p.collection} for policy ${p.policy} lists fields; the new fields would need adding by hand`)
  }
}

async function planSeeds() {
  const exists = (await find('/collections/core_services')) !== null
  const rows = exists ? await api('GET', '/items/core_services?limit=-1&fields=id,url,need,summary,search_phrases') : []
  for (const s of SEEDS) {
    const row = rows.find((r) => r.url === s.url)
    if (!row) {
      change('+', `seed core service "${s.title}" (published; need: "${s.need}"; ${s.search_phrases.length} search phrases)`, () =>
        api('POST', '/items/core_services', { ...s, status: 'published' })
      )
      continue
    }
    const patch = {}
    for (const k of ['summary', 'need', 'search_phrases']) {
      const v = row[k]
      if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) patch[k] = s[k]
    }
    if (Object.keys(patch).length) change('~', `fill empty ${Object.keys(patch).join(', ')} on core service "${s.title}"`, () => api('PATCH', '/items/core_services/' + row.id, patch))
  }
  await planMappingLinks()
  const org = await api('GET', '/items/organization')
  if (org && (org.podcast_title === undefined || org.podcast_title === null || org.podcast_title === '')) {
    change('~', 'set organization.podcast_title to "Rebuilding So-Tier" if empty', () => api('PATCH', '/items/organization', { podcast_title: 'Rebuilding So-Tier' }))
  }
}

// The approved mapping, written into Directus as ordinary links so staff can change it there.
// Only fills gaps: a service that already has a core service, or a program/core-service pair that
// already exists, is left alone, so a re-run never undoes an edit. Core service ids are looked up
// when the change runs, because on a first run the rows do not exist yet at planning time.
async function planMappingLinks() {
  const coreExists = (await find('/collections/core_services')) !== null
  const hasField = (await existingFields('services')).has(M2O.field)
  const services = await api('GET', `/items/services?limit=-1&fields=id,title${hasField ? ',core_service' : ''}`)
  const programs = await api('GET', '/items/programs?limit=-1&fields=id,title')
  const junctionExists = (await find('/collections/programs_core_services')) !== null
  const pairs = junctionExists ? await api('GET', '/items/programs_core_services?limit=-1&fields=programs_id,core_services_id') : []
  const cores = coreExists ? await api('GET', '/items/core_services?limit=-1&fields=id,title') : []
  const idOf = async (title) => {
    const rows = await api('GET', '/items/core_services?filter[title][_eq]=' + encodeURIComponent(title) + '&fields=id&limit=1')
    return rows[0]?.id
  }

  for (const sv of services) {
    const m = SERVICE_MAP[sv.id]
    if (!m || sv.core_service) continue
    change('+', `link service "${sv.title}" → ${m[0]}`, async () => {
      await api('PATCH', '/items/services/' + sv.id, { core_service: await idOf(m[0]) })
    })
  }
  for (const pr of programs) {
    for (const title of PROGRAM_MAP[pr.id] || []) {
      const core = cores.find((c) => c.title === title)
      if (core && pairs.some((x) => x.programs_id === pr.id && x.core_services_id === core.id)) continue
      change('+', `link program "${pr.title.trim()}" → ${title}`, async () => {
        await api('POST', '/items/programs_core_services', { programs_id: pr.id, core_services_id: await idOf(title) })
      })
    }
  }
}

async function writeMapping() {
  const services = await api('GET', '/items/services?limit=-1&sort=sort&fields=id,title,status')
  const programs = await api('GET', '/items/programs?limit=-1&sort=title&fields=id,title,status')
  const lines = [
    '# Core service mapping (starting point)',
    '',
    'Approved by Peter. This is the starting point only: the script loads it into Directus once, and',
    'from then on the links in Directus (`services.core_service`, `programs.core_services`) are the',
    'source of truth. Staff change them there; this file is not read by the site and will go stale.',
    '',
    'Generated by `scripts/directus/search-services-podcast-setup.mjs` from the live CMS.',
    '',
    '## Services (each sits under exactly one core service)',
    '',
    '| Service | Status | Proposed core service | Why |',
    '|---|---|---|---|',
    ...services.map((s) => {
      const m = SERVICE_MAP[s.id] || ['**unassigned**', 'New since this was drafted']
      return `| ${s.title} | ${s.status} | ${m[0]} | ${m[1]} |`
    }),
    '',
    'Build Capacity has no service under it. Its work (technical assistance, grant administration,',
    'training) is currently only visible as programs. Beth may want a service for it, or to move',
    'Coordinating Review or Reducing Municipal Costs there.',
    '',
    '## Programs (may sit under more than one; first is the main one)',
    '',
    '| Program | Status | Proposed core service(s) |',
    '|---|---|---|',
    ...programs.map((p) => `| ${p.title.trim()} | ${p.status} | ${(PROGRAM_MAP[p.id] || ['**unassigned**']).join(', ')} |`),
    '',
  ]
  await writeFile(join(HERE, '..', '..', 'docs', 'plans', 'core-services-mapping.md'), lines.join('\n'))
  console.log('Wrote docs/plans/core-services-mapping.md')
}

// --- Undo ---------------------------------------------------------------------------------------

async function planRemove() {
  for (const [collection, def] of [...ADDED_FIELDS].reverse()) {
    if ((await existingFields(collection)).has(def.field)) change('-', `delete field ${collection}.${def.field}`, () => api('DELETE', `/fields/${collection}/${def.field}`))
  }
  if ((await existingFields(M2O.many)).has(M2O.field)) change('-', `delete field ${M2O.many}.${M2O.field}`, () => api('DELETE', `/fields/${M2O.many}/${M2O.field}`))
  for (const j of JUNCTIONS) {
    for (const s of [j.a, j.b]) {
      if ((await existingFields(s.collection)).has(s.field)) change('-', `delete field ${s.collection}.${s.field}`, () => api('DELETE', `/fields/${s.collection}/${s.field}`))
    }
    if (await find('/collections/' + j.name)) change('-', `delete collection ${j.name}`, () => api('DELETE', '/collections/' + j.name))
  }
  for (const c of [...COLLECTIONS].reverse()) {
    if (await find('/collections/' + c.name)) change('-', `delete collection ${c.name} and all its rows`, () => api('DELETE', '/collections/' + c.name))
  }
  notes.push('permissions on deleted collections go with them; the services/programs/initiatives and housing_page rows keep their other content')
}

// --- Run ----------------------------------------------------------------------------------------

async function backup() {
  const dir = join(HERE, 'backups')
  await mkdir(dir, { recursive: true })
  const snap = await api('GET', '/schema/snapshot')
  const file = join(dir, `search-services-podcast-${new Date().toISOString().replace(/[:.]/g, '-')}-schema.json`)
  await writeFile(file, JSON.stringify(snap, null, 2))
  console.log('Saved schema snapshot to ' + file)
}

async function main() {
  console.log(`Search, core services and podcast schema ${REMOVE ? 'REMOVE' : 'SETUP'} — ${APPLY ? 'APPLYING to' : 'DRY RUN against'} ${BASE}`)
  if (!APPLY) console.log('(read-only; add --apply to make these changes)')
  console.log('')

  if (REMOVE) {
    await planRemove()
  } else {
    await resolvePolicies()
    for (const c of COLLECTIONS) {
      if (await find('/collections/' + c.name)) notes.push(`collection ${c.name} already exists; fields not re-checked`)
      else planCollectionsFor(c)
    }
    await planJunctionsAndM2O()
    await planFileRelations()
    await planAddedFields()
    await planPermissions()
    await planSeeds()
    await writeMapping()
  }

  console.log('')
  console.log(changes.length ? `${changes.length} change(s)${APPLY ? '' : ' to make'}:` : 'No changes: Directus already matches.')
  for (const c of changes) console.log(`  ${c.symbol} ${c.text}`)
  if (notes.length) {
    console.log('')
    console.log('Notes:')
    for (const n of notes) console.log('  · ' + n)
  }
  if (!APPLY || !changes.length) return

  console.log('')
  await backup()
  let done = 0
  try {
    for (const c of changes) {
      await c.run()
      done++
      console.log(`  ✓ ${c.text.split('\n')[0]}`)
    }
  } catch (e) {
    console.error(`\nStopped after ${done} of ${changes.length}: ${e.message}`)
    console.error('Re-run to continue (finished steps are skipped), or run with --remove to undo.')
    process.exit(1)
  }
  console.log(`\nDone: ${done} change(s) made.`)
}

function planCollectionsFor(c) {
  change('+', `create collection ${c.name} (${c.fields.length} fields: ${c.fields.map((x) => x.field).join(', ')})`, () =>
    api('POST', '/collections', {
      collection: c.name,
      meta: { ...c.meta, sort: 50, collapse: 'open' },
      schema: {},
      fields: [
        { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
        ...c.fields,
      ],
    })
  )
}

main().catch((e) => fail(e.message))
