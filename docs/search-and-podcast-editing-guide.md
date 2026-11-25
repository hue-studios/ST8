# How to edit the podcast, search and core services

**In short:** Everything here is edited in Directus at https://manage.southerntier8.org. Make your change, click **Save**, then check the page. Changes show on the next page load. You don't need a developer.

## Before you start

- Log in at https://manage.southerntier8.org with your own login.
- You need the **Content Editor** role. If you can't see **Podcast Episodes** or **Core Services** in the sidebar, ask Peter.
- Only **published** items show on the site. A draft is saved but invisible to visitors, so it's safe to work on one before it goes live.

## Adding a podcast episode

The Organization page has a **Rebuilding So-Tier** section. Each published episode appears there as a card.

1. In the left sidebar, click **Podcast Episodes**, then the **+** button.
2. Fill in:
   - **Title** and **Episode number**.
   - **Date published**.
   - **Summary**: a sentence or two shown on the card.
   - **Guests**: pick people from the staff and board records. Guests are linked to their entry, so pick the existing record rather than typing a name.
   - **Status**: set to **published**.
3. Choose one way to play it:
   - **Audio file**: upload an MP3. It plays on the site with a normal player.
   - **Embed URL**: paste a YouTube or Spotify link. It loads only when a visitor presses play, so the page stays fast.
   - Use one or the other, not both. Leave the one you don't use empty.
4. Add the **Duration** (for example 42:10) and the **Cover image** if you have one.
5. Click **Save**, then check the Organization page.

If the episode has a **Transcript**, it also gets its own page. Leave it empty if you don't have one.

- To take an episode down, change its **Status** to anything other than published. Nothing is deleted.
- If every episode is unpublished, the whole **Rebuilding So-Tier** section disappears from the page. That's expected.
- The intro text above the episodes is the **Podcast intro** on the **Organization** record. The section title is the **Podcast title**.

## Tagging a service or program to a core service

Search and the Services page group everything under five **core services**: **Plan**, **Develop**, **Connect**, **Build Capacity** and **Invest**. Each service and program belongs under one or more of them.

The five core services are edited under **Core Services**. Each one has a **Title**, a **Summary**, a **Need** line in the visitor's voice (for example "We need a plan or study before we invest"), and **Search phrases**. The search phrases are words people type that aren't in the title. They aren't shown on the site, but search matches them.

To put a service under a core service:

1. Open the service under **Services**.
2. Set **Core service** to one of the five. A service sits under exactly one core service.
3. Click **Save**.

To put a program under one or more core services:

1. Open the program under **Programs**.
2. In **Core services**, add each one that fits. The first one listed is the main one.
3. Click **Save**.

Or from the other side: open a core service and use **Services** and **Programs** to see what's under it. Use **Add Existing** to link one.

- Each core service's page lists its services and programs. A service or program with no core service still appears in search, but not under a group.
- Changing a core service's **Need** line changes the example prompt that visitors can click in the search box.

## Attaching an event to a program

Events can be shown on a program's page, starting with the Housing page.

1. Open the event under **Events**.
2. In **Programs**, add the program, for example **Regional Workforce Housing Investment Framework**.
3. Click **Save**.

The event then appears on that program's page without a deploy. Upcoming events show first. Past events show with their recordings, if one is linked.

For the Housing page's **Videos and Events** section, the recordings are listed under the Housing page's **Videos** section in Directus. Add a video with its title, a **Video link (URL)** (YouTube or Vimeo) and a short description. See the [Housing page guide](housing-page-editing-guide.md) for the rest of that page.

- An event with no program attached appears only on the Events listing, not on a program page.

## Checking your change

1. Click **Save** in Directus.
2. Open the page you changed on https://southerntier8.org and reload it.
3. For search, type a phrase from your change into the search box (the magnifying glass in the header), or press **/** on the keyboard, and check the result shows near the top.

If something doesn't show, check its **Status** is **published** first. Most missing items are drafts.

## When something goes wrong

- **A page shows an error or is blank:** tell Peter the page address and what you changed last.
- **The site looks out of date:** reload the page once. If it still looks old, wait a few minutes; the search index refreshes every five minutes.
- **A link doesn't work:** check that it starts with https:// and that the item it points to is published.
