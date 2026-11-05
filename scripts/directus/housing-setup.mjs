#!/usr/bin/env node
// Sets up Directus for the Housing program page: the `housing_page` singleton staff edit, its
// permissions, a "Housing" upload folder, seed content, and the program record's new URL.
// See docs/plans/housing-program-page.md, section 6.
//
//   node --env-file=.env scripts/directus/housing-setup.mjs                    # dry run
//   node --env-file=.env scripts/directus/housing-setup.mjs --apply            # make the changes
//   node --env-file=.env scripts/directus/housing-setup.mjs --remove           # dry run of the undo
//   node --env-file=.env scripts/directus/housing-setup.mjs --remove --apply   # undo
//
//   --rename-program "Housing"   also retitle the program record (left alone otherwise)
//
// Every mode is a dry run until --apply is given, the undo included, because the undo deletes
// whatever staff have typed into the page.
//
// Safe to re-run. Structure (collection, fields, relations, permissions, folder) is compared with
// what is already there, and only what is missing or different is created or updated. Content is
// only ever filled in where a field is empty, so a re-run never overwrites what staff have edited.
//
// Before changing anything, --apply saves the schema snapshot, the program record, the page's
// content and its permissions to scripts/directus/backups/ (gitignored).
//
// Needs DIRECTUS_URL, DIRECTUS_TOKEN (a static token for an admin user) and DIRECTUS_STAFF_ROLE
// (the role whose policy gets edit access, "Content Editor"). Uses plain fetch; no dependencies.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

// config/housingForecast.js is an ES module in a package without "type": "module". Node reads it
// fine but warns about it on every run; the warning is noise here.
process.removeAllListeners('warning')
const forecast = await import('../../config/housingForecast.js')

// --- Settings -----------------------------------------------------------------------------------

const COLLECTION = 'housing_page'
const SITE_URL = 'https://southerntier8.org'
const PAGE_PATH = '/economic-development-programs/housing'
const CS = forecast.CS_ORIGIN // https://southerntierny.communityscale.io
const DASHBOARD = CS + '/dashboard'
const FOLDER_NAME = 'Housing'
const PUBLIC_POLICY = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'

const OLD_SLUG = forecast.PROGRAM_SLUG // southern-tier-s-capital-stack-for-workforce-housing
const NEW_SLUG = 'housing'
const ORIGINAL_TITLE = "Southern Tier's Capital Stack for Workforce Housing"

// --- Arguments and environment ------------------------------------------------------------------

const argv = process.argv.slice(2)
const APPLY = argv.includes('--apply')
const REMOVE = argv.includes('--remove')
let RENAME = null
const renameAt = argv.indexOf('--rename-program')
if (renameAt !== -1) {
  const next = argv[renameAt + 1]
  RENAME = next && !next.startsWith('--') ? next : 'Housing'
}
const known = new Set(['--apply', '--remove', '--rename-program', RENAME])
const unknown = argv.filter((a) => !known.has(a))
if (unknown.length) fail('Unknown argument: ' + unknown.join(' '))

const BASE = (process.env.DIRECTUS_URL || '').replace(/\/$/, '')
const TOKEN = process.env.DIRECTUS_TOKEN
const STAFF_ROLE = process.env.DIRECTUS_STAFF_ROLE
if (!BASE || !TOKEN || !STAFF_ROLE) {
  fail(
    'Set DIRECTUS_URL, DIRECTUS_TOKEN and DIRECTUS_STAFF_ROLE (run with node --env-file=.env).'
  )
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
    const err = new Error(
      `${method} ${path} → ${res.status}: ` +
        (json?.errors?.map((e) => e.message).join('; ') || text.slice(0, 200))
    )
    err.status = res.status
    throw err
  }
  return json?.data ?? null
}

// GET that answers null for "not there" instead of throwing. Directus answers 403 rather than 404
// for a collection that does not exist, so both count.
async function find(path) {
  try {
    return await api('GET', path)
  } catch (e) {
    if (e.status === 403 || e.status === 404) return null
    throw e
  }
}

// --- Change log ---------------------------------------------------------------------------------
// Each change is printed, then run when --apply is given. Changes run in order, so one can use
// what an earlier one created (the folder's id, for example).

const changes = []
const placeholders = []
const state = {} // ids learned or created along the way

function change(symbol, text, run) {
  changes.push({ symbol, text, run })
}

// --- Field definitions --------------------------------------------------------------------------

const label = (text) => [{ language: 'en-US', translation: text }]

function group(field, name, sort, start, icon) {
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

function notice(field, groupName, sort, text) {
  return {
    field,
    type: 'alias',
    meta: {
      interface: 'presentation-notice',
      special: ['alias', 'no-data'],
      options: { color: 'info', icon: 'info', text },
      sort,
      width: 'full',
      group: groupName,
      hidden: false,
    },
  }
}

function field(name, type, meta, schema = {}) {
  return {
    field: name,
    type,
    meta: { hidden: false, required: false, readonly: false, ...meta },
    schema,
  }
}

// The two image fields upload into the Housing folder, which may not exist until the run makes
// it, so the definitions are built once its id is known.
function imageField(name, title, groupName, sort, note) {
  return field(name, 'uuid', {
    interface: 'file-image',
    special: ['file'],
    display: 'image',
    options: { folder: state.folderId ?? '(the new Housing folder)' },
    translations: label(title),
    note,
    group: groupName,
    sort,
    width: 'half',
  })
}

const RICH_TEXT_OPTIONS = {
  // Bold, italic, link, bullet list, heading: the cut-down toolbar from the plan.
  toolbar: ['h3', 'bold', 'italic', 'bullist', 'customLink', 'removeformat'],
  // Pasting from Word keeps only these tags and drops every style and class, so pasted copy
  // can't bring its own fonts, colours or spacing onto the page.
  tinymceOverrides: {
    valid_elements:
      'p,br,strong/b,em/i,a[href|target|rel|title],ul,ol,li,h2,h3,h4',
    paste_webkit_styles: 'none',
    paste_remove_styles_if_webkit: true,
  },
  placeholder:
    'A short introduction to the Southern Tier Workforce Housing Investment Framework.',
}

function fieldDefinitions() {
  return [
    field('id', 'integer', {
      interface: 'input',
      readonly: true,
      hidden: true,
      sort: 1,
      width: 'full',
      group: null,
    }),

    // 1. Page
    group('tab_page', '1. Page', 2, 'open', 'article'),
    field(
      'title',
      'string',
      {
        interface: 'input',
        required: true,
        options: { placeholder: 'Housing', trim: true },
        translations: label('Page title'),
        note: "The big heading at the top of the page, e.g. 'Housing'.",
        group: 'tab_page',
        sort: 1,
        width: 'half',
      },
      { max_length: 100 }
    ),
    field(
      'subtitle',
      'string',
      {
        interface: 'input',
        options: {
          placeholder: 'Southern Tier Workforce Housing Investment Framework',
          trim: true,
        },
        translations: label('Subtitle'),
        note: 'The line under the heading. Usually the framework’s full name.',
        group: 'tab_page',
        sort: 2,
        width: 'half',
      },
      { max_length: 150 }
    ),
    field('intro', 'text', {
      interface: 'input-rich-text-html',
      options: RICH_TEXT_OPTIONS,
      translations: label('Introduction'),
      note: 'The opening paragraphs. Pasting from Word is fine: formatting is cleaned down to bold, italic, links, lists and headings. Links to other websites open in a new tab.',
      group: 'tab_page',
      sort: 3,
      width: 'full',
    }),
    imageField(
      'page_image',
      'Page image',
      'tab_page',
      4,
      'The large photo at the top of the page. Landscape, at least 1600 px wide. Leave empty to use the program’s first photo.'
    ),
    field(
      'share_description',
      'string',
      {
        interface: 'input',
        options: {
          softLength: 160,
          trim: true,
          placeholder:
            'One or two sentences about the framework, for Facebook, LinkedIn and text messages.',
        },
        translations: label('Share description'),
        note: 'Shown under the title when someone shares the page on social media or in a text message. 160 characters at most.',
        group: 'tab_page',
        sort: 5,
        width: 'half',
      },
      { max_length: 160 }
    ),

    // 2. Framework Links
    group('tab_links', '2. Framework Links', 3, 'open', 'link'),
    field('framework_links', 'json', {
      interface: 'list',
      special: ['cast-json'],
      options: {
        template: '{{title}}',
        addLabel: 'Add a link',
        fields: [
          {
            field: 'title',
            name: 'Title',
            type: 'string',
            meta: {
              field: 'title',
              type: 'string',
              interface: 'input',
              width: 'half',
              required: true,
              note: "The card's heading, e.g. 'Housing Dashboard'.",
              options: { placeholder: 'Housing Dashboard', trim: true },
            },
          },
          {
            field: 'type',
            name: 'Type',
            type: 'string',
            meta: {
              field: 'type',
              type: 'string',
              interface: 'select-dropdown',
              width: 'half',
              note: 'Sets the icon on the card.',
              options: {
                choices: [
                  { text: 'Dashboard', value: 'dashboard' },
                  { text: 'Map', value: 'map' },
                  { text: 'Library', value: 'library' },
                  { text: 'Report', value: 'report' },
                  { text: 'Other', value: 'other' },
                ],
              },
            },
          },
          {
            field: 'description',
            name: 'Description',
            type: 'text',
            meta: {
              field: 'description',
              type: 'text',
              interface: 'input-multiline',
              width: 'full',
              note: 'One or two sentences under the title. 200 characters at most, so the cards stay even.',
              options: {
                softLength: 200,
                placeholder:
                  'What visitors will find when they open this link.',
              },
              validation: {
                _and: [{ description: { _regex: '^[\\s\\S]{0,200}$' } }],
              },
              validation_message:
                'Keep the description to 200 characters or fewer.',
            },
          },
          {
            field: 'url',
            name: 'Link (URL)',
            type: 'string',
            meta: {
              field: 'url',
              type: 'string',
              interface: 'input',
              width: 'half',
              required: true,
              note: 'The full web address, starting with https://. Opens in a new tab.',
              options: {
                placeholder: DASHBOARD,
                trim: true,
                iconLeft: 'link',
              },
              validation: { _and: [{ url: { _regex: '^https://' } }] },
              validation_message:
                'The link has to be a full web address starting with https:// — copy it from the address bar.',
            },
          },
          {
            field: 'button_text',
            name: 'Button text',
            type: 'string',
            meta: {
              field: 'button_text',
              type: 'string',
              interface: 'input',
              width: 'half',
              note: "The text on the button, e.g. 'Open the dashboard'. Keep it short.",
              options: { placeholder: 'Open the dashboard', trim: true },
            },
          },
        ],
      },
      translations: label('Framework links'),
      note: 'One card per link, in this order on the page. Drag the handle to reorder. A link with no title or URL is left off the page.',
      group: 'tab_links',
      sort: 1,
      width: 'full',
    }),

    // 3. Forecast Figures
    group('tab_figures', '3. Forecast Figures', 4, 'closed', 'bar_chart'),
    notice(
      'figures_notice',
      'tab_figures',
      1,
      `These numbers appear on the Housing Forecast pages (/regional-housing-forecast), not on the Housing page. Copy them from the [CommunityScale dashboard](${DASHBOARD}) when it posts new figures. Leave a box empty and the site shows the last figures built into it instead.`
    ),
    field(
      'figures_as_of',
      'string',
      {
        interface: 'input',
        options: { placeholder: forecast.HERO_STATS_AS_OF, trim: true },
        translations: label('Figures as of'),
        note: "When these figures were last copied from the dashboard, e.g. 'November 2026'.",
        group: 'tab_figures',
        sort: 2,
        width: 'half',
      },
      { max_length: 50 }
    ),
    field('headline_figures', 'json', {
      interface: 'list',
      special: ['cast-json'],
      options: {
        template: '{{value}} {{label}}',
        addLabel: 'Add a figure',
        fields: [
          {
            field: 'value',
            name: 'Value',
            type: 'string',
            meta: {
              field: 'value',
              type: 'string',
              interface: 'input',
              width: 'half',
              required: true,
              note: "As shown on the dashboard, e.g. '$95,522' or '572,230'.",
              options: { placeholder: '572,230', trim: true },
            },
          },
          {
            field: 'label',
            name: 'Label',
            type: 'string',
            meta: {
              field: 'label',
              type: 'string',
              interface: 'input',
              width: 'half',
              required: true,
              note: "What the number is, e.g. 'Population'.",
              options: { placeholder: 'Population', trim: true },
            },
          },
          {
            field: 'source',
            name: 'Source',
            type: 'string',
            meta: {
              field: 'source',
              type: 'string',
              interface: 'input',
              width: 'full',
              note: "The small print under the dashboard figure, e.g. 'Census ACS 2024'.",
              options: { placeholder: 'Census ACS 2024', trim: true },
            },
          },
        ],
      },
      translations: label('Headline figures'),
      note: `The four figures at the top of the [dashboard](${DASHBOARD}): median income, population, jobs and recent building permits.`,
      group: 'tab_figures',
      sort: 3,
      width: 'full',
    }),
    field(
      'need_total',
      'string',
      {
        interface: 'input',
        options: { placeholder: forecast.SUPPLY_NEED.total, trim: true },
        translations: label('Five-year need: total'),
        note: `"Total five-year housing production need" on the [dashboard](${DASHBOARD}).`,
        group: 'tab_figures',
        sort: 4,
        width: 'full',
      },
      { max_length: 20 }
    ),
    field(
      'need_replacement',
      'string',
      {
        interface: 'input',
        options: {
          placeholder: forecast.SUPPLY_NEED.rows[0].value,
          trim: true,
        },
        translations: label('Five-year need: replacement housing'),
        note: `"Replacement housing" under the total on the [dashboard](${DASHBOARD}).`,
        group: 'tab_figures',
        sort: 5,
        width: 'half',
      },
      { max_length: 20 }
    ),
    field(
      'need_shortage',
      'string',
      {
        interface: 'input',
        options: {
          placeholder: forecast.SUPPLY_NEED.rows[1].value,
          trim: true,
        },
        translations: label('Five-year need: shortages in existing stock'),
        note: `"Units to address shortages in existing housing stock" on the [dashboard](${DASHBOARD}).`,
        group: 'tab_figures',
        sort: 6,
        width: 'half',
      },
      { max_length: 20 }
    ),

    // 4. Home Page Banner
    group('tab_banner', '4. Home Page Banner', 5, 'closed', 'home'),
    field(
      'banner_show',
      'boolean',
      {
        interface: 'boolean',
        special: ['cast-boolean'],
        display: 'boolean',
        options: { label: 'Show the banner on the home page' },
        translations: label('Show on home page'),
        note: 'Turn off to hide the banner. Nothing is deleted, so it can be turned back on any time.',
        group: 'tab_banner',
        sort: 1,
        width: 'full',
      },
      { default_value: true }
    ),
    imageField(
      'banner_image',
      'Banner image',
      'tab_banner',
      2,
      'A wide photo, ideally 1600 × 600 px. Uploads go to the Housing folder. Leave empty to use the page image.'
    ),
    field(
      'banner_title',
      'string',
      {
        interface: 'input',
        options: { placeholder: 'Housing in the Southern Tier', trim: true },
        translations: label('Banner title'),
        note: 'A few words, shown large on the banner.',
        group: 'tab_banner',
        sort: 3,
        width: 'half',
      },
      { max_length: 80 }
    ),
    field(
      'banner_text',
      'string',
      {
        interface: 'input',
        options: {
          softLength: 140,
          placeholder:
            'Explore the Southern Tier Workforce Housing Investment Framework.',
          trim: true,
        },
        translations: label('Banner text'),
        note: 'One line under the title. The whole banner links to the Housing page.',
        group: 'tab_banner',
        sort: 4,
        width: 'half',
      },
      { max_length: 160 }
    ),

    // Behind the scenes: the program record that supplies partners, resources and news.
    field('program', 'integer', {
      interface: 'select-dropdown-m2o',
      special: ['m2o'],
      options: { template: '{{title}}' },
      translations: label('Program'),
      note: 'The program record this page shows partners, resources and news from. Set up by the developer.',
      hidden: true,
      group: null,
      sort: 6,
      width: 'full',
    }),
  ]
}

const RELATIONS = [
  { field: 'program', related: 'programs' },
  { field: 'page_image', related: 'directus_files' },
  { field: 'banner_image', related: 'directus_files' },
]

const COLLECTION_META = {
  icon: 'house',
  note: 'The Housing program page and the housing banner on the home page.',
  singleton: true,
  hidden: false,
  display_template: 'Housing Page',
  accountability: 'all',
  // Top of the sidebar: the other top-level entries (Website, Site Pages, Submissions) are 1–3.
  group: null,
  sort: 0,
  collapse: 'open',
  // The Preview button opens the live page.
  preview_url: SITE_URL + PAGE_PATH,
  translations: [
    {
      language: 'en-US',
      translation: 'Housing Page',
      singular: 'Housing Page',
      plural: 'Housing Page',
    },
  ],
}

// --- Seed content -------------------------------------------------------------------------------
// Only written into empty fields. `placeholder` marks what is waiting on Beth.

function seedContent() {
  return [
    { field: 'title', value: 'Housing' },
    {
      field: 'subtitle',
      value: 'Southern Tier Workforce Housing Investment Framework',
    },
    {
      field: 'intro',
      value:
        '<p>The Southern Tier Workforce Housing Investment Framework brings together the data, maps and resources the eight counties of the Southern Tier 8 Region need to plan and invest in workforce housing. Start with the tools below.</p>',
      placeholder: 'Stand-in intro until Beth sends the page copy.',
    },
    {
      field: 'page_image',
      value: null,
      placeholder:
        'No page image yet; the page uses the program’s photo until one is uploaded.',
    },
    {
      field: 'share_description',
      value:
        'Data, maps and resources for planning and investing in workforce housing across the eight counties of the Southern Tier 8 Region.',
    },
    {
      field: 'framework_links',
      value: [
        {
          title: 'Housing Dashboard',
          type: 'dashboard',
          description:
            'Housing need, population, jobs and affordability for the Southern Tier 8 Region, with forecasts to 2031.',
          url: DASHBOARD,
          button_text: 'Open the dashboard',
        },
        {
          title: 'Suitability Map',
          type: 'map',
          description:
            'An interactive map of where new housing is best suited across the eight counties.',
          url: CS + '/map',
          button_text: 'Open the map',
        },
        {
          title: 'Resource Library',
          type: 'library',
          description:
            'Reports, guides and data behind the framework, gathered in one place.',
          url: CS + '/',
          button_text: 'Browse the library',
        },
      ],
      placeholder:
        'Links waiting on Beth’s exact URLs. Dashboard (/dashboard) and map (/map, "Suitability Explorer") are live CommunityScale pages; the Resource Library has no URL yet and points at the project home.',
    },
    { field: 'figures_as_of', value: forecast.HERO_STATS_AS_OF },
    {
      field: 'headline_figures',
      value: forecast.HERO_STATS.map(({ value, label, source }) => ({
        value,
        label,
        source,
      })),
    },
    { field: 'need_total', value: forecast.SUPPLY_NEED.total },
    { field: 'need_replacement', value: forecast.SUPPLY_NEED.rows[0].value },
    { field: 'need_shortage', value: forecast.SUPPLY_NEED.rows[1].value },
    { field: 'banner_show', value: true },
    {
      field: 'banner_image',
      value: null,
      placeholder:
        'No banner image yet; the banner uses the page image (then the program’s photo) until one is uploaded.',
    },
    {
      field: 'banner_title',
      value: 'Housing in the Southern Tier',
      placeholder: 'Stand-in banner title.',
    },
    {
      field: 'banner_text',
      value:
        'Explore the Southern Tier Workforce Housing Investment Framework.',
      placeholder: 'Stand-in banner text.',
    },
    { field: 'program', value: () => state.programId },
  ]
}

// --- Comparison helpers -------------------------------------------------------------------------

// True if everything `want` specifies matches `have`. Keys `want` leaves out are not compared, so
// the defaults Directus fills in don't count as differences.
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

function differingKeys(want, have = {}) {
  return Object.keys(want).filter((k) => !matches(want[k], have?.[k]))
}

const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  v === '' ||
  (Array.isArray(v) && v.length === 0)

const show = (v) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return s.length > 90 ? s.slice(0, 87) + '…' : s
}

// --- Plan: setup --------------------------------------------------------------------------------

async function resolvePolicies() {
  const roles = await api(
    'GET',
    '/roles?filter[name][_eq]=' +
      encodeURIComponent(STAFF_ROLE) +
      '&fields=id,name,policies.policy.id,policies.policy.name,policies.policy.admin_access'
  )
  if (roles.length !== 1) {
    fail(`Expected one role named "${STAFF_ROLE}", found ${roles.length}.`)
  }
  const policies = roles[0].policies
    .map((p) => p.policy)
    .filter((p) => p && !p.admin_access)
  if (policies.length !== 1) {
    fail(
      `Expected role "${STAFF_ROLE}" to have one non-admin policy, found ${policies.length}.`
    )
  }
  state.staffPolicy = policies[0]
  const pub = await find('/policies/' + PUBLIC_POLICY + '?fields=id,name')
  if (!pub) fail('Public policy ' + PUBLIC_POLICY + ' not found.')
  console.log(
    `Staff policy:  ${state.staffPolicy.name} (${state.staffPolicy.id}), from role "${STAFF_ROLE}"`
  )
  console.log(`Public policy: ${PUBLIC_POLICY}`)
}

async function findProgram() {
  const rows = await api(
    'GET',
    `/items/programs?filter[url][_in]=${OLD_SLUG},${NEW_SLUG}&fields=id,title,url&limit=-1`
  )
  if (rows.length !== 1) {
    fail(
      `Expected one program with url "${OLD_SLUG}" or "${NEW_SLUG}", found ${rows.length}.`
    )
  }
  state.programId = rows[0].id
  return rows[0]
}

async function planSetup() {
  await resolvePolicies()
  const program = await findProgram()
  console.log(
    `Program:       #${program.id} "${program.title}" (/${program.url})`
  )

  // Folder
  const folders = await api(
    'GET',
    '/folders?filter[name][_eq]=' +
      FOLDER_NAME +
      '&filter[parent][_null]=true&fields=id'
  )
  if (folders.length) {
    state.folderId = folders[0].id
  } else {
    change('+', `create file folder "${FOLDER_NAME}"`, async () => {
      state.folderId = (await api('POST', '/folders', { name: FOLDER_NAME })).id
    })
  }

  // Collection
  const collection = await find('/collections/' + COLLECTION)
  const defs = fieldDefinitions()
  if (!collection) {
    change(
      '+',
      `create collection ${COLLECTION} (singleton, top of sidebar, preview → ${SITE_URL}${PAGE_PATH})`,
      () =>
        api('POST', '/collections', {
          collection: COLLECTION,
          meta: COLLECTION_META,
          schema: {},
          fields: [
            {
              ...defs[0],
              schema: { is_primary_key: true, has_auto_increment: true },
            },
          ],
        })
    )
  } else {
    const diff = differingKeys(COLLECTION_META, collection.meta)
    if (diff.length) {
      change('~', `update collection ${COLLECTION}: ${diff.join(', ')}`, () =>
        api('PATCH', '/collections/' + COLLECTION, { meta: COLLECTION_META })
      )
    }
  }

  // Fields. Built at run time so the image fields pick up the folder id.
  const existing = collection
    ? Object.fromEntries(
        (await api('GET', '/fields/' + COLLECTION)).map((f) => [f.field, f])
      )
    : {}
  for (const [i, def] of defs.entries()) {
    const have = existing[def.field]
    const build = () => fieldDefinitions()[i]
    const where = def.meta.group ? ` in ${def.meta.group}` : ''
    if (!have) {
      if (def.field === 'id' && !collection) continue // created with the collection
      change('+', `create field ${def.field} (${def.type}${where})`, () =>
        api('POST', '/fields/' + COLLECTION, build())
      )
      continue
    }
    if (have.type !== def.type) {
      fail(
        `Field ${def.field} is ${have.type}, expected ${def.type}. Fix it by hand or run --remove first.`
      )
    }
    const metaDiff = differingKeys(build().meta, have.meta)
    const schemaWant = def.schema || {}
    const schemaDiff = differingKeys(schemaWant, have.schema)
    if (metaDiff.length || schemaDiff.length) {
      change(
        '~',
        `update field ${def.field}: ${[...metaDiff, ...schemaDiff].join(', ')}`,
        () => {
          const d = build()
          return api('PATCH', `/fields/${COLLECTION}/${d.field}`, {
            meta: d.meta,
            ...(schemaDiff.length && { schema: d.schema }),
          })
        }
      )
    }
  }

  // Relations
  for (const rel of RELATIONS) {
    const have = collection
      ? await find(`/relations/${COLLECTION}/${rel.field}`)
      : null
    if (!have) {
      change(
        '+',
        `create relation ${COLLECTION}.${rel.field} → ${rel.related}`,
        () =>
          api('POST', '/relations', {
            collection: COLLECTION,
            field: rel.field,
            related_collection: rel.related,
            meta: { one_deselect_action: 'nullify' },
            schema: { on_delete: 'SET NULL' },
          })
      )
    } else if (have.related_collection !== rel.related) {
      fail(
        `Relation ${COLLECTION}.${rel.field} points at ${have.related_collection}, expected ${rel.related}.`
      )
    }
  }

  // Permissions
  const perms = await api(
    'GET',
    `/permissions?filter[collection][_eq]=${COLLECTION}&fields=id,policy,action,fields,permissions,validation&limit=-1`
  )
  const wantPerms = [
    { policy: state.staffPolicy.id, who: 'staff', action: 'read' },
    { policy: state.staffPolicy.id, who: 'staff', action: 'update' },
    { policy: PUBLIC_POLICY, who: 'public', action: 'read' },
  ]
  for (const p of wantPerms) {
    const have = perms.find(
      (x) => x.policy === p.policy && x.action === p.action
    )
    const body = {
      policy: p.policy,
      collection: COLLECTION,
      action: p.action,
      fields: ['*'],
      permissions: {},
      validation: {},
    }
    if (!have) {
      change(
        '+',
        `grant ${p.who} ${p.action} on ${COLLECTION} (all fields)`,
        () => api('POST', '/permissions', body)
      )
    } else {
      const allFields = matches(['*'], have.fields)
      const noFilter =
        !have.permissions || !Object.keys(have.permissions).length
      if (!allFields || !noFilter) {
        change(
          '~',
          `widen ${p.who} ${p.action} on ${COLLECTION} to all fields, no filter`,
          () => api('PATCH', '/permissions/' + have.id, body)
        )
      }
    }
  }
  const extra = perms.filter(
    (x) =>
      !wantPerms.some((p) => p.policy === x.policy && p.action === x.action)
  )
  for (const x of extra) {
    console.log(
      `  note: leaving existing permission #${x.id} (${x.action} for policy ${x.policy}) as it is`
    )
  }

  // Content: fill empty fields only.
  const item = collection ? await find('/items/' + COLLECTION) : null
  const fills = {}
  for (const s of seedContent()) {
    const value = typeof s.value === 'function' ? s.value() : s.value
    const current = item?.[s.field]
    if (s.placeholder && (isEmpty(current) || matches(value, current))) {
      placeholders.push(`${s.field}: ${s.placeholder}`)
    }
    if (value === null || !isEmpty(current)) continue
    fills[s.field] = value
  }
  if (Object.keys(fills).length) {
    const lines = Object.entries(fills)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return (
            `      ${k}: ${v.length} rows\n` +
            v.map((r) => '        - ' + show(r)).join('\n')
          )
        }
        return `      ${k}: ${show(v)}`
      })
      .join('\n')
    change('+', `seed ${COLLECTION} (empty fields only):\n${lines}`, () =>
      api('PATCH', '/items/' + COLLECTION, fills)
    )
  }

  // Program record
  if (program.url !== NEW_SLUG) {
    const taken = await api(
      'GET',
      `/items/programs?filter[url][_eq]=${NEW_SLUG}&filter[id][_neq]=${program.id}&fields=id&limit=1`
    )
    if (taken.length) fail(`Another program already uses url "${NEW_SLUG}".`)
    change(
      '~',
      `update programs #${program.id}: url "${program.url}" → "${NEW_SLUG}"`,
      () => api('PATCH', '/items/programs/' + program.id, { url: NEW_SLUG })
    )
  }
  if (RENAME && program.title !== RENAME) {
    change(
      '~',
      `update programs #${program.id}: title "${program.title}" → "${RENAME}"`,
      () => api('PATCH', '/items/programs/' + program.id, { title: RENAME })
    )
  } else if (!RENAME && program.title !== 'Housing') {
    console.log(
      `  note: program title stays "${program.title}" (pass --rename-program "Housing" to change it)`
    )
  }
}

// --- Plan: remove -------------------------------------------------------------------------------

async function planRemove() {
  await resolvePolicies()
  const program = await findProgram()
  console.log(
    `Program:       #${program.id} "${program.title}" (/${program.url})`
  )

  const perms = await api(
    'GET',
    `/permissions?filter[collection][_eq]=${COLLECTION}&fields=id,policy,action&limit=-1`
  )
  if (perms.length) {
    change('-', `delete ${perms.length} permission(s) on ${COLLECTION}`, () =>
      api(
        'DELETE',
        '/permissions',
        perms.map((p) => p.id)
      )
    )
  }

  const collection = await find('/collections/' + COLLECTION)
  if (collection) {
    change(
      '-',
      `delete collection ${COLLECTION}, its fields, relations and the content staff entered in it`,
      () => api('DELETE', '/collections/' + COLLECTION)
    )
  }

  const folders = await api(
    'GET',
    '/folders?filter[name][_eq]=' +
      FOLDER_NAME +
      '&filter[parent][_null]=true&fields=id'
  )
  if (folders.length) {
    const id = folders[0].id
    const [files, subfolders] = await Promise.all([
      api('GET', `/files?filter[folder][_eq]=${id}&fields=id&limit=1`),
      api('GET', `/folders?filter[parent][_eq]=${id}&fields=id&limit=1`),
    ])
    if (files.length || subfolders.length) {
      console.log(`  note: keeping folder "${FOLDER_NAME}"; it has files in it`)
    } else {
      change('-', `delete empty folder "${FOLDER_NAME}"`, () =>
        api('DELETE', '/folders/' + id)
      )
    }
  }

  const restore = {}
  if (program.url !== OLD_SLUG) restore.url = OLD_SLUG
  if (program.title !== ORIGINAL_TITLE) restore.title = ORIGINAL_TITLE
  if (Object.keys(restore).length) {
    change(
      '~',
      `restore programs #${program.id}: ` +
        Object.entries(restore)
          .map(([k, v]) => `${k} "${program[k]}" → "${v}"`)
          .join(', '),
      () => api('PATCH', '/items/programs/' + program.id, restore)
    )
  }
}

// --- Backup -------------------------------------------------------------------------------------

async function backup() {
  await mkdir(BACKUP_DIR, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const snapshot = await api('GET', '/schema/snapshot')
  const content = {
    program: state.programId
      ? await find('/items/programs/' + state.programId)
      : null,
    housing_page: await find('/items/' + COLLECTION),
    permissions: await api(
      'GET',
      `/permissions?filter[collection][_eq]=${COLLECTION}&limit=-1`
    ),
  }
  const snapPath = join(BACKUP_DIR, `${stamp}-schema-snapshot.json`)
  const contentPath = join(BACKUP_DIR, `${stamp}-housing-content.json`)
  await writeFile(snapPath, JSON.stringify(snapshot, null, 2))
  await writeFile(contentPath, JSON.stringify(content, null, 2))
  console.log(`Backed up to ${snapPath}`)
  console.log(`         and ${contentPath}`)
}

// --- Run ----------------------------------------------------------------------------------------

function fail(message) {
  console.error('Error: ' + message)
  process.exit(1)
}

async function main() {
  const mode = REMOVE ? 'REMOVE' : 'SETUP'
  console.log(
    `Housing page ${mode} — ${
      APPLY ? 'APPLYING to' : 'DRY RUN against'
    } ${BASE}` +
      (APPLY ? '' : ' (nothing will change; add --apply to make these changes)')
  )
  console.log('')

  if (REMOVE) await planRemove()
  else await planSetup()

  console.log('')
  if (!changes.length) {
    console.log('No changes: Directus already matches.')
  } else {
    console.log(`${changes.length} change(s)${APPLY ? '' : ' to make'}:`)
    for (const c of changes) console.log(`  ${c.symbol} ${c.text}`)
  }

  if (placeholders.length) {
    console.log('')
    console.log('Placeholders to replace when Beth sends the content:')
    for (const p of placeholders) console.log('  ! ' + p)
  }

  if (!APPLY || !changes.length) return

  console.log('')
  await backup()
  console.log('')
  let done = 0
  try {
    for (const c of changes) {
      await c.run()
      done++
      console.log(`  ✓ ${c.text.split('\n')[0]}`)
    }
  } catch (e) {
    console.error(`  ✗ ${e.message}`)
    console.error(
      `Stopped after ${done} of ${changes.length} change(s). Re-run to pick up where it left off.`
    )
    process.exit(1)
  }
  console.log('')
  console.log(
    `Done: ${done} change(s) applied. Run again to confirm "No changes".`
  )
}

await main()
