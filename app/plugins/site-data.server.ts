// What nuxtServerInit did on the Nuxt 2 site: load the footer data once per server render. The state is serialised
// into the page, so the browser never fetches it again.
export default defineNuxtPlugin(async () => {
  await Promise.all([loadOrganization(), loadHasPodcast(), loadFooterInitiatives()])
})
