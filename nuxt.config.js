export default {
  // ssr: 'true',
  // static: 'false',
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0', // default: localhost
  },
  modern: true,
  /*
   ** Headers of the page
   */
  head: {
    title:
      'Southern Tier 8 Economic Development Organization for the Southern Tier Region of New York',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Southern Tier 8 is a vibrant, multi-facet planning and development agency proudly serving eight counties in the Southern Tier region of Upstate New York. Our focus is to sustain and grow our region’s economy through collaborating with partners throughout our region.',
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://southerntier8.org',
      },
      {
        hid: 'fb:app_id',
        name: 'fb:app_id',
        content: '503626331013525',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://southerntier8.org/images/st8-social.png',
      },
      {
        hid: 'twitter:summary_large_image',
        name: 'twitter:summary_large_image',
        content: 'summary',
      },
      {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: '@SouthernTier8',
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'msapplication-TileColor',
        content: '#ffffff',
      },
      {
        name: 'msapplication-TileImage',
        content: '/icons/ms-icon-144x144.png',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    link: [
      {
        rel: 'preconnect',
        href: 'https://admin.steny.org',
        crossorigin: 'true',
      },
      {
        rel: 'preconnect',
        href: 'https://fast.fonts.net/',
        crossorigin: 'true',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/icons/apple-icon-57x57.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/icons/apple-icon-60x60.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/icons/apple-icon-72x72.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/icons/apple-icon-76x76.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/icons/apple-icon-114x114.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/icons/apple-icon-120x120.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/icons/apple-icon-144x144.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/icons/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/icons/apple-icon-180x180.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/icons/android-icon-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/icons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/icons/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/icons/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],

    script: [
      {
        src:
          'https://fast.fonts.net/jsapi/21a0c137-b931-4f95-8773-dabd5b0c50f7.js',
        rel: 'dns-prefetch',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#1accb8', height: '10px' },
  /*
   ** Global CSS
   */
  css: [
    {
      src: '~/assets/scss/main.scss',
      lang: 'scss',
    },
  ],
  router: {
    middleware: 'pages',
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/gtag', { src: '~plugins/v-calendar.js', ssr: false }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/moment',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // 'nuxt-purgecss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-izitoast',
    'vue-social-sharing/nuxt',
    [
      'nuxt-validate',
      {
        lang: 'en',
      },
    ],
  ],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.scss',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
  },
  moment: {
    defaultTimezone: 'America/New_York',
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'https://admin.steny.org/southern-tier-8',
  },
  izitoast: {
    timeout: 3000,
    position: 'bottomRight',
    transitionIn: 'flipInX',
    transitionOut: 'flipOutX',
    backgroundColor: '#fb00da',
    color: '#ffffff',
    titleColor: '#ffffff',
    messageColor: '#ffffff',
    layout: 2,
    imageWidth: 80,
    pauseOnHover: false,
    progressBarColor: '#00ff1b',
    overlay: true,
    overlayClose: true,
    overlayColor: 'rgba(0,0,0,0.7)',
  },
  pwa: {
    meta: {
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
      theme_color: '#193658',
      nativeUI: true,
      short_name: 'ST8',
      background_color: '#ffffff',
    },
  },
  env: {
    apiUrl: 'https://admin.steny.org/southern-tier-8',
    imageUrl: 'https://admin.steny.org/southern-tier-8/assets/',
  },

  render: {
    dist: {
      maxAge: '1d',
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    babel: {
      plugins: ['@babel/plugin-transform-spread'],
    },
    transpile: ['gsap', 'vue-feather-icons', 'v-calendar'],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        })
      }
    },
  },
}
