import api from "@/services/api";

export default {

    actions: {
        async fetchClients(ctx, vm) {
            ctx.commit('updateLoading', true, {root: true});

            try {
                const response = await api.clientsV2.fetchClients(vm.page)
                const clients = response.data.data;

                // const next = ;

                const paginate = {
                    total: response.data.total,
                    paginate: !!response.data.next,
                    pageCount: response.data.last_page
                };

                ctx.commit('updatePaginateSetting', paginate);

                ctx.commit('updateLoading', false, {root: true});
                ctx.commit('updateClients', clients);
            } catch (error) {
                if (!error.response) {
                    this.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        async fetchClientsSearch(ctx, vm) {
            ctx.commit('updateLoading', true, {root: true});
            try {
                const response = await api.clientsV2.searchClient(vm.search, vm.page)
                const clients = response.data.data;

                const paginate = {
                    total: response.data.total,
                    paginate: !!response.data.next,
                    pageCount: response.data.last_page
                };

                ctx.commit('updatePaginateSetting', paginate);
                ctx.commit('updateLoading', false, {root: true});
                ctx.commit('updateClients', clients);
            } catch (error) {
                if (!error.response) {
                    this.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        }
    },

    mutations: {
        updateClients(state, clients) {
            state.clients = clients;
        },

        updatePaginateSetting(state, paginate) {
            state.paginate = paginate
        }
    },

    state: {
        clients: [],
        paginate: {
            total: 0,
            paginate: false,
            pageCount: 0,
        }
    },

    getters: {
        getClients(state) {
            return state.clients;
        },

        getClientsPaginate(state) {
            return state.paginate;
        }
    }
}
