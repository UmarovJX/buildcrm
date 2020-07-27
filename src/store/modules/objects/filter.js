export default {
    actions: {
        async fetchFilterApartments(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.post(process.env.VUE_APP_URL + '/api/apartments/filter', vm.filter, header);
                const apartments = response.data;

                ctx.commit('updateApartment', apartments);
                ctx.commit('updateLoading', false, { root: true });
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, 'error');
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, 'error');
                    } else {
                        vm.toasted(error.response.data.message, 'error');
                    }
                }
            }
        },
    },

    mutations: {
        updateApartment(state, apartments) {
            state.apartments = apartments;
        },

    },

    state: {
        apartments: [],
    },

    getters: {
        getFilteredApartments (state) {
            return state.apartments;
        }
    }
}
