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
            console.log(debtors, 'debtors update');
            state.debtors = debtors;
        },

        updatePagination(state, pagination) {
            state.pagination = pagination;
        },

        updateDebtorsExcel(state, debtorsExcelSheets) {
            console.log(debtorsExcelSheets, 'debtorsExcelSheets update');
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
