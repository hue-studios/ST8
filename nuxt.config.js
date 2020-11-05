export default {
  ssr: 'true',
  static: 'false',
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
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
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://use.typekit.net/xnk2eiu.css',
        crossorigin: 'true'
      },
      {
        rel: 'preconnect',
        href: 'https://admin.steny.org',
        crossorigin: 'true'
      }
    ]
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
      lang: 'scss'
    }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    'nuxt-purgecss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: 'https://admin.steny.org/southern-tier-8'
  },
  pwa: {
    meta: {
      mobileAppIOS: true,
      appleStatusBarStyle: 'black-translucent',
      theme_color: '#193658',
      nativeUI: true,
      short_name: 'ST8',
      background_color: '#ffffff'
    }
  },
  env: {
    apiUrl: 'https://admin.steny.org/southern-tier-8',

    imageUrl: 'https://admin.steny.org/southern-tier-8/assets/'
  },

  render: {
    dist: {
      maxAge: '1d'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['gsap'],
    extend(config, ctx) {}
  }
}
