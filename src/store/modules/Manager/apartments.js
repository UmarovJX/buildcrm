import router from '../../../routes'
import api from "@/services/api";

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
        updateSpecificApartment(state, {updatingApartment, status}) {
            if (status === 'unavailable') {
                state.apartments.items.splice(updatingIndex, 1)
                return
            }

            const updatingIndex = state.apartments.items.findIndex(apartment => apartment.id === updatingApartment.id)
            if (updatingIndex !== -1) {
                state.apartments.items.splice(updatingIndex, 1, updatingApartment)
            }
        },
        updateApartment(state, apartments) {
            if (apartments.pagination.current > 1) {
                state.apartments.pagination = apartments.pagination;
                state.apartments.items.push(...apartments.items);
            } else {
                state.apartments = apartments;
            }
        },

        updateFilter(state, filter) {
            state.filter = filter;
        },

        updateReserveClient(state, client) {
            state.client = client;
        },
    },

    actions: {
        async fetchApartments(ctx, vm) {
            /* eslint-disable no-debugger */
            // debugger;
            ctx.commit("updateLoading", true, {root: true});

            if (typeof router.currentRoute.query.rooms === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.rooms);
                newArr.push(newArrItem);
                router.currentRoute.query.rooms = newArr;
            }
            if (typeof router.currentRoute.query.number === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.number);
                newArr.push(newArrItem);
                router.currentRoute.query.number = newArr;
            }
            if (typeof router.currentRoute.query.floors === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.floors);
                newArr.push(newArrItem);
                router.currentRoute.query.floors = newArr;
            }
            if (typeof router.currentRoute.query.blocks === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.blocks);
                newArr.push(newArrItem);
                router.currentRoute.query.blocks = newArr;
            }

            // if (router.currentRoute.name !== "apartments") return;

            try {
                const object = router.currentRoute.params.object
                let {data} = await api.objects.fetchObjectApartments(object, router.currentRoute.query)
                ctx.commit("updateApartment", data)
            } catch (error) {
                vm.toastedWithErrorCode(error);
            } finally {
                ctx.commit("updateLoading", false, {root: true});
            }

        },

        async fetchApartmentsFilter(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});
            try {
                const {object} = this.router.currentRoute.params
                const response = await api.objects.fetchObjectWithPagination(object, vm.page, vm.filter)
                const apartments = response.data;
                ctx.commit("updateApartment", apartments);
                ctx.commit("updateLoading", false, {root: true});
            } catch (error) {
                this.toastedWithErrorCode(error);
            }
        },

        async fetchFilterObject(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});
            try {
                const response = await api.objects.fetchByFilterObject(router.currentRoute.params.object)
                const floors = response.data;
                ctx.commit("updateFilter", floors);
            } catch (error) {
                if (!error.response) {
                    vm.toasted("Error: Network Error", "error");
                } else {
                    this.toastedWithErrorCode(error);
                }
            } finally {
                ctx.commit("updateLoading", false, {root: true});
            }
        },

        async fetchReserveClient(ctx, vm) {
            try {
                const response = await api.orders.fetchOrderClient(vm.order_id)
                const client = response.data;
                ctx.commit("updateReserveClient", client);
            } catch (error) {
                if (!error.response) {
                    vm.toasted("Error: Network Error", "error");
                } else {
                    this.toastedWithErrorCode(error);
                }
            }
        },
    },
    getters: {
        getApartments(state) {
            return state.apartments;
        },

        getFilterParams(state) {
            return state.filter;
        },

        getReserveClient(state) {
            return state.client;
        },
    }
}
