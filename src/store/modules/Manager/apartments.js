export default {
    actions: {
        async fetchApartments(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });

            if (vm.$route.name != 'apartments')
                return;

            // this.fetchStartLoading();
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                // console.log(vm.$route);

                const { data } = await vm.axios.get(process.env.VUE_APP_URL + '/objects/' + vm.$route.params.id + '/apartments?page=' + vm.page, header);
                const apartments = data;

                ctx.commit('updateApartment', apartments);
                ctx.commit('updateLoading', false, { root: true });
            } catch (error) {
                vm.toastedWithErrorCode(error);
            }
        },

        async fetchApartmentsFilter(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.post(process.env.VUE_APP_URL + '/objects/' + vm.$route.params.id + '/filter?page=' + vm.page, vm.filter, header);
                const apartments = response.data;
                ctx.commit('updateApartment', apartments);
                ctx.commit('updateLoading', false, { root: true });
            } catch (error) {
                vm.toastedWithErrorCode(error);
            }
        },

        async fetchFilterObject(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/objects/' + vm.$route.params.id +'/filter', header);
                const floors = response.data;
                ctx.commit('updateFilter', floors);
                ctx.commit('updateLoading', false, { root: true });
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toastedWithErrorCode(error);
                }
            }
        },


        async fetchReserveClient(ctx, vm)
        {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/orders/' + vm.order_id + '/client', header);
                const client = response.data;
                ctx.commit('updateReserveClient', client);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toastedWithErrorCode(error);
                }
            }
        }
    },

    mutations: {
        updateApartment(state, apartments) {
            if (apartments.pagination.current > 1) {
                state.apartments.pagination = apartments.pagination;
                state.apartments.items.push(...apartments.items);
            } else{
                state.apartments = apartments;
            }
        },

        updateFilter(state, filter) {
            state.filter = filter;
        },

        updateReserveClient(state, client) {
            state.client = client;
        }
    },

    state: {
        apartments: {},
        filter: {},

        client: {}
    },

    getters: {
        getApartments (state) {
            return state.apartments;
        },

        getFilterParams (state) {
            return state.filter;
        },

        getReserveClient(state) {
            return state.client;
        }
    }
}
