# Housing program page: final plan

Target: live by **Tue 11/17**, a day before the summit on 11/18.
Status: plan only. No code or Directus changes have been made.

## What we're building

A program page for **Housing** that acts as the hub for the Southern Tier Workforce Housing
Investment Framework. It links out to CommunityScale's project site (dashboard, suitability map,
resource library) and does not copy their data. ST8 staff can edit everything on it in Directus.

The existing Housing Forecast pages (`/regional-housing-forecast` and the eight county pages) stay
live. They are only taken out of the navigation.

---

## 1. URLs: both work, one is the real page

| URL | What happens |
|---|---|
| `/economic-development-programs/housing` | **The page.** Matches every other program page on the site. This is the canonical URL used for search engines and share cards. |
| `/programs/housing` | Permanent (301) redirect to the page. This is the address Beth prints on the QR codes, slides and handouts, and it works indefinitely. |
| `/economic-development-programs/southern-tier-s-capital-stack-for-workforce-housing` | 301 redirect to the page, so old links keep working. |
| `/programs` | 301 redirect to `/economic-development-programs`, so a visitor who trims the URL doesn't hit a 404. |
| `/regional-housing-forecast` and the county pages | Unchanged and still live. Just unlinked. |

- The redirects live in code (`nuxt.config.js` route rules), not in Directus, so a CMS edit can't
  break the printed URL. A test request against each one is part of the launch check.
- The program record's `url` changes from the capital-stack slug to `housing`, so the Programs
  listing card points to the new page automatically.
- **Tell Beth:** both URLs work, so she can print whichever she prefers. The short one is easier to
  type off a slide and makes a simpler QR code.

## 2. The page

`pages/economic-development-programs/housing.vue` is a dedicated page. It takes priority over the
generic `_slug.vue`, and it reuses the program page's look.

Top to bottom:
1. **Heading:** "Housing", with "Southern Tier Workforce Housing Investment Framework" beneath it.
   Both are editable.
2. **Intro:** rich text from Beth's content attachment (still needed).
3. **Framework links:** one card per link (title, short description, button). These open
   CommunityScale in a new tab. Staff can add, edit, remove and reorder them.
4. **What it is / What it accomplishes:** pulled from the existing program record, as on the
   current page.
5. **Counties served, partners, resources, news:** pulled from the existing program record, so
   nothing already attached is lost.
6. **Share card:** its own Open Graph image and description, built with the existing share-card
   builder.

**New tabs:** framework buttons and any link in the page's rich text that goes off the site get
`target="_blank" rel="noopener"`. Links within the site stay in the same tab. If ST8 wants this
everywhere, the same helper can go into the site-wide rich-text rendering.

## 3. Home page

- The county-map callout is replaced by **one image banner** that links to the housing page.
- The image, title, one-line text and an on/off switch all live in Directus (see section 6, tab 4),
  so Beth or Jen can swap the image or turn the banner off after the summit without a developer.
- The hardcoded "4,271" on the home page goes away with the map.

## 4. Navigation

- The header and footer "Housing" links point to `/economic-development-programs/housing`.
- The links to `/regional-housing-forecast` are removed from the header, footer, home page and
  program page. The forecast pages themselves stay.
- **Your call:** mark the forecast pages `noindex` so search engines stop showing them while
  they're unlinked. It's one meta tag, easy to take off later.

## 5. Headline figures: can they be dynamic?

**Not live from CommunityScale, not today.** Earlier research found that CommunityScale offers no
public endpoint for the dashboard summary figures. The card data their charts use is blocked in
their `robots.txt`, and their API/MCP access needs an account. Pulling from it without their OK
would be fragile and unwelcome.

So we do this in two stages:

**Now: Directus-managed, so updates need no deploy.**
- The four headline figures (median income, population, jobs, permits), their sources, the
  "as of" date, and the five-year production need (4,271 / 2,187) move from
  `config/housingForecast.js` into Directus.
- The forecast pages read them from Directus. The values currently in `config/` stay as a fallback,
  so a missing or blank entry never shows an empty box.
- When CommunityScale posts a new vintage, Beth or Jen update the numbers in Directus and the site
  changes on the next page load.

**Later: fully live, if CommunityScale agrees.** Beth meets the consultant Friday. Two asks, in
order of preference:
1. **A "headline stats" card** (plus one for the five-year need), like the custom
   `southerntierny:` cards they already built for us. We'd embed them the same way as the other
   charts, so they'd update themselves and need no upkeep.
2. **Permission and a key for their card-data endpoint.** The server would then fetch the figures,
   cache them for a few hours, and fall back to the Directus values if their API is down.

Note: per Beth, the new hub page **does not** show these figures. They're only used by the
unlinked forecast pages. That's why the Directus version is enough for the summit.

## 6. Directus: set up for Beth and Jen

### Structure

A new **singleton** collection, **Housing Page** (`housing_page`), pinned to the top of the
sidebar. Beth and Jen open one entry and see everything, sorted into four tabs:

| Tab | Fields | Editor experience |
|---|---|---|
| **1. Page** | Page title, subtitle, intro (rich text), page image, share description | Rich text with a cut-down toolbar (bold, italic, link, bullet list, heading) so pasted Word content can't break the layout. A character counter on the share description (160 max). |
| **2. Framework Links** | A repeater, one row per link: **Title**, **Description**, **Link (URL)**, **Button text**, **Type** (Dashboard / Map / Library / Report / Other) | Rows collapse to show just their title. Drag the handle to reorder, and an **"Add a link"** button adds one. The URL must start with `https://`, with a friendly error if it doesn't. A 200-character limit on the description keeps the cards even. Type sets the card's icon. |
| **3. Forecast Figures** | "As of" date; a repeater of **Value / Label / Source**; the five-year need total and its two parts | Each field has a note that says where to copy the number from on the CommunityScale dashboard, with the link. |
| **4. Home Page Banner** | **Show on home page** (toggle), banner image, title, one-line text | Image field with a note giving the ideal size (e.g. 1600 × 600) and uploads going to a "Housing" folder. The toggle hides the banner without deleting anything. |

### Things that make it easy

- **Plain-English labels and a note on every field.** For example: "The text on the button, e.g.
  'Open the dashboard'. Keep it short."
- **Required where it matters:** a link with no URL can't be saved. The site also skips an
  incomplete row rather than showing a broken card.
- **Placeholder examples** in every empty field.
- **Preview button:** the collection's preview URL is set to the live housing page, so after
  saving they can click through and see it.
- **Program link set behind the scenes:** the singleton links to the program record for partners,
  resources and news. That field is hidden so nobody unlinks it by accident.
- **Permissions:** the existing **Content Editor** role (Lolene, and Beth once invited) gets
  read and update on Housing Page, and the public role can read it. Nobody but admins can change
  its structure. Content Editor already covers programs, files, resources, news and the home
  page, so no new role is needed.
- **A one-page "How to edit the Housing page" guide** with screenshots, sent to Beth and Jen at
  launch.

### Run from a script, not by hand

`scripts/directus/housing-setup.mjs`, run with Node 22's built-in `--env-file`. It uses plain
`fetch`, so no new dependencies.

```bash
node --env-file=.env scripts/directus/housing-setup.mjs            # dry run: prints what it would change
node --env-file=.env scripts/directus/housing-setup.mjs --apply    # makes the changes
node --env-file=.env scripts/directus/housing-setup.mjs --remove   # undoes them
```

`.env`. It's already in `.gitignore`. The file doesn't exist yet, so you'll create it:

```
DIRECTUS_URL=https://manage.southerntier8.org
DIRECTUS_TOKEN=<static token for an admin user>
DIRECTUS_STAFF_ROLE=Content Editor
```

(URL, token and role are all set in `.env` as of 11/5.)

What the script does:
1. **Backs up first:** saves a schema snapshot (`/schema/snapshot`) to `scripts/directus/backups/`
   (gitignored) before changing anything.
2. **Is safe to re-run:** it checks what already exists and only creates or updates what's
   missing or different. Running it twice changes nothing the second time.
3. Creates the `housing_page` singleton, its fields, tabs, notes, validation and the relation to
   `programs`.
4. Sets permissions (staff edit, public read), the sidebar position, icon and preview URL.
5. **Seeds the content:**
   - the CommunityScale links (dashboard, suitability map, resource library)
   - the current headline figures from `config/housingForecast.js`
   - the banner text
   - "Southern Tier Workforce Housing Investment Framework" as the subtitle
6. Updates the program record: `url` becomes `housing`. It does **not** retitle the record unless
   run with `--rename-program "Housing"`, so that change stays your decision.
7. Prints a summary of every change.

If there is a staging or preview Directus instance (the Vercel config allows a per-environment
`DIRECTUS_URL`), the script runs there first and against production only after the preview site
checks out.

## 7. Build phases

Each phase ends in a commit on the build branch. The model column says which Claude model is worth
it for that phase: **Opus** where a mistake is costly or the design needs judgment, **Sonnet** for
well-specified build work, **Haiku** for mechanical or writing-only tasks.

| # | Phase | Depends on | Model | Done when |
|---|---|---|---|---|
| 1 | **Unlink the forecast pages.** Remove the `/regional-housing-forecast` links from the header, footer, home page and capital-stack program page. Pages stay live. | — | Haiku | No nav link reaches the forecast. Both forecast URLs still load. |
| 2 | **Directus setup script.** Write `scripts/directus/housing-setup.mjs` (section 6): backup, safe to re-run, dry-run by default, `--apply`, `--remove`. Dry-run against production and show Peter the output. **Stop for Peter's OK before `--apply`.** | — | **Opus** | The dry-run output has been reviewed. After the OK, it's applied and a second run reports no changes. |
| 3 | **Housing page and redirects.** `pages/economic-development-programs/housing.vue`, the four 301s in `nuxt.config.js`, the new-tab helper for rich text and framework links, and the share card. | 2 | **Opus** | Each URL in section 1 behaves as listed. Framework links open in new tabs. The page renders from Directus. |
| 4 | **Forecast figures from Directus.** The forecast pages read headline figures and the five-year need from `housing_page`, with `config/housingForecast.js` as the fallback. | 2 | Sonnet | Editing a figure in Directus changes the page with no deploy. Blanking it shows the fallback. |
| 5 | **Home banner and navigation.** Replace the county-map callout with the Directus-driven banner (respecting its on/off switch). Point header and footer "Housing" at the new page. | 2, 3 | Sonnet | The banner shows and hides from Directus and links to the housing page. |
| 6 | **Check and hand over.** Run every URL in section 1 through the dev preview (desktop and mobile), plus a Lighthouse/console pass. Write the "How to edit the Housing page" guide for Beth and Jen. | 1–5 | Sonnet (check), Haiku (guide) | All checks pass and the guide is ready to send. |

Phases 1 and 2 can run side by side. Phases 3 and 4 can too, once 2 is applied.

**Dates**

| When | Work |
|---|---|
| **Thu 11/5 – Fri 11/6** | Phases 1 and 2 (dry-run only). Reply to Jen and Beth and collect the answers below. Beth raises the CommunityScale asks on Friday. |
| **Mon 11/9** | Phase 2 applied after review. Phases 3 and 4 start. |
| **Tue 11/10 – Wed 11/11** | Phases 3–5. |
| **Thu 11/12** | Phase 6. Send Beth and Jen a preview link and the editing guide. They try adding and reordering links. |
| **Fri 11/13 – Mon 11/16** | Revisions. |
| **Tue 11/17** | Live. A final check of `/programs/housing` from a phone QR scan. |

## 8. Still needed from Beth and Jen

1. **The content attachment** Beth mentioned (the page copy).
2. **Home banner image**, or the go-ahead to use the current program image.
3. **The exact CommunityScale URLs** for the dashboard, suitability map and resource library.
4. **Which URL to print.** Both work; the short one scans more easily.
5. **New tabs** on this page only, or across the whole site.
6. **Program record title:** rename "Southern Tier's Capital Stack for Workforce Housing" to
   "Housing"?

## 9. Still needed from you

1. ~~Create `.env`~~ Done.
2. Invite Beth in Directus (User Directory → Invite Users, role **Content Editor**).
3. Say whether there's a staging Directus to run the script against first.
4. Decide on `noindex` for the unlinked forecast pages.
