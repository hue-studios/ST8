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
    title: 'Southern Tier 8 | Regional Economic Development Organization',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://admin.steny.org',
        crossorigin: 'true',
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
  plugins: [{ src: '~plugins/v-calendar.js', ssr: false }],
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
    // '@nuxtjs/google-analytics'
  ],
  // 'google-analytics': {
  //   id: 'UA-106815130-1'
  // },
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
    postcss: {},
    transpile: ['gsap'],
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
