export default {
    actions: {
        async fetchApartments(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            // this.fetchStartLoading();
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/list/' + vm.$route.params.id, header);
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

        async fetchApartmentsFilter(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.post(process.env.VUE_APP_URL + '/api/apartments/filter/' + vm.$route.params.id, vm.filter, header);
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

        async fetchApartmentsFloors(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/filter/params/floors', header);
                const floors = response.data;
                ctx.commit('updateFilterFloors', floors);
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

        async fetchApartmentsRooms(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/filter/params/rooms', header);
                const floors = response.data;
                ctx.commit('updateFilterRooms', floors);
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

        async fetchReserveClient(ctx, vm)
        {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/apartments/reserve/info/' + vm.apartment_preview.id, header);
                const client = response.data;
                ctx.commit('updateReserveClient', client);
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
        updateApartment(state, apartments) {
            state.apartments = apartments;
        },

        updateFilterFloors(state, floors) {
            state.filter.floors = floors;
        },

        updateFilterRooms(state, rooms) {
            state.filter.rooms = rooms;
        },

        updateReserveClient(state, client) {
            state.client = client;
        }
    },

    state: {
        apartments: [],
        filter: {
            rooms: [],
            floors: []
        },

        client: {}
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
        },

        getReserveClient(state) {
            return state.client;
        }
    }
}
