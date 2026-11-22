# southerntier8.org

Southern Tier 8 Regional Board website. Nuxt 4, Tailwind 4, shadcn-vue (wrapped), Directus.

```bash
pnpm install        # Node 22, pnpm 9
pnpm dev            # http://localhost:3000
pnpm build          # production build
pnpm typecheck
pnpm check:ui       # app/components/ui must equal the shadcn-vue CLI output
pnpm generate:types # shared/directus/schema.ts from the live CMS (needs DIRECTUS_URL and DIRECTUS_TOKEN in .env)
```

The CMS is the staff-managed Directus at manage.southerntier8.org; the site reads only public data. The upgrade from
Nuxt 2 is tracked in `docs/plans/search-services-podcast-updates.md`; see `docs/plans/upgrade-porting-notes.md` for
how to port a page.
