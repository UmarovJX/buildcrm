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
            return state.debtorsExcelSheets
        }
    },

};
