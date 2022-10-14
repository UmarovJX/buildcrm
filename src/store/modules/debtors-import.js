import router from "../../routes"
import api from "@/services/api"

export default {
    state: {
        debtors: [],
        pagination: {},
        debtorsExcelSheets: {
            rows: [],
            file: null,
        }
    },

    mutations: {
        updateDebtors(state, debtors) {
            state.debtors = debtors;
        },

        updatePagination(state, pagination) {
            state.pagination = pagination;
        },

        updateDebtorsExcel(state, debtorsExcelSheets) {
            console.log(debtorsExcelSheets, 'debtorsExcelSheets');
            state.debtorsExcelSheets = debtorsExcelSheets
        }
    },

    getters: {
        getImportDebtors(state) {
            return state.debtors;
        },

        getImportPaginationDebtors(state) {
            return state.pagination;
        },

        getDebtorsSheets(state) {
            console.log(state, 'state');
            return state.debtorsExcelSheets
        }
    },

    actions: {
        async fetchDebtors(ctx, vm) {
            ctx.commit("updateLoading", true, {root: true});

            if (typeof router.currentRoute.query.object_id === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.object_id);
                newArr.push(newArrItem);
                router.currentRoute.query.object_id = newArr;
            }
            if (typeof router.currentRoute.query.apartment_number === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.apartment_number);
                newArr.push(newArrItem);
                router.currentRoute.query.apartment_number = newArr;
            }
            if (typeof router.currentRoute.query.date === "string") {
                const newArr = [];
                const newArrItem = parseInt(router.currentRoute.query.date);
                newArr.push(newArrItem);
                router.currentRoute.query.date = newArr;
            }

            try {
                const params = router.currentRoute.query
                const {data} = await api.contract.fetchDeals(params)
                ctx.commit("updateContract", data.items);
                ctx.commit("updatePagination", data.pagination);
            } catch (error) {
                if (!error.response) {
                    vm.toasted("Error: Network Error", "error");
                } else {
                    if (error.response.status === 403) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 401) {
                        vm.toasted(error.response.data.message, "error");
                    } else if (error.response.status === 500) {
                        vm.toasted(error.response.data.message, "error");
                    } else {
                        vm.toasted(error.response.data.message, "error");
                    }
                }
            } finally {
                ctx.commit("updateLoading", false, {root: true});
            }
        },
    },
};
