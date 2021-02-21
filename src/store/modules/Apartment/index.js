export default {
    actions: {
        async fetchApartment(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const { data } = await vm.axios.get(process.env.VUE_APP_URL + '/apartments/' + vm.$route.params.id, header);

                ctx.commit('updateApartment', data);
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
        }
    },

    mutations: {
        updateApartment(state, apartment) {
            state.apartment = apartment;
        }
    },

    state: {
        apartment: {}
    },

    getters: {
        getApartment(state) {
            return state.apartment;
        }
    }
}
