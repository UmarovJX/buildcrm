import api from '@/services/api'

export default {
  actions: {
    async fetchCompanies(ctx, vm) {
      ctx.commit('updateLoading', true, { root: true })
      try {
        const response = await api.companies.getCompaniesList()
        const companies = response.data
        ctx.commit('updateCompanies', companies)
        ctx.commit('updateLoading', false, { root: true })
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
      }
    },

    async fetchBranch(ctx, vm) {
      try {
        const response = await api.companies.getCompanyBranch(vm.company_id)
        const branch = response.data
        ctx.commit('updateBranch', branch)
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
      }
    },

    async fetchBranchTypes(ctx, vm) {
      try {
        const response = await api.companies.getCompanyType()
        const types = response.data
        ctx.commit('updateBranchTypes', types)
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
      }
    },
  },

  state: {
    companies: [],
    types: [],
    branch: {},
  },

  mutations: {
    updateCompanies(state, companies) {
      state.companies = companies
    },

    updateBranchTypes(state, types) {
      state.types = types
    },

    updateBranch(state, branch) {
      state.branch = branch
    },
  },

  getters: {
    getCompanies(state) {
      return state.companies
    },

    getBranchTypes(state) {
      return state.types
    },

    getBranch(state) {
      return state.branch
    },
  },
}
