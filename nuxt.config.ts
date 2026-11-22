import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// The staff-managed Directus for ST8's own websites (not so-tier.com, which is members and sign-in).
// Build-time default; override per environment with NUXT_PUBLIC_DIRECTUS_URL, read at runtime.
const directusUrl = (process.env.DIRECTUS_URL || 'https://manage.southerntier8.org').replace(/\/$/, '')

// Permanent (301) redirects. One rule each: the Vercel preset maps `/x` and `/x/` to the same function file and fails
// the build on the duplicate. Nitro matches the trailing-slash form of a path against the same rule.
function redirects(map: Record<string, string>) {
  const rules: Record<string, { redirect: { to: string, statusCode: 301 } }> = {}
  for (const [from, to] of Object.entries(map)) {
    const rule = { redirect: { to, statusCode: 301 as const } }
    rules[from] = rule
  }
  return rules
}

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',

  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-og-image',
    'nuxt-schema-org',
    'nuxt-gtag',
    '@vueuse/nuxt',
  ],

  // shadcn-vue 2.8 writes `import { cn } from 'cn'` into app/components/ui (never edited by hand). Point that at the helper.
  alias: { cn: fileURLToPath(new URL('./app/utils/cn.ts', import.meta.url)) },

  // Only .vue files are components. app/components/ui is shadcn-vue's and is not auto-registered: import base
  // components from their barrel. Pages and feature components use the St8 wrappers, never ui/ directly.
  components: [{ path: '~/components', extensions: ['vue'], ignore: ['ui/**'] }],

  // Tailwind first, then the site's Sass, so the Sass wins ties exactly as it did on the Nuxt 2 site.
  css: ['~/assets/css/main.css', '~/assets/scss/main.scss', 'vue-sonner/style.css'],

  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: { quietDeps: true },
      },
    },
  },

  site: {
    url: 'https://southerntier8.org',
    name: 'Southern Tier 8',
    description:
      'Southern Tier 8 is a vibrant, multi-facet planning and development agency proudly serving eight counties in the Southern Tier region of Upstate New York.',
    defaultLocale: 'en',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Southern Tier 8 Economic Development Organization for the Southern Tier Region of New York',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        {
          name: 'description',
          content:
            'Southern Tier 8 is a vibrant, multi-facet planning and development agency proudly serving eight counties in the Southern Tier region of Upstate New York. Our focus is to sustain and grow our region’s economy through collaborating with partners throughout our region.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://southerntier8.org' },
        { property: 'fb:app_id', content: '503626331013525' },
        { property: 'og:image', content: 'https://southerntier8.org/images/st8-social.png' },
        { name: 'twitter:site', content: '@SouthernTier8' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'preconnect', href: directusUrl, crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://fast.fonts.net/', crossorigin: 'anonymous' },
        { rel: 'icon' as const, type: 'image/x-icon', href: '/favicon.ico' },
        ...[57, 60, 72, 76, 114, 120, 144, 152, 180].map(size => ({
          rel: 'apple-touch-icon' as const,
          sizes: `${size}x${size}`,
          href: `/icons/apple-icon-${size}x${size}.png`,
        })),
        { rel: 'icon' as const, type: 'image/png', sizes: '192x192', href: '/icons/android-icon-192x192.png' },
        { rel: 'icon' as const, type: 'image/png', sizes: '32x32', href: '/icons/favicon-32x32.png' },
        { rel: 'icon' as const, type: 'image/png', sizes: '96x96', href: '/icons/favicon-96x96.png' },
        { rel: 'icon' as const, type: 'image/png', sizes: '16x16', href: '/icons/favicon-16x16.png' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
    // Pages cross-fade, as on the Nuxt 2 site (`.page-*` in assets/scss/_transitions.scss).
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      directusUrl,
    },
  },

  // The GA4 property the Nuxt 2 site used through vue-gtag. The old Universal Analytics id is not carried over (UA stopped collecting in 2023).
  gtag: {
    id: 'G-2L5KBV6N3L',
  },

  // Light only until the site's Sass has a dark pass: tokens for both modes exist, there is no toggle.
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'st8-color-mode',
  },

  icon: {
    // Keep the icon CSS in a cascade layer so Tailwind size utilities win over its 1em default.
    cssLayer: 'base',
    // Icons resolve from the local @iconify-json packages (lucide, simple-icons); nothing is fetched at runtime.
    serverBundle: 'local',
    clientBundle: { scan: true },
  },

  image: {
    provider: 'directus',
    directus: { baseURL: `${directusUrl}/assets/` },
  },

  // Printed URLs (summit QR codes, slides, handouts) must never break, so redirects live in code, not the CMS.
  routeRules: redirects({
    '/programs': '/economic-development-programs',
    '/programs/housing': '/economic-development-programs/housing',
    // The Housing program's slug before it moved to /housing.
    '/economic-development-programs/southern-tier-s-capital-stack-for-workforce-housing':
      '/economic-development-programs/housing',
  }),

  typescript: {
    strict: true,
  },
})
