export default {
    actions: {
        async fetchDebtors(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const { data } = await vm.axios.get(process.env.VUE_APP_URL + '/debtors?page=' + vm.page, header);
                ctx.commit('updateDebtors', data.items);
                ctx.commit('updatePagination', data.pagination);
                ctx.commit('updateLoading', false, { root: true });

            } catch (error) {
                vm.toastedWithErrorCode(error);
            }
        },
    },

    state: {
        debtors: [],
        pagination: {},
    },

    mutations: {
        updateDebtors(state, debtors) {
            state.debtors = debtors;
        },

        updatePagination(state, pagination) {
            state.pagination = pagination;
        }
    },

    getters: {
        getDebtors(state) {
            return state.debtors;
        },

        getPaginationDebtors(state) {
            return state.pagination;
        },
    }
}
