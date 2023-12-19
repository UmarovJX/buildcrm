// import router from '../../../settings.routes.js'
import api from '@/services/api'

export default {
  state: {
    apartments: {
      items: [],
      pagination: {},
    },
    filter: {},
    client: {},
  },
  mutations: {
    updateSpecificApartment(state, { updatingApartment, status }) {
      if (status === 'unavailable') {
        state.apartments.items.splice(updatingIndex, 1)
        return
      }

      const updatingIndex = state.apartments.items.findIndex(
        apartment => apartment.id === updatingApartment.id,
      )
      if (updatingIndex !== -1) {
        state.apartments.items.splice(updatingIndex, 1, updatingApartment)
      }
    },
    updateApartment(state, apartments) {
      if (apartments.pagination.current > 1) {
        state.apartments.pagination = apartments.pagination
        state.apartments.items.push(...apartments.items)
      } else {
        state.apartments = apartments
      }
    },

    updateFilter(state, filter) {
      state.filter = filter
    },

    updateReserveClient(state, client) {
      state.client = client
    },
  },

  actions: {
    async fetchApartments(ctx, vm) {
      /* eslint-disable no-debugger */
      // debugger;
      const router = vm.$route
      ctx.commit('updateLoading', true, { root: true })

      if (typeof router.query.rooms === 'string') {
        const newArr = []
        const newArrItem = parseInt(router.query.rooms)
        newArr.push(newArrItem)
        router.query.rooms = newArr
      }

      if (typeof router.query.number === 'string') {
        const newArr = []
        const newArrItem = parseInt(router.query.number)
        newArr.push(newArrItem)
        router.query.number = newArr
      }
      if (typeof router.query.floors === 'string') {
        const newArr = []
        const newArrItem = parseInt(router.query.floors)
        newArr.push(newArrItem)
        router.query.floors = newArr
      }
      if (typeof router.query.blocks === 'string') {
        const newArr = []
        const newArrItem = parseInt(router.query.blocks)
        newArr.push(newArrItem)
        router.query.blocks = newArr
      }

      // if (router.name !== "apartments") return;

      // try {
      //     const object = router.params.object
      //     let {data} = await api.objectsV2.fetchObjectApartments(object, router.query)
      //     ctx.commit("updateApartment", data)
      // } catch (error) {
      //     vm.toastedWithErrorCode(error);
      // } finally {
      //     ctx.commit("updateLoading", false, {root: true});
      // }
    },

    async fetchApartmentsFilter(ctx, vm) {
      ctx.commit('updateLoading', true, { root: true })
      try {
        const { object } = this.router.params
        const response = await api.objects.fetchObjectWithPagination(
          object,
          vm.page,
          vm.filter,
        )
        const apartments = response.data
        ctx.commit('updateApartment', apartments)
        ctx.commit('updateLoading', false, { root: true })
      } catch (error) {
        this.toastedWithErrorCode(error)
      }
    },

    async fetchFilterObject(ctx, vm) {
      const router = vm.$route
      ctx.commit('updateLoading', true, { root: true })
      try {
        const response = await api.objects.fetchByFilterObject(
          router.params.object,
        )
        const floors = response.data
        ctx.commit('updateFilter', floors)
      } catch (error) {
        if (!error.response) {
          vm.toasted('Error: Network Error', 'error')
        } else {
          this.toastedWithErrorCode(error)
        }
      } finally {
        ctx.commit('updateLoading', false, { root: true })
      }
    },

    async fetchReserveClient(ctx, vm) {
      try {
        const response = await api.orders.fetchOrderClient(vm.order_id)
        const client = response.data
        ctx.commit('updateReserveClient', client)
      } catch (error) {
        if (!error.response) {
          vm.toasted('Error: Network Error', 'error')
        } else {
          this.toastedWithErrorCode(error)
        }
      }
    },
  },
  getters: {
    getApartments(state) {
      return state.apartments
    },

    getFilterParams(state) {
      return state.filter
    },

    getReserveClient(state) {
      return state.client
    },
  },
}
