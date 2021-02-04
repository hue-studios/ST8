export const state = () => ({
  loading: {
    status: false,
    loader: true
  },

  page: ''
})
export const getters = {
  loading: (state) => state.loading
}

export const mutations = {
  UPDATE_PAGE(state, pageName) {
    state.page = pageName
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  }
}
export const actions = {}
