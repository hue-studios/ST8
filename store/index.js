export const state = () => ({
  loading: {
    status: false,
    loader: true,
  },
  resourceInfo: false,
  resource: {
    title: '',
    link: '',
    resource: '',
  },
  page: '',
  // Loaded once per server render in nuxtServerInit (footer, contact info, default images).
  organization: {},
  footerInitiatives: [],
})
export const getters = {
  loading: (state) => state.loading,
  resourceInfo: (state) => state.resourceInfo,
  resource: (state) => state.resource,
  // Directus asset URL for an organization file field, e.g. orgAsset('default_cover_image', 'large')
  orgAsset: (state) => (field, key) =>
    state.organization[field]
      ? process.env.imageUrl +
        state.organization[field] +
        (key ? '?key=' + key : '')
      : '',
}

export const mutations = {
  UPDATE_RESOURCE(state, resource) {
    state.resource = resource
  },
  UPDATE_RESOURCE_INFO(state, resourceInfo) {
    state.resourceInfo = resourceInfo
  },
  UPDATE_PAGE(state, pageName) {
    state.page = pageName
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ORGANIZATION(state, organization) {
    state.organization = organization || {}
  },
  SET_FOOTER_INITIATIVES(state, initiatives) {
    state.footerInitiatives = initiatives || []
  },
}
export const actions = {
  async nuxtServerInit({ commit }) {
    // A CMS hiccup should not take the whole site down: render with empty footer data instead.
    const [organization, initiatives] = await Promise.all([
      this.$axios
        .$get(
          '/items/organization?fields=mission_statement,phone,fax,email,locations,social_links,default_cover_image,default_person_image,ceds_document'
        )
        .then((res) => res.data)
        .catch((error) => console.log(error)),
      this.$axios
        .$get(
          '/items/initiatives?fields=id,title,url,sort&filter[status][_eq]=published&sort=sort'
        )
        .then((res) => res.data)
        .catch((error) => console.log(error)),
    ])
    commit('SET_ORGANIZATION', organization)
    commit('SET_FOOTER_INITIATIVES', initiatives)
  },
}
