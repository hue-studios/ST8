// Southern Tier 8 Housing Forecast.
//
// The charts are hosted by CommunityScale and embedded as iframes — see
// https://docs.communityscale.io/docs/overview ("Embedding Charts and Maps"). Each card is served
// standalone at <origin>/cards/<id> and refreshes itself as CommunityScale's pipelines update, so
// nothing here needs a deploy when the underlying data changes.
//
// The cards prefixed `southerntierny:` are built for our region specifically and do not exist on
// CommunityScale's stock dashboards. The rest are their standard cards scoped to the Southern
// Tier 8 Region aggregate (the 8-county geography is configured on their side, not in the URL).
//
// Headings and copy below are ours. Each section leads with one chart and tucks the rest behind
// the questions they answer, the way CommunityScale's own dashboard does — which also means only
// the six lead charts load up front, and the others when a reader opens them.
//
// Each card renders its own title inside the iframe, so `label` and `question` are for the
// iframe's accessible name, the jump links and the accordion buttons.
//
// `height` is the starting height of the frame. Every card posts its real height up to the page
// once it has drawn, and the frame resizes itself, so these only have to be close enough to keep
// the page from jumping as the charts arrive. The ones given here are measured.
//
// This lives in code rather than Directus because the site reads Directus anonymously and cannot
// create collections. If the sections ever need to be editable by staff, this array is the shape
// to mirror in a `housing_forecast_sections` collection.

export const CS_ORIGIN = 'https://southerntierny.communityscale.io'

export const CS_CITATION =
  'CommunityScale Housing Forecast (2025). Housing needs analysis and population projection tool.'

// The program this dashboard belongs to, so the program page can link across to it.
export const PROGRAM_SLUG =
  'southern-tier-s-capital-stack-for-workforce-housing'

// The four headline figures beside the map, mirroring the summary CommunityScale puts at the top
// of its own dashboard.
//
// These are written down rather than fetched. CommunityScale renders them into its dashboard page
// and offers no public endpoint for them — the per-card JSON its charts use is disallowed in their
// robots.txt, and their MCP server needs an account — so taking them live would mean leaning on
// something they have not opened up. Two of the four were checked against the card data and agree
// exactly (population is the 2026 total in population_forecast; jobs is the 2023 regional total in
// job_growth); the other two come from the dashboard itself.
//
// Refresh them from https://southerntierny.communityscale.io/dashboard when CommunityScale posts a
// new vintage, and move `asOf` with them.
export const HERO_STATS_AS_OF = 'November 2026'

export const HERO_STATS = [
  {
    value: '$95,522',
    label: 'Median income',
    source: 'Census ACS 2024',
  },
  {
    value: '572,230',
    label: 'Population',
    source: '2026 estimate',
  },
  {
    value: '219,954',
    label: 'Jobs',
    source: 'LODES 2023',
  },
  {
    value: '6,520',
    label: 'Recent building permits',
    source: 'previous 5 years, Census BPS',
  },
]

export const SECTIONS = [
  {
    id: 'affordability',
    heading: 'How affordable is the Southern Tier?',
    intro:
      'Whether housing prices are keeping pace with local incomes. The gap between what homes cost and what households can actually afford is the clearest single read on housing pressure.',
    card: {
      id: 'housing_affordability_manual',
      label: 'Home prices against local incomes',
      height: 346,
    },
    more: [
      {
        id: 'affordability_calculator',
        question: 'What can you afford to buy here?',
        height: 533,
      },
      {
        id: 'southerntierny:housing_condition',
        question: 'How many homes need renovation?',
        height: 685,
      },
    ],
  },
  {
    id: 'population',
    heading: 'How is the population changing?',
    intro:
      'Population by age group, measured back to 2010 and projected forward. Where the age curve moves tells us which housing types will be needed, and when.',
    card: {
      id: 'population_forecast',
      label: 'Population by age group',
      height: 380,
    },
    more: [
      {
        id: 'population_change',
        question: 'How is the population changing by age?',
        height: 299,
      },
      {
        id: 'workforce_age',
        question: 'Who is entering and leaving the workforce?',
        height: 519,
      },
    ],
  },
  {
    id: 'jobs',
    heading: 'How is the job market changing?',
    intro:
      'Job counts over time, by sector, and what those jobs pay. Comparing across the region shows where employment is concentrating.',
    card: { id: 'job_growth', label: 'Total jobs', height: 275 },
    more: [
      {
        id: 'jobs_sector',
        question: 'Which sectors have the most jobs?',
        height: 436,
      },
      {
        id: 'wages_by_occupation',
        question: 'What do different jobs pay?',
        height: 651,
      },
    ],
  },
  {
    id: 'households',
    heading: 'How are households changing by income?',
    intro:
      'Which income groups are growing and which are shrinking. This is what identifies the households facing the most pressure, and the income bands new housing most needs to reach.',
    card: {
      id: 'household_growth',
      label: 'Household growth by income group',
      height: 375,
    },
    more: [
      {
        id: 'household_change',
        question: 'How are households changing by income level?',
        height: 330,
      },
    ],
  },
  {
    id: 'who-lives-here',
    heading: 'Who lives here today?',
    intro:
      'Household size, structure and cost burden. Comparing how households are composed against the housing available to them shows how well the two line up.',
    card: {
      id: 'housing_characteristics',
      label: 'Household characteristics by income',
      height: 650,
    },
    more: [
      {
        id: 'household_types',
        question: 'How are household types changing?',
        height: 335,
      },
      {
        id: 'cost_burden',
        question: 'Who is cost-burdened?',
        height: 384,
      },
      {
        id: 'cost_burden_trend',
        question: 'How is housing cost burden changing?',
        height: 370,
      },
    ],
  },
  {
    id: 'housing-stock',
    heading: 'What does the housing stock look like?',
    intro:
      'What has been built, when it was built, how much of it sits empty and what is on the market right now.',
    card: {
      id: 'southerntierny:housing_stock_by_tenure',
      label: 'Housing stock by tenure',
      height: 400,
    },
    more: [
      {
        id: 'housing_stock_comparison',
        question: 'How does the housing stock compare?',
        height: 460,
      },
      {
        id: 'southerntierny:housing_production',
        question: 'When was the housing built?',
        height: 275,
      },
      {
        id: 'building_permits',
        question: 'How much new housing is being permitted?',
        height: 384,
      },
      {
        id: 'vacancy_rates',
        question: 'How many homes are vacant?',
        height: 511,
      },
      {
        id: 'listings_filter',
        question: "What's for sale right now?",
        height: 647,
      },
      {
        id: 'rental_listings_filter',
        question: "What's available to rent?",
        height: 647,
      },
    ],
  },
]

// The figure the rest of the page builds towards. CommunityScale renders this one inline on its
// dashboard rather than as a card — there is no /cards/ page for it to embed — so, like the hero
// stats, it is written down here and refreshed by hand from
// https://southerntierny.communityscale.io/dashboard. It is a regional total, so the county pages
// leave it out.
export const SUPPLY_NEED = {
  id: 'supply-needed',
  heading: 'How much new housing does the region need?',
  intro:
    'To keep pace with growth and clear the shortfall in what already exists, the Southern Tier 8 Region needs 4,271 new units over the next five years.',
  total: '4,271',
  totalLabel: 'Total five-year housing production need (2026–2031)',
  rows: [
    {
      value: '2,187',
      label: 'Replacement housing',
      detail: 'Covering homes lost from the stock each year.',
    },
    {
      value: '4,271',
      label: 'Units to address shortages in existing housing stock',
      detail: 'Production needed to bring vacancy rates back into balance.',
    },
  ],
}

export default SECTIONS
