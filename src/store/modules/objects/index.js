import api from '@/services/api'

export default {
  actions: {
    async fetchObjects(ctx, vm) {
      ctx.commit('updateLoading', true, { root: true })
      ctx.commit('updateObjects', [])

      try {
        let response
        if (vm.archived) response = await api.objectsV3.getArchivedObjects()
        else response = await api.objectsV3.getObjects()
        const objects = response.data.result
        ctx.commit('updateObjects', objects)
      } catch (error) {
        if (!error.response) {
          vm.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          vm.toasted(error.response.data.message, 'error')
        } else {
          vm.toasted(error.response.data.message, 'error')
        }
      } finally {
        ctx.commit('updateLoading', false, { root: true })
      }
    },

    async fetchRoles(ctx, vm) {
      ctx.commit('updateLoading', true, { root: true })
      try {
        const response = await api.roles.fetchRoles()
        const roles = response.data
        ctx.commit('updateRoles', roles)
      } catch (error) {
        if (!error.response) {
          vm.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          vm.toasted(error.response.data.message, 'error')
        } else {
          vm.toasted(error.response.data.message, 'error')
        }
      } finally {
        ctx.commit('updateLoading', false, { root: true })
      }
    },
  },

  state: {
    objects: [],
    roles: [],
  },

  mutations: {
    updateObjects(state, objects) {
      state.objects = objects
    },

    updateRoles(state, roles) {
      state.roles = roles
    },
  },

  getters: {
    getObjects(state) {
      return state.objects
    },

    getRoles(state) {
      return state.roles
    },
  },
}
