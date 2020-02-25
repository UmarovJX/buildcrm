export default {
    actions: {
        async fetchApartments(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/list/' + vm.$route.params.id, header);
                const apartments = response.data;

                ctx.commit('updateApartment', apartments);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        async fetchApartmentsFilter(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.post(process.env.VUE_APP_URL + '/api/apartments/filter/' + vm.$route.params.id, vm.filter, header);
                const apartments = response.data;

                ctx.commit('updateApartment', apartments);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        async fetchApartmentsFloors(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/filter/params/floors', header);
                const floors = response.data;

                ctx.commit('updateFilterFloors', floors);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        async fetchApartmentsRooms(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/filter/params/rooms', header);
                const floors = response.data;

                ctx.commit('updateFilterRooms', floors);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        }
    },

    mutations: {
        updateApartment(state, apartments) {
            state.apartments = apartments;
        },

        updateFilterFloors(state, floors) {
            state.filter.floors = floors;
        },

        updateFilterRooms(state, rooms) {
            state.filter.rooms = rooms;
        }
    },

    state: {
        apartments: [],
        filter: {
            rooms: [],
            floors: []
        }
    },

    getters: {
        getApartments (state) {
            return state.apartments;
        },

        getFilterRooms (state) {
            return state.filter.rooms;
        },

        getFilterFloors (state) {
            return state.filter.floors;
        }
    }
}
