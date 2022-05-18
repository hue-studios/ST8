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
})
export const getters = {
  loading: (state) => state.loading,
  resourceInfo: (state) => state.resourceInfo,
  resource: (state) => state.resource,
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
}
export const actions = {}
