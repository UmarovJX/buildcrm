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
                vm.toastedWithErrorCode(error)
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
