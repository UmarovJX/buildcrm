import api from "@/services/api";

export default {
    actions: {
        async fetchDebtors(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});
            try {
                const {data} = await api.debtors.fetchDebtors(vm.page)
                ctx.commit("updateDebtors", data.items);
                ctx.commit("updatePagination", data.pagination);
            } catch (error) {
                vm.toastedWithErrorCode(error);
            } finally {
                ctx.commit("updateLoading", false, {root: true});
            }
        },

        async fetchDebtorsFilter(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});
            try {

                const body = {
                    contract_number: vm.search,
                    date: vm.date,
                    orderBy: vm.orderBy,
                }

                const {data} = await api.debtors.filterDebtors(vm.page, body)
                ctx.commit("updateDebtors", data.items);
                ctx.commit("updatePagination", data.pagination);
            } catch (error) {
                vm.toastedWithErrorCode(error);
            } finally {
                ctx.commit("updateLoading", false, {root: true});
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
        },
    },

    getters: {
        getDebtors(state) {
            return state.debtors;
        },

        getPaginationDebtors(state) {
            return state.pagination;
        },
    },
};
